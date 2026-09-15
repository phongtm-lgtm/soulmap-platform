param(
    [string]$Region = "ap-southeast-1",
    [string]$StackName = "soulmap-prod",
    [string]$ImageTag = ""
)

$ErrorActionPreference = "Stop"
$Aws = (Get-Command aws -ErrorAction SilentlyContinue).Source
if (-not $Aws) { $Aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe" }
if (-not $ImageTag) {
    $Commit = (git rev-parse --short=12 HEAD 2>$null)
    if (-not $Commit) { $Commit = "local" }
    $ImageTag = "$Commit-$(Get-Date -Format 'yyyyMMddHHmmss')"
}

$Repository = & $Aws cloudformation describe-stacks `
    --region $Region `
    --stack-name $StackName `
    --query "Stacks[0].Outputs[?OutputKey=='EcrRepositoryUri'].OutputValue | [0]" `
    --output text `
    --no-cli-pager
if ($LASTEXITCODE -ne 0 -or -not $Repository) { throw "Cannot read ECR repository output." }

$Registry = $Repository.Split('/')[0]
& $Aws ecr get-login-password --region $Region --no-cli-pager | docker login --username AWS --password-stdin $Registry
if ($LASTEXITCODE -ne 0) { throw "ECR login failed." }

$WorkspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$Dockerfile = Join-Path $PSScriptRoot "..\Dockerfile"
$Image = "${Repository}:${ImageTag}"

docker buildx build --platform linux/arm64 --file $Dockerfile --tag $Image --push $WorkspaceRoot
if ($LASTEXITCODE -ne 0) { throw "Image build or push failed." }

$Image
