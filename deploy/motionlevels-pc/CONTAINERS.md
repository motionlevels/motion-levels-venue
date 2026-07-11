# Venue container boundary

The production venue is deployed manually from images published for the full
commit SHA and then pinned to their verified registry digests. Nothing on the
venue polls GitHub, changes image tags, or activates a release in the
background.

## Runtime ownership

| Component | Runtime | Hardware or host access |
| --- | --- | --- |
| Floor controller | Container, UID 10001, host network | No devices; host networking retained for UDP broadcast/loopback |
| Game engine | Container, UID 10001, host network | No devices; host networking plus the audio broker Unix socket |
| Camera snapshot helper | Container, UID 10002, private bridge | RTSP to cameras `.128`–`.130` only |
| Security recorder | Container, UID 10002, private bridge | RTSP to `.130`, HTTPS uploads, recording spool |
| Caddy | Container, UID 10003, host network | `NET_BIND_SERVICE` only |
| Player browser | Optional container, UID 10003 | Wayland socket and `/dev/dri/renderD128` only |
| Audio broker | Host systemd socket service | `/dev/snd/pcmC0D5p` and `/dev/snd/timer` |
| Weston compositor | Host systemd service | DRM card/render node and VT 7; no input devices |
| HDMI agent | Host systemd service | `/dev/snd/controlC0` only |

Every core container uses a read-only root filesystem, drops all capabilities
(Caddy adds back only `NET_BIND_SERVICE`), enables `no-new-privileges`, and has
PID and memory limits. The floor and engine retain host networking because
their existing loopback streams and LED broadcast are timing-sensitive. They
receive no host devices or Docker socket.

Platform and camera credentials are copied into UID-specific, mode `0400`
files. They are mounted into only the containers that need them and are not
included in the Compose environment model.

The first venue migration and the camera installer share one host-owned
camera-recorder operator token at
`/etc/motion-levels/camera-recorder-token`. The release receives a read-only
snapshot of that value. Copy the same file once to the platform host before
cutover; do not generate independent engine, camera, and platform tokens.

The camera bridge uses fixed addresses and an nftables forward hook. The
snapshot helper can open RTSP only to the three venue cameras. The security
recorder can open RTSP only to the front camera and HTTPS for platform/object
uploads. Other new egress from that subnet is rejected.

The browser has its own bridge and can open only Caddy on that bridge's TCP/80
gateway. It cannot scan the host, venue LAN, Tailnet, or Internet.

## Deploy and roll back

From the repository root:

```bash
make deploy-motionlevels-1
make status-motionlevels-1
```

The playbook pulls only `sha-<full-commit>` images, verifies their revision
labels, and writes the matching content digests into the candidate manifest.
The activation command then:

1. resolves and validates the complete Compose model;
2. refuses the cutover unless the engine is in ambient/idle mode;
3. starts the audio and network-policy boundaries;
4. stops the retained native core services;
5. starts the candidate containers with `--no-build --wait`;
6. verifies HTTP routes, floor FPS/sync/UDP errors, engine state, and recorder
   heartbeat;
7. restores the native or previous container release if any gate fails.

Manual rollback uses the same idle gate:

```bash
make rollback-motionlevels-1
```

The first successful release keeps the native binaries, units, and packages as
rollback material. Remove them only after a physical-display and operating-day
soak period.

## Display migration

`motion_levels_display_backend: x11` remains the production inventory default.
The Weston/browser path is installed but not activated while the TV is
disconnected; the larger browser image is pulled only when Wayland is selected
or was already active. Switching the inventory value to `wayland` requires a
connected DRM output and replaces the legacy X11 kiosk with:

- a host Weston compositor that owns only DRM and VT devices, with input
  deliberately disabled;
- a browser container that sees only the Wayland socket and render node;
- a host HDMI agent that sees only the ALSA control node.

Before leaving Wayland enabled, physically validate cold boot without a TV,
hotplug, TV power cycling, 1080p60 recovery, browser/compositor independent
restart, and concurrent cue/music latency. X11 remains the manual rollback
until those checks pass.

## X5 camera

The X5 is not part of this Compose project. Its sole owner is the separately
hardened `motionlevels/motion-levels-cameras` container. The intended host is
`motionlevels-1-camera-dev`, published only on that host's Tailscale address,
with one USB bus/controller passed through. Move the physical cable and switch
clients only after passive `/healthz`, `/readyz`, and compatibility-status
checks pass. Initial validation must not invoke a capture endpoint.
