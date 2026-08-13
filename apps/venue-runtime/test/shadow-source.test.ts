import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";

import { ShadowSource } from "../src/shadow-source.js";
import { CanonicalStateStore } from "../src/state-store.js";
import { playerState } from "./fixtures.js";

test("polls the authoritative Go endpoint without becoming authoritative", async (context) => {
  const authoritative = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(playerState(17)));
  });
  authoritative.listen(0, "127.0.0.1");
  await once(authoritative, "listening");
  context.after(() => authoritative.close());
  const { port } = authoritative.address() as AddressInfo;

  const store = new CanonicalStateStore();
  const source = new ShadowSource(store, {
    sourceURL: new URL(`http://127.0.0.1:${port}`),
    intervalMillis: 1_000,
    requestTimeoutMillis: 1_000,
  });
  await source.poll();

  assert.equal(source.requests, 1);
  assert.equal(source.failures, 0);
  assert.equal(source.lastError, "");
  assert.equal(store.current()?.revision, 17);
});
