# Venue runtime

The TypeScript/Node replacement for the venue's Go game engine is introduced
incrementally. This first slice runs in **shadow mode only**:

- it polls the active Go engine's canonical `PlayerExperienceState`;
- validates the contract boundary and monotonic revision;
- detects stale or conflicting snapshots;
- exposes compatible read-only GET and SSE endpoints;
- exports bounded Prometheus metrics.

It deliberately has no game commands, floor UDP access, credentials, audio or
deployment authority yet. The Go engine remains authoritative until shadow
parity and physical validation gates pass.

```bash
npm ci
npm test
VENUE_RUNTIME_MODE=shadow \
VENUE_RUNTIME_SOURCE_URL=http://127.0.0.1:4102 \
VENUE_RUNTIME_HTTP=127.0.0.1:4103 \
npm start
```

Starting with any mode other than `shadow` fails closed.
