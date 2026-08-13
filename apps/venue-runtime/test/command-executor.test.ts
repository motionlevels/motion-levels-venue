import assert from "node:assert/strict";
import test from "node:test";

import { SerializedCommandExecutor } from "../src/command-executor.js";

const firstCommand = "d0482251-482b-4260-9bbb-3f93fca8cead";
const secondCommand = "bc96929c-6ba0-4850-91b8-0c7f3640168a";

test("serializes concurrent commands and reuses an idempotent result", async () => {
  const executor = new SerializedCommandExecutor<{ revision: number }>();
  const observed: number[] = [];
  let revision = 40;
  const action = async () => {
    const next = ++revision;
    await new Promise((resolve) => setTimeout(resolve, 2));
    observed.push(next);
    return { revision: next };
  };

  const [first, duplicate, second] = await Promise.all([
    executor.execute(firstCommand, action),
    executor.execute(firstCommand.toUpperCase(), action),
    executor.execute(secondCommand, action),
  ]);

  assert.deepEqual(first, { revision: 41 });
  assert.deepEqual(duplicate, first);
  assert.deepEqual(second, { revision: 42 });
  assert.deepEqual(observed, [41, 42]);
});

test("does not cache failed or anonymous commands", async () => {
  const executor = new SerializedCommandExecutor<number>();
  let calls = 0;
  await assert.rejects(executor.execute(firstCommand, () => {
    calls += 1;
    throw new Error("transition failed");
  }), /transition failed/);
  assert.equal(await executor.execute(firstCommand, () => ++calls), 2);
  assert.equal(await executor.execute("", () => ++calls), 3);
  assert.equal(await executor.execute("", () => ++calls), 4);
});

test("rejects malformed command IDs before execution", async () => {
  const executor = new SerializedCommandExecutor<number>();
  let called = false;
  await assert.rejects(executor.execute("retry-me", () => {
    called = true;
    return 1;
  }), /commandId must be a UUID/);
  assert.equal(called, false);
});
