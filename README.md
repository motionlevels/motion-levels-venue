# Motion Levels Venue

Venue-side runtime for Motion Levels, split out of the
[motion-levels-platform](https://github.com/motionlevels/motion-levels-platform)
monorepo. The repository owns the venue host and image boundary:

- `apps/player-menu/` — transitional fallback build for legacy games bundles.
  The production player-menu source and revision-matched static artifact now
  live in `motion-levels-games`; this repo retains packaging compatibility.
- `apps/player-display/` — the floor/TV display frontend.
- `packages/` — shared code: `core`, `design-tokens`, `floor-view` (TS, used by
  both frontends), `contracts` (protobuf shared with
  [motion-levels-controller](https://github.com/motionlevels/motion-levels-controller)).
- `game-bundles/motion-levels-games/` — pinned games bundle, synced from
  [motion-levels-games](https://github.com/motionlevels/motion-levels-games)
  releases via the `Sync Motion Levels games bundle` workflow. Bundle v2 owns
  the Node venue runtime, player menu, display renderer, playground, and media.
- `deploy/motionlevels-pc/` — venue container images, Compose model, and host
  scripts; `ansible/` — venue deploy playbooks.

The old `game-engine/`, `packages/motiongo`, and `content/audio` trees are
retained only as historical migration material. Production images do not build,
copy, execute, or mount them, and they must not be used as a fallback.

## Development

```sh
# Venue frontends
npm ci --prefix packages/floor-view
npm ci --prefix apps/player-menu
npm ci --prefix apps/player-display
npm test --prefix apps/player-menu
npm test --prefix apps/player-display
npm run dev --prefix apps/player-menu
```

## Releases and deploys

CI on `main` builds and publishes the immutable venue images
(`ghcr.io/motionlevels/motion-levels-venue-*`) tagged `sha-<venue revision>`
via the `Container images` workflow. The controller image is pinned separately
in `deploy/motionlevels-pc/venue-components.lock.json`. Successful image
publication automatically requests an exact-revision deployment to
`motionlevels-1`; a scheduled reconciliation retries releases deferred by the
physical-display safety gate.

Deploy venues from a checkout of this repo (the playbook resolves the venue
revision from `git rev-parse HEAD`, so the images for that commit must be
published first):

```sh
make deploy-venues            # containerized venues (default: motionlevels-1)
make status-motionlevels-1
```

The venue repository owns its image revision and deployment lifecycle
independently from the cloud platform. See
[`docs/operations/venue-deployment.md`](docs/operations/venue-deployment.md)
for provisioning, validation, activation, and rollback. Games release pinning
is documented in
[`docs/operations/games-bundle-sync.md`](docs/operations/games-bundle-sync.md).
