#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/hanziwork"
HEALTH_URL="http://127.0.0.1:3000/api/health"
ARCHIVE_PATH="${1:-}"
RELEASE_ID="${2:-}"
STAGING_DIR="$APP_DIR/.release-staging-$RELEASE_ID"
BACKUP_DIR="$APP_DIR/.release-previous"
RELEASE_ITEMS=(dist node_modules scripts lib db drizzle package.json package-lock.json)

if [[ ! "$RELEASE_ID" =~ ^[0-9a-f]{40}$ ]]; then
  echo "A full Git commit SHA is required as the release ID." >&2
  exit 1
fi

if [[ -z "$ARCHIVE_PATH" || ! -f "$ARCHIVE_PATH" ]]; then
  echo "Release artifact not found: $ARCHIVE_PATH" >&2
  exit 1
fi

ARCHIVE_PATH="$(realpath "$ARCHIVE_PATH")"
if [[ "$ARCHIVE_PATH" != "/tmp/hanziwork-$RELEASE_ID.tar.gz" ]]; then
  echo "Unexpected release artifact path: $ARCHIVE_PATH" >&2
  exit 1
fi

if [[ "$STAGING_DIR" != "$APP_DIR/.release-staging-$RELEASE_ID" ]] ||
  [[ "$BACKUP_DIR" != "$APP_DIR/.release-previous" ]]; then
  echo "Refusing to use unexpected release directories." >&2
  exit 1
fi

rm -rf -- "$STAGING_DIR"
install -d -m 755 "$STAGING_DIR"
tar -xzf "$ARCHIVE_PATH" --no-same-owner -C "$STAGING_DIR"

for item in "${RELEASE_ITEMS[@]}"; do
  if [[ ! -e "$STAGING_DIR/$item" ]]; then
    echo "Release artifact is missing $item." >&2
    exit 1
  fi
done

if [[ ! -f "$STAGING_DIR/dist/server/wrangler.json" ]] ||
  [[ ! -f "$STAGING_DIR/node_modules/wrangler/bin/wrangler.js" ]]; then
  echo "Release artifact does not contain a runnable production build." >&2
  exit 1
fi

mutation_started=false
rollback() {
  status=$?
  trap - ERR INT TERM

  if [[ "$mutation_started" == true ]]; then
    systemctl stop hanziwork-support.service || true
    systemctl stop hanziwork.service || true

    for item in "${RELEASE_ITEMS[@]}"; do
      rm -rf -- "$APP_DIR/$item"
      if [[ -e "$BACKUP_DIR/$item" ]]; then
        mv -- "$BACKUP_DIR/$item" "$APP_DIR/$item"
      fi
    done
  fi

  systemctl start hanziwork.service || true
  systemctl start hanziwork-support.service || true
  rm -rf -- "$STAGING_DIR" "$BACKUP_DIR"
  echo "Deployment failed; the previous release was restored." >&2
  exit "$status"
}
trap rollback ERR INT TERM

systemctl stop hanziwork-support.service
systemctl stop hanziwork.service

rm -rf -- "$BACKUP_DIR"
install -d -m 755 "$BACKUP_DIR"
mutation_started=true

for item in "${RELEASE_ITEMS[@]}"; do
  if [[ -e "$APP_DIR/$item" ]]; then
    mv -- "$APP_DIR/$item" "$BACKUP_DIR/$item"
  fi
  mv -- "$STAGING_DIR/$item" "$APP_DIR/$item"
done

systemctl start hanziwork.service
systemctl start hanziwork-support.service

for attempt in {1..30}; do
  if response="$(curl --fail --silent --show-error --max-time 10 "$HEALTH_URL")" &&
    grep -q '"status":"ok"' <<<"$response" &&
    grep -q '"database":"ok"' <<<"$response"; then
    rm -rf -- "$STAGING_DIR" "$BACKUP_DIR" "$ARCHIVE_PATH"
    trap - ERR INT TERM
    echo "Release $RELEASE_ID deployed and health checks passed."
    exit 0
  fi
  sleep 2
done

echo "Health check did not pass in time." >&2
exit 1
