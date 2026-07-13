import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { friendlyRequestError, requestJSON, RequestError } from "../src/api.ts";

const nativeFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = nativeFetch;
});

describe("kiosk API requests", () => {
  it("returns decoded JSON and forwards request options", async () => {
    let method = "";
    globalThis.fetch = (async (_url, init) => {
      method = init?.method || "GET";
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }) as typeof fetch;

    assert.deepEqual(await requestJSON<{ ok: boolean }>("https://example.invalid/status", { method: "POST" }, 100), { ok: true });
    assert.equal(method, "POST");
  });

  it("aborts hung requests at the kiosk deadline", async () => {
    globalThis.fetch = ((_url, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    })) as typeof fetch;

    await assert.rejects(
      requestJSON("https://example.invalid/status", {}, 5),
      (error: unknown) => error instanceof RequestError && error.kind === "timeout",
    );
  });

  it("classifies network and malformed-response failures", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("Failed to fetch");
    }) as typeof fetch;
    await assert.rejects(
      requestJSON("https://example.invalid/status", {}, 100),
      (error: unknown) => error instanceof RequestError && error.kind === "network",
    );

    globalThis.fetch = (async () => new Response("not-json", { status: 200 })) as typeof fetch;
    await assert.rejects(
      requestJSON("https://example.invalid/status", {}, 100),
      (error: unknown) => error instanceof RequestError && error.kind === "response",
    );
  });

  it("never exposes raw transport or server text to players", () => {
    assert.equal(
      friendlyRequestError(new RequestError("network", "internal socket detail"), "No se pudo iniciar"),
      "Sin conexión con el motor. Comprueba la conexión e inténtalo de nuevo.",
    );
    assert.equal(
      friendlyRequestError(new RequestError("response", "database stack trace", { status: 500 }), "No se pudo iniciar"),
      "No se pudo iniciar",
    );
  });
});
