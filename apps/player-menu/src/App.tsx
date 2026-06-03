import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { fetchEngineStatus, selectGame, type EngineStatus } from "./api";
import { categories, colors, difficulties, games, nameHints, playerColors, type CategoryID, type DifficultyID } from "./catalog";
import { BenchIcon, CategoryIcon, CheckIcon, CloseIcon, GameIcon, LogoIcon, UsersIcon } from "./icons";
import { hexToRGB, initials, mix } from "./utils";

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
};

type KeyboardTarget = { kind: "team" } | { kind: "player"; id: number };

const storageKey = "ml-player-menu-state-v1";
const keyboardRows = ["1234567890", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function loadMenuState(): MenuState {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<MenuState> | null;
    if (saved && typeof saved === "object") {
      return {
        teamName: "",
        players: [],
        category: "featured",
        selectedGame: "whack-a-mole",
        difficulty: "easy",
        nextPlayerId: 0,
        ...saved,
      };
    }
  } catch {
    // Ignore broken local storage and return the default kiosk state.
  }
  return {
    teamName: "",
    players: [
      { id: 1, name: "Red", color: playerColors[0], active: true },
      { id: 2, name: "Blue", color: playerColors[5], active: true },
    ],
    category: "featured",
    selectedGame: "whack-a-mole",
    difficulty: "easy",
    nextPlayerId: 2,
  };
}

