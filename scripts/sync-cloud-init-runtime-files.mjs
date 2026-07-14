#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cloudInitPath = path.join(repoRoot, "deploy/motionlevels-pc/cloud-init.yaml");
const mode = process.argv[2] || "--check";

if (!new Set(["--check", "--sync"]).has(mode)) {
  console.error("usage: node scripts/sync-cloud-init-runtime-files.mjs [--check|--sync]");
  process.exit(2);
}

const mirrors = [
  ["/usr/local/bin/motion-levels-player-kiosk", "deploy/motionlevels-pc/motion-levels-player-kiosk"],
  ["/etc/asound.conf", "deploy/motionlevels-pc/asound.conf"],
  ["/usr/local/bin/motion-levels-hdmi-watchdog", "deploy/motionlevels-pc/motion-levels-hdmi-watchdog"],
  ["/etc/motion-levels/motion-levels.env", "deploy/motionlevels-pc/motion-levels.env"],
  ["/etc/caddy/Caddyfile", "deploy/motionlevels-pc/Caddyfile"],
  ["/etc/systemd/system/motion-levels-floor-controller.service", "deploy/motionlevels-pc/motion-levels-floor-controller.service"],
  ["/etc/systemd/system/motion-levels-game-engine.service", "deploy/motionlevels-pc/motion-levels-game-engine.service"],
  ["/etc/systemd/system/motion-levels-kiosk.service", "deploy/motionlevels-pc/motion-levels-kiosk.service"],
  ["/etc/systemd/system/motion-levels-hdmi-watchdog.service", "deploy/motionlevels-pc/motion-levels-hdmi-watchdog.service"],
];

function normalized(source) {
  return source.replaceAll("\r\n", "\n").replace(/\n+$/, "");
}

function cloudInitContent(source) {
  // YAML literal blocks need space indentation. Canonical Caddy files use tabs,
  // so expand them deterministically and keep empty lines free of whitespace.
  return normalized(source).replaceAll("\t", "  ");
}

function findEmbeddedBlock(lines, target) {
  const marker = `  - path: ${target}`;
  const matches = lines.flatMap((line, index) => (line === marker ? [index] : []));
  if (matches.length !== 1) {
    throw new Error(`expected exactly one cloud-init write_files entry for ${target}; found ${matches.length}`);
  }

  const pathIndex = matches[0];
  const nextPathIndex = lines.findIndex((line, index) => index > pathIndex && line.startsWith("  - path: "));
  const entryEnd = nextPathIndex === -1 ? lines.length : nextPathIndex;
  const contentIndex = lines.findIndex(
    (line, index) => index > pathIndex && index < entryEnd && line === "    content: |",
  );
  if (contentIndex === -1) {
    throw new Error(`missing literal content block for ${target}`);
  }

  let end = contentIndex + 1;
  while (end < lines.length && (lines[end].startsWith("      ") || /^\s*$/.test(lines[end]))) {
    end += 1;
  }
  return { start: contentIndex + 1, end };
}

let cloudInitLines = fs.readFileSync(cloudInitPath, "utf8").replaceAll("\r\n", "\n").split("\n");
const drifted = [];

for (const [target, sourcePath] of mirrors) {
  const canonical = cloudInitContent(fs.readFileSync(path.join(repoRoot, sourcePath), "utf8"));
  const { start, end } = findEmbeddedBlock(cloudInitLines, target);
  const embedded = normalized(
    cloudInitLines
      .slice(start, end)
      .map((line) => (line.startsWith("      ") ? line.slice(6) : ""))
      .join("\n"),
  );
  if (embedded === canonical) {
    continue;
  }

  drifted.push({ target, sourcePath });
  if (mode === "--sync") {
    const replacement = canonical.split("\n").map((line) => (line ? `      ${line}` : ""));
    cloudInitLines.splice(start, end - start, ...replacement, "");
  }
}

if (mode === "--sync") {
  cloudInitLines = cloudInitLines.map((line) => (/^\s+$/.test(line) ? "" : line));
  fs.writeFileSync(cloudInitPath, `${cloudInitLines.join("\n").replace(/\n+$/, "")}\n`);
}

if (drifted.length === 0) {
  console.log("cloud-init runtime mirrors are current");
  process.exit(0);
}

for (const { target, sourcePath } of drifted) {
  console.error(`${mode === "--sync" ? "synced" : "drift"}: ${target} <- ${sourcePath}`);
}
process.exit(mode === "--check" ? 1 : 0);
