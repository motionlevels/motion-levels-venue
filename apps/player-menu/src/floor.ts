// LED floor preview animations.
//
// The physical floor is a 16 x 32 LED grid (see game-engine animation.GridWidth/Height
// and floor-controller floor.Grid*). The preview renders it at this exact resolution and
// aspect ratio (portrait, 1:2), matching the controller's /live view.
//
// Each animation is a pure function of tile coordinates and time, returning an RGB triple
// in 0..255. These are placeholders meant to *showcase* each game's identity until the real
// per-game preview frames are wired up; `loop` is a direct port of the engine's real attract
// loop, and whack-a-mole reuses the engine's real player colors.

export const FLOOR_COLS = 16;
export const FLOOR_ROWS = 32;

export type RGB = [number, number, number];
export type FloorAnim = (x: number, y: number, cols: number, rows: number, t: number) => RGB;

// Engine player colors (game-engine/internal/games/whackamole playerColors).
const playerColors: RGB[] = [
  [0, 65, 255], // blue
  [0, 255, 60], // green
  [255, 0, 212], // pink
  [255, 212, 0], // yellow
  [255, 90, 0], // orange
  [0, 229, 255], // cyan
];

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function mod(value: number, n: number): number {
  return ((value % n) + n) % n;
}

// Port of game-engine/internal/animation.hsv (h,s,v in 0..1 -> 0..255 RGB).
function hsv(h: number, s: number, v: number): RGB {
  h = mod(h, 1);
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const u = v * (1 - (1 - f) * s);
  let r = 0;
  let g = 0;
  let b = 0;
  switch (i % 6) {
    case 0:
      [r, g, b] = [v, u, p];
      break;
    case 1:
      [r, g, b] = [q, v, p];
      break;
    case 2:
      [r, g, b] = [p, v, u];
      break;
    case 3:
      [r, g, b] = [p, q, v];
      break;
    case 4:
      [r, g, b] = [u, p, v];
      break;
    default:
      [r, g, b] = [v, p, q];
  }
  return [r * 255, g * 255, b * 255];
}

