# Game Engine

The game engine produces logical board frames.

For now it renders one looping animation and streams protobuf `FrameRecord`
messages to `floor-controller`. It does not know about UDP, physical channels,
serpentine wiring, browser preview, or frame recording.

Its frame rate controls how often it offers a new desired board state. The
floor-controller owns the actual hardware, preview, and recording refresh
cadence.

## Run

Start `floor-controller` first, then:

```sh
go run ./game-engine/cmd/game-engine -controller 127.0.0.1:9090
```

The defaults are:

- controller frame stream: `127.0.0.1:9090`
- desired-state frame rate: `20fps`
- brightness: `80%`
