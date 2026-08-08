import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { displayErrorMessage, runtimeRetryDelayMillis } from "../src/displayRuntime.ts";

describe("runtimeRetryDelayMillis", () => {
  it("backs off quickly and caps retries at ten seconds", () => {
    assert.deepEqual(
      Array.from({ length: 9 }, (_, attempt) => runtimeRetryDelayMillis(attempt)),
      [0, 250, 500, 1000, 2000, 5000, 10_000, 10_000, 10_000],
    );
  });

  it("normalizes invalid attempts", () => {
    assert.equal(runtimeRetryDelayMillis(-10), 0);
    assert.equal(runtimeRetryDelayMillis(Number.NaN), 0);
  });
});

describe("displayErrorMessage", () => {
  it("keeps useful errors and supplies a safe Spanish fallback", () => {
    assert.equal(displayErrorMessage(new Error("fallo de carga")), "fallo de carga");
    assert.equal(displayErrorMessage(" revisión incorrecta "), "revisión incorrecta");
    assert.equal(displayErrorMessage(null), "No se pudo cargar la pantalla del juego");
  });
});
