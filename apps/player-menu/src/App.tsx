import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { controlGame, fetchEngineStatus, selectGame, type EngineStatus } from "./api";
import { categories, colors, difficulties, games, playerColorNames, playerColors, type CategoryID, type DifficultyID, type GameCard } from "./catalog";
import { BackspaceIcon, BoltIcon, CheckIcon, CloseIcon, LogoIcon, PauseIcon, PlayIcon, PlusIcon, RestartIcon, VolumeIcon, VolumeMutedIcon } from "./icons";
import { FloorPreview } from "./FloorPreview";
import { LiveFloorView } from "./LiveFloorView";
import { defaultFloorAnim, floorAnimations } from "./floor";
import { hexToColor, hexToRGB, initials } from "./utils";

type Player = {
  id: number;
  name: string;
  color: string;
  active: boolean;
};

type MenuState = {
  teamName: string;
  players: Player[];
  category: CategoryID;
  selectedGame: string;
  difficulty: DifficultyID;
  selectedLevels: Record<string, string>;
  nextPlayerId: number;
  narrationArmed: Record<string, boolean>;
};

type KeyboardTarget = { kind: "team" } | { kind: "player"; id: number };
type ScreenMode = "browse" | "game";
type RosterIssue = { message: string; playerIds: Set<number> };

const storageKey = "ml-player-menu-state-v1";
const maxPlayers = 6;
// Spanish QWERTY with Ñ and an accent row for proper names.
const keyboardRows = ["1234567890", "QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM", "ÁÉÍÓÚÜ"];
const defaultPlayers: Player[] = [{ id: 1, name: "", color: playerColors[0], active: true }];

function engineGameID(game: GameCard): string {
  return game.engineGame || game.id;
}

function previewAnimationID(game: GameCard): string {
  return game.previewAnimation || game.id;
}

function isAmbientCard(game: GameCard): boolean {
  return game.category === "attract";
}

function isIndividualCard(game: GameCard): boolean {
  return game.category === "individual";
}

function usesDifficulty(game: GameCard): boolean {
  return !isAmbientCard(game) && !game.levels?.length;
}

function supportsNarration(game: GameCard): boolean {
  return engineGameID(game) === "lava" || engineGameID(game) === "whack-a-mole";
}

function defaultLevelID(game: GameCard): string {
  return game.levels?.[0]?.id || "";
}

function loadMenuState(): MenuState {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<MenuState> | null;
    if (saved && typeof saved === "object") {
      const narrationArmed = saved.narrationArmed && typeof saved.narrationArmed === "object" ? saved.narrationArmed : {};
      const selectedLevels = saved.selectedLevels && typeof saved.selectedLevels === "object" ? saved.selectedLevels : {};
      const savedPlayers = Array.isArray(saved.players) ? saved.players : [];
      const wasOldUntouchedDefault =
        !saved.teamName &&
        savedPlayers.length === 2 &&
        savedPlayers.every((player, index) => {
          const name = String(player?.name || "").trim();
          const oldName = index === 0 ? "Red" : "Blue";
          return player && player.active && (name === "" || name === oldName);
        });
      return {
        teamName: "",
        difficulty: "easy",
        ...saved,
        category: saved.selectedGame === "whack-a-mole" && wasOldUntouchedDefault ? "team" : saved.category || "team",
        selectedGame: saved.selectedGame === "whack-a-mole" && wasOldUntouchedDefault ? "lava" : saved.selectedGame || "lava",
        selectedLevels,
        players: wasOldUntouchedDefault ? defaultPlayers : savedPlayers,
        nextPlayerId: wasOldUntouchedDefault ? 1 : saved.nextPlayerId || 0,
        narrationArmed,
      };
    }
  } catch {
    // Ignore broken local storage and return the default kiosk state.
  }
  return {
    teamName: "",
    players: defaultPlayers,
    category: "team",
    selectedGame: "lava",
    difficulty: "easy",
    selectedLevels: {},
    nextPlayerId: 1,
    narrationArmed: {},
  };
}

// Players get a "Jugador N" placeholder until they are named.
function playerLabel(players: Player[], player: Player): string {
  const name = player.name.trim();
  if (name) return name;
  return `Jugador ${players.indexOf(player) + 1}`;
}

function avatarLabel(players: Player[], player: Player): string {
  const name = player.name.trim();
  return name ? initials(name) : `${players.indexOf(player) + 1}`;
}

function normalizeRosterName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-ES");
}

