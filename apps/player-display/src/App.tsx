import { type ReactNode, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { displayEventSource, fetchDisplayStatus, type DisplayStatus } from "./api";
import { colorCSS, colorRGB, difficultyLabelES, eventMessageES, formatClock, gameTitleES, phaseLabel, playerLabelES } from "./utils";

const emptyStatus: DisplayStatus = {
  currentGame: "salvapantallas",
  label: "Motion Levels",
  phase: "idle",
  difficulty: "easy",
  playerCount: 1,
  playerConfigurable: false,
  players: [],
  score: 0,
  lives: -1,
  startedUnix: 0,
  endsUnix: 0,
  elapsedMillis: 0,
  remainingMillis: 0,
  introRemainingMillis: 0,
  countdownRemainingMillis: 0,
  activeTargets: 0,
  audioEnabled: false,
  audioMuted: false,
  lastEventUnixNanos: 0,
  lastEventCue: "",
  lastEventMessage: "",
};

function isTeamScoreGame(currentGame: string): boolean {
  return currentGame === "lava" || currentGame === "plataformas" || currentGame === "temporada1";
}

export default function App() {
  const options = useMemo(() => displayOptions(), []);
  const demoStatus = useMemo(() => demoDisplayStatus(options.demo), [options.demo]);
  const [status, setStatus] = useState<DisplayStatus>(emptyStatus);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (demoStatus) return;

    let cancelled = false;
    fetchDisplayStatus()
      .then((next) => {
        if (cancelled) return;
        setStatus(next);
        setConnected(true);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setConnected(false);
        setError(err instanceof Error ? err.message : "Sin conexión con el motor");
      });

    const source = displayEventSource();
    source.addEventListener("display", (event) => {
      setStatus(JSON.parse((event as MessageEvent).data) as DisplayStatus);
      setConnected(true);
      setError("");
    });
    source.onerror = () => {
      setConnected(false);
      setError("Sin conexión con el motor");
    };
    return () => {
      cancelled = true;
      source.close();
    };
  }, [demoStatus]);

  const liveStatus = demoStatus || status;
  const liveConnected = demoStatus ? true : connected;
  const liveError = demoStatus ? "" : error;

  if (isScreensaverDisplay(liveStatus)) {
    return <ScreensaverDisplay />;
  }

  if (options.hud === "classic") {
    return <ClassicDisplay status={liveStatus} connected={liveConnected} error={liveError} />;
  }

  return <ArcadeDisplay status={liveStatus} connected={liveConnected} error={liveError} />;
}

function ScreensaverDisplay() {
  return (
    <main className="display screensaver-display" aria-label="Motion Levels">
      <div className="screensaver-logo" aria-hidden="true" />
    </main>
  );
}

