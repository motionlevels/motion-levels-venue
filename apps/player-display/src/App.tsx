import { type ReactNode, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { displayEventSource, fetchDisplayStatus, type DisplayStatus } from "./api";
import { createCoalescer, isFeedStalled } from "./displayFeed";
import { challengeMode, heartMeterSlotCount, levelDisplayAttemptCount, levelDisplayLives, levelDisplayTimeLabel, levelDisplayTimeMillis } from "./displayMetrics";
import { colorCSS, colorRGB, difficultyLabelES, eventMessageES, formatClock, gameTitleES, levelLabelES, phaseLabel, playerLabelES } from "./utils";

// If no stream event arrives, keep the display fresh with a 250ms fallback
// poll. Some kiosk/browser combinations can silently lose EventSource delivery;
// do not let that degrade the TV into multi-second updates.
const FALLBACK_UPDATE_MS = 250;
const STALL_MS = 750;
const STREAM_RECONNECT_MS = 3000;

const emptyStatus: DisplayStatus = {
  currentGame: "salvapantallas",
  label: "Motion Levels",
  phase: "idle",
  difficulty: "easy",
  difficultyConfigurable: false,
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

function isTeamScoreGame(status: Pick<DisplayStatus, "currentGame" | "label" | "level" | "levelNumber" | "levelMode">): boolean {
  const currentGame = compactDisplayText(status.currentGame);
  return currentGame === "lava" || isLevelGame(status);
}

export default function App() {
  const options = useMemo(() => displayOptions(), []);
  const demoStatus = useMemo(() => demoDisplayStatus(options), [options]);
  const [status, setStatus] = useState<DisplayStatus>(emptyStatus);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (demoStatus) return;

    let cancelled = false;
    const monoNow = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
    let lastEventAt = monoNow();
    let lastReconnectAt = 0;
    let source: EventSource | null = null;

    // Render the freshest status at most once per frame so the high-frequency
    // (~20Hz) stream never backs up the render queue on the venue PC.
    const coalescer = createCoalescer<DisplayStatus>(
      {
        request: (callback) => requestAnimationFrame(callback),
        cancel: (handle) => cancelAnimationFrame(handle),
      },
      (next) => {
        if (!cancelled) setStatus(next);
      },
    );

    const accept = (next: DisplayStatus) => {
      if (cancelled) return;
      lastEventAt = monoNow();
      setConnected(true);
      setError("");
      coalescer.push(next);
    };

    const pollOnce = () => {
      fetchDisplayStatus()
        .then(accept)
        .catch((err) => {
          if (cancelled) return;
          setConnected(false);
          setError(err instanceof Error ? err.message : "Sin conexión con el motor");
        });
    };

    const onDisplay = (event: Event) => {
      try {
        accept(JSON.parse((event as MessageEvent).data) as DisplayStatus);
      } catch {
        /* ignore malformed frame */
      }
    };
    const onError = () => {
      if (cancelled) return;
      setConnected(false);
      setError("Sin conexión con el motor");
    };
    const closeSource = () => {
      if (!source) return;
      source.removeEventListener("display", onDisplay);
      source.close();
      source = null;
    };

    const attach = () => {
      closeSource();
      lastReconnectAt = monoNow();
      try {
        source = displayEventSource();
      } catch {
        setConnected(false);
        setError("Sin conexión con el motor");
        return;
      }
      source.addEventListener("display", onDisplay);
      source.onerror = onError;
    };
    attach();

    pollOnce();

    // Watchdog: if the stream goes quiet (silently dropped or never connected),
    // poll the engine at the target display cadence and occasionally rebuild
    // the stream. Polling is intentionally faster than reconnecting: it keeps
    // the TV current without thrashing EventSource on fragile kiosk browsers.
    const watchdog = window.setInterval(() => {
      if (cancelled || !isFeedStalled(lastEventAt, monoNow(), STALL_MS)) return;
      pollOnce();
      if (monoNow() - lastReconnectAt >= STREAM_RECONNECT_MS) attach();
    }, FALLBACK_UPDATE_MS);

    return () => {
      cancelled = true;
      coalescer.cancel();
      window.clearInterval(watchdog);
      closeSource();
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
  const teamScoreGame = isTeamScoreGame(status);
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
          <h1>{displayGameTitle(status)}</h1>
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
  const displayModel = createArcadeDisplayModel(status, connected, error);
  const { duelGame, levelGame, memoryGame, showFooterEvent, showPlayerInfo, teamRosterGame, teamScoreboardGame } = displayModel;
  const leader = useMemo(() => {
    if (teamRosterGame || duelGame || !status.players.length) return null;
    return [...status.players].sort((left, right) => right.score - left.score)[0];
  }, [duelGame, status.players, teamRosterGame]);
  const clock = displayClock(status);
  const eventMessage = eventMessageES(status.lastEventCue, status.lastEventMessage);
  const mainMetric = primaryMetric(status);
  const sideMetrics = arcadeSideMetrics(status);
  const levelSideMetrics = arcadeLevelSideMetrics(status);
  const levelTimeDetails = arcadeLevelTimeDetails(status);

  return (
    <ArcadeDisplayShell model={displayModel}>
      {duelGame ? (
        <DuelBoard status={status} clock={clock} />
      ) : memoryGame ? (
        <MemoryBoard status={status} clock={clock} />
      ) : levelGame ? (
        <section className="arcade-stage arcade-stage--level-hud">
          <div className="arcade-level-main" aria-label="Marcadores principales">
            <MetricPanel className="arcade-metric--lives" label="Vidas" value={<HeartMeter lives={levelDisplayLives(status)} showAllUpTo={20} />} tone="red" />
            <LevelTimeStatsPanel details={levelTimeDetails} />
          </div>
          <div className="arcade-level-side" aria-label="Marcadores de ronda">
            {levelSideMetrics.map((metric) => (
              <MetricPanel key={metric.label} label={metric.label} value={metric.value} tone={metric.tone} stars={metric.stars} icon={metricIcon(metric.label)} />
            ))}
          </div>
        </section>
      ) : (
        <section className={`arcade-stage ${teamRosterGame || teamScoreboardGame ? "team-score" : ""}`}>
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
          className={`arcade-players ${teamRosterGame || teamScoreboardGame ? "team-score" : ""} count-${Math.min(Math.max(status.players.length, 1), 8)}`}
          aria-label={teamRosterGame || teamScoreboardGame ? "Equipos" : "Jugadores"}
        >
          {teamRosterGame && status.players.length ? (
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
            status.players.map((player) => <ArcadePlayerCard key={player.index} player={player} leader={leader?.index === player.index} compact={levelGame} team={teamScoreboardGame} />)
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
    </ArcadeDisplayShell>
  );
}

type ArcadeDisplayModel = {
  duelGame: boolean;
  levelGame: boolean;
  memoryGame: boolean;
  rootClassName: string;
  showFooterEvent: boolean;
  showPlayerInfo: boolean;
  teamRosterGame: boolean;
  teamScoreboardGame: boolean;
  header: ArcadeHeaderModel;
};

type ArcadeHeaderModel = {
  connected: boolean;
  error: string;
  eyebrow: string;
  levelLabel: string;
  title: string;
};

function createArcadeDisplayModel(status: DisplayStatus, connected: boolean, error: string): ArcadeDisplayModel {
  const memoryGame = isMemoryGame(status);
  const teamRosterGame = isTeamScoreGame(status);
  const teamScoreboardGame = isTeamScoreboardGame(status);
  const duelGame = isDuelGame(status) && status.players.length >= 2;
  const levelGame = isLevelGame(status);
  const showPlayerInfo = shouldShowPlayerInfo(status);
  const eventMessage = eventMessageES(status.lastEventCue, status.lastEventMessage);
  const showFooterEvent = Boolean(eventMessage) && !levelGame && !memoryGame;
  const lifeLoss = status.lastEventCue === "miss" && status.currentGame === "lava";
  const eventClass = status.lastEventCue ? `event-${status.lastEventCue}${lifeLoss ? " event-life-loss" : ""}` : "";

  const rootClasses = [
    "display",
    "arcade-display",
    !levelGame && !memoryGame ? "reference-brand" : "",
    duelGame ? "duel-game" : "",
    memoryGame ? "memory-display" : "",
    levelGame ? "level-display level-points-display" : "",
    !duelGame && !showPlayerInfo ? "no-player-info" : "",
    showFooterEvent ? "has-event" : "",
    status.phase,
    eventClass,
  ];

  return {
    duelGame,
    levelGame,
    memoryGame,
    rootClassName: rootClasses.filter(Boolean).join(" "),
    showFooterEvent,
    showPlayerInfo,
    teamRosterGame,
    teamScoreboardGame,
    header: {
      connected,
      error,
      eyebrow: levelGame ? "Juego seleccionado" : phaseLabel(status.phase),
      levelLabel: displayLevelLabel(status),
      title: displayGameTitle(status),
    },
  };
}

function ArcadeDisplayShell({ model, children }: { model: ArcadeDisplayModel; children: ReactNode }) {
  return (
    <main className={model.rootClassName}>
      <ArcadeHeader model={model.header} />
      {children}
    </main>
  );
}

function ArcadeHeader({ model }: { model: ArcadeHeaderModel }) {
  return (
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
        <span>{model.eyebrow}</span>
        <h1>{model.title}</h1>
      </div>
      {model.levelLabel ? (
        <div className="arcade-level-badge">
          <span>Nivel actual</span>
          <strong>{model.levelLabel}</strong>
        </div>
      ) : model.error && !model.connected ? (
        <div className="arcade-system"><strong>OFF</strong><small>{model.error}</small></div>
      ) : (
        <div className="arcade-top-spacer" aria-hidden="true" />
      )}
    </header>
  );
}

function MemoryBoard({ status, clock }: { status: DisplayStatus; clock: string }) {
  const players = status.players.length ? status.players : [
    { index: 0, label: "Jugador 1", color: { r: 255, g: 41, b: 56 }, score: status.score, lives: status.lives },
  ];

  return (
    <section className="arcade-stage arcade-stage--memory-hud" aria-label="Marcador de memoria">
      <MetricPanel className="arcade-metric--time memory-time" label="Tiempo restante" value={clock} tone="amber" />
      <section className={`memory-scoreboard count-${Math.min(Math.max(players.length, 1), 8)}`} aria-label="Puntos por jugador">
        <div className="memory-scoreboard__header">
          <span>Puntos por jugador</span>
        </div>
        <div className="memory-scoreboard__grid">
          {players.map((player) => (
            <MemoryPlayerScore key={player.index} player={player} />
          ))}
        </div>
      </section>
    </section>
  );
}

function MemoryPlayerScore({ player }: { player: DisplayStatus["players"][number] }) {
  return (
    <article className="memory-player-score" style={{ "--player": colorCSS(player.color), "--player-rgb": colorRGB(player.color) } as CSSProperties}>
      <div className="memory-player-score__name">
        <i />
        <span>{playerLabelES(player.label)}</span>
      </div>
      <strong>{player.score}</strong>
    </article>
  );
}

function DuelBoard({ status, clock }: { status: DisplayStatus; clock: string }) {
  const left = status.players.filter((_, index) => index % 2 === 0);
  const right = status.players.filter((_, index) => index % 2 === 1);
  const clockCaption = status.phase === "countdown"
    ? "Cuenta atrás"
    : status.phase === "finished"
      ? "Final"
      : status.phase === "ready"
        ? "A sus puestos"
        : "Tiempo";
  return (
    <section className={`duel-board count-${Math.min(status.players.length, 8)}`} aria-label="Marcador de duelo">
      <div className="duel-column">
        {left.map((player) => <DuelSide key={player.index} player={player} side="left" />)}
      </div>
      <div className="duel-center">
        <span>{clockCaption}</span>
        <strong>{clock}</strong>
        <b>VS</b>
      </div>
      <div className="duel-column">
        {right.map((player) => <DuelSide key={player.index} player={player} side="right" />)}
      </div>
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

function ArcadePlayerCard({ player, leader, compact = false, team = false }: { player: DisplayStatus["players"][number]; leader: boolean; compact?: boolean; team?: boolean }) {
  const label = playerLabelES(player.label);
  return (
    <article className={`arcade-player-card ${leader ? "leader" : ""} ${compact ? "compact" : ""} ${team ? "team" : ""}`} style={{ "--player": colorCSS(player.color), "--player-rgb": colorRGB(player.color) } as CSSProperties}>
      <div className="arcade-player-name">
        <i />
        <span>{team ? `Equipo ${label}` : label}</span>
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
  children,
  className = "",
  icon = "",
}: {
  label: string;
  value: ReactNode;
  tone: "magenta" | "cyan" | "amber" | "red";
  stars?: number;
  children?: ReactNode;
  className?: string;
  icon?: "" | "points" | "targets" | "difficulty";
}) {
  return (
    <article className={`arcade-metric ${tone} ${icon ? "arcade-metric--with-icon" : ""} ${className}`}>
      {icon ? <i className={`arcade-metric-icon arcade-metric-icon--${icon}`} aria-hidden="true" /> : null}
      <span>{label}</span>
      <strong>{value}</strong>
      {stars ? <DifficultyStars count={stars} /> : null}
      {children}
    </article>
  );
}

function LevelTimeStatsPanel({ details }: { details: Array<{ label: string; value: string }> }) {
  return (
    <article className="arcade-metric amber arcade-metric--time arcade-metric--level-stats" aria-label="Tiempo e intentos">
      <div className="arcade-time-details">
        {details.slice(0, 2).map((detail) => (
          <span className={`arcade-time-detail arcade-time-detail--${timeDetailIcon(detail.label)}`} key={detail.label}>
            <i aria-hidden="true" />
            <small>{detail.label}</small>
            <b>{detail.value}</b>
          </span>
        ))}
      </div>
    </article>
  );
}

function metricIcon(label: string): "" | "points" | "targets" | "difficulty" {
  const normalized = normalizedDisplayText(label);
  if (normalized.includes("puntos")) return "points";
  if (normalized.includes("objetivos")) return "targets";
  if (normalized.includes("dificultad")) return "difficulty";
  return "";
}

function timeDetailIcon(label: string): "time" | "attempts" {
  return normalizedDisplayText(label).includes("intentos") ? "attempts" : "time";
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
      <div
        className={`heart-meter ${compact ? "compact" : ""} many`}
        style={{ "--heart-count": compact ? 3 : 5 } as CSSProperties}
      >
        {Array.from({ length: compact ? 3 : 5 }, (_, index) => <span className="heart filled" key={index} />)}
        <b>x{lives}</b>
      </div>
    );
  }
  const slots = heartMeterSlotCount(lives, compact);
  const sizeClass = slots <= 1 ? "single" : slots <= 4 ? "few" : slots <= 8 ? "medium" : "full";
  return (
    <div
      className={`heart-meter ${compact ? "compact" : ""} ${sizeClass}`}
      style={{ "--heart-count": Math.max(1, slots) } as CSSProperties}
    >
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

function isMemoryGame(status: Pick<DisplayStatus, "currentGame" | "label">): boolean {
  const currentGame = compactDisplayText(status.currentGame);
  const label = normalizedDisplayText(status.label);
  return (
    currentGame === "memory"
    || currentGame === "memorychallenge"
    || currentGame === "authoredmemorychallenge"
    || currentGame === "memorylights"
    || label.includes("reto de memoria")
    || label === "memoria"
  );
}

function isDuelGame(status: Pick<DisplayStatus, "currentGame" | "label">): boolean {
  const currentGame = compactDisplayText(status.currentGame);
  return currentGame === "duel" || currentGame === "authoredduel" || normalizedDisplayText(status.label) === "duelo";
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

function compactDisplayText(value: string): string {
  return normalizedDisplayText(value).replace(/[^a-z0-9]+/g, "");
}

function displayGameTitle(status: Pick<DisplayStatus, "currentGame" | "label">): string {
  return gameTitleES(status.currentGame, status.label);
}

function isTeamScoreboardGame(status: Pick<DisplayStatus, "currentGame" | "label">): boolean {
  const text = normalizedDisplayText(`${status.currentGame} ${status.label}`);
  return text.includes("tira") || text.includes("afloja") || text.includes("baldosas") || text.includes("tug");
}

function isLevelGame(status: Pick<DisplayStatus, "level" | "levelNumber" | "levelMode">): boolean {
  return Boolean(status.level || (status.levelNumber && status.levelNumber > 0) || status.levelMode);
}

function shouldShowPlayerInfo(status: DisplayStatus): boolean {
  if (isMemoryGame(status)) return false;
  if (isLevelGame(status)) return false;
  if (status.playerConfigurable === false) return false;
  return status.players.length > 0 || status.playerConfigurable === true;
}

function displayLevelLabel(status: DisplayStatus): string {
  if (status.levelNumber && status.levelNumber > 0) return `Nivel ${status.levelNumber}`;
  const level = String(status.level || "").trim();
  const levelLabel = levelLabelES(level);
  if (levelLabel) return levelLabel;
  const labelLevel = levelLabelES(status.label);
  if (labelLevel) return labelLevel;
  return level;
}

function primaryMetric(status: DisplayStatus): { label: string; value: string; caption: string } {
  if (status.phase === "countdown") {
    return { label: "Countdown", value: displayClock(status), caption: "Preparados" };
  }
  if (isLevelGame(status)) {
    return {
      label: "Tiempo",
      value: formatClock(levelDisplayTimeMillis(status)),
      caption: challengeMode(status) ? "Restante" : "Transcurrido",
    };
  }
  if (status.currentGame === "whack-a-mole") {
    return { label: "Puntos", value: String(status.score), caption: "Marcador actual" };
  }
  if (status.activeTargets > 0 && isTeamScoreGame(status)) {
    return { label: "Objetivos", value: String(status.activeTargets), caption: "Restantes" };
  }
  return { label: "Tiempo", value: displayClock(status), caption: status.remainingMillis > 0 ? "Restante" : "Transcurrido" };
}

function arcadeSideMetrics(status: DisplayStatus): Array<{ label: string; value: string; tone: "magenta" | "cyan" | "amber"; stars?: number }> {
  if (isLevelGame(status)) {
    return [
      { label: "Puntos", value: String(status.score), tone: "magenta" },
      { label: "Objetivos", value: String(Math.max(0, status.activeTargets || 0)), tone: "cyan" },
      { label: "Dificultad", value: difficultyLabelES(status.difficulty), tone: "amber", stars: difficultyStars(status.difficulty) },
      { label: "Intentos", value: String(Math.max(1, status.attemptCount || 0)), tone: "magenta" },
      { label: "Mejor sesión", value: formatBestTime(status.sessionBestElapsedMillis), tone: "cyan" },
      { label: "Mejor global", value: formatBestTime(status.bestElapsedMillis), tone: "amber" },
    ];
  }
  const metrics: Array<{ label: string; value: string; tone: "magenta" | "cyan" | "amber"; stars?: number }> = [
    { label: "Puntos", value: String(status.score), tone: "magenta" },
    { label: "Objetivos", value: String(status.activeTargets), tone: "cyan" },
  ];
  if (shouldShowDifficulty(status)) {
    metrics.push({ label: "Dificultad", value: difficultyLabelES(status.difficulty), tone: "amber", stars: difficultyStars(status.difficulty) });
  }
  return metrics;
}

function arcadeLevelSideMetrics(status: DisplayStatus): Array<{ label: string; value: string; tone: "magenta" | "cyan" | "amber"; stars?: number }> {
  if (isLevelGame(status)) {
    return [
      { label: "Puntos", value: String(status.score), tone: "magenta" },
      { label: "Objetivos", value: String(Math.max(0, status.activeTargets || 0)), tone: "cyan" },
      { label: "Dificultad", value: difficultyLabelES(status.difficulty), tone: "amber", stars: difficultyStars(status.difficulty) },
    ];
  }
  return arcadeSideMetrics(status);
}

function arcadeLevelTimeDetails(status: DisplayStatus): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];
  if (isLevelGame(status)) {
    details.push({ label: levelDisplayTimeLabel(status), value: formatClock(levelDisplayTimeMillis(status)) });
    details.push({ label: "Intentos", value: String(levelDisplayAttemptCount(status)) });
  }
  return details;
}

function formatBestTime(milliseconds?: number): string {
  return milliseconds && milliseconds > 0 ? formatClock(milliseconds) : "-";
}

function shouldShowDifficulty(status: DisplayStatus): boolean {
  return status.difficultyConfigurable !== false && Boolean(status.difficulty);
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

type DisplayOptions = {
  hud: "arcade" | "classic";
  demo: string;
  demoGame: string;
  demoLabel: string;
  demoPlayers?: number;
  demoLives?: number;
  demoDifficultyConfigurable?: boolean;
};

function displayOptions(): DisplayOptions {
  if (typeof window === "undefined") return { hud: "arcade", demo: "", demoGame: "", demoLabel: "" };
  const params = new URLSearchParams(window.location.search);
  const difficultyParam = params.get("difficultyConfigurable");
  const playersParam = Number(params.get("demoPlayers") || "");
  const rawLivesParam = params.get("demoLives");
  const livesParam = Number(rawLivesParam || "");
  return {
    hud: params.get("hud") === "classic" ? "classic" : "arcade",
    demo: params.get("demo") || "",
    demoGame: params.get("demoGame") || "",
    demoLabel: params.get("demoLabel") || "",
    demoPlayers: Number.isFinite(playersParam) && playersParam > 0 ? Math.floor(playersParam) : undefined,
    demoLives: rawLivesParam !== null && Number.isFinite(livesParam) && livesParam >= 0 ? Math.floor(livesParam) : undefined,
    demoDifficultyConfigurable: difficultyParam === null ? undefined : difficultyParam === "1" || difficultyParam === "true",
  };
}

function demoDisplayStatus(options: DisplayOptions): DisplayStatus | null {
  const name = options.demo;
  const base: DisplayStatus = {
    ...emptyStatus,
    currentGame: options.demoGame || "arcade-demo",
    label: options.demoLabel || "Arcade",
    phase: "running",
    difficulty: "medium",
    difficultyConfigurable: options.demoDifficultyConfigurable ?? true,
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
    sessionElapsedMillis: 143000,
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
        currentGame: options.demoGame || "countdown-demo",
        label: options.demoLabel || "Cuenta atrás",
        phase: "countdown",
        score: 0,
        lives: 8,
        sessionElapsedMillis: 214000,
        countdownRemainingMillis: 19000,
        remainingMillis: 0,
        activeTargets: 23,
        attemptCount: 2,
        sessionBestElapsedMillis: 38200,
        bestElapsedMillis: 36100,
        lastEventCue: "",
        lastEventMessage: "",
      };
    case "levels":
      return {
        ...base,
        currentGame: options.demoGame || "level-demo",
        label: options.demoLabel || "Juego de niveles",
        phase: "running",
        difficulty: "medium",
        levelMode: "challenge",
        playerConfigurable: false,
        score: 12,
        lives: options.demoLives ?? 7,
        elapsedMillis: 48600,
        sessionElapsedMillis: 432000,
        challengeElapsedMillis: 174000,
        challengeAttemptCount: 4,
        remainingMillis: 551400,
        activeTargets: 8,
        level: "level-4",
        levelNumber: 4,
        attemptCount: 1,
        failureCount: 1,
        sessionBestElapsedMillis: 51200,
        bestElapsedMillis: 46800,
        lastEventCue: "coin",
        lastEventMessage: `${options.demoLabel || "Juego de niveles"} punto 12`,
      };
    case "duel": {
      const duelRoster = [
        { index: 0, label: "Red", color: { r: 255, g: 41, b: 56 } },
        { index: 1, label: "Cyan", color: { r: 30, g: 213, b: 255 } },
        { index: 2, label: "Green", color: { r: 47, g: 216, b: 108 } },
        { index: 3, label: "Pink", color: { r: 247, g: 61, b: 255 } },
        { index: 4, label: "Blue", color: { r: 10, g: 90, b: 248 } },
        { index: 5, label: "Yellow", color: { r: 255, g: 209, b: 102 } },
        { index: 6, label: "Violet", color: { r: 167, g: 139, b: 250 } },
        { index: 7, label: "Orange", color: { r: 251, g: 146, b: 60 } },
      ];
      const duelCount = Math.min(Math.max(options.demoPlayers || 2, 2), duelRoster.length);
      const players = duelRoster.slice(0, duelCount).map((player, index) => ({ ...player, score: 14 - index * 2, lives: -1 }));
      return {
        ...base,
        currentGame: options.demoGame || "authored-duel",
        label: options.demoLabel || "Duelo",
        playerCount: duelCount,
        players,
        score: players.reduce((total, player) => total + player.score, 0),
        lives: -1,
        sessionElapsedMillis: 94000,
        remainingMillis: 156000,
        activeTargets: 0,
        lastEventCue: "hit",
        lastEventMessage: "Cyan +1",
      };
    }
    case "team":
      return {
        ...base,
        currentGame: "lava",
        label: "El suelo es lava",
        difficulty: "hard",
        score: 64,
        lives: 3,
        sessionElapsedMillis: 164000,
        activeTargets: 6,
        lastEventCue: "miss",
        lastEventMessage: "Fallo",
      };
    case "teams":
      return {
        ...base,
        currentGame: options.demoGame || "arcade-teams",
        label: options.demoLabel || "Tira y Afloja Baldosas",
        difficulty: "easy",
        difficultyConfigurable: options.demoDifficultyConfigurable ?? false,
        playerCount: 2,
        players: [
          { index: 0, label: "Red", color: { r: 255, g: 41, b: 56 }, score: 42, lives: -1 },
          { index: 1, label: "Cyan", color: { r: 30, g: 213, b: 255 }, score: 35, lives: -1 },
        ],
        score: 77,
        lives: -1,
        activeTargets: 0,
        remainingMillis: 0,
        elapsedMillis: 94000,
        sessionElapsedMillis: 94000,
        lastEventCue: "hit",
        lastEventMessage: "Red +5",
      };
    case "memory":
      return {
        ...base,
        currentGame: options.demoGame || "memory",
        label: options.demoLabel || "Reto de memoria",
        difficulty: "medium",
        playerCount: 4,
        players: [
          { index: 0, label: "Jugador 1", color: { r: 255, g: 23, b: 48 }, score: 18, lives: -1 },
          { index: 1, label: "Jugador 2", color: { r: 30, g: 213, b: 255 }, score: 15, lives: -1 },
          { index: 2, label: "Jugador 3", color: { r: 47, g: 216, b: 108 }, score: 12, lives: -1 },
          { index: 3, label: "Jugador 4", color: { r: 247, g: 61, b: 255 }, score: 9, lives: -1 },
        ],
        score: 54,
        lives: -1,
        elapsedMillis: 72000,
        sessionElapsedMillis: 72000,
        remainingMillis: 128000,
        activeTargets: 16,
        lastEventCue: "hit",
        lastEventMessage: "Jugador 1 18",
      };
    case "classic":
      return base;
    case "players":
      return base;
    default:
      return null;
  }
}
