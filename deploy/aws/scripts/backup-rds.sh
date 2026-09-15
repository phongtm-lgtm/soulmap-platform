#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="$(sed -n 's/^AWS_REGION=//p' /opt/soulmap/env/runtime.env)"
[[ -n "$AWS_REGION" ]]

prefix="soulmap-prod-daily-"
snapshot="${prefix}$(date -u +%Y%m%dT%H%M%SZ)"

aws rds create-db-snapshot \
  --region "$AWS_REGION" \
  --db-instance-identifier soulmap-prod \
  --db-snapshot-identifier "$snapshot" \
  --tags Key=ManagedBy,Value=soulmap-backup \
  --no-cli-pager >/dev/null

cutoff="$(date -u -d '7 days ago' +%s)"
aws rds describe-db-snapshots \
  --region "$AWS_REGION" \
  --db-instance-identifier soulmap-prod \
  --snapshot-type manual \
  --query 'DBSnapshots[].{Id:DBSnapshotIdentifier,Created:SnapshotCreateTime}' \
  --output text \
  --no-cli-pager |
while read -r created identifier; do
  [[ "$identifier" == "$prefix"* ]] || continue
  created_epoch="$(date -u -d "$created" +%s)"
  if (( created_epoch < cutoff )); then
    aws rds delete-db-snapshot \
      --region "$AWS_REGION" \
      --db-snapshot-identifier "$identifier" \
      --no-cli-pager >/dev/null
  fi
done