function ClassicDisplay({ status, connected, error }: DisplayProps) {
  const teamScoreGame = isTeamScoreGame(status.currentGame);
  const leader = useMemo(() => {
    if (teamScoreGame) return null;
    if (!status.players.length) return null;
    return [...status.players].sort((left, right) => right.score - left.score)[0];
  }, [status.players, teamScoreGame]);

  const lifeLoss = status.lastEventCue === "miss" && status.currentGame === "lava";
  const eventClass = status.lastEventCue ? `event-${status.lastEventCue}${lifeLoss ? " event-life-loss" : ""}` : "";
  const clock =
    status.phase === "intro"
      ? formatClock(status.introRemainingMillis)
      : status.phase === "countdown"
        ? formatClock(status.countdownRemainingMillis)
        : status.remainingMillis > 0
          ? formatClock(status.remainingMillis)
          : status.phase === "finished"
            ? "0:00"
            : formatClock(status.elapsedMillis);

  return (
    <main className={`display ${status.phase} ${eventClass}`}>
      <header className="display-top">
        <div className="brand">
          <span className="display-brand-mark" aria-hidden="true" />
          <strong>Motion Levels</strong>
          <span className={`live-dot ${connected ? "on" : ""}`} aria-label={connected ? "En directo" : "Sin conexión"} />
        </div>
        <div className="game-title">
          <span>{phaseLabel(status.phase)}</span>
          <h1>{gameTitleES(status.currentGame, status.label)}</h1>
        </div>
        <div className="connection">
          <strong>{connected ? "En directo" : "Sin conexión"}</strong>
          <span>{error || (!status.audioEnabled ? "Audio no disponible" : status.audioMuted ? "Audio silenciado" : "Audio listo")}</span>
        </div>
      </header>

      <section className="hero-stats">
        <article className="stat clock">
          <span>Tiempo</span>
          <strong>{clock}</strong>
        </article>
        <article className="stat total-score">
          <span>Puntos</span>
          <strong>{status.score}</strong>
        </article>
        <article className="stat lives">
          <span>Vidas</span>
          <strong>{status.lives < 0 ? "∞" : status.lives}</strong>
        </article>
      </section>

      <section className={`player-grid ${teamScoreGame ? "team-score" : ""} count-${Math.min(Math.max(status.players.length, 1), 3)}`} aria-label={teamScoreGame ? "Equipo" : "Jugadores"}>
        {teamScoreGame && status.players.length ? (
          <article className="team-card">
            <div className="team-card-head">
              <span>Equipo</span>
              <strong>{status.players.length} {status.players.length === 1 ? "jugador" : "jugadores"}</strong>
            </div>
            <div className="team-roster">
              {status.players.map((player) => (
                <span className="team-player" key={player.index} style={{ "--player": colorCSS(player.color), "--player-rgb": colorRGB(player.color) } as CSSProperties}>
                  <i />
                  {playerLabelES(player.label)}
                </span>
              ))}
            </div>
          </article>
        ) : status.players.length ? (
          status.players.map((player) => (
            <article
              className={`player-card ${leader?.index === player.index ? "leader" : ""}`}
              key={player.index}
              style={{ "--player": colorCSS(player.color), "--player-rgb": colorRGB(player.color) } as CSSProperties}
            >
              <div className="player-name">
                <span>{playerLabelES(player.label)}</span>
                {leader?.index === player.index ? <b>Líder</b> : null}
              </div>
              <strong>{player.score}</strong>
              <small>{player.lives < 0 ? "Vidas ilimitadas" : `${player.lives} ${player.lives === 1 ? "vida" : "vidas"}`}</small>
            </article>
          ))
        ) : (
          <article className="empty-player">
            <span>Esperando datos del juego</span>
          </article>
        )}
      </section>

      <footer className="display-bottom">
        <div className="mini-stat">
          <span>Objetivos</span>
          <strong>{status.activeTargets}</strong>
        </div>
        <div className={`event-strip ${status.lastEventCue ? "active" : ""}`}>
          <span>{eventMessageES(status.lastEventCue, status.lastEventMessage)}</span>
        </div>
        <div className="mini-stat">
          <span>Dificultad</span>
          <strong>{difficultyLabelES(status.difficulty)}</strong>
        </div>
      </footer>
    </main>
  );
}

