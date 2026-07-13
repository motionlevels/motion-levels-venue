#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
platform_dir="${PLATFORM_DIR:-${repo_root}/../motion-levels}"
mode="check"
scope="all"

usage() {
  cat <<'EOF'
Usage: scripts/sync-platform-mirrors.sh [--check|--sync] [--platform-dir PATH] [--scope all|seeds]

The venue repository is canonical for packages/, go.mod/go.sum, content/audio,
and motion-go seed sources. --check reports drift without writing. --sync makes
the corresponding mirrors in a sibling motion-levels-platform checkout match.

game-bundles/ is intentionally excluded: each consumer pins releases through
its own Sync Motion Levels games bundle workflow.
EOF
}

while (($#)); do
  case "$1" in
    --check)
      mode="check"
      ;;
    --sync)
      mode="sync"
      ;;
    --platform-dir)
      shift
      (($#)) || { echo "--platform-dir requires a path" >&2; exit 2; }
      platform_dir="$1"
      ;;
    --scope)
      shift
      (($#)) || { echo "--scope requires all or seeds" >&2; exit 2; }
      scope="$1"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

case "$scope" in
  all|seeds) ;;
  *)
    echo "Unsupported scope: $scope (expected all or seeds)" >&2
    exit 2
    ;;
esac

platform_dir="$(cd "$platform_dir" 2>/dev/null && pwd)" || {
  echo "Platform checkout not found at $platform_dir" >&2
  echo "Pass --platform-dir PATH or set PLATFORM_DIR." >&2
  exit 1
}

if [[ ! -d "$platform_dir/.git" || ! -d "$platform_dir/platform/app/src/lib/seed" ]]; then
  echo "$platform_dir is not a motion-levels-platform checkout" >&2
  exit 1
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT
drift=0

write_file_list() {
  local repo="$1"
  local prefix="$2"
  local kind="$3"
  local output="$4"

  git -C "$repo" ls-files --cached --others --exclude-standard -z -- "$prefix" |
    while IFS= read -r -d '' path; do
      [[ -e "$repo/$path" || -L "$repo/$path" ]] || continue
      local relative="${path#"$prefix"/}"
      if [[ "$path" == "$prefix" ]]; then
        relative="${path##*/}"
      fi
      if [[ "$kind" == "typescript" && "$relative" != *.ts ]]; then
        continue
      fi
      printf '%s\n' "$relative"
    done | LC_ALL=C sort -u >"$output"
}

check_tree() {
  local label="$1"
  local source_prefix="$2"
  local target_prefix="$3"
  local kind="${4:-all}"
  local source_list="$tmp_dir/${label//[^a-zA-Z0-9]/_}.source"
  local target_list="$tmp_dir/${label//[^a-zA-Z0-9]/_}.target"

  write_file_list "$repo_root" "$source_prefix" "$kind" "$source_list"
  write_file_list "$platform_dir" "$target_prefix" "$kind" "$target_list"

  # The platform seed directory also contains platform-owned level data. For
  # TypeScript seeds, require every venue-owned file to match but preserve
  # unrelated platform files.
  if [[ "$kind" != "typescript" ]] && ! diff -u "$source_list" "$target_list" >/dev/null; then
    echo "DRIFT $label file set"
    diff -u "$source_list" "$target_list" || true
    drift=1
  fi

  while IFS= read -r relative; do
    [[ -n "$relative" ]] || continue
    if ! cmp -s "$repo_root/$source_prefix/$relative" "$platform_dir/$target_prefix/$relative"; then
      echo "DRIFT $label/$relative"
      drift=1
    fi
  done <"$source_list"
}

sync_tree() {
  local label="$1"
  local source_prefix="$2"
  local target_prefix="$3"
  local kind="${4:-all}"
  local source_list="$tmp_dir/${label//[^a-zA-Z0-9]/_}.source"
  local target_list="$tmp_dir/${label//[^a-zA-Z0-9]/_}.target"

  write_file_list "$repo_root" "$source_prefix" "$kind" "$source_list"
  write_file_list "$platform_dir" "$target_prefix" "$kind" "$target_list"
  mkdir -p "$platform_dir/$target_prefix"

  if [[ "$kind" != "typescript" ]]; then
    comm -13 "$source_list" "$target_list" |
      while IFS= read -r relative; do
        [[ -n "$relative" ]] || continue
        rm -f "$platform_dir/$target_prefix/$relative"
        echo "REMOVED $target_prefix/$relative"
      done
  fi

  while IFS= read -r relative; do
    [[ -n "$relative" ]] || continue
    mkdir -p "$(dirname "$platform_dir/$target_prefix/$relative")"
    cp -Pp "$repo_root/$source_prefix/$relative" "$platform_dir/$target_prefix/$relative"
  done <"$source_list"
  echo "SYNCED $label"
}

check_file() {
  local relative="$1"
  if ! cmp -s "$repo_root/$relative" "$platform_dir/$relative"; then
    echo "DRIFT $relative"
    drift=1
  fi
}

sync_file() {
  local relative="$1"
  cp -Pp "$repo_root/$relative" "$platform_dir/$relative"
  echo "SYNCED $relative"
}

if [[ "$mode" == "check" ]]; then
  if [[ "$scope" == "all" ]]; then
    check_tree packages packages packages
    check_file go.mod
    check_file go.sum
    check_tree audio content/audio content/audio
  fi
  check_tree motion-go-seeds \
    game-engine/internal/games/authored/seeds \
    platform/app/src/lib/seed \
    typescript

  if ((drift)); then
    echo "Platform mirrors are stale. Review the drift, then run make sync-platform-mirrors." >&2
    exit 1
  fi
  echo "Platform mirrors match the venue sources."
  exit 0
fi

if [[ "$scope" == "all" ]]; then
  sync_tree packages packages packages
  sync_file go.mod
  sync_file go.sum
  sync_tree audio content/audio content/audio
fi
sync_tree motion-go-seeds \
  game-engine/internal/games/authored/seeds \
  platform/app/src/lib/seed \
  typescript
echo "Review and commit the mirror changes in $platform_dir."
