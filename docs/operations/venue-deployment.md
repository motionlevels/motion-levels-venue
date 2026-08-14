# Native venue deployment and rollback

This runbook is the production operator path for `motionlevels-1`. A deployment starts from clean,
full-SHA source checkouts on the control machine, builds and verifies a native release locally, and
activates it as systemd services on the Debian venue PC. It does not publish or deploy container
images.

## Canonical inputs

Four Git revisions define a release:

1. The clean `motion-levels-venue` `HEAD` is the release identifier.
2. Controller, games, and camera revisions are full SHAs in
   [`deploy/motionlevels-pc/venue-components.lock.json`](../../deploy/motionlevels-pc/venue-components.lock.json).
3. Production host identity and hardware are in
   [`ansible/inventory/production/host_vars/motionlevels-1.yml`](../../ansible/inventory/production/host_vars/motionlevels-1.yml).
4. Shared paths, package prerequisites, source-checkout defaults, and service names are in
   [`ansible/inventory/production/group_vars/all.yml`](../../ansible/inventory/production/group_vars/all.yml).

The production host file is
[`ansible/inventory/production/hosts.yml`](../../ansible/inventory/production/hosts.yml), and
`ansible.cfg` selects it by default. It deliberately opens independent SSH connections with bounded
connect and keepalive timeouts; a stale multiplexed control socket must not strand a deployment
halfway through a loop.

Do not put secrets in host vars. The production camera configuration references these host-only,
non-empty files:

- `/etc/motion-levels/camera-recorder-token`
- `/etc/motion-levels-cameras/platform-token`
- `/etc/motion-levels-cameras/twitch-stream-key`

The last file contains the Twitch **stream key**, not a Helix API or OAuth token. Provision it from
a protected local file without placing its value in Git, inventory, shell history, or the rendered
environment. The venue playbook refuses deployment when any file is absent or empty and normalizes
camera-secret ownership to `root:motion-levels-cameras` mode `0440`. Other platform secrets remain
in `/etc/motion-levels/platform.env`.

## Release assembly

By default, place the repositories next to one another:

```text
motion-levels-venue/
motion-levels-controller/
motion-levels-games/
motion-levels-cameras/
```

Alternative checkout paths are supported without changing inventory:

```sh
export MOTION_LEVELS_CONTROLLER_SOURCE=/absolute/path/to/motion-levels-controller
export MOTION_LEVELS_GAMES_SOURCE=/absolute/path/to/motion-levels-games
export MOTION_LEVELS_CAMERAS_SOURCE=/absolute/path/to/motion-levels-cameras
```

Inspect the required revisions and compare each checkout before deploying:

```sh
make show-pins
git rev-parse HEAD
git status --short
git -C ../motion-levels-controller rev-parse HEAD
git -C ../motion-levels-controller status --short
git -C ../motion-levels-games rev-parse HEAD
git -C ../motion-levels-games status --short
git -C ../motion-levels-cameras rev-parse HEAD
git -C ../motion-levels-cameras status --short
```

Every status command must be empty, and the three component revisions must match the lock exactly.
The build fails closed on a dirty or mismatched checkout.

`scripts/build-native-release.sh` then:

- builds the pinned controller as a verified static Linux/amd64 executable;
- builds and verifies the runtime/menu/display/media bundle from the pinned games source;
- copies the pinned camera Python source directly and includes its hash-pinned Python 3.13
  dependency lock;
- copies the venue-owned runtime adapters and service definitions used by the native stack;
- writes `release-manifest.json` with all four revisions and every output file's size and SHA-256;
- runs `scripts/verify-native-release.py` before returning the release directory.

The default output is `/tmp/motion-levels-venue-native/releases/<venue-sha>`. It is a locally
generated, verified deployment directory, not a published release asset. Build it independently as
a preflight when useful:

```sh
release_dir="$(make --no-print-directory build-native-release | tail -1)"
make verify-native-release RELEASE_DIR="$release_dir"
```

The same build and verification run automatically at the beginning of the Ansible playbook.

## Control-machine and host prerequisites

The native playbook requires:

- `ansible`, `git`, `go`, `jq`, `node`, `npm`, `python3`, and `rsync` on the control machine;
- Debian 13 or newer on x86-64;
- Node.js 20 or newer and Python 3.13;
- SSH access as the inventory user (`root` in production);
- all three protected camera secret files already present on the host;
- the controller, games, and camera source checkouts available on the control machine.

