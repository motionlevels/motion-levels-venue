# Games source pin and bundle assembly

The venue does not consume a mutable games branch or a pre-published container image. It builds the
runtime, player menu, display renderer, media, and game registry together from one clean
`motion-levels-games` source revision.

## Canonical pin

The full games revision is:

```sh
jq -r '.components.games.revision' deploy/motionlevels-pc/venue-components.lock.json
```

The default source checkout is the sibling directory `../motion-levels-games`. Override it with
`MOTION_LEVELS_GAMES_SOURCE=/absolute/path` when necessary. The native release builder requires that
checkout's `HEAD` to equal the lock and rejects tracked or untracked changes. It also requires the
exact Node.js major in `components.games.nodeVersion`; set `MOTION_LEVELS_NODE_BIN_DIR` to an
absolute directory containing that version's `node` and `npm` executables when it is not the system
default.

Do not restore or edit the old venue `game-bundles/`, player-menu/display applications, or
historical game engine to update a game. They are not production authoring or fallback paths. Make
the change and run its tests in `motion-levels-games` first.

## Update the pin

1. Commit the complete games change in `motion-levels-games`, including runtime, UI, media, and
   registry changes that must remain revision-matched.
2. Verify the games repository's own build, media generation, bundle verification, and tests.
3. Put that commit's full 40-character SHA in
   `deploy/motionlevels-pc/venue-components.lock.json`.
4. Check out the exact SHA in the local games source directory and leave it clean.
5. Run the venue-native build from a clean venue checkout:

   ```sh
   release_dir="$(make --no-print-directory build-native-release | tail -1)"
   make verify-native-release RELEASE_DIR="$release_dir"
   ```

6. Commit the lock change. Deploy only that committed venue revision.

`scripts/build-native-release.sh` runs the games build and media generation, builds the complete
bundle into the local candidate release, runs the games repository's bundle verifier, writes a
source pin beside the generated bundle, and includes every generated file in the venue release
manifest. Runtime, menu, display, and media therefore cannot drift across games revisions.

## Verify and deploy

Before deployment:

```sh
required="$(jq -r '.components.games.revision' deploy/motionlevels-pc/venue-components.lock.json)"
actual="$(git -C ../motion-levels-games rev-parse HEAD)"
test "$actual" = "$required"
test -z "$(git -C ../motion-levels-games status --porcelain --untracked-files=normal)"
make deploy-motionlevels-1
```

After deployment, confirm the active venue release, engine status, menu, and display:

```sh
make release-motionlevels-1
ssh root@motionlevels-1 'curl -fsS http://127.0.0.1/engine/api/status | jq .sourceRevision'
ssh root@motionlevels-1 'curl -fsS http://127.0.0.1/menu/build.json | jq .gamesSourceRevision'
ssh root@motionlevels-1 'curl -fsS -o /dev/null http://127.0.0.1/menu/'
ssh root@motionlevels-1 'curl -fsS -o /dev/null http://127.0.0.1/display/'
```

The deployment gate performs both revision comparisons against the locked games SHA before it
restarts the kiosk. A mismatch rolls activation back instead of presenting a new menu with an old
runtime, or an old menu with a new runtime.

Launch representative games only after the passive health checks pass. Confirm floor output, input
events, display media, and audio with an operator present at the venue.

## Rollback

For an operational failure, `make rollback-motionlevels-1` swaps to the complete previous native
venue release, including its revision-matched games bundle.

For a durable forward fix, restore the known-good full games SHA in the component lock (or pin a new
fix commit), build and verify a new venue revision, commit it, and deploy normally. Never retag,
replace, or mutate an already selected source revision.