function ArcadeDisplay({ status, connected, error }: DisplayProps) {
  const teamScoreGame = isTeamScoreGame(status.currentGame);
  const duelGame = status.currentGame === "duel" && status.players.length >= 2;
  const parkourGame = isParkourGame(status.currentGame);
  const levelPointsGame = isLevelPointsGame(status);
  const parkourStyleGame = parkourGame || levelPointsGame;
  const leader = useMemo(() => {
    if (teamScoreGame || duelGame || !status.players.length) return null;
    return [...status.players].sort((left, right) => right.score - left.score)[0];
  }, [duelGame, status.players, teamScoreGame]);
  const lifeLoss = status.lastEventCue === "miss" && status.currentGame === "lava";
  const eventClass = status.lastEventCue ? `event-${status.lastEventCue}${lifeLoss ? " event-life-loss" : ""}` : "";
  const clock = displayClock(status);
  const eventMessage = eventMessageES(status.lastEventCue, status.lastEventMessage);
  const mainMetric = primaryMetric(status);
  const sideMetrics = arcadeSideMetrics(status);
  const levelLabel = displayLevelLabel(status);
  const showPlayerInfo = shouldShowPlayerInfo(status);
  const showFooterEvent = Boolean(eventMessage);

  return (
    <main className={`display arcade-display ${duelGame ? "duel-game" : ""} ${parkourStyleGame ? "parkour-display" : ""} ${levelPointsGame ? "level-points-display" : ""} ${!duelGame && !showPlayerInfo ? "no-player-info" : ""} ${showFooterEvent ? "has-event" : ""} ${status.phase} ${eventClass}`}>
      <header className="arcade-top">
        <div className="arcade-brand-panel">
          <span className="arcade-brand" aria-label="Motion Levels">
            <span className="arcade-brand-mark" aria-hidden="true" />
            <span className="arcade-brand-name" aria-hidden="true">
              <b>Motion</b>
              <b>Levels</b>
            </span>
          </span>
        </div>
        <div className="arcade-title">
          <span>{levelLabel ? `${phaseLabel(status.phase)} · ${levelLabel}` : phaseLabel(status.phase)}</span>
          <h1>{gameTitleES(status.currentGame, status.label)}</h1>
        </div>
        {error && !connected ? <div className="arcade-system"><strong>OFF</strong><small>{error}</small></div> : null}
      </header>

      {duelGame ? (
        <DuelBoard status={status} clock={clock} />
      ) : parkourStyleGame ? (
        <section className="arcade-stage arcade-stage--level-hud">
          <div className="arcade-level-grid" aria-label="Marcadores de ronda">
            <MetricPanel
              className="arcade-metric--lives"
              label="Vidas"
              value={<HeartMeter lives={status.lives} showAllUpTo={20} />}
              tone="red"
            />
            <MetricPanel className="arcade-metric--time" label={mainMetric.caption === "Restante" ? "Tiempo restante" : "Tiempo transcurrido"} value={clock} tone="amber" />
            {sideMetrics.map((metric) => (
              <MetricPanel key={metric.label} label={metric.label} value={metric.value} tone={metric.tone} stars={metric.stars} />
            ))}
          </div>
        </section>
      ) : (
        <section className={`arcade-stage ${teamScoreGame ? "team-score" : ""}`}>
          <article className="arcade-primary">
            <div className="arcade-ribbon">{mainMetric.label}</div>
            <strong>{mainMetric.value}</strong>
            <span>{mainMetric.caption}</span>
          </article>

          <aside className="arcade-side" aria-label="Marcadores de ronda">
            {sideMetrics.map((metric) => (
              <MetricPanel key={metric.label} label={metric.label} value={metric.value} tone={metric.tone} />
            ))}
          </aside>
        </section>
      )}

      {!duelGame && showPlayerInfo ? (
        <section
          className={`arcade-players ${teamScoreGame ? "team-score" : ""} count-${Math.min(Math.max(status.players.length, 1), 8)}`}
          aria-label={teamScoreGame ? "Equipo" : "Jugadores"}
        >
          {teamScoreGame && status.players.length ? (
            <article className="arcade-team-card">
              <div>
                <span>Equipo</span>
                <strong>{status.players.length} {status.players.length === 1 ? "jugador" : "jugadores"}</strong>
              </div>
              <div className="arcade-roster">
                {status.players.map((player) => (
                  <PlayerChip player={player} key={player.index} />
                ))}
              </div>
            </article>
          ) : status.players.length ? (
            status.players.map((player) => <ArcadePlayerCard key={player.index} player={player} leader={leader?.index === player.index} compact={parkourStyleGame} />)
          ) : (
            <article className="arcade-empty">Esperando datos del juego</article>
          )}
        </section>
      ) : null}

      {showFooterEvent ? <footer className="arcade-bottom">
        <div className={`arcade-event ${status.lastEventCue ? "active" : ""}`}>
          <span>{eventMessage}</span>
        </div>
      </footer> : null}
    </main>
  );
}

function DuelBoard({ status, clock }: { status: DisplayStatus; clock: string }) {
  const left = status.players[0];
  const right = status.players[1];
  return (
    <section className="duel-board" aria-label="Marcador de duelo">
      <DuelSide player={left} side="left" />
      <div className="duel-center">
        <span>Countdown</span>
        <strong>{clock}</strong>
        <b>VS</b>
      </div>
      <DuelSide player={right} side="right" />
    </section>
  );
}

