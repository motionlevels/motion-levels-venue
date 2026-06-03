import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { displayEventSource, fetchDisplayStatus, type DisplayStatus } from "./api";
import { colorCSS, colorRGB, difficultyLabelES, eventMessageES, formatClock, gameTitleES, phaseLabel, playerLabelES } from "./utils";

const emptyStatus: DisplayStatus = {
  currentGame: "loop",
  label: "Motion Levels",
  phase: "idle",
  difficulty: "easy",
  playerCount: 1,
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

export default function App() {
  const [status, setStatus] = useState<DisplayStatus>(emptyStatus);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

  const leader = useMemo(() => {
    if (!status.players.length) return null;
    return [...status.players].sort((left, right) => right.score - left.score)[0];
  }, [status.players]);

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
          <span className={`live-dot ${connected ? "on" : ""}`} />
          <strong>Motion Levels</strong>
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

      <section className={`player-grid count-${Math.min(Math.max(status.players.length, 1), 3)}`} aria-label="Players">
        {status.players.length ? (
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
          <span>{eventMessageES(status.lastEventCue, status.lastEventMessage) || "Listo"}</span>
        </div>
        <div className="mini-stat">
          <span>Dificultad</span>
          <strong>{difficultyLabelES(status.difficulty)}</strong>
        </div>
      </footer>
    </main>
  );
}
