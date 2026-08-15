# Motion Levels Venue

This repository is the deployment and hardware-integration boundary for a Motion Levels venue. It
does not implement gameplay, the player menu/display renderer, camera control, or the physical floor
controller. It pins those source repositories by full Git SHA, assembles their verified native
outputs locally, and deploys them to Debian with Ansible and systemd.

Production does not deploy Docker images or wait for a registry publication. Any CI is supplemental
validation; a manual deployment is built from the exact clean source checkouts selected here.

## Start here

- Production hosts: [`ansible/inventory/production/hosts.yml`](ansible/inventory/production/hosts.yml)
- Zaragoza Caracol Sala 1 configuration:
  [`ansible/inventory/production/host_vars/motionlevels-1.yml`](ansible/inventory/production/host_vars/motionlevels-1.yml)
- Shared native defaults:
  [`ansible/inventory/production/group_vars/all.yml`](ansible/inventory/production/group_vars/all.yml)
- Exact controller, games, and camera source pins:
  [`deploy/motionlevels-pc/venue-components.lock.json`](deploy/motionlevels-pc/venue-components.lock.json)
- Native playbook: [`ansible/playbooks/venue.yml`](ansible/playbooks/venue.yml)
- Full operator runbook: [`docs/operations/venue-deployment.md`](docs/operations/venue-deployment.md)

The production host variables are the canonical place to discover venue identity and non-secret
hardware configuration: room UUID, host/network addresses, display/audio mode, exact GoPro serial
and USB identity, recording policy, and security-camera settings. Secret token values remain only on
the venue host at the file paths referenced by those variables; never put them in Git.

## Source ownership

| Concern | Canonical repository |
| --- | --- |
| Inventory, Ansible, native release assembly, systemd, Caddy, kiosk, supervisor, hardware wiring | `motion-levels-venue` |
| Gameplay, TypeScript venue runtime, menu, display renderer, and revision-matched media | `motion-levels-games` |
| Physical floor controller binary and wire protocols | `motion-levels-controller` |
| GoPro control, preview, multipart upload, verification, and SD cleanup | `motion-levels-cameras` |
| Platform, database, object storage, and platform sala view | `motion-levels-platform` |

The old `game-engine/`, `apps/player-menu/`, `apps/player-display/`, `packages/`, `content/`, and
container/Compose paths found in earlier revisions are historical migration material. They are not
production implementation, deployment entrypoints, or fallbacks. Do not restore them; make changes
in the owning source repository.

## Native release model

[`deploy/motionlevels-pc/venue-components.lock.json`](deploy/motionlevels-pc/venue-components.lock.json)
pins full 40-character revisions for controller, games, and cameras. By default, the builder expects
clean sibling checkouts at:

```text
../motion-levels-controller
../motion-levels-games
../motion-levels-cameras
```

Override those locations with `MOTION_LEVELS_CONTROLLER_SOURCE`, `MOTION_LEVELS_GAMES_SOURCE`, and
`MOTION_LEVELS_CAMERAS_SOURCE`. Each checkout must be clean and at the exact locked revision. The
venue checkout must also be clean because its own full `HEAD` becomes the release identity.
The builder requires the exact Node.js major in `components.games.nodeVersion`; when that version is
not the system default, set `MOTION_LEVELS_NODE_BIN_DIR` to an absolute directory containing its
`node` and `npm` executables (for example, a versioned Homebrew formula's `bin` directory).

`scripts/build-native-release.sh` builds locally into
`/tmp/motion-levels-venue-native/releases/<venue-sha>` by default. It produces only derived runtime
output: the static controller binary, revision-matched games bundle, pinned camera source,
and venue adapters. `release-manifest.json` records every component revision plus the size and
SHA-256 of every file. `scripts/verify-native-release.py` verifies that directory before Ansible
transfers it. Nothing is pulled from a venue image registry.

On `motionlevels-1`, immutable releases live below `/opt/motion-levels/venue/releases/`. The
`current` and `previous` symlinks provide atomic activation and one-release rollback. Mutable state
stays under `/var/lib/motion-levels*`; configuration and secrets stay under `/etc/`.

## Deploy production

Install the Ansible dependency once, verify access, inspect the pins, and deploy:

```sh
make install-ansible-collections
make ansible-ping LIMIT=motionlevels-1
make show-pins
make deploy-motionlevels-1
```

The playbook performs the local build and manifest verification itself, stages the exact release,
switches the native systemd stack, verifies the software services and local HTTP surfaces, and
automatically restores the previous healthy release if activation fails. It refuses dirty or
revision-mismatched source trees. There is no CI, container image, or GHCR wait in this path.

Physical peripherals never gate deployment. A powered-off GoPro, disconnected TV, or unavailable
floor is reported by the venue and platform as an operational state after activation. The configured
identity still makes camera control fail closed for an unexpected device; udev, the HDMI watchdog,
and floor-network reconciliation recover automatically when the expected hardware appears later.

Useful operator commands:

```sh
make status-motionlevels-1
make health-motionlevels-1
make release-motionlevels-1
make logs-motionlevels-1
make rollback-motionlevels-1
```

`make build-native-release` can be used as a local preflight. Its final line is the verified release
directory; pass that path to `make verify-native-release RELEASE_DIR=...` for an explicit second
verification.

See the [deployment runbook](docs/operations/venue-deployment.md) for secrets, source-pin updates,
health endpoints, logs, rollback behavior, and adding a venue. Games pinning is described in
[`docs/operations/games-bundle-sync.md`](docs/operations/games-bundle-sync.md).
