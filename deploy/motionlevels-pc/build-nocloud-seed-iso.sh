#!/usr/bin/env bash
set -euo pipefail

# Build a standard NoCloud seed ISO containing Motion Levels cloud-init data.
# Attach this ISO as a secondary CD-ROM/config drive to a Debian cloud image VM.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CLOUD_INIT_TEMPLATE="${CLOUD_INIT_TEMPLATE:-${SCRIPT_DIR}/cloud-init.yaml}"

VM_HOSTNAME="${VM_HOSTNAME:-motionlevels-venue}"
OUTPUT="${OUTPUT:-${REPO_ROOT}/release/${VM_HOSTNAME}-seed.iso}"
TS_AUTHKEY="${TS_AUTHKEY:-}"
TAILSCALE_ADVERTISE_TAGS="${TAILSCALE_ADVERTISE_TAGS:-tag:motion-levels-edge}"
if [ -z "${SSH_PUBLIC_KEY_FILE:-}" ]; then
  if [ -f "${HOME}/.ssh/id_ed25519.pub" ]; then
    SSH_PUBLIC_KEY_FILE="${HOME}/.ssh/id_ed25519.pub"
  else
    SSH_PUBLIC_KEY_FILE="${HOME}/.ssh/id_rsa.pub"
  fi
fi

quote_env_value() {
  printf '%q' "$1"
}

if [ ! -f "${CLOUD_INIT_TEMPLATE}" ]; then
  echo "Cloud-init template not found: ${CLOUD_INIT_TEMPLATE}" >&2
  exit 1
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "${tmp_dir}"' EXIT

user_data="${tmp_dir}/user-data"
meta_data="${tmp_dir}/meta-data"
network_config="${tmp_dir}/network-config"

cp "${CLOUD_INIT_TEMPLATE}" "${user_data}"

export ML_PROVISION_HOSTNAME_QUOTED
export TS_AUTHKEY_QUOTED
export TS_TAGS_QUOTED
export SSH_KEYS_YAML
ML_PROVISION_HOSTNAME_QUOTED="$(quote_env_value "${VM_HOSTNAME}")"
TS_AUTHKEY_QUOTED="$(quote_env_value "${TS_AUTHKEY}")"
TS_TAGS_QUOTED="$(quote_env_value "${TAILSCALE_ADVERTISE_TAGS}")"
SSH_KEYS_YAML=""
if [ -f "${SSH_PUBLIC_KEY_FILE}" ]; then
  SSH_KEYS_YAML="$(awk 'NF { sub(/\r$/, ""); print "      - " $0 }' "${SSH_PUBLIC_KEY_FILE}")"
  if grep -F -f "${SSH_PUBLIC_KEY_FILE}" "${user_data}" >/dev/null 2>&1; then
    SSH_KEYS_YAML=""
  fi
fi

perl -0pi -e '
  s/^      MOTION_LEVELS_PROVISION_HOSTNAME=.*/      MOTION_LEVELS_PROVISION_HOSTNAME=$ENV{ML_PROVISION_HOSTNAME_QUOTED}/m;
  s/^      TAILSCALE_AUTHKEY=.*/      TAILSCALE_AUTHKEY=$ENV{TS_AUTHKEY_QUOTED}/m;
  s/^      TAILSCALE_ADVERTISE_TAGS=.*/      TAILSCALE_ADVERTISE_TAGS=$ENV{TS_TAGS_QUOTED}/m;
  s/^      # MOTION_LEVELS_SSH_AUTHORIZED_KEYS\n/$ENV{SSH_KEYS_YAML} ? ($ENV{SSH_KEYS_YAML} . "\n") : "      # MOTION_LEVELS_SSH_AUTHORIZED_KEYS\n"/me;
' "${user_data}"

cat >"${meta_data}" <<EOF
instance-id: motionlevels-${VM_HOSTNAME}
local-hostname: ${VM_HOSTNAME}
EOF

cat >"${network_config}" <<'EOF'
version: 2
ethernets:
  all:
    match:
      name: "e*"
    dhcp4: true
    dhcp6: false
EOF

mkdir -p "$(dirname "${OUTPUT}")"
rm -f "${OUTPUT}"

if command -v cloud-localds >/dev/null 2>&1; then
  cloud-localds --network-config="${network_config}" "${OUTPUT}" "${user_data}" "${meta_data}"
elif command -v genisoimage >/dev/null 2>&1; then
  genisoimage -quiet -output "${OUTPUT}" -volid cidata -joliet -rock \
    "${user_data}" "${meta_data}" "${network_config}"
elif command -v mkisofs >/dev/null 2>&1; then
  mkisofs -quiet -output "${OUTPUT}" -volid cidata -joliet -rock \
    "${user_data}" "${meta_data}" "${network_config}"
elif command -v xorriso >/dev/null 2>&1; then
  xorriso -as mkisofs -quiet -output "${OUTPUT}" -volid cidata -joliet -rock \
    "${user_data}" "${meta_data}" "${network_config}"
elif command -v hdiutil >/dev/null 2>&1; then
  hdiutil makehybrid -quiet -iso -joliet -default-volume-name cidata \
    -o "${OUTPUT}" "${tmp_dir}"
else
  echo "Need cloud-localds, genisoimage, mkisofs, xorriso, or hdiutil to build an ISO." >&2
  exit 1
fi

echo "Wrote ${OUTPUT}"
