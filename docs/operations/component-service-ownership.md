# Component service ownership

## Decision

The venue repository should remain the **deployment composition authority**, but
it should not remain the only source of generic launch knowledge for components.

A component repository should own:

- its executable or bundle entry point;
- a generic service template or declarative service metadata;
- its environment-variable schema and defaults;
- health/readiness probes;
- state-directory requirements;
- generic hardening recommendations;
- upgrade compatibility information.

The venue repository should own:

- the exact component versions selected for a venue;
- site-specific addresses, interfaces, ports, users, secrets, and devices;
- dependency ordering between components;
- final systemd/NixOS/Ansible composition;
- activation, rollback, and health-gated promotion;
- venue-specific hardening overrides.

This avoids copying implementation assumptions into deployment while preserving
one place that understands the complete physical venue.

## File-level recommendation

| Existing venue file | Long-term authority | Notes |
|---|---|---|
| `motion-levels-venue-runtime.service` | Games template + venue override | Games owns entry point, env contract, health probe and writable-state contract. Venue supplies concrete paths, controller dependency and secrets. |
| `venue-runtime` launcher | Games | It resolves the games bundle layout and belongs with the bundle contract. Bundle it as a supported launcher. |
| `motion-levels-floor-controller.service` | Controller template + venue override | Controller owns flags/defaults/readiness. Venue supplies physical LAN, floor addresses and resource policy. |
| kiosk service/launcher | Venue | This is host/display composition, not game-engine behavior. |
| Caddy configuration | Venue | Routes several components and uses venue filesystem layout. |
| camera units/helpers | Camera repository for generic launch; venue for USB/site wiring | Follow the same split. |
| venue supervisor | Venue | Cross-component health and rollback are composition responsibilities. |

## Bundle contract extension

Add optional service metadata to the games bundle, for example:

```json
{
  "service": {
    "launcher": "venue/launch-runtime",
    "environmentSchema": "venue/environment.schema.json",
    "health": {
      "type": "http",
      "path": "/healthz",
      "expectedStatus": 200
    },
    "stateDirectories": [
      "/var/lib/motion-levels/session-history"
    ]
  }
}
```

The venue release builder verifies this metadata and generates or installs the
final unit with site-owned overrides. The games artifact should not encode
Zaragoza-specific IP addresses or `/opt/motion-levels/venue/current`.

## Safe migration sequence

1. Add generic launcher/service metadata to the games bundle without changing
   the installed venue unit.
2. Extend bundle verification and native-release verification.
3. Make the venue builder consume the bundled launcher while retaining its
   existing unit.
4. Introduce a unit generator or template merge with explicit venue overrides.
5. Validate staging and rollback on the real host.
6. Remove duplicated launcher assumptions from the venue repository.

Do not move a `.service` file alone. Move its executable contract, environment
schema, health check, tests and release packaging together.

## Deployment build optimization

The venue release currently rebuilds the games repository and runs
`generate:media`. Replace that with consumption of an immutable, checksum-verified
games release asset:

1. lock a games release tag, source revision and artifact SHA-256;
2. download or provide the release archive before native release assembly;
3. verify the archive and internal `bundle.json`;
4. copy the verified bundle into the native candidate;
5. never run npm or Playwright in the venue release builder.

This makes a venue deployment a composition operation rather than a second
software build and eliminates duplicated, expensive thumbnail generation.
