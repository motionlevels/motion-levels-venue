# Game Engine

The game engine produces logical board frames and handles game-owned input
reactions such as score and sound cues.

It streams protobuf `FrameRecord` messages to `floor-controller` and subscribes
to the controller's protobuf pressure-event stream. It does not know about UDP,
physical channels, serpentine wiring, browser preview, or frame recording.

Its frame rate controls how often it offers a new desired board state. The
floor-controller owns the actual hardware, preview, and recording refresh
cadence.

## Run

Start `floor-controller` first, then:

```sh
go run ./game-engine/cmd/game-engine -controller 127.0.0.1:4201
```

The defaults are:

- game-engine API: `http://127.0.0.1:4102/api/status`
- controller frame stream: `127.0.0.1:4201`
- pressure event stream: `127.0.0.1:4202`
- game: `loop`
- desired-state frame rate: `20fps`
- brightness: `80%`

## Games

The primary player menu now lives in `apps/player-menu`. It is a standalone
Vite/React kiosk UI that talks to the local game-engine API:

```sh
cd apps/player-menu
npm install
npm run dev
```

Open:

```txt
http://127.0.0.1:4103
```

Choosing a game updates the running game immediately through the local
game-engine API at `http://127.0.0.1:4102`. Music is switched with the game, and
pressure events continue to flow through the same controller stream.

The player-facing TV display lives in `apps/player-display`. It subscribes to
the game-engine display stream:

```txt
http://127.0.0.1:4102/api/display/events
```

The display app is visual-only for now. Low-latency music and cue playback stay
owned by the Go game-engine process and use the game-engine PC's default audio
output, usually the HDMI TV.

## Session Recordings

The game-engine writes authoritative session logs by default:

```txt
game-recordings/YYYYMMDDTHHMMSSZ.game.pbstream
```

These files use protobuf `GameSessionRecord` messages from
`packages/contracts/gamepb/game.proto`, written as length-delimited pbstream
records. Active files end in `.open` and are renamed into place after a clean
close; startup recovery finalizes leftover `.open` files so a crash does not
leave data invisible.

The session log records:

- session start/end, including `session_id` and RNG seed
- accepted menu selections from the game-engine API point of view
- API interactions observed by the engine
- pressure inputs received from the floor-controller
- game events such as start, hit, miss, and win
- audio cue intents triggered by the engine
- periodic player-display snapshots
- semantic level attempt start/finish records for multi-level games such as
  `temporada1`; these include level id/number, difficulty, timestamps, result,
  score, lives, elapsed time, and active target counts

Important flags:

- `-record-sessions`: directory or `.game.pbstream` file path. Empty disables
  session recording.
- `-session-segment-bytes`: max bytes per segment before rotation.
- `-display-snapshot-fps`: how often display snapshots are recorded.

The floor-controller still owns physical frame recordings. Session replay should
join game-engine `.game.pbstream` files with controller frame recordings by
time range and, later, by an explicit shared `session_id`.

### Whack-a-mole

`whack-a-mole` is the first focused game ported from the previous repo. It uses
colored 2x2 targets, a colored start pad countdown, immediate target
replacement after a hit, and miss catch-up timing.

Run it locally with the existing asset pool:

```sh
go run ./game-engine/cmd/game-engine \
  -game whack-a-mole \
  -players 1 \
  -controller 127.0.0.1:4201 \
  -pressure-events 127.0.0.1:4202 \
  -fps 30 \
  -brightness 85 \
  -audio \
  -audio-player native \
  -audio-assets /Users/lobis/git/motion-levels/motion-levels/web/assets/temporada1 \
  -music Motion/canciones/Musica8.mp3 \
  -start-cue Motion/sonidos/aparecer.mp3 \
  -coin-cue Motion/sonidos/coin.wav \
  -damage-cue Motion/sonidos/fallo.mp3 \
  -win-cue Motion/sonidos/victoria.mp3
```

Press the visible start pad first. After the countdown, press the colored 2x2
targets. Hits play the coin cue; misses play the damage cue.

## Audio

The game-engine can play music and sound cues through the OS default audio
output. On a venue mini PC, configure the HDMI TV as the system default output.

Audio is intentionally local to the game-engine process for now. Game logic can
request music and cues without involving the floor-controller. Fast feedback
cues such as coin and damage sounds use a native preloaded audio backend:
MP3/WAV assets are decoded and resampled at startup, then each press-triggered
cue starts from memory. This avoids spawning `afplay`/`ffplay` for every tile
press.

Command players are kept only as a fallback or forced option. For instant
feedback, prefer the native backend.

For local testing with the old Temporada 1 assets:

```sh
go run ./game-engine/cmd/game-engine \
  -audio \
  -audio-assets /Users/lobis/git/motion-levels/motion-levels/web/assets/temporada1 \
  -music Motion/canciones/Background01.mp3 \
  -start-cue Motion/sonidos/aparecer.mp3 \
  -coin-cue Motion/sonidos/coin.wav \
  -damage-cue Motion/sonidos/fallo.mp3 \
  -win-cue Motion/sonidos/victoria.mp3
```

For a quick speaker/HDMI check without connecting to the floor-controller:

```sh
go run ./game-engine/cmd/game-engine \
  -audio-test \
  -audio-player native \
  -audio-assets /path/to/audio-assets \
  -music Motion/canciones/Background01.mp3 \
  -start-cue Motion/sonidos/aparecer.mp3 \
  -coin-cue Motion/sonidos/coin.wav \
  -damage-cue Motion/sonidos/fallo.mp3 \
  -win-cue Motion/sonidos/victoria.mp3
```

Useful flags:

- `-audio`: enable local playback.
- `-audio-assets`: root directory for audio files.
- `-audio-player`: `native` for the low-latency backend, empty for auto, or a
  command such as `afplay`, `mpv`, `ffplay`, or `mpg123`.
- `-music`: looping background music asset.
- `-start-cue`: one-shot cue played when the engine connects.
- `-coin-cue` and `-damage-cue`: preloaded press-feedback cue assets.
- `-win-cue`: preloaded completion cue asset.
- `-music-volume` and `-cue-volume`: values from `0.0` to `1.0`.
