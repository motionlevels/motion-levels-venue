import { CanonicalStateStore } from "./state-store.js";
import { createRuntimeServer } from "./server.js";
import { ShadowSource } from "./shadow-source.js";

function positiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error(`invalid positive integer: ${value}`);
  return parsed;
}

function parseAddress(value: string): { host: string; port: number } {
  const separator = value.lastIndexOf(":");
  if (separator <= 0) throw new Error(`invalid listen address: ${value}`);
  const host = value.slice(0, separator);
  const port = positiveInteger(value.slice(separator + 1), 0);
  if (port > 65_535) throw new Error(`invalid listen port: ${port}`);
  return { host, port };
}

const mode = process.env.VENUE_RUNTIME_MODE ?? "shadow";
if (mode !== "shadow") {
  throw new Error(`VENUE_RUNTIME_MODE=${mode} is not enabled; only shadow is safe during migration`);
}

const sourceURL = new URL(process.env.VENUE_RUNTIME_SOURCE_URL ?? "http://engine-core:4102");
if (sourceURL.protocol !== "http:" && sourceURL.protocol !== "https:") {
  throw new Error("VENUE_RUNTIME_SOURCE_URL must use HTTP or HTTPS");
}
const listen = parseAddress(process.env.VENUE_RUNTIME_HTTP ?? "127.0.0.1:4103");
const store = new CanonicalStateStore();
const source = new ShadowSource(store, {
  sourceURL,
  intervalMillis: positiveInteger(process.env.VENUE_RUNTIME_POLL_MILLIS, 200),
  requestTimeoutMillis: positiveInteger(process.env.VENUE_RUNTIME_TIMEOUT_MILLIS, 1_000),
});
const server = createRuntimeServer({ store, source });

source.start();
server.listen(listen.port, listen.host, () => {
  process.stdout.write(`venue runtime shadow listening on ${listen.host}:${listen.port}\n`);
});

function shutdown(): void {
  source.stop();
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
