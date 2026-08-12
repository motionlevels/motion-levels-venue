# Player Display

Full-screen player-facing TV display for score, timer, phase, and game status.

The display talks to the local Go game-engine API at `http://127.0.0.1:4102`
and subscribes to the canonical revisioned `/api/player-state/events` feed.

```sh
npm install
npm run dev
```

Open:

```txt
http://127.0.0.1:4104
```

The default HUD is the arcade player display. The previous display remains
available for recovery or comparison:

```txt
http://127.0.0.1:4104/?hud=classic
```

For design review without a running game engine, use one of the built-in demo
states:

```txt
http://127.0.0.1:4104/?demo=players
http://127.0.0.1:4104/?demo=countdown
http://127.0.0.1:4104/?demo=team
http://127.0.0.1:4104/?demo=duel
http://127.0.0.1:4104/?hud=classic&demo=classic
```

For kiosk-style fullscreen Electron testing:

```sh
PLAYER_DISPLAY_FULLSCREEN=1 npm run electron:dev
```

Set `VITE_GAME_ENGINE_URL` if the display is pointed at a different game-engine
machine:

```sh
VITE_GAME_ENGINE_URL=http://192.168.1.137:4102 npm run dev
```
