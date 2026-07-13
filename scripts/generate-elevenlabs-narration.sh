#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
secret_file="${ELEVENLABS_ENV_FILE:-$repo_root/.secrets/elevenlabs.env}"

if [[ -f "$secret_file" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$secret_file"
  set +a
fi

: "${ELEVENLABS_API_KEY:?Set ELEVENLABS_API_KEY or create .secrets/elevenlabs.env}"

voice_id="${ELEVENLABS_VOICE_ID:-oHMibLgDqXK3fjgFVtJ6}"
out="${1:-$repo_root/content/audio/Motion/narraciones/lava-intro.mp3}"
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

mkdir -p "$(dirname "$out")"

ELEVENLABS_TEXT="${ELEVENLABS_TEXT:-}" python3 - <<'PY' > "$tmp"
import json
import os

text = os.environ.get("ELEVENLABS_TEXT") or (
    "El suelo es lava. Durante la cuenta atrás, colocaos sobre las plataformas seguras. "
    "Cuando empiece la ronda, evitad las zonas rojas y movedos rápido. "
    "Cada pisada sobre lava resta una vida al equipo. "
    "Tenéis un segundo de inmunidad después de cada fallo. ¡Preparados!"
)

print(json.dumps({
    "text": text,
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.46,
        "similarity_boost": 0.82,
        "style": 0.35,
        "use_speaker_boost": True,
    },
}, ensure_ascii=False))
PY

curl -sS \
  -X POST "https://api.elevenlabs.io/v1/text-to-speech/${voice_id}?output_format=mp3_44100_128" \
  -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
  -H "Content-Type: application/json" \
  --data-binary "@${tmp}" \
  -o "$out"

python3 - "$out" <<'PY'
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
size = path.stat().st_size
if size < 1000:
    print(path.read_text(errors="ignore")[:500])
    raise SystemExit(f"{path} is unexpectedly small")
print(f"generated {path} ({size} bytes)")
PY
