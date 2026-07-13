#!/usr/bin/env bash
set -euo pipefail

revision="${VENUE_DEPLOY_REVISION:?set VENUE_DEPLOY_REVISION to the full venue commit SHA}"
token="${VENUE_AUTO_DEPLOY_TOKEN:?set VENUE_AUTO_DEPLOY_TOKEN}"
url="${VENUE_AUTO_DEPLOY_URL:-https://platform.motionlevels.obis.dev/api/venue/auto-deploy}"

if [[ ! "$revision" =~ ^[0-9a-f]{40}$ ]]; then
  echo "VENUE_DEPLOY_REVISION must be a full lowercase Git SHA" >&2
  exit 1
fi
if [ "${#token}" -lt 24 ]; then
  echo "VENUE_AUTO_DEPLOY_TOKEN must contain at least 24 characters" >&2
  exit 1
fi

response="$(mktemp)"
trap 'rm -f "$response"' EXIT

set +e
status="$(
  curl -sS \
    --connect-timeout 10 \
    --max-time 30 \
    -o "$response" \
    -w '%{http_code}' \
    -X POST \
    -H "Authorization: Bearer $token" \
    -H 'Content-Type: application/json' \
    --data "{\"revision\":\"$revision\"}" \
    "$url"
)"
curl_exit=$?
set -e
if [ "$curl_exit" -ne 0 ]; then
  echo "Could not reach the venue auto-deploy endpoint (curl exit $curl_exit)" >&2
  exit 1
fi

if [ "$status" = 409 ]; then
  echo "Venue revision $revision was superseded before deployment"
  jq . "$response"
  exit 0
fi
if [ "$status" != 202 ]; then
  echo "Venue auto-deploy endpoint returned HTTP $status" >&2
  cat "$response" >&2
  exit 1
fi

job_id="$(jq -er '.id' "$response")"
queued_revision="$(jq -er '.revision' "$response")"
if [ "$queued_revision" != "$revision" ]; then
  echo "Venue auto-deploy queued unexpected revision $queued_revision" >&2
  exit 1
fi
echo "Queued venue deployment $job_id for $queued_revision"

deadline=$(( $(date +%s) + 1800 ))
attempt=0
while [ "$(date +%s)" -lt "$deadline" ]; do
  attempt=$((attempt + 1))
  set +e
  payload="$(
    curl -fsS \
      --connect-timeout 10 \
      --max-time 30 \
      -H "Authorization: Bearer $token" \
      --get \
      --data-urlencode "id=$job_id" \
      "$url"
  )"
  curl_exit=$?
  set -e
  if [ "$curl_exit" -ne 0 ]; then
    echo "Venue deployment API temporarily unavailable (attempt $attempt, curl exit $curl_exit)"
    sleep 10
    continue
  fi

  reported_revision="$(jq -er '.revision' <<<"$payload")"
  state="$(jq -er '.state' <<<"$payload")"
  if [ "$reported_revision" != "$revision" ]; then
    echo "Venue deployment status reports unexpected revision $reported_revision" >&2
    exit 1
  fi

  case "$state" in
    succeeded)
      echo "motionlevels-1 is active at $reported_revision"
      exit 0
      ;;
    deferred)
      detail="$(jq -r '.detail // "venue conditions are not ready"' <<<"$payload")"
      echo "Venue deployment deferred safely: $detail"
      exit 0
      ;;
    failed)
      jq . <<<"$payload" >&2
      exit 1
      ;;
    queued|running)
      echo "Venue deployment $job_id is $state (attempt $attempt)"
      ;;
    *)
      echo "Venue deployment returned invalid state: $state" >&2
      exit 1
      ;;
  esac
  sleep 10
done

echo "Timed out waiting for venue deployment $job_id" >&2
exit 1
