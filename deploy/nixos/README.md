# NixOS venue host: Zaragoza

This flake installs the NixOS host layer for the Proxmox VM named
`motionlevels-zaragoza`. It consumes the same verified native release layout as
the Debian production deployment; it does not introduce Docker, Compose, an
image registry, or a second application-release format.

The checked-in configuration deliberately sets
`motionLevels.venueHost.commissioningMode = true`. All venue units and host
prerequisites are installed, but they are not attached to a boot target and
are not restarted by `nixos-rebuild`. Ansible remains canonical for the
per-venue configuration rendered into mutable files under `/etc`. This keeps
the application stack inert while hardware passthrough and venue-local checks
are completed. The old `motionlevels-1` mini PC must remain disconnected while
this replacement retains the same logical room identity.

## VM contract

- UEFI/OVMF, Q35, x86-64, QEMU guest agent;
- main disk exposed as `/dev/sda`, partitioned by Disko as GPT with a 1 GiB ESP
  and an ext4 root filesystem;
- management NIC `BC:24:11:49:08:EF`, renamed to `mgmt0`, at
  `10.137.50.100/24` through `10.137.50.1`;
- venue NIC `BC:24:11:2D:D7:75`, renamed to `venue0`, at
  `192.168.1.142/24` with no default route;
- isolated GoPro USB link `04:57:47:04:B1:1C`, renamed to `gopro0`, with
  inbound UDP/8554 allowed only on that interface for the
  `udp://@0.0.0.0:8554` preview receiver;
- SSH key authentication only;
- Tailscale installed but not given an auth key by Nix.

The Zaragoza Twitch transcode is inventory-owned and fixed at 1920x1080,
30 fps, 6000 kbps video, and 160 kbps audio.

The guest filesystem is ext4 because the Proxmox storage layer already owns
ZFS. Do not enable discard/TRIM for this VM until the earlier Proxmox/NixOS
discard failure has been understood and a disposable-disk test succeeds.

## Install

Inject the operator public key outside the flake, then run `nixos-anywhere`
against the temporary Linux system in the VM:

```sh
cd deploy/nixos
install -Dm0600 ~/.ssh/id_ed25519.pub \
  /tmp/motionlevels-zaragoza-extra/etc/ssh/authorized_keys.d/root

nix run github:nix-community/nixos-anywhere -- \
  --flake .#motionlevels-zaragoza \
  --extra-files /tmp/motionlevels-zaragoza-extra \
  root@10.137.50.100
```

This repartitions `/dev/sda`; use it only for the new VM.

## Register Tailscale

No reusable key or OAuth credential belongs in this flake. After the first
boot, authenticate interactively or pass a short-lived key from a protected
runtime file:

```sh
sudo tailscale up \
  --hostname=motionlevels-zaragoza \
  --advertise-tags=tag:motion-levels-edge \
  --accept-dns=false \
  --accept-routes=false \
  --ssh
```

Do not clone `/var/lib/tailscale` into another guest because it contains the
node identity.

## Native release and secrets

Build the release with the repository's canonical
`scripts/build-native-release.sh`, verify its manifest, and transfer the exact
directory with the commissioning-only staging playbook:

```sh
make stage-motionlevels-zaragoza
```

It writes the verified release below:

```text
/opt/motion-levels/venue/releases/<full-venue-sha>
```

Activation continues to use the atomic `current` and `previous` symlinks. The
NixOS units execute the controller, games runtime, camera source, supervisor,
kiosk, and adapters through `/opt/motion-levels/venue/current`. The same staging
playbook renders `/etc/motion-levels/motion-levels.env`,
`/etc/motion-levels-cameras.env`, and `/etc/caddy/Caddyfile` as normal mutable
files; the Nix configuration deliberately does not own those paths.

Provision these host-owned files separately. Nix intentionally creates none of
them and never copies their values into the world-readable Nix store:

```text
/etc/motion-levels/platform.env
/etc/motion-levels/camera-recorder-token
/etc/motion-levels/camera.env
/etc/motion-levels/security-recorder.env
/etc/motion-levels/venue-supervisor.env
/etc/motion-levels-cameras/platform-token
/etc/motion-levels-cameras/twitch-stream-key
```

After attaching passthrough, verify the exact HDMI output, ALSA card/device,
GoPro serial/USB topology and USB network interface visible inside NixOS. Then
change `commissioningMode` to `false`, rebuild the NixOS generation, and run the
same software-only health contract used by the Debian deployment. Missing
physical peripherals remain degraded runtime state and do not justify changing
their exact configured identities.

## Validation

```sh
cd deploy/nixos
nix flake check
nix build .#nixosConfigurations.motionlevels-zaragoza.config.system.build.toplevel
```