function firstAvailableColor(players: Player[], ignoredID?: number): string {
  const used = new Set(players.filter((player) => player.active && player.id !== ignoredID).map((player) => player.color.toLowerCase()));
  return playerColors.find((color) => !used.has(color.toLowerCase())) || playerColors[0];
}

function activeRosterIssue(players: Player[]): RosterIssue | null {
  const active = players.filter((player) => player.active);
  const names = new Map<string, Player[]>();
  const colors = new Map<string, Player[]>();

  for (const player of active) {
    const nameKey = normalizeRosterName(playerLabel(players, player));
    if (nameKey) names.set(nameKey, [...(names.get(nameKey) || []), player]);

    const colorKey = player.color.toLowerCase();
    colors.set(colorKey, [...(colors.get(colorKey) || []), player]);
  }

  for (const duplicates of names.values()) {
    if (duplicates.length > 1) {
      const label = playerLabel(players, duplicates[0]);
      return {
        message: `El nombre "${label}" ya está en uso`,
        playerIds: new Set(duplicates.map((player) => player.id)),
      };
    }
  }

  for (const duplicates of colors.values()) {
    if (duplicates.length > 1) {
      return {
        message: "Cada jugador necesita un color distinto",
        playerIds: new Set(duplicates.map((player) => player.id)),
      };
    }
  }

  return null;
}