Install the required Ansible collection once:

```sh
make install-ansible-collections
```

The playbook installs the tracked native Debian package set, including operational tools such as
`curl`, `ffmpeg`, `jq`, `ripgrep`, `rsync`, and `usbutils`.

## Manual production deployment

Run from the root of a clean, committed venue checkout:

```sh
make ansible-ping LIMIT=motionlevels-1
make deploy-motionlevels-1
```

For an explicit inventory selection, use:

```sh
make deploy-venues LIMIT=motionlevels-1
```

No GHCR token or container image is involved. Do not restore or run the removed container playbook,
Compose model, or legacy container helpers from older revisions. The native playbook contains a
bounded first-cutover safety check for an old camera container; that migration guard is not a
container deployment mechanism.

### Hardware-independent activation

No extra variable or acknowledgement is required when a peripheral is unavailable. Ansible does not
probe or certify the GoPro, TV, floor panels, pressure sensors, HDMI mode, or browser heartbeat as a
condition of activation. It validates the installed software processes and HTTP surfaces only.

Peripheral state remains visible through the venue UI, the platform sala view, service metrics, and
logs. A missing or unhealthy device can therefore leave the venue operational state degraded without
rolling back an otherwise valid software release. The camera service and its serial-specific udev
rule remain installed and enabled, and the HDMI watchdog remains active, so supported hardware is
reconciled automatically when it appears later.

`/etc/motion-levels/stack.json` records this as `deployment_health_contract: software-only` and
`hardware_state_contract: observed-not-gated`. A non-secret copy is served with `no-store` at
`/stack.json` for operator and platform diagnostics; Caddy never receives access to the protected
configuration directory. The same document publishes the full locked revisions for the controller,
games, and cameras components, so operators can distinguish the venue deployment revision from the
source revisions assembled into it.

The only camera-specific pre-cutover safety check is workload state: Ansible refuses to terminate an
active capture, host recording, or Twitch broadcast. Durable queued or retrying uploads do not block
deployment and resume from their persisted state after restart. The post-activation health gate
checks that Twitch broadcasting is configured; it deliberately does not start a public broadcast.

## What activation changes

Ansible stages the verified output at
`/opt/motion-levels/venue/releases/<venue-sha>.candidate`, independently verifies its manifest on
the host, creates the camera venv using the exact hash-pinned dependencies, and promotes the complete
directory to `/opt/motion-levels/venue/releases/<venue-sha>`.

Activation records the former release in `/opt/motion-levels/venue/previous` and selects the
candidate through `/opt/motion-levels/venue/current`. Both names are replaced with temporary
symlinks created in the same directory followed by `mv -Tf`, so readers observe either the old or
new link rather than an unlink/recreate gap. systemd services execute only through `current`; state
and recordings are not placed in a release directory.

The native service set is:

- `motion-levels-floor-controller.service`
- `motion-levels-venue-runtime.service`
- `motion-levels-venue-supervisor.service`
- `motion-levels-cameras.service`
- `motion-levels-security-recorder.service`
- `motion-levels-camera-helper.service`
- `motion-levels-kiosk.service`
- `motion-levels-hdmi-watchdog.service`
- `caddy.service`

After every native health gate succeeds, the playbook retires old display/audio/container units and
stops and disables Docker and containerd. It then removes only the allowlisted legacy container
helpers and manifest/config roots that could reactivate Compose or rewrite the retired
`/etc/motion-levels/venue/runtime.env` symlink. Native releases under `/opt/motion-levels/venue`,
mutable state under `/var/lib/motion-levels*`, and `/var/lib/docker` are never part of that cleanup.
Docker storage is deliberately preserved until an operator explicitly approves reclaiming it;
Docker is not a running production dependency.

`motion-levels-lan-ip.service` continuously reconciles the configured floor source address without
failing when its interface is absent. The floor controller stays online with `floor_output` marked
unavailable and retries only that exact source address; it never falls back to another interface.
The security recorder stops accepting new upload work on `SIGTERM`, finalizes or boundedly
terminates its `ffmpeg` child, and has a 20-second systemd stop ceiling. Individual platform requests
are capped at 10 seconds; an interrupted or failed upload keeps its local segment for retry on the
next start.

