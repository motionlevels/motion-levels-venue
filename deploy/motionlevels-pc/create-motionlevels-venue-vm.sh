#!/usr/bin/env bash
set -euo pipefail

# Create a Motion Levels venue test VM on the homelab Proxmox node from the
# Debian cloud image and deploy/motionlevels-pc/cloud-init.yaml.
#
# Run from a workstation that can SSH to the Proxmox node as root.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CLOUD_INIT_TEMPLATE="${CLOUD_INIT_TEMPLATE:-${REPO_ROOT}/deploy/motionlevels-pc/cloud-init.yaml}"

PROXMOX_HOST="${PROXMOX_HOST:-proxmox}"
VMID="${VMID:-305}"
VM_HOSTNAME="${VM_HOSTNAME:-motionlevels-trixie-test}"
RECREATE="${RECREATE:-0}"

IMAGE_PATH="${IMAGE_PATH:-/var/lib/vz/template/iso/debian-13-genericcloud-amd64.qcow2}"
STORAGE="${STORAGE:-local-lvm}"
SNIPPET_STORAGE="${SNIPPET_STORAGE:-nvme-large-1}"
SNIPPET_DIR="${SNIPPET_DIR:-/mnt/pve/${SNIPPET_STORAGE}/snippets}"
MEMORY="${MEMORY:-4096}"
CORES="${CORES:-2}"
DISK_SIZE="${DISK_SIZE:-32G}"
BRIDGE="${BRIDGE:-vmbr0}"
NET0="${NET0:-virtio,bridge=${BRIDGE}}"
IPCONFIG0="${IPCONFIG0:-ip=dhcp}"
NAMESERVER="${NAMESERVER:-192.168.1.1}"
SEARCHDOMAIN="${SEARCHDOMAIN:-obis.dev}"
TS_AUTHKEY="${TS_AUTHKEY:-}"
TAILSCALE_ADVERTISE_TAGS="${TAILSCALE_ADVERTISE_TAGS:-tag:motion-levels-edge}"
if [ -z "${SSH_PUBLIC_KEY_FILE:-}" ]; then
  if [ -f "${HOME}/.ssh/id_ed25519.pub" ]; then
    SSH_PUBLIC_KEY_FILE="${HOME}/.ssh/id_ed25519.pub"
  else
    SSH_PUBLIC_KEY_FILE="${HOME}/.ssh/id_rsa.pub"
  fi
fi

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

quote_env_value() {
  printf '%q' "$1"
}

remote() {
  ssh -o BatchMode=yes "${PROXMOX_HOST}" "$@"
}

need ssh
need scp
need perl

if [ ! -f "${CLOUD_INIT_TEMPLATE}" ]; then
  echo "Cloud-init template not found: ${CLOUD_INIT_TEMPLATE}" >&2
  exit 1
fi

if [ ! -f "${SSH_PUBLIC_KEY_FILE}" ]; then
  echo "SSH public key not found: ${SSH_PUBLIC_KEY_FILE}" >&2
  echo "Set SSH_PUBLIC_KEY_FILE to the key that should log in as root." >&2
  exit 1
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "${tmp_dir}"' EXIT

user_data="${tmp_dir}/user-data.yaml"
ssh_keys="${tmp_dir}/sshkeys.pub"
cp "${CLOUD_INIT_TEMPLATE}" "${user_data}"
cp "${SSH_PUBLIC_KEY_FILE}" "${ssh_keys}"

export ML_PROVISION_HOSTNAME_QUOTED
export TS_AUTHKEY_QUOTED
export TS_TAGS_QUOTED
export SSH_KEYS_YAML
ML_PROVISION_HOSTNAME_QUOTED="$(quote_env_value "${VM_HOSTNAME}")"
TS_AUTHKEY_QUOTED="$(quote_env_value "${TS_AUTHKEY}")"
TS_TAGS_QUOTED="$(quote_env_value "${TAILSCALE_ADVERTISE_TAGS}")"
SSH_KEYS_YAML="$(awk 'NF { sub(/\r$/, ""); print "      - " $0 }' "${SSH_PUBLIC_KEY_FILE}")"
if grep -F -f "${SSH_PUBLIC_KEY_FILE}" "${user_data}" >/dev/null 2>&1; then
  SSH_KEYS_YAML=""
