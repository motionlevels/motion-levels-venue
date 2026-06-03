# Player Menu

Standalone kiosk UI for choosing games, configuring a team, and launching the
local Go game engine.

During development it talks to the game-engine API at `http://127.0.0.1:8082`.

```sh
npm install
npm run dev
```

Open:

```txt
http://127.0.0.1:5174
```

Other devices on the same network can use the Vite network URL printed by
`npm run dev`, for example `http://192.168.1.137:5174`.

Set `VITE_GAME_ENGINE_URL` if the menu is not running on the same machine as
the game-engine:

```sh
VITE_GAME_ENGINE_URL=http://192.168.1.137:8082 npm run dev
```

Electron development shell:

```sh
npm run electron:dev
```

The Electron app loads the Vite dev server when `PLAYER_MENU_URL` is set. For a
local packaged-style smoke run, `npm run electron` builds the static app and
opens it in Electron.
