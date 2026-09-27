#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/hanziwork"
DIST_DIR="$APP_DIR/dist"
BACKUP_DIR="$APP_DIR/dist.previous"
HEALTH_URL="http://127.0.0.1:3000/api/health"

if [[ "$(pwd -P)" != "$APP_DIR" ]]; then
  echo "Deployment must run from $APP_DIR" >&2
  exit 1
fi

restore_previous_build() {
  if [[ -d "$BACKUP_DIR" ]]; then
    rm -rf -- "$DIST_DIR"
    mv -- "$BACKUP_DIR" "$DIST_DIR"
  fi
  systemctl start hanziwork.service || true
}

npm ci

systemctl stop hanziwork.service
rm -rf -- "$BACKUP_DIR"
if [[ -d "$DIST_DIR" ]]; then
  mv -- "$DIST_DIR" "$BACKUP_DIR"
fi
trap restore_previous_build ERR

npm run build

audio_dir="$(realpath "$DIST_DIR/client/audio")"
if [[ "$audio_dir" != "$DIST_DIR/client/audio" ]] || [[ ! -d "$APP_DIR/public/audio" ]]; then
  echo "Refusing to remove an unexpected audio output path: $audio_dir" >&2
  exit 1
fi
rm -rf -- "$audio_dir"

systemctl start hanziwork.service
systemctl restart hanziwork-support.service

for attempt in {1..30}; do
  if response="$(curl --fail --silent --show-error --max-time 10 "$HEALTH_URL")" &&
    grep -q '"status":"ok"' <<<"$response" &&
    grep -q '"database":"ok"' <<<"$response"; then
    rm -rf -- "$BACKUP_DIR"
    trap - ERR
    echo "Deployment completed and health checks passed."
    exit 0
  fi
  sleep 2
done

echo "Health check did not pass in time." >&2
exit 1
