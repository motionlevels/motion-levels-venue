import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendorRoot = path.join(repoRoot, "game-bundles/motion-levels-games");
const pin = JSON.parse(await readFile(path.join(vendorRoot, "pin.json"), "utf8"));
assert.equal(pin.schema, "motion-levels-games-pin-v1");
assert.match(String(pin.sourceRevision), /^[0-9a-f]{40}$/u);
assert.match(String(pin.artifactDigest), /^[0-9a-f]{64}$/u);
assert.equal(pin.bundlePath, pin.sourceRevision);
assert.match(String(pin.releaseTag), /^games-v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/u);

const bundleRoot = path.join(vendorRoot, pin.bundlePath);
const bundle = JSON.parse(await readFile(path.join(bundleRoot, "bundle.json"), "utf8"));
assert.equal(bundle.schema, "motion-levels-games-bundle-v1");
assert.equal(bundle.contractVersion, 1);
assert.equal(bundle.runnerProtocolVersion, 1);
assert.equal(bundle.sdkFps, 50);
assert.equal(bundle.sourceRevision, pin.sourceRevision);
assert.equal(bundle.artifactDigest, pin.artifactDigest);
if (bundle.playerMenu !== undefined) {
  assert.equal(bundle.playerMenu.adapterProtocolVersion, 1);
  assert.match(String(bundle.playerMenu.entry), /^menu\/(?:[^/]+\/)*index\.html$/u);
}

const files = await walk(bundleRoot);
const actual = await Promise.all(files
  .filter((file) => path.basename(file) !== "bundle.json")
  .sort()
  .map(async (file) => {
    const contents = await readFile(file);
    return {
      path: path.relative(bundleRoot, file).split(path.sep).join("/"),
      sha256: createHash("sha256").update(contents).digest("hex"),
      bytes: contents.length
    };
  }));
assert.deepEqual(actual, bundle.files);
if (bundle.playerMenu !== undefined) {
  assert.ok(actual.some((file) => file.path === bundle.playerMenu.entry), "player menu entry is missing from bundle files");
}
const canonical = actual.map((file) => `${file.path}\0${file.sha256}\0${file.bytes}\n`).join("");
assert.equal(createHash("sha256").update(canonical).digest("hex"), pin.artifactDigest);
console.log(`Verified motion-levels-games ${pin.sourceRevision} (${actual.length} files, ${pin.artifactDigest})`);

async function walk(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}
