# Motion Levels Venue

Venue-side runtime for Motion Levels, split out of the
[motion-levels-platform](https://github.com/motionlevels/motion-levels-platform)
monorepo. Everything that runs on a venue PC lives here:

- `game-engine/` — the Go game engine (HTTP API on `:4102`), including the
  authored native games and the motion-go seed generator.
- `apps/player-menu/` — kiosk UI for choosing games and launching the engine.
- `apps/player-display/` — the floor/TV display frontend.
- `packages/` — shared code: `core`, `design-tokens`, `floor-view` (TS, used by
  both frontends), `contracts` (protobuf shared with
  [motion-levels-controller](https://github.com/motionlevels/motion-levels-controller)),
  and `motiongo` (Go SDK for motion-go games).
- `game-bundles/motion-levels-games/` — pinned games bundle, synced from
  [motion-levels-games](https://github.com/motionlevels/motion-levels-games)
  releases via the `Sync Motion Levels games bundle` workflow.
- `content/audio/` — audio assets served by the engine.
- `deploy/motionlevels-pc/` — venue container images, Compose model, and host
  scripts; `ansible/` — venue deploy playbooks.

## Development

```sh
# Engine
go test ./...
go run ./game-engine/cmd/game-engine

# Player menu (talks to the engine on :4102)
npm ci --prefix packages/floor-view
npm ci --prefix apps/player-menu
npm run dev --prefix apps/player-menu
```

## Motion-go seeds (cross-repo contract)

The native games under `game-engine/internal/games/authored/nativegames` are
the source of truth for motion-go games. Generated TypeScript seeds live in
`game-engine/internal/games/authored/seeds` and are verified by tests and CI
(`motion-go-seeds -check`).

The platform repo keeps copies under `platform/app/src/lib/seed`. After
changing an authored game:

```sh
make sync-platform-seeds PLATFORM_DIR=../motion-levels
```

then commit the refreshed seeds in the platform repo.

## Releases and deploys

CI on `main` builds and publishes the immutable venue images
(`ghcr.io/motionlevels/motion-levels-venue-*`) tagged `sha-<venue revision>`
via the `Container images` workflow. The controller image is pinned separately
in `deploy/motionlevels-pc/venue-components.lock.json`.

Deploy venues from a checkout of this repo (the playbook resolves the venue
revision from `git rev-parse HEAD`, so the images for that commit must be
published first):

```sh
make deploy-venues            # containerized venues (default: motionlevels-1)
make status-motionlevels-1
```

> **Note:** the platform's auto-deploy pipeline (`deploy-production` in the old
> monorepo `images.yml`) deployed platform and venues atomically at one
> revision. That link was severed by the repo split; until the platform
> deployer learns to check out this repo at a pinned venue revision, venue
> deploys are manual (`make deploy-venues`).
