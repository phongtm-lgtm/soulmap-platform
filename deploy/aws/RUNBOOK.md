# Soulmap AWS Runbook

This deployment runs Soulmap Server and 9router as separate containers on one
ARM64 EC2 instance. PostgreSQL runs privately on RDS. 9router data persists on
encrypted EBS and is copied to a private versioned S3 bucket.

## Prerequisites

- AWS CLI v2 authenticated with an account allowed to create the stack resources.
- Docker Desktop with Buildx.
- Region `ap-southeast-1`.
- An email address for ACME certificates.

Do not put AWS credentials, database passwords, or 9router keys in this repository.

## Provision

```powershell
aws login --region ap-southeast-1
./deploy/aws/scripts/provision.ps1 -BudgetEmail you@example.com
```

The stack creates a `t4g.small`, a private `db.t4g.micro` PostgreSQL instance,
an Elastic IP, ECR, a private backup bucket, SSM access, and a USD 45 monthly
budget notification. It deliberately creates no ALB, NAT gateway, or SSH rule.

## Build and deploy

```powershell
$image = ./deploy/aws/scripts/build-push.ps1
./deploy/aws/scripts/deploy-host.ps1 `
  -AcmeEmail you@example.com `
  -FrontendOrigin https://example.invalid `
  -GoogleClientId "" `
  -ImageTag ($image -split ':')[-1]
```

Replace the frontend origin and Google client ID when they are known. The API
hostname is shown at the end of deployment and is also available in the stack
output `ApiHostname`.

## Configure 9router

Install the AWS Session Manager plugin, then obtain the instance ID:

```powershell
$instanceId = aws cloudformation describe-stacks `
  --region ap-southeast-1 `
  --stack-name soulmap-prod `
  --query "Stacks[0].Outputs[?OutputKey=='InstanceId'].OutputValue | [0]" `
  --output text

aws ssm start-session `
  --region ap-southeast-1 `
  --target $instanceId `
  --document-name AWS-StartPortForwardingSession `
  --parameters '{"portNumber":["20128"],"localPortNumber":["20128"]}'
```

Open `http://localhost:20128`. Retrieve the initial password without printing it
into shell history:

```powershell
aws ssm get-parameter `
  --region ap-southeast-1 `
  --name /soulmap/prod/9router-initial-password `
  --with-decryption `
  --query Parameter.Value `
  --output text
```

Configure a provider in 9router, test it, and create an endpoint API key. Store
the endpoint key in SSM locally; do not send it through chat:

```powershell
$key = Read-Host "9router endpoint API key" -AsSecureString
$plain = [Net.NetworkCredential]::new('', $key).Password
aws ssm put-parameter `
  --region ap-southeast-1 `
  --name /soulmap/prod/9router-client-api-key `
  --type SecureString `
  --value $plain `
  --overwrite
$plain = $null
```

Run `deploy-host.ps1` again with the selected model. It reads the key from SSM
and recreates the Soulmap container. The 9router dashboard is available through
its Caddy HTTPS hostname. Port `20128` remains bound to loopback only, and Caddy
blocks public `/v1*` API paths; Soulmap uses the private Docker network instead.

## Operations

Open a shell without SSH:

```powershell
aws ssm start-session --region ap-southeast-1 --target $instanceId
```

Check services on the instance:

```bash
sudo docker compose --env-file /opt/soulmap/env/runtime.env -f /opt/soulmap/compose.yaml ps
curl -fsS http://127.0.0.1:20128/api/health
curl -fsS https://"$(sudo sed -n 's/^PUBLIC_HOST=//p' /opt/soulmap/env/runtime.env)"/api/v1/actuator/health
```

Create a consistent 9router backup:

```bash
sudo /opt/soulmap/bin/backup-9router.sh
```

Daily 9router backups and RDS snapshots are scheduled with systemd timers. Check
their next runs with `systemctl list-timers 'soulmap-*'`. RDS automated backups
are retained for one day because AWS Free plan accounts reject longer retention;
the timer creates daily manual snapshots and removes snapshots older than seven
days. Increase automated retention after upgrading the account plan. Test restore
procedures before relying on backups.

## Delete

RDS deletion protection must be disabled explicitly before deleting the stack.
CloudFormation retains the ECR repository and S3 bucket and takes a final RDS
snapshot. Review retained resources afterward because they continue to incur
small storage charges.
