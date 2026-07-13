# Venue container boundary

The production venue is deployed from images published for full component
commit SHAs and then pinned to verified registry digests. After the immutable
image workflow succeeds, an authenticated management-plane relay requests the
exact venue revision; scheduled reconciliation retries only when a release was
safely deferred. The venue release SHA and the independently published
controller SHA are stored together in one candidate manifest. Nothing on the
venue polls GitHub or changes image tags itself.

## Runtime ownership

| Component | Runtime | Hardware or host access |
| --- | --- | --- |
| Floor controller | `motion-levels-controller` image, UID 10001 | Internal core/egress bridges plus the floor-only ipvlan L2 endpoint; no devices |
| Game engine | Container, UID 10001 | Internal core and restricted egress bridges plus the audio broker Unix socket; no devices |
| Camera snapshot helper | Container, UID 10002 | Caddy-only snapshot API bridge plus RTSP to cameras `.128`–`.130` only |
| Security recorder | Container, UID 10002, private bridge | RTSP to `.130`, HTTPS uploads, recording spool |
| Caddy | Container, UID 10003 | Internal core/display and restricted egress bridges; no capabilities |
| Player browser | Container, UID 10003 | Internal display bridge, Wayland socket, and `/dev/dri/renderD128` only |
| Audio broker | Host systemd socket service | `/dev/snd/controlC0`, exact playback PCM `/dev/snd/pcmC0D5p`, and `/dev/snd/timer` |
| Weston compositor | Host systemd service | DRM card/render node and VT 7; no input devices |
| HDMI agent | Host systemd service | `/dev/snd/controlC0` only |

Every core container uses a read-only root filesystem, drops all capabilities,
enables `no-new-privileges`, and has PID and memory limits. No venue container
uses host networking or receives the Docker socket. Caddy listens on
unprivileged container ports: Docker publishes `8080` as host port 80 only on
loopback and the Tailscale address, and publishes the LAN-enriched `8081`
listener only on `192.168.1.142:80`. This keeps the wired-only TV/platform
routes separated by kernel socket bindings after Docker destination NAT.

The `core` and `display` bridges are internal networks with no routed egress.
Floor, engine, and Caddy use a separate `egress` bridge whose nftables rules
permit only their role-specific DNS, platform, object-storage, and dormant X5
destinations. The snapshot API has a fourth internal bridge shared only by
camera-helper and Caddy. Network-scoped aliases (`floor-core`, `engine-core`,
`camera-helper-api`, and `caddy-display`) keep service discovery on the
intended network even when a process has multiple attachments.

The floor's only hardware attachment is an internal, gateway-free ipvlan L2
endpoint at `192.168.1.143` on `enp2s0`. Ipvlan keeps the parent's Ethernet MAC
while giving the controller its own IP boundary. The controller's HTTP and TCP
streams are reachable only on the internal core network; IPv4 packet info pins
all floor UDP sends to `.143` and `enp2s0`. LED frames deliberately remain
limited broadcasts to `255.255.255.255:4626`: live tiles include link-local
addresses, so changing to a `192.168.1.255` directed broadcast would not be
compatible.
Only sensor UDP/7800 inbound and LED UDP/4626 outbound are allowed for `.143`.
Netdev ingress/egress hooks on `enp2s0` enforce that rule even for ipvlan L2
traffic that bypasses the ordinary inet forward hook; inet rules duplicate it
as defense in depth.

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

The browser has its own internal bridge and reaches only `caddy-display:8080`.
It cannot scan the host, venue LAN, Tailnet, or Internet. The nftables table
also rejects new access from the core, display, camera, and egress container
subnets back into host services. A host-wide default-deny input policy is
deliberately deferred until the physical display/gameplay soak is complete;
that broader management-plane hardening is not part of this cutover.

## Deploy and roll back

From the repository root:

```bash
make deploy-motionlevels-1
make status-motionlevels-1
```

The playbook pulls only `sha-<full-commit>` images, verifies each component's
own revision, architecture, and protocol labels, and writes the matching
content digests into the candidate manifest. Controller promotion is manual via
`venue-components.lock.json`; publishing a controller image never deploys it.
The activation command then:

1. resolves and validates the complete Compose model;
2. refuses the cutover unless the engine is in ambient/idle mode;
3. starts the audio, internal networks, hardware ipvlan, and network-policy
   boundaries;
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

`motion_levels_display_backend: wayland` selects the narrow display path for
the physical maintenance-window validation. It replaces the legacy X11 kiosk
with:

- a host Weston compositor that owns only DRM and VT devices, with input
  deliberately disabled;
- a browser container that sees only the Wayland socket and render node;
- a host HDMI agent that sees only the ALSA control node.

Before leaving Wayland enabled, physically validate gameplay, audio routing,
1080p60 output, hotplug/TV power cycling, browser/compositor independent
restart, and concurrent cue/music latency. X11 remains the automatic/manual
rollback until those checks pass.

## X5 camera

The X5 surface is disabled by default, not deleted. With
`MOTION_LEVELS_X5_ENABLED=0`, the engine receives an empty recorder URL/token,
the platform does not register a recorder, and both container and native Caddy
return no `/camera-recorder/*` route. The implementation, token source, and
separate `motionlevels/motion-levels-cameras` ownership remain intact. A venue
deployment with the switch off removes any legacy `motion-levels-cameras`
runtime container so its restart policy cannot resurrect USB or port access;
the image, host state, configuration, credentials, and source are preserved.

Restoration does not require redevelopment: recreate the preserved camera
service from its Compose project, set `motion_levels_x5_enabled: true`, supply
the dormant recorder URL and Caddy upstream, and redeploy. For a recorder on
the venue host, the deterministic container upstream is
`http://172.30.53.1:8040`; do not use container loopback or an ambiguous
`host-gateway` alias. Follow `docs/operations/x5-runtime-switch.md` for the
complete enable/disable and verification procedure.
