# Venue deployment and rollback

This repository is the release owner for the venue runtime. Venue images use
the full venue commit as their immutable tag; platform commits are a separate
release stream.

## Prerequisites

- Work from a clean checkout of the exact commit to deploy.
- Confirm CI and the `Container images` workflow succeeded for that commit.
- Install the Ansible collection with `make install-ansible-collections`.
- Export a GitHub token that can read the private venue and controller images
  as `GHCR_TOKEN`, or let the Make target use `gh auth token`.

Provision a new Proxmox VM from the tracked cloud-init template with:

```sh
deploy/motionlevels-pc/create-motionlevels-venue-vm.sh
```

The helper accepts environment overrides documented at the top of the script.
Cloud-init carries bootstrapping copies of a small set of canonical runtime
files from `deploy/motionlevels-pc/`. After changing one of those files, refresh
and verify the embedded copies before committing:

```sh
npm run sync:cloud-init-mirrors
npm run check:cloud-init-mirrors
```

The static test suite also rejects drift so newly provisioned venues cannot
silently start with older kiosk, Caddy, audio, environment, or service files.

## Automatic production deployment

After CI publishes the complete immutable image set for a new `main` commit,
the `Container images` workflow requests activation of that exact revision on
`motionlevels-1`. A scheduled reconciliation workflow retries releases that
were safely deferred while the physical display was disconnected. The relay
rejects stale revisions, and an already-active revision is a no-op.

Automatic activation uses the same idle, HDMI, image-contract, health, and
rollback gates as an operator deployment. It never bypasses the venue release
helper. The `Production` environment must contain
`VENUE_AUTO_DEPLOY_TOKEN`; the authenticated relay URL defaults to
`https://platform.motionlevels.obis.dev/api/venue/auto-deploy` and can be
overridden with the `VENUE_AUTO_DEPLOY_URL` environment variable.

## Deploy `motionlevels-1` manually

```sh
make ansible-ping LIMIT=motionlevels-1
make deploy-motionlevels-1
make status-motionlevels-1
```

The container playbook resolves `git rev-parse HEAD`, pulls every image tagged
for that revision, verifies its embedded revision, architecture, protocol and
digest, stages a complete candidate, and activates it only through the venue's
atomic release helper. The controller image remains independently pinned in
`deploy/motionlevels-pc/venue-components.lock.json`.

Use the broader target only when deploying an explicit inventory selection:

```sh
make deploy-venues LIMIT=motionlevels-1
```

`motionlevels-cloud-1` is a recovery target and is not part of the default
production deployment path.

## Observe and roll back

```sh
make logs-motionlevels-1
make restart-motionlevels-1
make rollback-motionlevels-1
make status-motionlevels-1
```

Failed activation health checks roll back automatically. The manual rollback
command restores the previously activated manifest; verify engine, controller,
player menu, player display, floor output, and audio before declaring recovery
complete.

The X5 implementation remains dormant while `motion_levels_x5_enabled` is
false. Restoring it requires a coordinated platform and venue configuration
change; ordinary venue deploys must not enable it implicitly.
