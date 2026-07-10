import { useEffect, useRef, useState } from "react";
import type { DisplayStatus } from "./api";

type GamesDisplayRuntime = {
  revision: string;
  mount(element: Element, input: GamesDisplayInput): void;
  update(element: Element, input: GamesDisplayInput): void;
  unmount(element: Element): void;
};

type GamesDisplayInput = {
  gameId: string;
  snapshot: Record<string, unknown>;
  frame?: DisplayStatus["frame"];
  paused: boolean;
};

declare global {
  interface Window {
    MotionLevelsGamesDisplay?: GamesDisplayRuntime;
  }
}

export function MotionLevelsGamesDisplay({ status }: { status: DisplayStatus }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const revision = status.sourceRevision || "";
  const gameId = gameID(status);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !revision || !status.gameSnapshot) return;
    let cancelled = false;
    const input: GamesDisplayInput = {
      gameId,
      snapshot: status.gameSnapshot,
      frame: status.frame,
      paused: status.phase === "paused"
    };

    loadRuntime(revision)
      .then((runtime) => {
        if (cancelled) return;
        runtime.mount(host, input);
        setError("");
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "No se pudo cargar la pantalla del juego");
      });

    return () => {
      cancelled = true;
      window.MotionLevelsGamesDisplay?.unmount(host);
    };
  }, [gameId, revision]);

  useEffect(() => {
    const host = hostRef.current;
    const runtime = window.MotionLevelsGamesDisplay;
    if (!host || runtime?.revision !== revision || !status.gameSnapshot) return;
    runtime.update(host, {
      gameId,
      snapshot: status.gameSnapshot,
      frame: status.frame,
      paused: status.phase === "paused"
    });
  }, [gameId, revision, status.frame, status.gameSnapshot, status.phase]);

  return (
    <main className="motion-levels-games-display-host">
      <div ref={hostRef} className="motion-levels-games-display-root" />
      {error ? <div className="motion-levels-games-display-error">{error}</div> : null}
    </main>
  );
}

function gameID(status: DisplayStatus) {
  return status.currentGame.startsWith("motion-levels-games:")
    ? status.currentGame.slice("motion-levels-games:".length)
    : String(status.gameSnapshot?.currentGame || status.currentGame);
}

let pendingRuntime: { revision: string; promise: Promise<GamesDisplayRuntime>; script: HTMLScriptElement } | null = null;

function loadRuntime(revision: string): Promise<GamesDisplayRuntime> {
  const existing = window.MotionLevelsGamesDisplay;
  if (existing?.revision === revision) return Promise.resolve(existing);
  if (pendingRuntime?.revision === revision) return pendingRuntime.promise;
  pendingRuntime?.script.remove();
  const script = document.createElement("script");
  const promise = new Promise<GamesDisplayRuntime>((resolve, reject) => {
    script.src = `${gamesAssetBaseURL()}/${encodeURIComponent(revision)}/display/display.js`;
    script.async = true;
    script.dataset.motionLevelsGamesRevision = revision;
    script.onload = () => {
      const runtime = window.MotionLevelsGamesDisplay;
      if (runtime?.revision !== revision) {
        reject(new Error("La revisión de la pantalla no coincide con el juego"));
        return;
      }
      resolve(runtime);
    };
    script.onerror = () => reject(new Error("No se pudo cargar la pantalla del juego"));
    document.head.append(script);
  });
  pendingRuntime = { revision, promise, script };
  const clearPending = () => {
    if (pendingRuntime?.promise === promise) pendingRuntime = null;
  };
  void promise.then(clearPending, clearPending);
  return promise;
}

function gamesAssetBaseURL() {
  const override = import.meta.env.VITE_MOTION_LEVELS_GAMES_ASSET_URL?.trim();
  if (override) return override.replace(/\/$/u, "");
  const gateway = window.location.pathname.match(/^(\/gateways\/[^/]+)\/display(?:\/|$)/u);
  if (gateway) return `${window.location.origin}${gateway[1]}/games`;
  return `${window.location.origin}/games`;
}
