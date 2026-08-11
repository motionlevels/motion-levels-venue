# Player Menu

> Transitional fallback only. The production source and release artifact now
> live in `motion-levels-games/apps/player-menu`. This copy remains buildable
> until all deployed games pins contain `playerMenu.adapterProtocolVersion: 1`.
> Do not add new product behavior here.

Standalone kiosk UI for choosing games, configuring a team, and launching the
local Go game engine.

During development it talks to the game-engine API at `http://127.0.0.1:4102`.

```sh
npm install
npm run dev
```

Open:

```txt
http://127.0.0.1:4103
```

Other devices on the same network can use the Vite network URL printed by
`npm run dev`, for example `http://192.168.1.137:4103`.

Set `VITE_GAME_ENGINE_URL` if the menu is not running on the same machine as
the game-engine:

```sh
VITE_GAME_ENGINE_URL=http://192.168.1.137:4102 npm run dev
```

Analytics are sent to the dedicated PostHog menu project in production builds.
Development mode keeps analytics off unless explicitly enabled:

```sh
VITE_POSTHOG_ENABLED=true npm run dev
```

Optional kiosk identity values:

```sh
VITE_VENUE_ID=motion-levels-main
VITE_KIOSK_ID=kiosk-1
```

The player menu records game/category/level/difficulty actions, team size, and
kiosk controls. It intentionally does not send team or player names.

Electron development shell:

```sh
npm run electron:dev
```

The Electron app loads the Vite dev server when `PLAYER_MENU_URL` is set. For a
local packaged-style smoke run, `npm run electron` builds the static app and
opens it in Electron.
