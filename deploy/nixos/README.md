# NixOS venue host

This directory defines the future NixOS host layer for Motion Levels venues.
The application boundary is unchanged: venue releases remain six immutable OCI
images built from this repository. NixOS replaces the mutable Debian host, not
the application containers.

`motionlevels-nixos-venue-lab` is an isolated Proxmox VM used to validate:

- declarative disk, network, SSH, Docker, QEMU guest-agent, and Tailscale setup;
- reboot persistence;
- loading and serving an exact released venue image;
- the `/menu/`, `/display/`, and `/games/` static surfaces.

The VM deliberately does not emulate floor Ethernet, cameras, ALSA, DRM, HDMI,
or Wayland. The lab service is not enabled at boot and must only be started
after its private immutable image has been loaded:

```sh
sudo systemctl start motion-levels-venue-lab
curl --fail http://127.0.0.1:8080/menu/
```

## Validate the configuration

Run from this directory on a machine with Nix installed:

```sh
nix flake check
nix build .#nixosConfigurations.motionlevels-nixos-venue-lab.config.system.build.toplevel
```

## Install the disposable VM

Provision VMID 253 with the companion HomeLab script first. Then copy the
operator public key into an extra-files tree and run `nixos-anywhere`:

```sh
install -Dm0600 ~/.ssh/id_ed25519.pub \
  /tmp/motionlevels-nixos-extra/etc/ssh/authorized_keys.d/root
nix run github:nix-community/nixos-anywhere -- \
  --flake .#motionlevels-nixos-venue-lab \
  --extra-files /tmp/motionlevels-nixos-extra \
  root@10.137.25.253
```

The install repartitions only the new disposable VM disk. It does not interact
with `motionlevels-1`.