The camera environment and udev rule are rendered from production host vars. Runtime reconciliation
requires the exact GoPro USB vendor, product, and serial; another HERO12 is ignored by the control
service. The venue's `recording.default_profile` is passed to the camera service as
`ML_CAMERAS_GOPRO_DEFAULT_RECORDING_PROFILE`, so the deployed default remains explicit and
venue-specific. Deployment does not inspect that hardware identity. Health checks are read-only and
never start or stop a recording.

## Health and observability

Start with the summarized operator targets:

```sh
make status-motionlevels-1
make health-motionlevels-1
make release-motionlevels-1
make logs-motionlevels-1
```

`release-motionlevels-1` prints the resolved `current` and `previous` paths. The active `current`
symlink is authoritative after a manual rollback; `/etc/motion-levels/stack.json` records the last
Ansible activation attempt.

The playbook requires HTTP 200 from all of these local surfaces before accepting a release:

```text
http://127.0.0.1/controller/health
http://127.0.0.1/engine/api/status
http://127.0.0.1/venue-api/v1/snapshot
http://127.0.0.1/menu/
http://127.0.0.1/menu/build.json
http://127.0.0.1/display/
http://127.0.0.1:8040/healthz
```

The gate also requires `sourceRevision` from `/engine/api/status` and `gamesSourceRevision` from
`/menu/build.json` to equal the full games SHA in `venue-components.lock.json`. The kiosk is restarted
only after those two independently served surfaces converge. Caddy serves `build.json` with
`no-store, max-age=0, must-revalidate`; unversioned menu icons use revalidation rather than immutable
caching. These endpoints prove that the deployed software is running, reachable, and revision
matched. They do not require a connected camera, display, or floor. `/readyz` and the venue snapshot
remain useful operational signals: they may report a disconnected or otherwise invalid peripheral
without failing deployment.

For focused investigation:

```sh
ssh root@motionlevels-1 'journalctl -u motion-levels-venue-runtime.service -n 200 --no-pager'
ssh root@motionlevels-1 'journalctl -u motion-levels-cameras.service -u motion-levels-gopro-reconcile.service -n 200 --no-pager'
ssh root@motionlevels-1 'curl -fsS http://127.0.0.1/venue-api/v1/snapshot | jq'
ssh root@motionlevels-1 'curl -fsS http://127.0.0.1:8040/api/v1/cameras/gopro-hero12/status | jq'
```

The local `/venue/` UI and `/venue-api/v1/snapshot` are the venue-owned operator surface; the
platform sala view consumes the same status contract remotely.

## Rollback

Failed activation health checks automatically restore `previous` and restart the former stack.
Only the current and previous native releases are retained after a successful deployment.

To swap back manually:

```sh
make rollback-motionlevels-1
```

The target validates both release directories, atomically swaps `current` and `previous`, reloads
systemd, restarts the native service set, and prints status. It does not alter `/var/lib` state,
recording queues, camera SD media, `/etc` configuration, or secrets.

After rollback, verify:

```sh
make release-motionlevels-1
make status-motionlevels-1
make health-motionlevels-1
make logs-motionlevels-1
```

Confirm the controller, menu, display, floor output, HDMI audio, venue snapshot, and serial-pinned
camera status before declaring recovery complete. Avoid `make restart-motionlevels-1` during an
active camera recording; a full-stack restart is an explicit maintenance action, not a health check.

## Update a component pin

1. Make and validate the implementation change in its owning repository.
2. Commit it and copy its full 40-character revision into
   `deploy/motionlevels-pc/venue-components.lock.json`.
3. Check out that exact revision in the corresponding local source directory.
4. Ensure all four source trees are clean.
5. Run `make build-native-release` and verify the returned directory.
6. Commit the venue lock update, then deploy that clean venue revision.

Never use a branch name, mutable tag, latest release, registry tag, or locally modified source tree
as a production pin.

## Add another venue

1. Add the host under `motion_levels_venues` in
   `ansible/inventory/production/hosts.yml`.
2. Add `ansible/inventory/production/host_vars/<inventory-hostname>.yml`, following
   `motionlevels-1.yml` and replacing every identity/hardware value.
3. Use a unique room UUID, venue slug, hostname, addresses, controller identity, GoPro serial, USB
   network interface/MAC, display/audio settings, and recording policy.
4. Provision the referenced secret files directly on the host.
5. Run `make ansible-ping LIMIT=<inventory-hostname>` and deploy with the same explicit limit.

Do not hide venue-specific hardware in templates or group defaults. Host vars are the discoverable,
reviewable source of truth for non-secret venue configuration.
