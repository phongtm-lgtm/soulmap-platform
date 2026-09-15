#!/usr/bin/env bash
set -euo pipefail

BACKUP_BUCKET="$(sed -n 's/^BACKUP_BUCKET=//p' /opt/soulmap/env/runtime.env)"
AWS_REGION="$(sed -n 's/^AWS_REGION=//p' /opt/soulmap/env/runtime.env)"
[[ -n "$BACKUP_BUCKET" && -n "$AWS_REGION" ]]

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
archive="/opt/soulmap/backups/9router-${stamp}.tar.gz"

docker compose --env-file /opt/soulmap/env/runtime.env -f /opt/soulmap/compose.yaml stop 9router
trap 'docker compose --env-file /opt/soulmap/env/runtime.env -f /opt/soulmap/compose.yaml start 9router' EXIT

tar -czf "$archive" -C /opt/soulmap/data 9router
aws s3 cp "$archive" "s3://${BACKUP_BUCKET}/9router/${stamp}.tar.gz" --region "$AWS_REGION" --sse AES256 --only-show-errors
rm -f "$archive"

docker compose --env-file /opt/soulmap/env/runtime.env -f /opt/soulmap/compose.yaml start 9router
trap - EXIT
