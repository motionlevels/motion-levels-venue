# Player Display

Full-screen player-facing TV display for score, timer, phase, and game status.

The display talks to the local Go game-engine API at `http://127.0.0.1:8082`
and subscribes to `/api/display/events` for live state updates.

```sh
npm install
npm run dev
```

Open:

```txt
http://127.0.0.1:5175
```

For kiosk-style fullscreen Electron testing:

```sh
PLAYER_DISPLAY_FULLSCREEN=1 npm run electron:dev
```

Set `VITE_GAME_ENGINE_URL` if the display is pointed at a different game-engine
machine:

```sh
VITE_GAME_ENGINE_URL=http://192.168.1.137:8082 npm run dev
```
