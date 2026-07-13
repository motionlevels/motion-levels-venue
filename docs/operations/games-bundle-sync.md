# Games bundle synchronization

The games repository publishes an immutable release archive. Both the platform
and venue repositories pin that release independently so each image build has
the exact files it consumes.

## Automated sync

Run the `Sync Motion Levels games bundle` workflow with:

- `release_tag`: `games-vMAJOR.MINOR.PATCH`
- `source_revision`: the full 40-character games repository commit

The workflow needs a `GAMES_REPO_TOKEN` secret with read access to private
release assets. It downloads the exact archive and checksum, validates the
manifest and media contract, updates `game-bundles/motion-levels-games`, makes
a normal forward commit, and dispatches venue CI. The games release workflow
must dispatch both the platform and venue consumer workflows so their pins do
not diverge.

An operator can dispatch the venue consumer explicitly:

```sh
gh workflow run sync-games-bundle.yml \
  --repo motionlevels/motion-levels-venue \
  --ref main \
  -f release_tag=games-vX.Y.Z \
  -f source_revision=<40-character-revision>
```

## Verify and deploy

```sh
npm run verify:games-bundle
go test ./game-engine/internal/games/motionlevelsgames/...
jq '{releaseTag, sourceRevision, previousRevision}' \
  game-bundles/motion-levels-games/pin.json
```

After CI publishes the venue images for the resulting venue commit, deploy it
through the normal venue deployment procedure. Verify the pinned revision from
the running engine, launch representative games from the player menu, and
confirm player-display media, floor output, events, and audio.

## Rollback

Never retag or replace a published games archive. Revert the pin update with a
normal forward commit, or publish a new patch release from the known-good games
source. Re-run bundle verification, wait for immutable venue images, and deploy
the resulting venue commit.
