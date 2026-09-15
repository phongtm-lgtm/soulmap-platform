param(
    [Parameter(Mandatory = $true)][string]$AcmeEmail,
    [string]$FrontendOrigin = "https://example.invalid",
    [string]$GoogleClientId = "",
    [string]$AiModel = "cx/gpt-5.6-luna",
    [string]$ImageTag = "",
    [string]$Region = "ap-southeast-1",
    [string]$StackName = "soulmap-prod"
)

$ErrorActionPreference = "Stop"
$Aws = (Get-Command aws -ErrorAction SilentlyContinue).Source
if (-not $Aws) { $Aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe" }
if (-not $ImageTag) {
    throw "Pass the image tag returned by build-push.ps1."
}

function Get-Output([string]$Name) {
    $Value = & $Aws cloudformation describe-stacks --region $Region --stack-name $StackName `
        --query "Stacks[0].Outputs[?OutputKey=='$Name'].OutputValue | [0]" --output text --no-cli-pager
    if ($LASTEXITCODE -ne 0 -or -not $Value -or $Value -eq "None") { throw "Missing stack output: $Name" }
    return $Value
}

function New-Secret([int]$Bytes = 48) {
    $Buffer = [byte[]]::new($Bytes)
    $Generator = [Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $Generator.GetBytes($Buffer)
    }
    finally {
        $Generator.Dispose()
    }
    return [Convert]::ToBase64String($Buffer)
}

$InstanceId = Get-Output "InstanceId"
$PublicHost = Get-Output "ApiHostname"
$RouterPublicHost = $PublicHost -replace '^api\.', 'router.'
$RdsEndpoint = Get-Output "RdsEndpoint"
$RdsSecretArn = Get-Output "RdsSecretArn"
$Bucket = Get-Output "BackupBucketName"
$Repository = Get-Output "EcrRepositoryUri"
$AccountId = (& $Aws sts get-caller-identity --query Account --output text --no-cli-pager).Trim()

$SecretNames = @(
    "9router-jwt-secret",
    "9router-initial-password",
    "9router-api-key-secret",
    "9router-machine-id-salt"
)
$ExistingOutput = & $Aws ssm get-parameters-by-path --region $Region --path /soulmap/prod/ `
    --query "Parameters[].Name" --output text --no-cli-pager
if ($LASTEXITCODE -ne 0) { throw "Cannot list existing SSM parameters." }
$ExistingPaths = @($ExistingOutput -split '\s+' | Where-Object { $_ })
foreach ($Name in $SecretNames) {
    $Path = "/soulmap/prod/$Name"
    if ($Path -notin $ExistingPaths) {
        $Value = New-Secret
        & $Aws ssm put-parameter --region $Region --name $Path --type SecureString --value $Value --no-cli-pager | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Cannot create SSM parameter $Path" }
    }
}

$BundleRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Temp = Join-Path $env:TEMP "soulmap-aws-$([Guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Path $Temp | Out-Null
try {
    Copy-Item (Join-Path $BundleRoot "compose.yaml") $Temp
    Copy-Item (Join-Path $BundleRoot "Caddyfile") $Temp
    New-Item -ItemType Directory -Path (Join-Path $Temp "database") | Out-Null
    Copy-Item (Join-Path $BundleRoot "database\schema.sql") (Join-Path $Temp "database")
    Copy-Item (Join-Path $BundleRoot "..\..\soulmap-server\src\main\resources\db\seed_mbti_questions.sql") (Join-Path $Temp "database")
    Copy-Item (Join-Path $BundleRoot "scripts\backup-9router.sh") $Temp
    Copy-Item (Join-Path $BundleRoot "scripts\backup-rds.sh") $Temp
    Copy-Item (Join-Path $BundleRoot "systemd") $Temp -Recurse
    tar -czf (Join-Path $Temp "bundle.tar.gz") -C $Temp compose.yaml Caddyfile database backup-9router.sh backup-rds.sh systemd
    if ($LASTEXITCODE -ne 0) { throw "Cannot create deployment bundle." }

    $Key = "deployments/$ImageTag/bundle.tar.gz"
    & $Aws s3 cp (Join-Path $Temp "bundle.tar.gz") "s3://$Bucket/$Key" --region $Region --sse AES256 --no-cli-pager | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Cannot upload deployment bundle." }

    $Commands = @(
        "set -euo pipefail",
        "aws s3 cp 's3://$Bucket/$Key' /tmp/soulmap-bundle.tar.gz --region '$Region' --only-show-errors",
        "tar -xzf /tmp/soulmap-bundle.tar.gz -C /opt/soulmap",
        "mv /opt/soulmap/Caddyfile /opt/soulmap/config/Caddyfile",
        "mv /opt/soulmap/backup-9router.sh /opt/soulmap/bin/backup-9router.sh",
        "mv /opt/soulmap/backup-rds.sh /opt/soulmap/bin/backup-rds.sh",
        "chmod 0700 /opt/soulmap/bin/backup-9router.sh /opt/soulmap/bin/backup-rds.sh",
        "cp /opt/soulmap/systemd/* /etc/systemd/system/",
        "systemctl daemon-reload",
        "systemctl enable --now soulmap-9router-backup.timer soulmap-rds-backup.timer",
        "DB_SECRET=`$(aws secretsmanager get-secret-value --region '$Region' --secret-id '$RdsSecretArn' --query SecretString --output text)",
        "DB_USER=`$(jq -r .username <<<`$DB_SECRET)",
        "DB_PASSWORD=`$(jq -r .password <<<`$DB_SECRET)",
        "JWT_SECRET=`$(aws ssm get-parameter --region '$Region' --name /soulmap/prod/9router-jwt-secret --with-decryption --query Parameter.Value --output text)",
        "INITIAL_PASSWORD=`$(aws ssm get-parameter --region '$Region' --name /soulmap/prod/9router-initial-password --with-decryption --query Parameter.Value --output text)",
        "API_KEY_SECRET=`$(aws ssm get-parameter --region '$Region' --name /soulmap/prod/9router-api-key-secret --with-decryption --query Parameter.Value --output text)",
        "MACHINE_ID_SALT=`$(aws ssm get-parameter --region '$Region' --name /soulmap/prod/9router-machine-id-salt --with-decryption --query Parameter.Value --output text)",
        "AI_KEY=`$(aws ssm get-parameter --region '$Region' --name /soulmap/prod/9router-client-api-key --with-decryption --query Parameter.Value --output text 2>/dev/null || true)",
        "umask 077",
        "cat > /opt/soulmap/env/runtime.env <<EOF`nSOULMAP_IMAGE=$Repository`:$ImageTag`nPUBLIC_HOST=$PublicHost`nROUTER_PUBLIC_HOST=$RouterPublicHost`nROUTER_PUBLIC_URL=https://$RouterPublicHost`nACME_EMAIL=$AcmeEmail`nSPRING_PROFILES_ACTIVE=prod`nSERVER_PORT=8090`nSOULMAP_FRONTEND_ORIGIN=$FrontendOrigin`nSOULMAP_GOOGLE_CLIENT_ID=$GoogleClientId`nSOULMAP_SESSION_DURATION_DAYS=14`nSOULMAP_SESSION_COOKIE_SECURE=true`nSOULMAP_SESSION_COOKIE_SAME_SITE=None`nSOULMAP_DATABASE_URL=jdbc:postgresql://$RdsEndpoint`:5432/soulmap?sslmode=require`nSOULMAP_DATABASE_USERNAME=`$DB_USER`nSOULMAP_DATABASE_PASSWORD=`$DB_PASSWORD`nSOULMAP_DB_POOL_MAX_SIZE=5`nSOULMAP_DB_POOL_MIN_IDLE=1`nSOULMAP_AI_PROVIDER=9router`nSOULMAP_AI_BASE_URL=http://9router:20128/v1`nSOULMAP_AI_API_KEY=`$AI_KEY`nSOULMAP_AI_MODEL=$AiModel`nSOULMAP_AI_TIMEOUT_SECONDS=300`nSOULMAP_AI_STRUCTURED_OUTPUT_MODE=json_object`nJWT_SECRET=`$JWT_SECRET`nINITIAL_PASSWORD=`$INITIAL_PASSWORD`nAPI_KEY_SECRET=`$API_KEY_SECRET`nMACHINE_ID_SALT=`$MACHINE_ID_SALT`nBACKUP_BUCKET=$Bucket`nAWS_REGION=$Region`nEOF",
        "export PGPASSWORD=`$DB_PASSWORD",
        "psql postgresql://`$DB_USER@$RdsEndpoint`:5432/soulmap?sslmode=require -f /opt/soulmap/database/schema.sql",
        "aws ecr get-login-password --region '$Region' | docker login --username AWS --password-stdin '$AccountId.dkr.ecr.$Region.amazonaws.com' >/dev/null",
        "docker compose --env-file /opt/soulmap/env/runtime.env -f /opt/soulmap/compose.yaml pull",
        "docker compose --env-file /opt/soulmap/env/runtime.env -f /opt/soulmap/compose.yaml up -d",
        "rm -f /tmp/soulmap-bundle.tar.gz"
    )
    $Parameters = @{ commands = $Commands } | ConvertTo-Json -Compress -Depth 4
    $ParametersFile = Join-Path $Temp "ssm-parameters.json"
    [IO.File]::WriteAllText($ParametersFile, $Parameters, [Text.UTF8Encoding]::new($false))
    $CommandId = & $Aws ssm send-command --region $Region --instance-ids $InstanceId `
        --document-name AWS-RunShellScript --comment "Deploy Soulmap $ImageTag" `
        --parameters "file://$ParametersFile" --query Command.CommandId --output text --no-cli-pager
    if ($LASTEXITCODE -ne 0) { throw "Cannot send deployment command." }

    & $Aws ssm wait command-executed --region $Region --command-id $CommandId --instance-id $InstanceId
    $Status = & $Aws ssm get-command-invocation --region $Region --command-id $CommandId --instance-id $InstanceId `
        --query Status --output text --no-cli-pager
    if ($LASTEXITCODE -ne 0 -or $Status -ne "Success") { throw "Host deployment failed with status $Status." }
    "SSM deployment status: $Status"
}
finally {
    Remove-Item -LiteralPath $Temp -Recurse -Force -ErrorAction SilentlyContinue
}

"API URL: https://$PublicHost/api/v1"
"9router dashboard: https://$RouterPublicHost"
