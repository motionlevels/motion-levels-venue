# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Repository scope

This is the **venue-side** repo: the Go game engine, player-display kiosk,
player-menu runtime adapter and temporary legacy fallback, shared packages,
and venue deploy tooling. The production player-menu source/static artifact is
owned by `motion-levels-games`; Electron/Caddy packaging, supervisor APIs,
controller connectivity, hardware output, and deployment remain here.
The cloud side (platform app, website, homelab infra) lives in
`motionlevels/motion-levels-platform`. Generated motion-go seeds are consumed
by the platform repo — after editing an authored native game, run
`make sync-platform-seeds` and commit the platform side too (see README).
This repo is also canonical for `packages/`, `go.mod`/`go.sum`, and
`content/audio`; run `make check-platform-mirrors` before publishing changes to
those paths and `make sync-platform-mirrors` when the platform copy is stale.

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
