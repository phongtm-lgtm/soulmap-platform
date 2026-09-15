param(
    [string]$Region = "ap-southeast-1",
    [string]$StackName = "soulmap-prod",
    [string]$BudgetEmail = ""
)

$ErrorActionPreference = "Stop"
$Aws = (Get-Command aws -ErrorAction SilentlyContinue).Source
if (-not $Aws) {
    $Aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
}
if (-not (Test-Path -LiteralPath $Aws)) {
    throw "AWS CLI v2 is required."
}

& $Aws sts get-caller-identity --region $Region --no-cli-pager | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "AWS authentication failed. Run 'aws login --region $Region' first."
}

$Template = Join-Path $PSScriptRoot "..\infra\stack.yaml"
& $Aws cloudformation validate-template --region $Region --template-body "file://$Template" --no-cli-pager | Out-Null
if ($LASTEXITCODE -ne 0) { throw "CloudFormation validation failed." }

& $Aws cloudformation deploy `
    --region $Region `
    --stack-name $StackName `
    --template-file $Template `
    --capabilities CAPABILITY_NAMED_IAM `
    --parameter-overrides "ProjectName=$StackName" "BudgetEmail=$BudgetEmail" `
    --no-fail-on-empty-changeset `
    --no-cli-pager
if ($LASTEXITCODE -ne 0) { throw "CloudFormation deployment failed." }

& $Aws cloudformation describe-stacks `
    --region $Region `
    --stack-name $StackName `
    --query "Stacks[0].Outputs[].{Name:OutputKey,Value:OutputValue}" `
    --output table `
    --no-cli-pager