// Cheap deterministic hash for scripted spawns.
function hash(n: number): number {
  let h = (n ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

// Attract loop: direct port of engine animation.LoopColor (16 wide x 32 tall, portrait), so
// the rainbow flows exactly as it does in the real idle mode on the floor.
const loop: FloorAnim = (x, y, cols, rows, t) => {
  const widthPhase = x / cols;
  const heightPhase = y / rows;
  const hue = mod(widthPhase * 0.55 + heightPhase * 0.35 + t * 0.1, 1);
  const pulse = 0.7 + 0.3 * Math.sin((t * 2.0 + widthPhase * 4.0 - heightPhase * 2.5) * Math.PI);
  return hsv(hue, 0.85, clamp01(pulse));
};

// Ambient comet: several cool streaks sweep across the floor, leaving short tails.
const ambientComet: FloorAnim = (x, y, cols, rows, t) => {
  const nx = x / cols;
  const ny = y / rows;
  let glow = 0.04;
  for (let i = 0; i < 4; i++) {
    const seed = i * 0.23;
    const head = mod(t * (0.13 + i * 0.018) + seed, 1.45) - 0.22;
    const lane = 0.16 + i * 0.22 + Math.sin(t * 0.38 + i) * 0.05;
    const diagonal = nx * 0.84 + ny * 0.36;
    const dist = Math.abs(diagonal - head) + Math.abs(ny - lane) * 0.62;
    glow += Math.max(0, 1 - dist * 12) * 0.95;
  }
  const baseHue = mod(0.55 + nx * 0.1 - ny * 0.05 + t * 0.035, 1);
  return hsv(baseHue, 0.82, clamp01(glow));
};

// Ambient pulse: soft waves expand from the center with a calmer lobby feel.
const ambientPulse: FloorAnim = (x, y, cols, rows, t) => {
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const dist = Math.hypot((x - cx) / cols, (y - cy) / rows);
  const ring = 0.5 + 0.5 * Math.sin((dist * 8.5 - t * 1.35) * Math.PI * 2);
  const shimmer = 0.5 + 0.5 * Math.sin((x * 0.55 - y * 0.21 + t * 0.8) * Math.PI);
  const value = 0.16 + ring * 0.54 + shimmer * 0.14;
  return hsv(mod(0.34 + dist * 0.28 + t * 0.025, 1), 0.72, clamp01(value));
};

// Ambient spark: mostly dark floor with tiny warm sparks that appear and fade.
const ambientSpark: FloorAnim = (x, y, cols, rows, t) => {
  const beat = Math.floor(t * 8);
  const phase = t * 8 - beat;
  let value = 0.06;
  let hue = 0.08;
  for (let i = 0; i < 6; i++) {
    const seed = hash(beat * 17 + i * 29);
    const sx = seed % cols;
    const sy = (seed >>> 8) % rows;
    const dist = Math.abs(x - sx) + Math.abs(y - sy);
    if (dist > 2) continue;
    const falloff = Math.max(0, 1 - dist / 2.4) * Math.pow(1 - phase, 1.7);
    value += falloff;
    hue = 0.06 + ((seed >>> 16) % 18) / 100;
  }
  const underglow = 0.03 + 0.05 * Math.sin((x * 0.4 + y * 0.2 + t * 0.5) * Math.PI);
  return hsv(hue, 0.9, clamp01(value + underglow));
};

// Whack-a-mole: 2x2 targets pop in across the floor in the real player colors, rising fast
// and fading out like the engine's target.color ramp.
const whackAMole: FloorAnim = (x, y, cols, rows, t) => {
  const stride = 0.46; // a new target every ~0.46s
  const life = 1.5; // each target lives ~1.5s
  const now = Math.floor(t / stride);
  let out: RGB = [0, 0, 0];
  for (let k = now; k >= now - 4; k--) {
    if (k < 0) continue;
    const seed = hash(k);
    const ox = seed % (cols - 1);
    const oy = (seed >>> 8) % (rows - 1);
    if (x < ox || x >= ox + 2 || y < oy || y >= oy + 2) continue;
    const age = t - k * stride;
    if (age < 0 || age > life) continue;
    const color = playerColors[seed % playerColors.length];
    const rise = age < 0.1 ? age / 0.1 : 1;
    const ratio = clamp01(1 - age / life);
    const bright = rise * Math.pow(ratio, 1.1);
    out = [color[0] * bright, color[1] * bright, color[2] * bright];
  }
  return out;
};

// Floor is Lava: flowing red/orange heat with cool dark safe islands.
const lava: FloorAnim = (x, y, cols, rows, t) => {
  const nx = x / cols;
  const ny = y / rows;
  const field =
    0.5 +
    0.5 *
      Math.sin((nx * 3.0 + ny * 1.6 + t * 0.7) * Math.PI) *
      Math.cos((nx * 2.2 - ny * 3.2 - t * 0.5) * Math.PI);
  if (field < 0.34) {
    return [4, 9, 18]; // safe tile
  }
  const heat = clamp01((field - 0.34) / 0.66);
  const flicker = 0.82 + 0.18 * Math.sin((x * 1.3 + y * 0.7 + t * 6) * Math.PI);
  return [255 * flicker, (45 + 150 * heat) * flicker, 8 * heat * flicker];
};

// Parkour: blue current platform, travelling green target, and red lava underneath.
const parkour: FloorAnim = (x, y, cols, rows, t) => {
  const current = { x: Math.floor(cols / 2), y: 4 };
  const path = [
    { x: 4, y: 12 },
    { x: 11, y: 16 },
    { x: 5, y: 23 },
    { x: 12, y: 27 },
  ];
  const step = Math.floor(t / 1.7);
  const target = path[step % path.length];
  const previous = path[(step + path.length - 1) % path.length];
  const phase = (t / 1.7) % 1;
  const visual = {
    x: Math.round(previous.x + (target.x - previous.x) * phase),
    y: Math.round(previous.y + (target.y - previous.y) * phase),
  };

  const onPlatform = (center: { x: number; y: number }) => Math.abs(x - center.x) <= 1 && Math.abs(y - center.y) <= 1;
  if (onPlatform(current)) {
    const pulse = 0.74 + 0.26 * Math.sin(t * 4.4);
    return [0, 150 * pulse, 255 * pulse];
  }
  if (onPlatform(visual)) {
    const pulse = 0.72 + 0.28 * Math.sin(t * 5.1);
    return [60 * pulse, 255 * pulse, 48 * pulse];
  }
  const f1 = 0.5 + 0.5 * Math.sin(x * 0.75 + y * 0.22 + t * 1.9);
  const f2 = 0.5 + 0.5 * Math.sin(y * 0.55 - t * 2.7);
  return [115 + 85 * f1, 4 + 40 * f2, 0];
};

// Duel: two territories push a glowing clash line back and forth across the floor.
const duel: FloorAnim = (x, y, cols, rows, t) => {
  const blue: RGB = [0, 90, 255];
  const red: RGB = [255, 40, 64];
  const boundary = cols / 2 + Math.sin(t * 0.9) * cols * 0.2;
  const edge = Math.abs(x + 0.5 - boundary);
  if (edge < 0.7) {
    const p = 0.6 + 0.4 * Math.sin((t * 8 + y) * 0.6);
    return [255 * p, 255 * p, 255 * p];
  }
  const base = x + 0.5 < boundary ? blue : red;
  const front = clamp01(1 - edge / (cols / 2));
  const bright = 0.32 + 0.68 * front;
  const sparkle = 0.85 + 0.15 * Math.sin((x * 0.9 + y * 1.7 - t * 4) * Math.PI);
  return [base[0] * bright * sparkle, base[1] * bright * sparkle, base[2] * bright * sparkle];
};

export const defaultFloorAnim = loop;

export const floorAnimations: Record<string, FloorAnim> = {
  "whack-a-mole": whackAMole,
  loop,
  "ambient-comet": ambientComet,
  "ambient-pulse": ambientPulse,
  "ambient-spark": ambientSpark,
  lava,
  parkour,
  duel,
};