export default function App() {
  const [menu, setMenu] = useState<MenuState>(() => loadMenuState());
  const [status, setStatus] = useState<EngineStatus | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [keyboardTarget, setKeyboardTarget] = useState<KeyboardTarget | null>(null);
  const [colorPickerFor, setColorPickerFor] = useState<number | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);
  const [teamOpen, setTeamOpen] = useState(false);
  const [screenMode, setScreenMode] = useState<ScreenMode>("browse");
  const [launchedGameID, setLaunchedGameID] = useState(menu.selectedGame);
  const [introUntil, setIntroUntil] = useState(0);
  const [countdownUntil, setCountdownUntil] = useState(0);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const next = await fetchEngineStatus();
        if (cancelled) return;
        setStatus(next);
        setError("");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Sin conexión con el motor");
      }
    }
    refresh();
    const id = window.setInterval(refresh, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (screenMode !== "game") return;
    const id = window.setInterval(() => setNowMs(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [screenMode]);

  // Esc closes the topmost overlay (keyboard first, then dialogs, then the team drawer).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (keyboardTarget) setKeyboardTarget(null);
      else if (colorPickerFor !== null) setColorPickerFor(null);
      else if (confirmRemove !== null) setConfirmRemove(null);
      else if (teamOpen) setTeamOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyboardTarget, colorPickerFor, confirmRemove, teamOpen]);

  const availableGames = useMemo(() => new Set((status?.catalog || []).map((entry) => entry.game)), [status]);
  const activePlayers = menu.players.filter((player) => player.active);
  const activeCategory = categories.find((category) => category.id === menu.category) || categories[0];
  const selectedGame = games.find((game) => game.id === menu.selectedGame) || games[0];
  const launchedGame = games.find((game) => game.id === launchedGameID) || selectedGame;
  const visibleGames = games.filter((game) => game.category === menu.category);
  const selectedDifficulty = difficulties.find((difficulty) => difficulty.id === menu.difficulty) || difficulties[0];
  const launchedPlayers = isIndividualCard(launchedGame) ? activePlayers.slice(0, 1) : activePlayers;
  const launchedLevel = launchedGame.levels?.find((level) => level.id === (status?.level || selectedLevelFor(launchedGame)));
  const launchedModeLabel = isAmbientCard(launchedGame) ? "Ambiente" : launchedLevel?.label || selectedDifficulty.label;
  const pickerPlayer = menu.players.find((player) => player.id === colorPickerFor) || null;
  const removePlayer = menu.players.find((player) => player.id === confirmRemove) || null;
  const connectionState = error ? "connection-off" : status ? "connection-on" : "connection-pending";
  const playerCount = activePlayers.length || 1;
  const playerCountLabel = `${playerCount} ${playerCount === 1 ? "jugador" : "jugadores"}`;
  const rosterIssue = useMemo(() => activeRosterIssue(menu.players), [menu.players]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", colors.green);
    document.documentElement.style.setProperty("--accent-rgb", hexToRGB(colors.green));
  }, []);

  function addPlayer() {
    setMenu((current) => {
      if (current.players.length >= maxPlayers) return current;
      return {
        ...current,
        players: [
          ...current.players,
          {
            id: current.nextPlayerId + 1,
            name: "",
            color: firstAvailableColor(current.players),
            active: true,
          },
        ],
        nextPlayerId: current.nextPlayerId + 1,
      };
    });
  }

  function ensurePlayers(current: MenuState): MenuState {
    if (current.players.some((player) => player.active)) return current;
    return {
      ...current,
      players: [{ id: current.nextPlayerId + 1, name: "", color: playerColors[0], active: true }],
      nextPlayerId: current.nextPlayerId + 1,
    };
  }

  function updatePlayer(id: number, patch: Partial<Player>) {
    setMenu((current) => {
      let nextPatch = patch;
      if (patch.color && current.players.some((player) => player.id !== id && player.active && player.color.toLowerCase() === patch.color?.toLowerCase())) {
        return current;
      }
      if (patch.active === true) {
        const player = current.players.find((candidate) => candidate.id === id);
        if (player && current.players.some((candidate) => candidate.id !== id && candidate.active && candidate.color.toLowerCase() === player.color.toLowerCase())) {
          nextPatch = { ...patch, color: firstAvailableColor(current.players, id) };
        }
      }
      return {
        ...current,
        players: current.players.map((player) => (player.id === id ? { ...player, ...nextPatch } : player)),
      };
    });
  }

  function deletePlayer(id: number) {
    setMenu((current) => ({ ...current, players: current.players.filter((player) => player.id !== id) }));
    setConfirmRemove(null);
  }

  function keyboardValue() {
    if (!keyboardTarget) return "";
    if (keyboardTarget.kind === "team") return menu.teamName;
    return menu.players.find((player) => player.id === keyboardTarget.id)?.name || "";
  }

  function keyboardTitle() {
    if (!keyboardTarget) return "";
    if (keyboardTarget.kind === "team") return "Nombre del equipo";
    const player = menu.players.find((candidate) => candidate.id === keyboardTarget.id);
    return player ? `Jugador ${menu.players.indexOf(player) + 1}` : "Jugador";
  }

  function setKeyboardValue(value: string) {
    if (!keyboardTarget) return;
    const next = value.slice(0, keyboardTarget.kind === "team" ? 20 : 12);
    if (keyboardTarget.kind === "team") {
      setMenu((current) => ({ ...current, teamName: next }));
      return;
    }
    updatePlayer(keyboardTarget.id, { name: next });
  }

  function typeKey(key: string) {
    const current = keyboardValue();
    let ch = key;
    // Title-case as you type so names read "José" instead of "JOSÉ".
    if (key !== " " && /\p{L}/u.test(key)) {
      const atWordStart = current.length === 0 || current.endsWith(" ");
      ch = atWordStart ? key.toUpperCase() : key.toLowerCase();
    }
    setKeyboardValue(`${current}${ch}`);
  }

  function selectGameCard(gameID: string) {
    const game = games.find((candidate) => candidate.id === gameID);
    setMenu((current) => ({
      ...current,
      selectedGame: gameID,
      selectedLevels: game?.levels?.length && !current.selectedLevels[gameID] ? { ...current.selectedLevels, [gameID]: defaultLevelID(game) } : current.selectedLevels,
    }));
    if (game && isAmbientCard(game) && !game.disabled && availableGames.has(engineGameID(game))) {
      void launch(game.id);
    }
  }

  function selectedLevelFor(game: GameCard, state = menu): string {
    if (!game.levels?.length) return "";
    return state.selectedLevels[game.id] || defaultLevelID(game);
  }

  function setSelectedLevel(game: GameCard, levelID: string) {
    setMenu((current) => ({
      ...current,
      selectedLevels: {
        ...current.selectedLevels,
        [game.id]: levelID,
      },
    }));
  }

  function narrationArmedFor(game: GameCard, state = menu): boolean {
    if (!supportsNarration(game)) return false;
    return state.narrationArmed[game.id] ?? true;
  }

  function setNarrationArmed(game: GameCard, armed: boolean) {
    setMenu((current) => ({
      ...current,
      narrationArmed: {
        ...current.narrationArmed,
        [game.id]: armed,
      },
    }));
    setMessage((current) => (current.startsWith("Narración") ? "" : current));
  }

  async function launch(gameID = selectedGame.id) {
    const game = games.find((candidate) => candidate.id === gameID);
    if (!game || game.disabled || !availableGames.has(engineGameID(game))) return;
    const nextMenu = ensurePlayers({ ...menu, selectedGame: game.id });
    const nextRosterIssue = activeRosterIssue(nextMenu.players);
    if (!isAmbientCard(game) && nextRosterIssue) {
      setMenu(nextMenu);
      setMessage("");
      setError(nextRosterIssue.message);
      setTeamOpen(true);
      return;
    }
    const playNarration = narrationArmedFor(game, nextMenu);
    const launchPlayers = nextMenu.players.filter((player) => player.active);
    const rosterForGame = isIndividualCard(game) ? launchPlayers.slice(0, 1) : launchPlayers;
    const selectedLevel = selectedLevelFor(game, nextMenu);
    setMenu(nextMenu);
    setMessage("Iniciando");
    setError("");
    try {
      const nextStatus = await selectGame({
        game: engineGameID(game),
        playerCount: Math.max(1, rosterForGame.length),
        difficulty: usesDifficulty(game) ? nextMenu.difficulty : undefined,
        level: selectedLevel || undefined,
        narrationEnabled: supportsNarration(game) ? playNarration : false,
        teamName: nextMenu.teamName.trim(),
        players: rosterForGame.map((player, index) => ({
          index,
          label: playerLabel(nextMenu.players, player),
          color: hexToColor(player.color),
        })),
      });
      setStatus(nextStatus);
      setMessage("En curso");
      setLaunchedGameID(game.id);
      if (supportsNarration(game) && playNarration) {
        setMenu((current) => ({
          ...current,
          narrationArmed: {
            ...current.narrationArmed,
            [game.id]: false,
          },
        }));
      }
      syncPlayTiming(nextStatus, game);
      setTeamOpen(false);
      setKeyboardTarget(null);
      setScreenMode(isAmbientCard(game) ? "browse" : "game");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el juego");
    }
  }

  async function restartLaunchedGame() {
    await launch(launchedGame.id);
    setMessage("Reiniciando");
  }

  async function sendGameControl(action: "pause" | "resume" | "restart" | "exit" | "narration" | "mute" | "unmute" | "toggle_mute") {
    setError("");
    try {
      const nextStatus = await controlGame(action);
      setStatus(nextStatus);
      if (action === "restart") {
        syncPlayTiming(nextStatus, launchedGame);
        setMessage("Reiniciando");
      } else if (action === "exit") {
        setScreenMode("browse");
        setMessage("Juego finalizado");
      } else if (action === "narration") {
        setMessage("Narración");
      } else if (action === "toggle_mute" || action === "mute" || action === "unmute") {
        setMessage(nextStatus.audioMuted ? "Audio silenciado" : "Audio activo");
      } else {
        setMessage(action === "pause" ? "Pausado" : "En curso");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo controlar el juego");
    }
  }

  function syncPlayTiming(nextStatus: EngineStatus, game: GameCard) {
    const now = Date.now();
    if (isAmbientCard(game)) {
      setIntroUntil(now);
      setCountdownUntil(now);
      setNowMs(now);
      return;
    }
    const introMillis = Math.max(0, nextStatus.introRemainingMillis || 0);
    const countdownMillis = Math.max(0, nextStatus.countdownRemainingMillis || 3000);
    setIntroUntil(now + introMillis);
    setCountdownUntil(now + introMillis + countdownMillis);
    setNowMs(now);
  }

  const introActive = screenMode === "game" && introUntil > nowMs;
  const countdownValue = screenMode === "game" && !introActive ? Math.max(0, Math.ceil((countdownUntil - nowMs) / 1000)) : 0;
  const launchIssue = !isAmbientCard(selectedGame) ? rosterIssue?.message || "" : "";
  const launchStatusMessage = error || launchIssue || message || (isAmbientCard(selectedGame) ? "Ambiente listo" : "Listo para jugar");

  function enterBrowserFullscreen() {
    if (document.fullscreenElement) return;
    const root = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
    const requestFullscreen = root.requestFullscreen?.bind(root) || root.webkitRequestFullscreen?.bind(root);
    if (!requestFullscreen) return;
    Promise.resolve(requestFullscreen()).catch((err) => {
      console.warn("Fullscreen request failed", err);
    });
  }

  return (
    <main className={`app ${connectionState} ${keyboardTarget ? "keyboard-open" : ""} ${screenMode === "game" ? "playing" : ""}`}>
      <header className="topbar">
        <div className="brand">
          <button className="brand-mark" type="button" aria-label="Entrar en pantalla completa" onClick={enterBrowserFullscreen}>
            <LogoIcon />
          </button>
          <div className="brand-copy">
            <b>Motion Levels</b>
            <span>Quiosco</span>
          </div>
        </div>
        <nav className="category-tabs top-category-tabs" aria-label="Categorías de juegos">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`tab ${menu.category === category.id ? "active" : ""}`}
              type="button"
              aria-pressed={menu.category === category.id}
              onClick={() => {
                const first = games.find((game) => game.category === category.id);
                setMenu((current) => ({ ...current, category: category.id, selectedGame: first?.id || current.selectedGame }));
              }}
            >
              {category.label}
            </button>
          ))}
        </nav>
        <div className="status-capsules">
          <button
            className={`capsule audio-btn ${status?.audioMuted ? "muted" : ""}`}
            type="button"
            onClick={() => sendGameControl("toggle_mute")}
            disabled={!status?.audioEnabled}
            aria-label={status?.audioMuted ? "Activar audio" : "Silenciar audio"}
          >
            {status?.audioMuted ? <VolumeMutedIcon /> : <VolumeIcon />}
            <strong>{status?.audioMuted ? "Mute" : "Audio"}</strong>
          </button>
          <button className={`capsule equipo-btn ${rosterIssue ? "invalid" : ""}`} type="button" onClick={() => setTeamOpen(true)} aria-label="Abrir equipo">
            <span className="mini-avatars">
              {activePlayers.slice(0, 6).map((player) => (
                <span key={player.id} style={{ "--pc": player.color } as CSSProperties} />
              ))}
            </span>
            <strong>{playerCountLabel}</strong>
          </button>
        </div>
      </header>

      {screenMode === "game" ? (
        <GameControlScreen
          game={launchedGame}
          status={status}
          players={launchedPlayers}
          allPlayers={menu.players}
          modeLabel={launchedModeLabel}
          ambient={isAmbientCard(launchedGame)}
          introActive={introActive}
          countdownValue={countdownValue}
          error={error}
          onPauseToggle={() => sendGameControl(status?.paused ? "resume" : "pause")}
          onRestart={() => restartLaunchedGame()}
          narrationSupported={supportsNarration(launchedGame)}
          narrationArmed={narrationArmedFor(launchedGame)}
          onNarrationToggle={() => setNarrationArmed(launchedGame, !narrationArmedFor(launchedGame))}
          onExit={() => sendGameControl("exit")}
        />
      ) : (
      <section className="layout">
        <div className={`drawer-backdrop ${teamOpen ? "open" : ""}`} onClick={() => setTeamOpen(false)} />
        <aside className={`panel team-panel team-drawer ${teamOpen ? "open" : ""}`} aria-label="Configuración del equipo" aria-hidden={!teamOpen}>
          <div className="drawer-head">
            <div>
              <strong>Equipo</strong>
              <span>{playerCountLabel}</span>
            </div>
            <button className="icon-button" type="button" aria-label="Cerrar equipo" onClick={() => setTeamOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <section className="team-name">
            <div className="micro">Equipo</div>
            <input
              value={menu.teamName}
              maxLength={20}
              autoComplete="off"
              spellCheck={false}
              placeholder="Nombre del equipo"
              inputMode="none"
              onFocus={() => setKeyboardTarget({ kind: "team" })}
              onClick={() => setKeyboardTarget({ kind: "team" })}
              onChange={(event) => setMenu((current) => ({ ...current, teamName: event.target.value }))}
            />
          </section>

          <section className="roster" aria-label="Jugadores">
            {menu.players.length === 0 ? <div className="message">Añade un jugador o usa el inicio rápido.</div> : null}
            {menu.players.map((player, index) => {
              const invalidPlayer = Boolean(rosterIssue?.playerIds.has(player.id));
              return (
                <article key={player.id} className={`player ${player.active ? "" : "off"} ${invalidPlayer ? "invalid" : ""}`} style={{ "--pc": player.color } as CSSProperties}>
                  <button className="avatar" type="button" onClick={() => setColorPickerFor(player.id)} aria-label={`Elegir color de ${playerLabel(menu.players, player)}`}>
                    {avatarLabel(menu.players, player)}
                  </button>
                  <input
                    value={player.name}
                    maxLength={12}
                    aria-label="Nombre del jugador"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="none"
                    aria-invalid={invalidPlayer || undefined}
                    placeholder={`Jugador ${index + 1}`}
                    onFocus={() => setKeyboardTarget({ kind: "player", id: player.id })}
                    onClick={() => setKeyboardTarget({ kind: "player", id: player.id })}
                    onChange={(event) => updatePlayer(player.id, { name: event.target.value })}
                  />
                  <div className="player-actions">
                    <button
                      className="icon-button"
                      type="button"
                      title={player.active ? "Descansar" : "Activar"}
                      aria-label={player.active ? `Poner a descansar a ${playerLabel(menu.players, player)}` : `Activar a ${playerLabel(menu.players, player)}`}
                      onClick={() => updatePlayer(player.id, { active: !player.active })}
                    >
                      {player.active ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button className="icon-button danger" type="button" title="Quitar" aria-label={`Quitar a ${playerLabel(menu.players, player)}`} onClick={() => setConfirmRemove(player.id)}>
                      <CloseIcon />
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="team-actions">
            <button className="btn" type="button" onClick={addPlayer} disabled={menu.players.length >= maxPlayers}>
              <PlusIcon />
              Añadir jugador
            </button>
          </section>

          <button className="btn primary drawer-done" type="button" onClick={() => setTeamOpen(false)}>
            <CheckIcon />
            Listo
          </button>
        </aside>

        <section className="main-panel">
          <section className="browse-content">
            <section className="game-grid-panel" aria-labelledby="games-heading">
              <div className="section-head">
                <div>
                  <span className="micro">Elige juego</span>
                  <h2 id="games-heading">{activeCategory.label}</h2>
                </div>
                <span className="grid-count">{visibleGames.length} modos</span>
              </div>
              <section key={menu.category} className="games game-grid" aria-label="Juegos">
                {visibleGames.map((game, index) => {
                  const future = Boolean(game.disabled);
                  const engineAvailable = availableGames.has(engineGameID(game));
                  const selected = menu.selectedGame === game.id;
                  const active = selected && status?.currentGame === engineGameID(game);
                  return (
                    <button
                      key={game.id}
                      className={`card game-card ${future ? "disabled" : ""} ${!future && !engineAvailable ? "unavailable" : ""} ${selected ? "selected" : ""} ${active ? "active" : ""}`}
                      style={{ "--c": game.color, "--crgb": hexToRGB(game.color), "--i": index } as CSSProperties}
                      type="button"
                      disabled={future}
                      data-game-id={game.id}
                      aria-pressed={selected}
                      onClick={() => selectGameCard(game.id)}
                    >
                      <Preview animationID={previewAnimationID(game)} />
                      <div className="game-body">
                        <h3>{game.label}</h3>
                      </div>
                    </button>
                  );
                })}
              </section>
            </section>

            <aside className="panel detail-panel" style={{ "--c": selectedGame.color, "--crgb": hexToRGB(selectedGame.color) } as CSSProperties} aria-label="Juego seleccionado">
              <div className="detail-preview">
                <Preview animationID={previewAnimationID(selectedGame)} />
              </div>
              <div className="detail-copy">
                <span className="micro">Seleccionado</span>
                <h2>{selectedGame.label}</h2>
                <p>{selectedGame.description}</p>
                {selectedGame.levels?.length ? (
                  <div className="level-selector" role="radiogroup" aria-label="Nivel">
                    {selectedGame.levels.map((level) => {
                      const active = selectedLevelFor(selectedGame) === level.id;
                      return (
                        <button
                          key={level.id}
                          className={`level-option ${active ? "active" : ""}`}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSelectedLevel(selectedGame, level.id)}
                        >
                          <strong>{level.label}</strong>
                          <span>{level.description}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
                <div className="detail-rules">
                  <span className="micro">Reglas rápidas</span>
                  <ul>
                    {selectedGame.rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>
                <p className="detail-note">
                  {isAmbientCard(selectedGame)
                    ? "Las animaciones de ambiente se pueden cambiar al instante desde esta pantalla."
                    : "Revisa equipo y dificultad antes de empezar. La partida se lanza desde el botón principal."}
                </p>
              </div>
            </aside>
          </section>

          <section className="panel launch-bar" aria-label="Resumen de inicio">
            <div className={`launch-copy ${isAmbientCard(selectedGame) ? "ambient" : ""}`}>
              <div className="launch-selected">
                <span className={`launch-status ${error || launchIssue ? "error" : ""}`}>{launchStatusMessage}</span>
                <strong>{selectedGame.label}</strong>
              </div>
              {usesDifficulty(selectedGame) ? (
                <div className="launch-difficulty" role="group" aria-label="Dificultad">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.id}
                      className={`launch-difficulty-button ${menu.difficulty === difficulty.id ? "active" : ""}`}
                      style={{ "--accent": difficulty.color, "--accent-rgb": hexToRGB(difficulty.color) } as CSSProperties}
                      type="button"
                      aria-pressed={menu.difficulty === difficulty.id}
                      onClick={() => setMenu((current) => ({ ...current, difficulty: difficulty.id }))}
                    >
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {(() => {
              const engineAvailable = availableGames.has(engineGameID(selectedGame));
              const rosterBlocked = !isAmbientCard(selectedGame) && Boolean(rosterIssue);
              const blocked = selectedGame.disabled || !engineAvailable || rosterBlocked;
              const blockedLabel = rosterBlocked ? "Revisa equipo" : selectedGame.disabled ? "Próximamente" : error ? "Sin conexión" : "No disponible";
              return (
                <div className="launch-actions">
                  {supportsNarration(selectedGame) ? (
                    <button
                      className={`btn narration-toggle ${narrationArmedFor(selectedGame) ? "active" : ""}`}
                      type="button"
                      aria-pressed={narrationArmedFor(selectedGame)}
                      onClick={() => setNarrationArmed(selectedGame, !narrationArmedFor(selectedGame))}
                    >
                      <BoltIcon />
                      {narrationArmedFor(selectedGame) ? "Narración ON" : "Narración OFF"}
                    </button>
                  ) : null}
                  <button className="btn primary play" type="button" disabled={blocked} onClick={() => launch()}>
                    {blocked ? (
                      blockedLabel
                    ) : (
                      <>
                        <PlayIcon />
                        {isAmbientCard(selectedGame) ? "Reproducir" : "Empezar"}
                      </>
                    )}
                  </button>
                </div>
              );
            })()}
          </section>
        </section>
      </section>
      )}

      {pickerPlayer ? (
        <ColorPicker
          player={pickerPlayer}
          takenColors={new Set(menu.players.filter((player) => player.active && player.id !== pickerPlayer.id).map((player) => player.color.toLowerCase()))}
          onPick={(color) => {
            updatePlayer(pickerPlayer.id, { color });
            setColorPickerFor(null);
          }}
          onClose={() => setColorPickerFor(null)}
        />
      ) : null}

      {removePlayer ? (
        <ConfirmDialog
          title="¿Quitar jugador?"
          body={`Se quitará a ${playerLabel(menu.players, removePlayer)} del equipo.`}
          confirmLabel="Quitar"
          cancelLabel="Cancelar"
          onConfirm={() => deletePlayer(removePlayer.id)}
          onCancel={() => setConfirmRemove(null)}
        />
      ) : null}

      {keyboardTarget ? (
        <TouchKeyboard
          title={keyboardTitle()}
          value={keyboardValue()}
          placeholder={keyboardTarget.kind === "team" ? "Nombre del equipo" : "Nombre del jugador"}
          onType={typeKey}
          onBackspace={() => setKeyboardValue(keyboardValue().slice(0, -1))}
          onClear={() => setKeyboardValue("")}
          onSpace={() => typeKey(" ")}
          onDone={() => setKeyboardTarget(null)}
        />
      ) : null}
    </main>
  );
}

function ColorPicker({
  player,
  takenColors,
  onPick,
  onClose,
}: {
  player: Player;
  takenColors: Set<string>;
  onPick: (color: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Elegir color" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <strong>Elige un color</strong>
          <button className="icon-button" type="button" aria-label="Cerrar" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="swatch-grid">
          {playerColors.map((color, index) => {
            const selected = color.toLowerCase() === player.color.toLowerCase();
            const taken = !selected && takenColors.has(color.toLowerCase());
            return (
              <button
                key={color}
                className={`swatch ${selected ? "selected" : ""} ${taken ? "taken" : ""}`}
                style={{ "--pc": color } as CSSProperties}
                type="button"
                disabled={taken}
                aria-label={taken ? `${playerColorNames[index]} en uso` : playerColorNames[index]}
                aria-pressed={selected}
                onClick={() => onPick(color)}
              >
                {selected ? <CheckIcon /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onCancel}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <strong>{title}</strong>
        </div>
        <p className="modal-body">{body}</p>
        <div className="modal-actions">
          <button className="btn" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn danger" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function GameControlScreen({
  game,
  status,
  players,
  allPlayers,
  modeLabel,
  ambient,
  introActive,
  countdownValue,
  error,
  onPauseToggle,
  onRestart,
  narrationSupported,
  narrationArmed,
  onNarrationToggle,
  onExit,
}: {
  game: GameCard;
  status: EngineStatus | null;
  players: Player[];
  allPlayers: Player[];
  modeLabel: string;
  ambient: boolean;
  introActive: boolean;
  countdownValue: number;
  error: string;
  onPauseToggle: () => void;
  onRestart: () => void;
  narrationSupported: boolean;
  narrationArmed: boolean;
  onNarrationToggle: () => void;
  onExit: () => void;
}) {
  const paused = Boolean(status?.paused);
  return (
    <section className="game-control-screen" style={{ "--c": game.color, "--crgb": hexToRGB(game.color) } as CSSProperties}>
      <div className="game-control-main">
        <div className="game-control-preview">
          <LiveFloorView />
          {introActive ? (
            <div className="countdown-overlay narration" aria-live="polite">
              <span>Narración</span>
            </div>
          ) : countdownValue > 0 ? (
            <div className="countdown-overlay" aria-live="polite">
              <span>{countdownValue}</span>
            </div>
          ) : paused ? (
            <div className="countdown-overlay paused" aria-live="polite">
              <span>Pausa</span>
            </div>
          ) : null}
        </div>

        <div className="game-control-copy">
          <span className="micro">{ambient ? "Ambiente activo" : "Juego activo"}</span>
          <h2>{game.label}</h2>
          <p>{ambient ? "Animación en curso" : introActive ? "Narración inicial" : countdownValue > 0 ? "Preparando una salida segura" : paused ? "El juego está pausado" : "Ronda en curso"}</p>
          <div className="control-meta">
            <span>{ambient ? "Todos los jugadores" : `${players.length || 1} ${players.length === 1 ? "jugador" : "jugadores"}`}</span>
            <span>{modeLabel}</span>
            <span>{status?.currentGame || engineGameID(game)}</span>
          </div>
          {!ambient ? <div className="control-roster">
            {players.slice(0, 6).map((player) => (
              <span key={player.id} className="player-pill" style={{ "--pc": player.color } as CSSProperties}>
                <span />
                <span>{playerLabel(allPlayers, player)}</span>
              </span>
            ))}
          </div> : null}
          {error ? <div className="message error">{error}</div> : null}
        </div>
      </div>

      <div className="game-control-actions">
        <button className="btn control-action" type="button" onClick={onPauseToggle}>
          {paused ? <PlayIcon /> : <PauseIcon />}
          {paused ? "Reanudar" : "Pausar"}
        </button>
        <button className="btn control-action" type="button" onClick={onRestart}>
          <RestartIcon />
          Reiniciar
        </button>
        {narrationSupported ? (
          <button
            className={`btn control-action narration-toggle ${narrationArmed ? "active" : ""}`}
            type="button"
            aria-pressed={narrationArmed}
            onClick={onNarrationToggle}
          >
            <BoltIcon />
            {narrationArmed ? "Narración ON" : "Narración OFF"}
          </button>
        ) : null}
        <button className="btn control-action danger" type="button" onClick={onExit}>
          <CloseIcon />
          Salir
        </button>
      </div>
    </section>
  );
}

function TouchKeyboard({
  title,
  value,
  placeholder,
  onType,
  onBackspace,
  onClear,
  onSpace,
  onDone,
}: {
  title: string;
  value: string;
  placeholder: string;
  onType: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpace: () => void;
  onDone: () => void;
}) {
  return (
    <section className="touch-keyboard" aria-label="Teclado táctil" onMouseDown={(event) => event.preventDefault()}>
      <div className="kb-display">
        <div className="kb-field">
          <span className="micro">{title}</span>
          <div className="kb-value">
            {value ? <span>{value}</span> : <span className="kb-placeholder">{placeholder}</span>}
            <span className="kb-caret" />
          </div>
        </div>
        <button className="kb-clear" type="button" onClick={onClear} disabled={!value}>
          Borrar todo
        </button>
      </div>
      <div className="keyboard-rows">
        {keyboardRows.map((row, index) => (
          <div className={`keyboard-row ${index === keyboardRows.length - 1 ? "accents" : ""}`} key={row}>
            {row.split("").map((key) => (
              <button className={`key ${index === keyboardRows.length - 1 ? "accent" : ""}`} key={key} type="button" onClick={() => onType(key)}>
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="keyboard-row keyboard-tools">
          <button className="key utility" type="button" aria-label="Borrar" onClick={onBackspace}>
            <BackspaceIcon />
          </button>
          <button className="key space" type="button" onClick={onSpace}>
            Espacio
          </button>
          <button className="key done" type="button" onClick={onDone}>
            Listo
          </button>
        </div>
      </div>
    </section>
  );
}

function Preview({ animationID }: { animationID: string }) {
  const anim = floorAnimations[animationID] || defaultFloorAnim;
  return (
    <div className="preview">
      <FloorPreview anim={anim} orientation="landscape" />
    </div>
  );
}
