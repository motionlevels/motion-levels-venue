import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";

import { CanonicalStateStore } from "./state-store.js";

type ShadowSourceStatus = {
  lastSuccessUnixMillis: number;
  requests: number;
  failures: number;
};

export type RuntimeServerOptions = {
  store: CanonicalStateStore;
  source: ShadowSourceStatus;
  staleAfterMillis?: number;
};

function writeJSON(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
  });
  response.end(`${JSON.stringify(value)}\n`);
}

function metrics(options: RuntimeServerOptions): string {
  const { store, source } = options;
  const current = store.current();
  const lines = [
    "# HELP motion_levels_venue_runtime_info Static venue runtime build information.",
    "# TYPE motion_levels_venue_runtime_info gauge",
    'motion_levels_venue_runtime_info{mode="shadow"} 1',
    "# HELP motion_levels_venue_runtime_source_requests_total Shadow source requests.",
    "# TYPE motion_levels_venue_runtime_source_requests_total counter",
    `motion_levels_venue_runtime_source_requests_total ${source.requests}`,
    "# HELP motion_levels_venue_runtime_source_failures_total Shadow source failures.",
    "# TYPE motion_levels_venue_runtime_source_failures_total counter",
    `motion_levels_venue_runtime_source_failures_total ${source.failures}`,
    "# HELP motion_levels_venue_runtime_state_ingest_total Canonical state ingest outcomes.",
    "# TYPE motion_levels_venue_runtime_state_ingest_total counter",
    `motion_levels_venue_runtime_state_ingest_total{result="accepted"} ${store.metrics.accepted}`,
    `motion_levels_venue_runtime_state_ingest_total{result="duplicate"} ${store.metrics.duplicates}`,
    `motion_levels_venue_runtime_state_ingest_total{result="stale"} ${store.metrics.stale}`,
    `motion_levels_venue_runtime_state_ingest_total{result="conflict"} ${store.metrics.conflicts}`,
    `motion_levels_venue_runtime_state_ingest_total{result="invalid"} ${store.metrics.invalid}`,
    "# HELP motion_levels_venue_runtime_player_state_revision Latest mirrored canonical revision.",
    "# TYPE motion_levels_venue_runtime_player_state_revision gauge",
    `motion_levels_venue_runtime_player_state_revision ${current?.revision ?? 0}`,
  ];
  return `${lines.join("\n")}\n`;
}

export function createRuntimeServer(options: RuntimeServerOptions): Server {
  const staleAfterMillis = options.staleAfterMillis ?? 5_000;
  return createServer((request: IncomingMessage, response: ServerResponse) => {
    const url = new URL(request.url ?? "/", "http://venue-runtime.invalid");
    if (request.method === "GET" && url.pathname === "/api/health") {
      const current = options.store.current();
      const sourceAgeMillis = options.source.lastSuccessUnixMillis === 0
        ? null
        : Date.now() - options.source.lastSuccessUnixMillis;
      const ready = current !== undefined && sourceAgeMillis !== null && sourceAgeMillis <= staleAfterMillis;
      writeJSON(response, ready ? 200 : 503, {
        status: ready ? "ok" : "degraded",
        mode: "shadow",
        authoritative: false,
        revision: current?.revision ?? 0,
        sourceAgeMillis,
      });
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/player-state") {
      const current = options.store.current();
      if (current === undefined) {
        writeJSON(response, 503, { error: "authoritative state has not been observed" });
      } else {
        writeJSON(response, 200, current);
      }
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/player-state/events") {
      response.writeHead(200, {
        "cache-control": "no-store",
        connection: "keep-alive",
        "content-type": "text/event-stream",
      });
      const send = (state: unknown) => response.write(`event: player-state\ndata: ${JSON.stringify(state)}\n\n`);
      const current = options.store.current();
      if (current !== undefined) send(current);
      const unsubscribe = options.store.subscribe(send);
      const keepalive = setInterval(() => response.write(": keepalive\n\n"), 15_000);
      keepalive.unref();
      request.on("close", () => {
        clearInterval(keepalive);
        unsubscribe();
      });
      return;
    }
    if (request.method === "GET" && url.pathname === "/metrics") {
      response.writeHead(200, { "content-type": "text/plain; version=0.0.4; charset=utf-8" });
      response.end(metrics(options));
      return;
    }
    writeJSON(response, 404, { error: "not found" });
  });
}
