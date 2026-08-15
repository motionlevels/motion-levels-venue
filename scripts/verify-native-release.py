#!/usr/bin/env python3
"""Verify every byte and required entry in a native venue release directory."""

from __future__ import annotations

import json
import os
import re
import sys
from hashlib import sha256
from pathlib import Path


def fail(message: str) -> None:
    raise SystemExit(message)


if len(sys.argv) != 2:
    fail("usage: verify-native-release.py <release-directory>")

root = Path(sys.argv[1]).resolve()
if root.stat().st_mode & 0o777 != 0o755:
    fail("native release root must have mode 0755")
manifest_path = root / "release-manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
if manifest.get("schema") != "motion-levels-native-venue-release-v1":
    fail("unsupported native venue release schema")

revision_pattern = re.compile(r"^[0-9a-f]{40}$")
if not revision_pattern.fullmatch(str(manifest.get("venueRevision", ""))):
    fail("invalid venue revision")
components = manifest.get("components")
if not isinstance(components, dict) or set(components) != {"controller", "games", "cameras"}:
    fail("release must pin controller, games, and cameras")
for name, revision in components.items():
    if not revision_pattern.fullmatch(str(revision)):
        fail(f"invalid {name} revision")

records = manifest.get("files")
if not isinstance(records, list) or not records:
    fail("native release file manifest is empty")
seen: set[str] = set()
for record in records:
    if not isinstance(record, dict):
        fail("invalid native release file record")
    relative = str(record.get("path", ""))
    path = Path(relative)
    if not relative or path.is_absolute() or ".." in path.parts or relative in seen:
        fail(f"unsafe or duplicate native release path: {relative!r}")
    seen.add(relative)
    target = root / path
    record_type = record.get("type", "file")
    if record_type not in {"file", "symlink"}:
        fail(f"unsupported native release file type: {record_type!r}")
    if record_type == "symlink" and not target.is_symlink():
        fail(f"native release symlink is missing: {relative}")
    if record_type == "file" and (not target.is_file() or target.is_symlink()):
        fail(f"native release file is missing: {relative}")
    payload = target.readlink().as_posix().encode() if target.is_symlink() else target.read_bytes()
    if record.get("bytes") != len(payload) or record.get("sha256") != sha256(payload).hexdigest():
        fail(f"native release file failed digest verification: {relative}")

actual = {
    path.relative_to(root).as_posix()
    for path in root.rglob("*")
    if (path.is_file() or path.is_symlink()) and path != manifest_path
}
complete_path = root / ".complete"
if ".complete" in actual:
    if complete_path.is_symlink() or not complete_path.is_file():
        fail("native release completion marker must be a regular file")
    if complete_path.read_text(encoding="utf-8").strip() != manifest["venueRevision"]:
        fail("native release completion marker does not match venue revision")
    actual.remove(".complete")
if actual != seen:
    fail(f"native release contains unmanifested files: {sorted(actual - seen)}")
for path in root.rglob("*"):
    relative = path.relative_to(root)
    if path.name == "__pycache__" or path.suffix in {".pyc", ".pyo"} or "tests" in relative.parts:
        fail(f"development-only Python content is not allowed in a native release: {relative}")

games_revision = str(components["games"])
bundle_root = root / "game-bundles/motion-levels-games" / games_revision
current_bundle = root / "game-bundles/motion-levels-games/current"
if not current_bundle.is_symlink() or current_bundle.readlink() != Path(games_revision):
    fail("games current symlink does not select the pinned revision")
bundle = json.loads((bundle_root / "bundle.json").read_text(encoding="utf-8"))
if bundle.get("sourceRevision") != games_revision:
    fail("games bundle revision does not match release manifest")
for entry in (
    bundle.get("venueRuntime", {}).get("entry"),
    bundle.get("playerMenu", {}).get("entry"),
    bundle.get("playerDisplay", {}).get("entry"),
    bundle.get("playerDisplay", {}).get("shellEntry"),
):
    if not isinstance(entry, str) or not (bundle_root / entry).is_file():
        fail(f"games bundle entry is missing: {entry!r}")

for executable in (
    root / "bin/floor-controller",
    root / "deploy/motionlevels-pc/venue-runtime",
):
    if not executable.is_file() or not os.access(executable, os.X_OK):
        fail(f"native executable is missing or not executable: {executable.relative_to(root)}")
camera_root = root / "components/cameras"
camera_source = camera_root / "source/motion_levels_cameras"
for required in (
    camera_root / "requirements-native.lock",
    camera_source / "__init__.py",
    camera_source / "main.py",
):
    if not required.is_file():
        fail(f"camera source entry is missing: {required.relative_to(root)}")
if list(camera_root.rglob("*.whl")):
    fail("camera application wheels are not allowed in a source release")
print(
    f"Verified native venue release {manifest['venueRevision']} "
    f"with {len(records)} files"
)
