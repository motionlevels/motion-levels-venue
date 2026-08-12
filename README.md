# Motion Levels Venue

Venue-side runtime for Motion Levels, split out of the
[motion-levels-platform](https://github.com/motionlevels/motion-levels-platform)
monorepo. Everything that runs on a venue PC lives here:

- `game-engine/` — the Go game engine (HTTP API on `:4102`), including the
  authored native games and the motion-go seed generator.
- `apps/player-menu/` — transitional fallback build for legacy games bundles.
  The production player-menu source and revision-matched static artifact now
  live in `motion-levels-games`; this repo retains the kiosk shell, runtime
  adapter implementation, and deployment.
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
  scripts; `deploy/nixos/` — declarative NixOS host evaluation;
  `ansible/` — venue deploy playbooks.

## Development

```sh
# Engine
go test ./...
go run ./game-engine/cmd/game-engine

# Player menu (talks to the engine on :4102)
npm ci --prefix packages/floor-view
npm ci --prefix apps/player-menu
npm ci --prefix apps/player-display
npm test --prefix apps/player-menu
npm test --prefix apps/player-display
npm run dev --prefix apps/player-menu
```

## Cross-repo mirrors

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

This repo is also canonical for `packages/`, `go.mod`/`go.sum`, and
`content/audio/`. The platform keeps mirrors because its application and image
build consume them directly. Check or synchronize every mirror with:

```sh
make check-platform-mirrors PLATFORM_DIR=../motion-levels
make sync-platform-mirrors PLATFORM_DIR=../motion-levels
```

The sync command changes the platform checkout, so review and commit both repos
separately. `game-bundles/` is not copied by this command: platform and venue
pin the same published games release through their own sync workflows.

Audio generation belongs here with the canonical assets. For example:

```sh
scripts/generate-elevenlabs-narration.sh
```

Set `ELEVENLABS_API_KEY`, or put it in the ignored
`.secrets/elevenlabs.env` file. Pass an output path and `ELEVENLABS_TEXT` to
generate a different narration.

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
