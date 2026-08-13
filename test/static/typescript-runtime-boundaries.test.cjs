const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "../..");
const runtimeRoot = path.join(repoRoot, "apps/venue-runtime");

function sourceText() {
  return fs
    .readdirSync(path.join(runtimeRoot, "src"))
    .filter((name) => name.endsWith(".ts"))
    .map((name) => fs.readFileSync(path.join(runtimeRoot, "src", name), "utf8"))
    .join("\n");
}

test("TypeScript venue runtime starts fail-closed in shadow mode", () => {
  const main = fs.readFileSync(path.join(runtimeRoot, "src/main.ts"), "utf8");
  assert.match(main, /mode !== "shadow"/);
  assert.match(main, /only shadow is safe during migration/);
});

test("TypeScript venue runtime has no physical floor or process boundary access", () => {
  const sources = sourceText();
  assert.doesNotMatch(sources, /node:dgram|createSocket\s*\(/);
  assert.doesNotMatch(sources, /node:child_process|\bspawn\s*\(|\bexecFile\s*\(/);
  assert.doesNotMatch(sources, /192\.168\.|255\.255\.255\.255|420[123]/);
  assert.doesNotMatch(sources, /MOTION_LEVELS_(?:LED|FLOOR|CONTROLLER)_/);
});

test("TypeScript venue runtime is covered by pinned Node 24 CI", () => {
  const workflow = fs.readFileSync(path.join(repoRoot, ".github/workflows/ci.yml"), "utf8");
  assert.match(workflow, /node-version: 24/);
  assert.match(workflow, /name: venue-runtime[\s\S]*?working-directory: apps\/venue-runtime/);
  assert.match(workflow, /lockfile: apps\/venue-runtime\/package-lock\.json/);
});