function DuelSide({ player, side }: { player: DisplayStatus["players"][number]; side: "left" | "right" }) {
  return (
    <article className={`duel-side ${side}`} style={{ "--player": colorCSS(player.color), "--player-rgb": colorRGB(player.color) } as CSSProperties}>
      <div>
        <i />
        <span>{playerLabelES(player.label)}</span>
      </div>
      <strong>{player.score}</strong>
    </article>
  );
}

function ArcadePlayerCard({ player, leader, compact = false }: { player: DisplayStatus["players"][number]; leader: boolean; compact?: boolean }) {
  return (
    <article className={`arcade-player-card ${leader ? "leader" : ""} ${compact ? "compact" : ""}`} style={{ "--player": colorCSS(player.color), "--player-rgb": colorRGB(player.color) } as CSSProperties}>
      <div className="arcade-player-name">
        <i />
        <span>{playerLabelES(player.label)}</span>
        {leader ? <b>Líder</b> : null}
      </div>
      <strong>{player.score}</strong>
    </article>
  );
}

function PlayerChip({ player }: { player: DisplayStatus["players"][number] }) {
  return (
    <span className="arcade-player-chip" style={{ "--player": colorCSS(player.color), "--player-rgb": colorRGB(player.color) } as CSSProperties}>
      <i />
      {playerLabelES(player.label)}
    </span>
  );
}

