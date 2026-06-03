import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { controlGame, fetchEngineStatus, selectGame, type EngineStatus } from "./api";
import { categories, difficulties, games, playerColorNames, playerColors, type CategoryID, type DifficultyID, type GameCard } from "./catalog";
import { BackspaceIcon, BoltIcon, CheckIcon, CloseIcon, LogoIcon, PauseIcon, PlayIcon, PlusIcon, RestartIcon, VolumeIcon, VolumeMutedIcon } from "./icons";
import { FloorPreview } from "./FloorPreview";
import { defaultFloorAnim, floorAnimations } from "./floor";
import { hexToRGB, initials } from "./utils";

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
  nextPlayerId: number;
  narrationArmed: Record<string, boolean>;
};

type KeyboardTarget = { kind: "team" } | { kind: "player"; id: number };
type ScreenMode = "browse" | "game";

const storageKey = "ml-player-menu-state-v1";
const maxPlayers = 6;
// Spanish QWERTY with Ñ.
const keyboardRows = ["1234567890", "QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"];
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

function supportsNarration(game: GameCard): boolean {
  return engineGameID(game) === "lava";
}

function loadMenuState(): MenuState {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<MenuState> | null;
    if (saved && typeof saved === "object") {
      const narrationArmed = saved.narrationArmed && typeof saved.narrationArmed === "object" ? saved.narrationArmed : {};
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
        category: "featured",
        selectedGame: "whack-a-mole",
        difficulty: "easy",
        ...saved,
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
    category: "featured",
    selectedGame: "whack-a-mole",
    difficulty: "easy",
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
  const gamesScrollRef = useRef<HTMLElement | null>(null);
  const gamesDragRef = useRef({ dragging: false, didMove: false, pointerId: 0, startX: 0, scrollLeft: 0, gameID: "" });

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

  const availableGames = useMemo(() => new Set((status?.catalog || []).map((entry) => entry.game)), [status]);
  const activePlayers = menu.players.filter((player) => player.active);
  const activeCategory = categories.find((category) => category.id === menu.category) || categories[0];
  const selectedGame = games.find((game) => game.id === menu.selectedGame) || games[0];
  const launchedGame = games.find((game) => game.id === launchedGameID) || selectedGame;
  const visibleGames = games.filter((game) => game.category === menu.category);
  const selectedDifficulty = difficulties.find((difficulty) => difficulty.id === menu.difficulty) || difficulties[0];
  const pickerPlayer = menu.players.find((player) => player.id === colorPickerFor) || null;
  const removePlayer = menu.players.find((player) => player.id === confirmRemove) || null;

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", activeCategory.color);
    document.documentElement.style.setProperty("--accent-rgb", hexToRGB(activeCategory.color));
  }, [activeCategory.color]);

  function addPlayer() {
    setMenu((current) => {
      if (current.players.length >= maxPlayers) return current;
      const index = current.players.length;
      return {
        ...current,
        players: [
          ...current.players,
          {
            id: current.nextPlayerId + 1,
            name: "",
            color: playerColors[index % playerColors.length],
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
    setMenu((current) => ({
      ...current,
      players: current.players.map((player) => (player.id === id ? { ...player, ...patch } : player)),
    }));
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
    setKeyboardValue(`${keyboardValue()}${key}`);
  }

  function beginGamesDrag(event: ReactPointerEvent<HTMLElement>) {
    const scroller = gamesScrollRef.current;
    if (!scroller || event.button !== 0) return;
    const card = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-game-id]");
    gamesDragRef.current = {
      dragging: true,
      didMove: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      gameID: card?.dataset.gameId || "",
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("dragging");
  }

  function moveGamesDrag(event: ReactPointerEvent<HTMLElement>) {
    const state = gamesDragRef.current;
    const scroller = gamesScrollRef.current;
    if (!state.dragging || !scroller || event.pointerId !== state.pointerId) return;
    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 4) state.didMove = true;
    scroller.scrollLeft = state.scrollLeft - delta;
    event.preventDefault();
  }

  function endGamesDrag(event: ReactPointerEvent<HTMLElement>) {
    const state = gamesDragRef.current;
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    state.dragging = false;
    event.currentTarget.classList.remove("dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!state.didMove && state.gameID) {
      selectGameCard(state.gameID, { ignoreDrag: true });
    }
    window.setTimeout(() => {
      gamesDragRef.current.didMove = false;
      gamesDragRef.current.gameID = "";
    }, 0);
  }

  function selectGameCard(gameID: string, options?: { ignoreDrag?: boolean }) {
    if (!options?.ignoreDrag && gamesDragRef.current.didMove) return;
    const game = games.find((candidate) => candidate.id === gameID);
    setMenu((current) => ({ ...current, selectedGame: gameID }));
    if (game && isAmbientCard(game) && !game.disabled && availableGames.has(engineGameID(game))) {
      void launch(game.id);
    }
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
    setMessage(armed ? "Narración activada para la próxima partida" : "Narración desactivada");
  }

  async function launch(gameID = selectedGame.id) {
    const game = games.find((candidate) => candidate.id === gameID);
    if (!game || game.disabled || !availableGames.has(engineGameID(game))) return;
    const nextMenu = ensurePlayers({ ...menu, selectedGame: game.id });
    const playNarration = narrationArmedFor(game, nextMenu);
    setMenu(nextMenu);
    setMessage("Iniciando");
    setError("");
    try {
      const nextStatus = await selectGame({
        game: engineGameID(game),
        playerCount: Math.max(1, nextMenu.players.filter((player) => player.active).length),
        difficulty: nextMenu.difficulty,
        narrationEnabled: supportsNarration(game) ? playNarration : false,
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

  return (
    <main className={`app ${keyboardTarget ? "keyboard-open" : ""} ${screenMode === "game" ? "playing" : ""}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <LogoIcon />
          </div>
          <div className="brand-copy">
            <b>Motion Levels</b>
            <span>Quiosco</span>
          </div>
        </div>
        <div className="title-stack">
          <div className="eyebrow">{activeCategory.label}</div>
          <h1>{activeCategory.title}</h1>
        </div>
        <div className="status-capsules">
          <div className="capsule status-dot">
            <span className={`live-dot ${status && !error ? "on" : ""}`} />
            <strong>{error ? "Sin conexión" : "Conectado"}</strong>
          </div>
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
          <button className="capsule equipo-btn" type="button" onClick={() => setTeamOpen(true)} aria-label="Abrir equipo">
            <span className="mini-avatars">
              {activePlayers.slice(0, 6).map((player) => (
                <span key={player.id} style={{ "--pc": player.color } as CSSProperties} />
              ))}
            </span>
            <strong>Equipo</strong>
          </button>
        </div>
      </header>

      {screenMode === "game" ? (
        <GameControlScreen
          game={launchedGame}
          status={status}
          players={activePlayers}
          allPlayers={menu.players}
          difficulty={selectedDifficulty.label}
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
            <strong>Equipo</strong>
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

          <section>
            <div className="micro difficulty-label">Dificultad</div>
            <div className="difficulty">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  className={`seg ${menu.difficulty === difficulty.id ? "active" : ""}`}
                  style={{ "--accent": difficulty.color, "--accent-rgb": hexToRGB(difficulty.color) } as CSSProperties}
                  type="button"
                  onClick={() => setMenu((current) => ({ ...current, difficulty: difficulty.id }))}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </section>

          <section className="roster" aria-label="Jugadores">
            {menu.players.length === 0 ? <div className="message">Añade un jugador o usa el inicio rápido.</div> : null}
            {menu.players.map((player, index) => (
              <article key={player.id} className={`player ${player.active ? "" : "off"}`} style={{ "--pc": player.color } as CSSProperties}>
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
            ))}
          </section>

          <section className="team-actions">
            <button className="btn" type="button" onClick={addPlayer} disabled={menu.players.length >= maxPlayers}>
              <PlusIcon />
              Añadir jugador
            </button>
            <button className="btn" type="button" onClick={() => launch("whack-a-mole")}>
              <BoltIcon />
              Inicio rápido
            </button>
          </section>

          <button className="btn primary drawer-done" type="button" onClick={() => setTeamOpen(false)}>
            <CheckIcon />
            Listo
          </button>
        </aside>

        <section className="main-panel">
          <nav className="category-tabs" aria-label="Categorías de juegos">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`tab ${menu.category === category.id ? "active" : ""}`}
                style={{ "--tc": category.color } as CSSProperties}
                type="button"
                onClick={() => {
                  const first = games.find((game) => game.category === category.id);
                  setMenu((current) => ({ ...current, category: category.id, selectedGame: first?.id || current.selectedGame }));
                }}
              >
                {category.label}
              </button>
            ))}
          </nav>

          <section
            key={menu.category}
            ref={gamesScrollRef}
            className={`games game-carousel ${visibleGames.length === 1 ? "single" : ""}`}
            aria-label="Juegos"
            onPointerDown={beginGamesDrag}
            onPointerMove={moveGamesDrag}
            onPointerUp={endGamesDrag}
            onPointerCancel={endGamesDrag}
          >
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
                >
                  <Preview animationID={previewAnimationID(game)} />
                  <div className="game-body">
                    <h3>{game.label}</h3>
                    <p>{game.description}</p>
                    <div className="tags">
                      <span className="tag accent">{game.players === "Todos" ? "Todos los jugadores" : `${game.players} jugadores`}</span>
                      <span className="tag">{game.difficulty}</span>
                      {selected ? <span className="tag selected">Seleccionado</span> : null}
                      {future ? <span className="tag soon">Próximamente</span> : null}
                      {!future && !engineAvailable ? <span className="tag soon">{error ? "Sin conexión" : "No disponible"}</span> : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          <section className="panel launch-bar" aria-label="Resumen de inicio">
            <div className="launch-copy">
              {activePlayers.length
                ? activePlayers.slice(0, 6).map((player) => (
                    <span key={player.id} className="player-pill" style={{ "--pc": player.color } as CSSProperties}>
                      <span />
                      <span>{playerLabel(menu.players, player)}</span>
                    </span>
                  ))
                : <span className="message">Sin jugadores activos</span>}
              <span className={`message ${error ? "error" : ""}`}>
                {error || message || (isAmbientCard(selectedGame) ? `${selectedGame.label} · Ambiente` : `${selectedGame.label} · ${activePlayers.length || 1} ${activePlayers.length === 1 ? "jugador" : "jugadores"} · ${selectedDifficulty.label}`)}
              </span>
            </div>
            {(() => {
              const engineAvailable = availableGames.has(engineGameID(selectedGame));
              const blocked = selectedGame.disabled || !engineAvailable;
              const blockedLabel = selectedGame.disabled ? "Próximamente" : error ? "Sin conexión" : "No disponible";
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

function ColorPicker({ player, onPick, onClose }: { player: Player; onPick: (color: string) => void; onClose: () => void }) {
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
            return (
              <button
                key={color}
                className={`swatch ${selected ? "selected" : ""}`}
                style={{ "--pc": color } as CSSProperties}
                type="button"
                aria-label={playerColorNames[index]}
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
  difficulty,
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
  difficulty: string;
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
          <Preview animationID={previewAnimationID(game)} />
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
            <span>{ambient ? "Ambiente" : difficulty}</span>
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
        {keyboardRows.map((row) => (
          <div className="keyboard-row" key={row}>
            {row.split("").map((key) => (
              <button className="key" key={key} type="button" onClick={() => onType(key)}>
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