fi

perl -0pi -e '
  s/^      MOTION_LEVELS_PROVISION_HOSTNAME=.*/      MOTION_LEVELS_PROVISION_HOSTNAME=$ENV{ML_PROVISION_HOSTNAME_QUOTED}/m;
  s/^      TAILSCALE_AUTHKEY=.*/      TAILSCALE_AUTHKEY=$ENV{TS_AUTHKEY_QUOTED}/m;
  s/^      TAILSCALE_ADVERTISE_TAGS=.*/      TAILSCALE_ADVERTISE_TAGS=$ENV{TS_TAGS_QUOTED}/m;
  s/^      # MOTION_LEVELS_SSH_AUTHORIZED_KEYS\n/$ENV{SSH_KEYS_YAML} . "\n"/me;
' "${user_data}"

remote_user_data="${SNIPPET_DIR}/motionlevels-${VMID}-user-data.yaml"
remote_ssh_keys="${SNIPPET_DIR}/motionlevels-${VMID}-sshkeys.pub"

remote "install -d -m 0755 '${SNIPPET_DIR}'"
scp -q "${user_data}" "${PROXMOX_HOST}:${remote_user_data}"
scp -q "${ssh_keys}" "${PROXMOX_HOST}:${remote_ssh_keys}"

if remote "qm status '${VMID}' >/dev/null 2>&1"; then
  if [ "${RECREATE}" != "1" ]; then
    echo "VM ${VMID} already exists. Set RECREATE=1 to destroy and recreate it." >&2
    exit 1
  fi

  echo "Destroying existing VM ${VMID}..."
  remote "qm shutdown '${VMID}' --timeout 30 >/dev/null 2>&1 || qm stop '${VMID}' >/dev/null 2>&1 || true"
  remote "qm destroy '${VMID}' --purge 1"
fi

echo "Creating VM ${VMID} (${VM_HOSTNAME}) on ${PROXMOX_HOST}..."
remote "test -f '${IMAGE_PATH}'"
remote "qm create '${VMID}' \
  --name '${VM_HOSTNAME}' \
  --memory '${MEMORY}' \
  --cores '${CORES}' \
  --net0 '${NET0}' \
  --scsihw virtio-scsi-pci \
  --agent enabled=1 \
  --ostype l26 \
  --serial0 socket \
  --vga std"
remote "qm importdisk '${VMID}' '${IMAGE_PATH}' '${STORAGE}'"
remote "qm set '${VMID}' \
  --scsi0 '${STORAGE}:vm-${VMID}-disk-0,discard=on,ssd=1' \
  --ide2 '${STORAGE}:cloudinit' \
  --boot order=scsi0 \
  --ipconfig0 '${IPCONFIG0}' \
  --nameserver '${NAMESERVER}' \
  --searchdomain '${SEARCHDOMAIN}' \
  --ciuser root \
  --sshkeys '${remote_ssh_keys}' \
  --cicustom 'user=${SNIPPET_STORAGE}:snippets/motionlevels-${VMID}-user-data.yaml'"
remote "qm resize '${VMID}' scsi0 '${DISK_SIZE}'"
remote "qm start '${VMID}'"

cat <<EOF

Created VM:
  VMID:      ${VMID}
  Hostname:  ${VM_HOSTNAME}
  Proxmox:   ${PROXMOX_HOST}
  SSH user:  root

Wait for cloud-init:
  ssh root@${VM_HOSTNAME} cloud-init status --wait

Deploy updates:
  ansible-playbook ansible/playbooks/venue-containers.yml \
    --limit localhost,${VM_HOSTNAME} \
    -e motion_levels_containerized_venue=true \
    -e motion_levels_display_backend=x11
EOF
