# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Repository scope

This is the **venue-side** packaging and deployment repo. The in-process
TypeScript game runtime, player-menu source/static artifact, controller client,
and kiosk API are owned by `motion-levels-games` and arrive only through its
immutable pinned bundle. Electron/Caddy packaging, host supervision, physical
controller deployment, display/camera hardware boundaries, and venue rollout
remain here. The cloud side lives in `motionlevels/motion-levels-platform`.

`game-engine/`, `packages/motiongo`, and `content/audio` are retained historical
migration material, not a production runtime or fallback. Do not modify, build,
mirror, deploy, or revive them. Make gameplay changes in `motion-levels-games`.

## Multiple parties share this repo

More than one agent/person commits to `main`. To avoid divergent histories
and painful merge conflicts, follow the git hygiene rules below.

## Git workflow

- **Pull before starting any new piece of work.** Run `git pull --rebase`
  before your first change in a session so you build on the latest `main`.
- **Pull periodically during long sessions.** Re-run `git pull --rebase`
  every so often (e.g. before each new logical task, or before a commit) to
  pick up others' work early, while conflicts are small and easy to resolve.
- **Pull again right before you push.** If the push is rejected because the
  remote moved, run `git pull --rebase` and push again.
- **Commit in small, focused units** with clear messages — small commits
  rebase cleanly and are easy for others to follow.
- **Push promptly** once work is in a good state, so others see it soon and
  don't build on a stale base.
- **Resolve conflicts carefully.** Prefer `--rebase` to keep history linear.
  If a conflict is non-trivial, stop and resolve it deliberately rather than
  blindly accepting one side.

## Commit identity

Commits from this machine are authored as **Motion Levels
<noreply@motionlevels.com>** (set in the agent's global git config). Leave
that as-is unless told otherwise.

## Deployment target preference

- Treat `motionlevels-1` as the primary venue target. Do not deploy to
  `motionlevels-cloud-1` when `motionlevels-1` is available, unless the user
  explicitly asks for that backup/cloud venue.

## Infrastructure hostnames

- `motionlevels-dev` is retired. Do not spend time pinging or debugging it.
  Use `motionlevels-platform` for the platform host and
  `motionlevels-postgres-1` for PostgreSQL/database checks.
