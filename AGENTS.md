# AGENTS.md

Guidance for AI agents and humans working in this repository.

## Repository scope

This is the **venue deployment and hardware-integration repository**. Its active production scope is:

- production inventory and per-venue non-secret configuration under `ansible/inventory/production/`;
- native Debian deployment in `ansible/playbooks/venue.yml` and `ansible/templates/`;
- full-SHA source pins in `deploy/motionlevels-pc/venue-components.lock.json`;
- locally verified release assembly in `scripts/build-native-release.sh`;
- venue-owned systemd, Caddy, kiosk, supervisor, camera wiring, and host adapters under
  `deploy/motionlevels-pc/`.

Gameplay, the TypeScript venue runtime, player menu, display renderer, and revision-matched media
belong to `motion-levels-games`. Camera control and media durability belong to
`motion-levels-cameras`. The physical controller belongs to `motion-levels-controller`. Consume
those repositories only at the full revisions in the component lock.

The `game-engine/`, `apps/player-menu/`, `apps/player-display/`, `packages/`, `content/`, and
Docker/Compose paths present in older revisions are historical migration material. Do not restore,
modify, build, deploy, copy from, or revive them as production fallbacks. Make implementation
changes in the owning repository.

## Venue configuration

The default inventory is `ansible/inventory/production/hosts.yml`. Shared defaults live in
`ansible/inventory/production/group_vars/all.yml`; the complete production hardware example is
`ansible/inventory/production/host_vars/motionlevels-1.yml` (Zaragoza Caracol Sala 1).

Add or change venue identity, addresses, display/audio hardware, exact camera serial/USB identity,
and recording policy in host vars. Keep bearer tokens and all other secrets outside Git at the
host paths referenced by those variables. Never replace an exact camera serial with a model-only or
USB-port-only match.

## Source-first native releases

- Production deployment is Ansible plus systemd. Do not add a Docker image, Compose, registry, or
  Kubernetes deployment path.
- The venue `HEAD` and every component pin must be full 40-character Git revisions.
- The venue, controller, games, and camera source trees must be clean and revision-matched before a
  build or deploy. Do not deploy a dirty checkout.
- Source repositories are the canonical inputs. The controller binary and games bundle are derived
  locally; camera source is copied directly. All three exist only inside the checksummed venue release.
- `release-manifest.json` must cover every transferred runtime file. Never bypass
  `scripts/verify-native-release.py` or copy a source tree directly to a venue.
- Remote releases live under `/opt/motion-levels/venue/releases/<venue-sha>` and activation uses the
  `current`/`previous` symlinks. Mutable state must remain under `/var/lib`; configuration and
  secrets must remain under `/etc`.
- CI may validate a revision, but manual deployment does not depend on a published CI artifact.

Use `make deploy-motionlevels-1` for production and the status/log/rollback targets documented in
the README. The playbook's health gates and rollback are part of the release contract; do not
replace them with ad-hoc SSH copying or service restarts.

Deployment health is software-only. Physical camera, display, floor, sensor, USB, HDMI, and network
adapter presence, identity, signal, or readiness must never be an Ansible activation or rollback
condition. Report unavailable hardware as degraded runtime state and keep the corresponding service
and hotplug/retry mechanism active so it can recover later.

## Camera safety

Camera status checks must remain read-only. Never record, stop, photograph, delete media, or alter a
profile during deployment verification. Runtime control must require the venue's exact GoPro serial,
but presence and readiness never gate deployment. Preserve the camera service's multipart upload,
object-verification-before-delete, and workflow-owned SD cleanup boundaries.

## Deployment target preference

Treat `motionlevels-1` as the primary production venue. Do not deploy to `motionlevels-cloud-1`
unless the user explicitly requests that recovery target and it exists in the selected inventory.

## Validation

For operator/configuration changes, run the practical subset of:

```sh
ansible-inventory --graph
ansible-playbook ansible/playbooks/venue.yml --syntax-check
make show-pins
```

The native build additionally verifies all four clean source revisions and the generated release
manifest. Diagnose hardware separately after deployment through systemd status, journal logs,
service metrics, the venue snapshot, and read-only status requests.

## Multiple parties share this repo

More than one agent/person commits to `main`. Preserve unrelated work in a dirty tree. Pull with
rebase before a new change, periodically during long work, and immediately before pushing. Commit
small focused changes and push them promptly. Resolve conflicts deliberately.

## Commit identity

Commits from this machine use **Motion Levels <noreply@motionlevels.com>** from the global Git
configuration. Leave that identity unchanged unless explicitly instructed otherwise.

## Infrastructure hostnames

`motionlevels-dev` is retired. Use `motionlevels-platform` for the platform host and
`motionlevels-postgres-1` for PostgreSQL/database checks.