function MetricPanel({
  label,
  value,
  tone,
  stars,
  className = "",
}: {
  label: string;
  value: ReactNode;
  tone: "magenta" | "cyan" | "amber" | "red";
  stars?: number;
  className?: string;
}) {
  return (
    <article className={`arcade-metric ${tone} ${className}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {stars ? <DifficultyStars count={stars} /> : null}
    </article>
  );
}

function DifficultyStars({ count }: { count: number }) {
  const active = Math.max(0, Math.min(4, count));
  return (
    <div className="difficulty-stars" aria-label={`${active} de 4 estrellas`}>
      {Array.from({ length: 4 }, (_, index) => (
        <span className={index < active ? "active" : ""} key={index}>★</span>
      ))}
    </div>
  );
}

function HeartMeter({ lives, compact = false, showAllUpTo = 8 }: { lives: number; compact?: boolean; showAllUpTo?: number }) {
  if (lives < 0) {
    return <div className={`heart-meter ${compact ? "compact" : ""} infinite`}><b>∞</b></div>;
  }
  if (lives > showAllUpTo) {
    return (
      <div className={`heart-meter ${compact ? "compact" : ""} many`}>
        {Array.from({ length: compact ? 3 : 5 }, (_, index) => <span className="heart filled" key={index} />)}
        <b>x{lives}</b>
      </div>
    );
  }
  const slots = Math.max(compact ? Math.min(5, Math.max(lives, 3)) : 5, lives);
  return (
    <div className={`heart-meter ${compact ? "compact" : ""}`}>
      {Array.from({ length: slots }, (_, index) => (
        <span className={`heart ${index < lives ? "filled" : ""}`} key={index} />
      ))}
    </div>
  );
}

function displayClock(status: DisplayStatus): string {
  if (status.phase === "intro") return formatClock(status.introRemainingMillis);
  if (status.phase === "countdown") return formatClock(status.countdownRemainingMillis);
  if (status.remainingMillis > 0) return formatClock(status.remainingMillis);
  if (status.phase === "finished") return "0:00";
  return formatClock(status.elapsedMillis);
}

function isParkourGame(currentGame: string): boolean {
  return currentGame === "parkour" || currentGame === "parkour2";
}

function isScreensaverDisplay(status: Pick<DisplayStatus, "currentGame" | "label">): boolean {
  const currentGame = normalizedDisplayText(status.currentGame);
  return currentGame === "salvapantallas" || currentGame === "screensaver";
}

function normalizedDisplayText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function isTemporadaOneGame(status: Pick<DisplayStatus, "currentGame" | "label">): boolean {
  const currentGame = normalizedDisplayText(status.currentGame);
  const label = normalizedDisplayText(status.label);
  return currentGame === "temporada1" || currentGame === "temporada1-niveles" || label.includes("temporada 1") || label.includes("temporada1");
}

function isLevelPointsGame(status: Pick<DisplayStatus, "currentGame" | "label">): boolean {
  return isTemporadaOneGame(status);
}

function isFixedSoloDisplayGame(currentGame: string): boolean {
  return currentGame === "parkour" || currentGame === "parkour2" || currentGame === "saltos" || currentGame === "temporada1" || currentGame === "temporada1-niveles";
}

function shouldShowPlayerInfo(status: DisplayStatus): boolean {
  if (isLevelPointsGame(status)) return false;
  if (isFixedSoloDisplayGame(status.currentGame)) return false;
  if (status.playerConfigurable === false) return false;
  return status.players.length > 0 || status.playerConfigurable === true;
}

function displayLevelLabel(status: DisplayStatus): string {
  if (status.levelNumber && status.levelNumber > 0) return `Nivel ${status.levelNumber}`;
  const level = String(status.level || "").trim();
  const match = level.match(/^level-(\d+)$/i);
  if (match) return `Nivel ${match[1]}`;
  return level;
}

function primaryMetric(status: DisplayStatus): { label: string; value: string; caption: string } {
  if (status.phase === "countdown") {
    return { label: "Countdown", value: displayClock(status), caption: "Preparados" };
  }
  if (isParkourGame(status.currentGame)) {
    return { label: "Tiempo", value: displayClock(status), caption: status.remainingMillis > 0 ? "Restante" : "Transcurrido" };
  }
  if (isLevelPointsGame(status)) {
    return { label: "Tiempo", value: displayClock(status), caption: status.remainingMillis > 0 ? "Restante" : "Transcurrido" };
  }
  if (status.currentGame === "whack-a-mole" || status.currentGame === "temporada2") {
    return { label: "Puntos", value: String(status.score), caption: "Marcador actual" };
  }
  if (status.activeTargets > 0 && (status.currentGame === "lava" || status.currentGame === "plataformas" || status.currentGame === "temporada1")) {
    return { label: "Objetivos", value: String(status.activeTargets), caption: "Restantes" };
  }
  return { label: "Tiempo", value: displayClock(status), caption: status.remainingMillis > 0 ? "Restante" : "Transcurrido" };
}

function arcadeSideMetrics(status: DisplayStatus): Array<{ label: string; value: string; tone: "magenta" | "cyan" | "amber"; stars?: number }> {
  if (isParkourGame(status.currentGame)) {
    return [
      { label: "Intentos", value: String(Math.max(1, status.attemptCount || 0)), tone: "magenta" },
      { label: "Mejor sesión", value: formatBestTime(status.sessionBestElapsedMillis), tone: "cyan" },
      { label: "Mejor global", value: formatBestTime(status.bestElapsedMillis), tone: "amber" },
    ];
  }
  if (isLevelPointsGame(status)) {
    return [
      { label: "Puntos", value: String(status.score), tone: "magenta" },
      { label: "Objetivos", value: String(Math.max(0, status.activeTargets || 0)), tone: "cyan" },
      { label: "Dificultad", value: difficultyLabelES(status.difficulty), tone: "amber", stars: difficultyStars(status.difficulty) },
      { label: "Intentos", value: String(Math.max(1, status.attemptCount || 0)), tone: "magenta" },
      { label: "Mejor sesión", value: formatBestTime(status.sessionBestElapsedMillis), tone: "cyan" },
      { label: "Mejor global", value: formatBestTime(status.bestElapsedMillis), tone: "amber" },
    ];
  }
  return [
    { label: "Puntos", value: String(status.score), tone: "magenta" },
    { label: "Objetivos", value: String(status.activeTargets), tone: "cyan" },
    { label: "Dificultad", value: difficultyLabelES(status.difficulty), tone: "amber", stars: difficultyStars(status.difficulty) },
  ];
}

function formatBestTime(milliseconds?: number): string {
  return milliseconds && milliseconds > 0 ? formatClock(milliseconds) : "-";
}

function difficultyStars(difficulty: string): number {
  const normalized = normalizedDisplayText(difficulty);
  if (normalized === "expert" || normalized === "experto") return 4;
  if (normalized === "hard" || normalized === "dificil") return 3;
  if (normalized === "medium" || normalized === "media") return 2;
  return 1;
}

type DisplayProps = {
  status: DisplayStatus;
  connected: boolean;
  error: string;
};

function displayOptions(): { hud: "arcade" | "classic"; demo: string } {
  if (typeof window === "undefined") return { hud: "arcade", demo: "" };
  const params = new URLSearchParams(window.location.search);
  return {
    hud: params.get("hud") === "classic" ? "classic" : "arcade",
    demo: params.get("demo") || "",
  };
}

function demoDisplayStatus(name: string): DisplayStatus | null {
  const base: DisplayStatus = {
    ...emptyStatus,
    currentGame: "temporada2",
    label: "Temporada 2",
    phase: "running",
    difficulty: "medium",
    playerCount: 4,
    playerConfigurable: true,
    players: [
      { index: 0, label: "Red", color: { r: 255, g: 41, b: 56 }, score: 42, lives: 4 },
      { index: 1, label: "Cyan", color: { r: 30, g: 213, b: 255 }, score: 35, lives: 3 },
      { index: 2, label: "Green", color: { r: 47, g: 216, b: 108 }, score: 30, lives: 5 },
      { index: 3, label: "Pink", color: { r: 247, g: 61, b: 255 }, score: 21, lives: 2 },
    ],
    score: 128,
    lives: 5,
    elapsedMillis: 143000,
    remainingMillis: 137000,
    activeTargets: 17,
    audioEnabled: true,
    lastEventCue: "hit",
    lastEventMessage: "Red +5",
  };

  switch (name) {
    case "screensaver":
      return {
        ...emptyStatus,
        currentGame: "salvapantallas",
        label: "Salvapantallas",
        phase: "ambient",
        playerCount: 0,
        playerConfigurable: false,
        players: [],
        lives: -1,
        audioEnabled: true,
      };
    case "countdown":
      return {
        ...base,
        currentGame: "parkour",
        label: "Parkour",
        phase: "countdown",
        score: 0,
        lives: 8,
        countdownRemainingMillis: 19000,
        remainingMillis: 0,
        activeTargets: 23,
        attemptCount: 2,
        sessionBestElapsedMillis: 38200,
        bestElapsedMillis: 36100,
        lastEventCue: "",
        lastEventMessage: "",
      };
    case "duel":
      return {
        ...base,
        currentGame: "duel",
        label: "Duelo",
        playerCount: 2,
        players: base.players.slice(0, 2).map((player, index) => ({ ...player, score: index === 0 ? 12 : 9, lives: index === 0 ? 3 : 4 })),
        score: 21,
        lives: -1,
        remainingMillis: 156000,
        activeTargets: 0,
        lastEventCue: "hit",
        lastEventMessage: "Cyan +1",
      };
    case "team":
      return {
        ...base,
        currentGame: "lava",
        label: "El suelo es lava",
        difficulty: "hard",
        score: 64,
        lives: 3,
        activeTargets: 6,
        lastEventCue: "miss",
        lastEventMessage: "Fallo",
      };
    case "temporada1":
      return {
        ...base,
        currentGame: "temporada1",
        label: "Temporada 1",
        difficulty: "medium",
        playerConfigurable: false,
        score: 12,
        lives: 7,
        elapsedMillis: 48600,
        remainingMillis: 0,
        activeTargets: 8,
        level: "level-4",
        levelNumber: 4,
        attemptCount: 3,
        failureCount: 1,
        sessionBestElapsedMillis: 51200,
        bestElapsedMillis: 46800,
        lastEventCue: "coin",
        lastEventMessage: "Temporada 1 punto 12",
      };
    case "temporada1-20lives":
      return {
        ...base,
        currentGame: "temporada1",
        label: "Temporada 1",
        difficulty: "hard",
        playerConfigurable: false,
        score: 12,
        lives: 20,
        elapsedMillis: 48600,
        remainingMillis: 0,
        activeTargets: 8,
        level: "level-4",
        levelNumber: 4,
        attemptCount: 3,
        failureCount: 1,
        sessionBestElapsedMillis: 51200,
        bestElapsedMillis: 46800,
        lastEventCue: "",
        lastEventMessage: "",
      };
    case "classic":
      return base;
    case "players":
      return base;
    default:
      return null;
  }
}