export default function App() {
  const [menu, setMenu] = useState<MenuState>(() => loadMenuState());
  const [status, setStatus] = useState<EngineStatus | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [keyboardTarget, setKeyboardTarget] = useState<KeyboardTarget | null>(null);

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
        if (!cancelled) setError(err instanceof Error ? err.message : "Game engine offline");
      }
    }
    refresh();
    const id = window.setInterval(refresh, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const availableGames = useMemo(() => new Set((status?.catalog || []).map((entry) => entry.game)), [status]);
  const activePlayers = menu.players.filter((player) => player.active);
  const activeCategory = categories.find((category) => category.id === menu.category) || categories[0];
  const selectedGame = games.find((game) => game.id === menu.selectedGame) || games[0];
  const visibleGames = games.filter((game) => game.category === menu.category);
  const selectedDifficulty = difficulties.find((difficulty) => difficulty.id === menu.difficulty) || difficulties[0];

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", activeCategory.color);
    document.documentElement.style.setProperty("--accent-rgb", hexToRGB(activeCategory.color));
  }, [activeCategory.color]);

  function addPlayer() {
    setMenu((current) => {
      if (current.players.length >= 6) return current;
      const index = current.players.length;
      return {
        ...current,
        players: [
          ...current.players,
          {
            id: current.nextPlayerId + 1,
            name: nameHints[index % nameHints.length],
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
      players: [{ id: current.nextPlayerId + 1, name: "Red", color: playerColors[0], active: true }],
      nextPlayerId: current.nextPlayerId + 1,
    };
  }

  function updatePlayer(id: number, patch: Partial<Player>) {
    setMenu((current) => ({
      ...current,
      players: current.players.map((player) => (player.id === id ? { ...player, ...patch } : player)),
    }));
  }

  function keyboardValue() {
    if (!keyboardTarget) return "";
    if (keyboardTarget.kind === "team") return menu.teamName;
    return menu.players.find((player) => player.id === keyboardTarget.id)?.name || "";
  }

  function keyboardTitle() {
    if (!keyboardTarget) return "";
    if (keyboardTarget.kind === "team") return "Team name";
    const player = menu.players.find((candidate) => candidate.id === keyboardTarget.id);
    return player ? `Player ${menu.players.indexOf(player) + 1}` : "Player";
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

  function cycleColor(id: number) {
    setMenu((current) => ({
      ...current,
      players: current.players.map((player) => {
        if (player.id !== id) return player;
        const index = playerColors.indexOf(player.color);
        return { ...player, color: playerColors[(index + 1) % playerColors.length] };
      }),
    }));
  }

  async function launch(gameID = selectedGame.id) {
    const game = games.find((candidate) => candidate.id === gameID);
    if (!game || game.disabled || !availableGames.has(game.id)) return;
    const nextMenu = ensurePlayers({ ...menu, selectedGame: game.id });
    setMenu(nextMenu);
    setMessage("Starting");
    setError("");
    try {
      const nextStatus = await selectGame({ game: game.id, playerCount: Math.max(1, nextMenu.players.filter((player) => player.active).length) });
      setStatus(nextStatus);
      setMessage("Running");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start game");
    }
  }

  return (
    <main className={`app ${keyboardTarget ? "keyboard-open" : ""}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <LogoIcon />
          </div>
          <div className="brand-copy">
            <b>Motion Levels</b>
            <span>Player kiosk</span>
          </div>
        </div>
        <div className="title-stack">
          <div className="eyebrow">{activeCategory.label}</div>
          <h1>{activeCategory.title}</h1>
        </div>
        <div className="status-capsules">
          <div className="capsule">
            <span className={`live-dot ${status && !error ? "on" : ""}`} />
            <strong>{error ? "Offline" : "Connected"}</strong>
          </div>
          <button className="capsule" type="button" onClick={() => window.open(`${window.location.protocol}//${window.location.hostname}:8081/live`, "_blank", "noreferrer")}>
            <strong>Open Floor</strong>
          </button>
        </div>
      </header>

      <section className="layout">
        <aside className="panel team-panel" aria-label="Team setup">
          <section className="team-name">
            <div className="micro">Team</div>
            <input
              value={menu.teamName}
              maxLength={20}
              autoComplete="off"
              spellCheck={false}
              placeholder="Team name"
              inputMode="none"
              onFocus={() => setKeyboardTarget({ kind: "team" })}
              onClick={() => setKeyboardTarget({ kind: "team" })}
              onChange={(event) => setMenu((current) => ({ ...current, teamName: event.target.value }))}
            />
          </section>

          <section>
            <div className="micro difficulty-label">Difficulty</div>
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

          <section className="roster" aria-label="Players">
            {menu.players.length === 0 ? <div className="message">Add a player or use quick start.</div> : null}
            {menu.players.map((player) => (
              <article key={player.id} className={`player ${player.active ? "" : "off"}`} style={{ "--pc": player.color } as CSSProperties}>
                <button className="avatar" type="button" onClick={() => cycleColor(player.id)} aria-label={`Change ${player.name} color`}>
                  {initials(player.name)}
                </button>
                <input
                  value={player.name}
                  maxLength={12}
                  aria-label="Player name"
                  autoComplete="off"
                  spellCheck={false}
                  inputMode="none"
                  placeholder="Player"
                  onFocus={() => setKeyboardTarget({ kind: "player", id: player.id })}
                  onClick={() => setKeyboardTarget({ kind: "player", id: player.id })}
                  onChange={(event) => updatePlayer(player.id, { name: event.target.value })}
                />
                <div className="player-actions">
                  <button className="icon-button" type="button" title={player.active ? "Bench" : "Activate"} onClick={() => updatePlayer(player.id, { active: !player.active })}>
                    {player.active ? <CheckIcon /> : <BenchIcon />}
                  </button>
                  <button className="icon-button" type="button" title="Remove" onClick={() => setMenu((current) => ({ ...current, players: current.players.filter((candidate) => candidate.id !== player.id) }))}>
                    <CloseIcon />
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="team-actions">
            <button className="btn" type="button" onClick={addPlayer}>
              Add
            </button>
            <button className="btn" type="button" onClick={() => launch("whack-a-mole")}>
              Quick
            </button>
          </section>
        </aside>

        <section className="main-panel">
          <nav className="category-tabs" aria-label="Game categories">
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
                <CategoryIcon id={category.id} />
                {category.label}
              </button>
            ))}
          </nav>

          <section className={`games ${visibleGames.length === 1 ? "single" : ""}`} aria-label="Games">
            {visibleGames.map((game) => {
              const playable = availableGames.has(game.id) && !game.disabled;
              const active = status?.currentGame === game.id;
              return (
                <button
                  key={game.id}
                  className={`card game-card ${playable ? "" : "disabled"} ${active ? "active" : ""}`}
                  style={{ "--c": game.color, "--crgb": hexToRGB(game.color) } as CSSProperties}
                  type="button"
                  disabled={!playable}
                  onClick={() => setMenu((current) => ({ ...current, selectedGame: game.id }))}
                >
                  <Preview gameID={game.id} color={game.color} />
                  <div className="game-body">
                    <h3>{game.label}</h3>
                    <p>{game.description}</p>
                    <div className="tags">
                      <span className="tag accent">
                        <UsersIcon />
                        {game.players}
                      </span>
                      <span className="tag">{game.difficulty}</span>
                      {!playable ? <span className="tag">Coming soon</span> : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          <section className="panel launch-bar" aria-label="Launch summary">
            <div className="launch-copy">
              {activePlayers.length
                ? activePlayers.slice(0, 6).map((player) => (
                    <span key={player.id} className="player-pill" style={{ "--pc": player.color } as CSSProperties}>
                      <span />
                      <span>{player.name}</span>
                    </span>
                  ))
                : <span className="message">No active players</span>}
              <span className={`message ${error ? "error" : ""}`}>{error || message || `${selectedGame.label} · ${activePlayers.length || 1} player${activePlayers.length === 1 ? "" : "s"} · ${selectedDifficulty.label}`}</span>
            </div>
            <button className="btn primary" type="button" disabled={selectedGame.disabled || !availableGames.has(selectedGame.id)} onClick={() => launch()}>
              {selectedGame.disabled || !availableGames.has(selectedGame.id) ? "Coming Soon" : "Start"}
            </button>
          </section>
        </section>
      </section>

      {keyboardTarget ? (
        <TouchKeyboard
          title={keyboardTitle()}
          value={keyboardValue()}
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

function TouchKeyboard({
  title,
  value,
  onType,
  onBackspace,
  onClear,
  onSpace,
  onDone,
}: {
  title: string;
  value: string;
  onType: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpace: () => void;
  onDone: () => void;
}) {
  return (
    <section className="touch-keyboard" aria-label="Touch keyboard" onMouseDown={(event) => event.preventDefault()}>
      <div className="keyboard-head">
        <div>
          <span className="micro">{title}</span>
          <strong>{value || "Tap keys below"}</strong>
        </div>
        <button className="key done" type="button" onClick={onDone}>
          Done
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
          <button className="key utility" type="button" onClick={onClear}>
            Clear
          </button>
          <button className="key space" type="button" onClick={onSpace}>
            Space
          </button>
          <button className="key utility" type="button" onClick={onBackspace}>
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}

function Preview({ gameID, color }: { gameID: string; color: string }) {
  const cells = [];
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 16; x++) {
      const pulse = 0.32 + 0.34 * Math.sin((x * 0.7 + y * 0.32 + gameID.length) * 0.9);
      cells.push(<span key={`${x}-${y}`} style={{ background: mix("#06101a", color, Math.max(0.05, pulse)) }} />);
    }
  }
  const iconName = games.find((game) => game.id === gameID)?.icon || "loop";
  return (
    <div className="preview">
      <div className="preview-grid">{cells}</div>
      <span className="glyph">
        <GameIcon name={iconName} />
      </span>
    </div>
  );
}
