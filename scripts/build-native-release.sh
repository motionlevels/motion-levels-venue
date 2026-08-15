#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
lock_path="$repo_root/deploy/motionlevels-pc/venue-components.lock.json"
build_root="${MOTION_LEVELS_NATIVE_BUILD_ROOT:-/tmp/motion-levels-venue-native}"
controller_root="${MOTION_LEVELS_CONTROLLER_SOURCE:-$repo_root/../motion-levels-controller}"
games_root="${MOTION_LEVELS_GAMES_SOURCE:-$repo_root/../motion-levels-games}"
cameras_root="${MOTION_LEVELS_CAMERAS_SOURCE:-$repo_root/../motion-levels-cameras}"

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Required build command is missing: $1" >&2
    exit 69
  }
}

for command in git go jq node npm python3 rsync; do
  require_command "$command"
done

venue_revision="$(git -C "$repo_root" rev-parse HEAD)"
controller_revision="$(jq -er '.components.controller.revision' "$lock_path")"
games_revision="$(jq -er '.components.games.revision' "$lock_path")"
cameras_revision="$(jq -er '.components.cameras.revision' "$lock_path")"
controller_go_version="$(jq -er '.components.controller.goVersion' "$lock_path")"

validate_source() {
  local name="$1"
  local root="$2"
  local expected_revision="$3"
  if [[ ! -d "$root" ]] || ! git -C "$root" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "$name source repository is missing at $root" >&2
    exit 66
  fi
  local actual_revision
  actual_revision="$(git -C "$root" rev-parse HEAD)"
  if [[ "$actual_revision" != "$expected_revision" ]]; then
    echo "$name source is $actual_revision; venue lock requires $expected_revision" >&2
    exit 65
  fi
  if [[ -n "$(git -C "$root" status --porcelain --untracked-files=normal)" ]]; then
    echo "$name source tree is dirty; refusing to build a pinned release" >&2
    exit 65
  fi
}

if [[ -n "$(git -C "$repo_root" status --porcelain --untracked-files=normal)" ]]; then
  echo "Venue source tree is dirty; commit the exact deployment revision first" >&2
  exit 65
fi
validate_source controller "$controller_root" "$controller_revision"
validate_source games "$games_root" "$games_revision"
validate_source cameras "$cameras_root" "$cameras_revision"

mkdir -p "$build_root"
release_dir="$build_root/releases/$venue_revision"
if [[ -f "$release_dir/release-manifest.json" ]] \
  && python3 "$repo_root/scripts/verify-native-release.py" "$release_dir" >/dev/null; then
  printf '%s\n' "$release_dir"
  exit 0
fi

candidate="$(mktemp -d "$build_root/.release-${venue_revision:0:12}.XXXXXX")"
cleanup() { rm -rf "$candidate"; }
trap cleanup EXIT
# mktemp intentionally creates a private directory. The completed release is
# served by Caddy and executed by dedicated system users, so its root must be
# traversable after promotion without making any mutable state world-writable.
chmod 0755 "$candidate"
mkdir -p \
  "$candidate/bin" \
  "$candidate/components/controller" \
  "$candidate/components/cameras" \
  "$candidate/deploy/motionlevels-pc" \
  "$candidate/game-bundles/motion-levels-games"

# The controller helper cross-builds one static Linux/amd64 executable and
# verifies its revision, protocol, digest, target architecture, and linkage.
controller_output="$candidate/components/controller"
GOTOOLCHAIN="$controller_go_version" \
CONTROLLER_EXPECTED_GO_VERSION="$controller_go_version" \
SOURCE_REVISION="$controller_revision" \
OUTPUT_DIR="$controller_output" \
  sh "$controller_root/scripts/build-native.sh" >/dev/null
controller_binary="$controller_output/motion-levels-controller-linux-amd64-$controller_revision"
install -m 0755 "$controller_binary" "$candidate/bin/floor-controller"

# Build the complete revision-matched runtime/menu/display bundle from games
# source. Media is generated from the same manifests before bundle hashing.
npm --prefix "$games_root" run build >/dev/null
npm --prefix "$games_root" run generate:media >/dev/null
games_output="$candidate/game-bundles/motion-levels-games/$games_revision"
MOTION_LEVELS_GAMES_SOURCE_REVISION="$games_revision" \
MOTION_LEVELS_GAMES_BUNDLE_DIR="$games_output" \
  npm --prefix "$games_root" run build:bundle >/dev/null
(cd "$games_root" && MOTION_LEVELS_GAMES_BUNDLE_DIR="$games_output" npm run verify:bundle >/dev/null)
cat > "$candidate/game-bundles/motion-levels-games/pin.json" <<EOF
{
  "schema": "motion-levels-games-source-pin-v1",
  "sourceRevision": "$games_revision",
  "bundlePath": "$games_revision"
}
EOF
ln -s "$games_revision" "$candidate/game-bundles/motion-levels-games/current"

# motion-levels-cameras is pure Python, so deploy its pinned source directly.
# Only third-party Linux dependencies need installation in the candidate venv.
mkdir -p "$candidate/components/cameras/source/motion_levels_cameras"
rsync -a --delete \
  --exclude '__pycache__' \
  --exclude '*.py[cod]' \
  --exclude 'tests/' \
  "$cameras_root/src/motion_levels_cameras/" \
  "$candidate/components/cameras/source/motion_levels_cameras/"
install -m 0644 \
  "$cameras_root/requirements-native.lock" \
  "$candidate/components/cameras/requirements-native.lock"

# The venue owns only deployment/runtime adapters, operator pages, and units.
rsync -a \
  --exclude '__pycache__' \
  --exclude '*.py[cod]' \
  --exclude 'tests/' \
  "$repo_root/deploy/motionlevels-pc/" \
  "$candidate/deploy/motionlevels-pc/"

python3 - "$candidate" "$venue_revision" "$controller_revision" "$games_revision" "$cameras_revision" <<'PY'
from __future__ import annotations

from hashlib import sha256
import json
from pathlib import Path
import sys

root = Path(sys.argv[1])
venue, controller, games, cameras = sys.argv[2:]
files: list[dict[str, object]] = []
for path in sorted(root.rglob("*")):
    if path.name == "release-manifest.json" or (not path.is_file() and not path.is_symlink()):
        continue
    payload = path.readlink().as_posix().encode() if path.is_symlink() else path.read_bytes()
    files.append(
        {
            "bytes": len(payload),
            "path": path.relative_to(root).as_posix(),
            "sha256": sha256(payload).hexdigest(),
            "type": "symlink" if path.is_symlink() else "file",
        }
    )
manifest = {
    "schema": "motion-levels-native-venue-release-v1",
    "venueRevision": venue,
    "components": {
        "controller": controller,
        "games": games,
        "cameras": cameras,
    },
    "files": files,
}
(root / "release-manifest.json").write_text(
    json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8"
)
PY
python3 "$repo_root/scripts/verify-native-release.py" "$candidate" >/dev/null

mkdir -p "$(dirname "$release_dir")"
rm -rf "$release_dir"
mv "$candidate" "$release_dir"
trap - EXIT
printf '%s\n' "$release_dir"
