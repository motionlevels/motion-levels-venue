// LED floor preview animations.
//
// The physical floor is a 16 x 32 LED grid (see game-engine animation.GridWidth/Height
// and floor-controller floor.Grid*). The preview renders it at this exact resolution and
// aspect ratio (portrait, 1:2), matching the controller preview.
//
// Each animation is a pure function of tile coordinates and time, returning an RGB triple
// in 0..255. These are placeholders meant to *showcase* each game's identity until the real
// per-game preview frames are wired up; the rainbow preview is a local attract
// animation, and whack-a-mole reuses the engine's real player colors.

export const FLOOR_COLS = 16;
export const FLOOR_ROWS = 32;

export type RGB = [number, number, number];
export type FloorAnim = (x: number, y: number, cols: number, rows: number, t: number) => RGB;

const safeZoneGreen: RGB = [0, 255, 0];

// Engine player colors.
const playerColors: RGB[] = [
  [255, 0, 0], // red
  [0, 255, 255], // cyan
  [0, 255, 0], // green
  [255, 0, 255], // pink
  [0, 0, 255], // blue
  [255, 255, 0], // yellow
  [255, 128, 0], // orange
  [128, 0, 255], // purple
];

const temporada1Level1FrameCells = [
  [13, 8, 1], [12, 8, 1], [5, 6, 1], [0, 4, 1], [6, 4, 1], [10, 4, 1], [11, 4, 1], [14, 4, 1],
  [3, 24, 1], [4, 27, 1], [4, 28, 1], [13, 28, 1], [11, 22, 1], [10, 27, 1], [1, 15, 1], [5, 0, 1], [13, 1, 1],
  [9, 3, 3], [2, 11, 3], [13, 22, 3], [2, 20, 3], [7, 28, 3], [7, 19, 3],
  [0, 0, 2], [1, 0, 2], [2, 0, 2], [3, 0, 2], [4, 0, 2], [5, 0, 2], [6, 0, 2], [7, 0, 2],
  [8, 0, 2], [9, 0, 2], [10, 0, 2], [11, 0, 2], [12, 0, 2], [13, 0, 2], [14, 0, 2], [15, 0, 2],
  [0, 16, 2], [1, 16, 2], [2, 16, 2], [3, 16, 2], [4, 16, 2], [5, 16, 2], [6, 16, 2], [7, 16, 2],
  [8, 16, 2], [9, 16, 2], [10, 16, 2], [11, 16, 2], [12, 16, 2], [13, 16, 2], [14, 16, 2], [15, 16, 2],
  [9, 18, 0], [7, 10, 0], [7, 11, 0], [7, 12, 0], [7, 13, 0], [7, 14, 0], [7, 15, 0], [7, 16, 0], [7, 17, 0], [7, 18, 0],
  [8, 10, 0], [8, 11, 0], [8, 12, 0], [8, 13, 0], [8, 14, 0], [8, 15, 0], [8, 16, 0], [8, 17, 0], [8, 18, 0],
  [9, 10, 0], [9, 11, 0], [9, 12, 0], [9, 13, 0], [9, 14, 0], [9, 15, 0], [9, 16, 0], [9, 17, 0],
  [6, 10, 0], [6, 11, 0], [6, 12, 0], [6, 13, 0], [6, 14, 0], [6, 15, 0], [6, 16, 0], [6, 17, 0], [6, 18, 0],
] as const;

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

function hashText(value: string): number {
  let out = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    out ^= value.charCodeAt(index);
    out = Math.imul(out, 16777619) >>> 0;
  }
  return out || 1;
}

// Local rainbow attract preview for cards that do not have generated assets yet.
const rainbowPreview: FloorAnim = (x, y, cols, rows, t) => {
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
    const color = playerColors[mod(seed, playerColors.length)] || playerColors[0];
    const rise = age < 0.1 ? age / 0.1 : 1;
    const ratio = clamp01(1 - age / life);
    const bright = rise * Math.pow(ratio, 1.1);
    out = [color[0] * bright, color[1] * bright, color[2] * bright];
  }
  return out;
};

const simonDice: FloorAnim = (x, y, cols, rows, t) => {
  const halfCols = Math.floor(cols / 2);
  const halfRows = Math.floor(rows / 2);
  const pads: Array<{ x: number; y: number; w: number; h: number; color: RGB }> = [
    { x: 1, y: 2, w: halfCols - 2, h: halfRows - 3, color: [0, 90, 248] },
    { x: halfCols + 1, y: 2, w: cols - halfCols - 2, h: halfRows - 3, color: [255, 82, 104] },
    { x: 1, y: halfRows + 1, w: halfCols - 2, h: rows - halfRows - 3, color: [255, 209, 102] },
    { x: halfCols + 1, y: halfRows + 1, w: cols - halfCols - 2, h: rows - halfRows - 3, color: [0, 232, 98] },
  ];
  const sequence = [0, 1, 2, 0, 3, 1, 2, 3];
  const cycle = t * 1.15;
  const active = sequence[Math.floor(cycle) % sequence.length] || 0;
  const phase = cycle % 1;

  for (let i = 0; i < pads.length; i++) {
    const pad = pads[i];
    if (!onRect(x, y, pad.x, pad.y, pad.w, pad.h)) continue;
    const edge = x === pad.x || x === pad.x + pad.w - 1 || y === pad.y || y === pad.y + pad.h - 1;
    const idlePulse = 0.16 + 0.04 * Math.sin(t * 2.2 + i);
    const hitPulse = i === active ? 0.35 + 0.65 * Math.pow(1 - phase, 1.35) : 0;
    const brightness = edge ? Math.max(idlePulse + 0.1, hitPulse * 0.8) : Math.max(idlePulse, hitPulse);
    return [pad.color[0] * brightness, pad.color[1] * brightness, pad.color[2] * brightness];
  }

  const centerCue = Math.abs(x - (cols - 1) / 2) <= 1 && Math.abs(y - (rows - 1) / 2) <= 1;
  if (centerCue) {
    const flash = 0.18 + 0.42 * Math.pow(1 - phase, 1.8);
    return [255 * flash, 255 * flash, 255 * flash];
  }

  return [1, 5, 12];
};

// Floor is Lava: flowing red/orange heat with cool dark safe islands.
const lava: FloorAnim = (x, y, cols, rows, t) => {
  const nx = x / cols;
  const ny = y / rows;
  const field =
    0.5 +
    0.5 *
      Math.sin((nx * 3.0 + ny * 1.6 + t * 0.34) * Math.PI) *
      Math.cos((nx * 2.2 - ny * 3.2 - t * 0.24) * Math.PI);
  if (field < 0.48) {
    return [4, 9, 18]; // safe tile
  }
  const heat = clamp01((field - 0.48) / 0.52);
  const flicker = 0.82 + 0.18 * Math.sin((x * 1.3 + y * 0.7 + t * 6) * Math.PI);
  return [255 * flicker, (45 + 150 * heat) * flicker, 8 * heat * flicker];
};

// Saltos: blue current platform, travelling green target, and red lava underneath.
const saltos: FloorAnim = (x, y, cols, rows, t) => {
  const current = { x: Math.floor(cols / 2), y: 4 };
  const path = [
    { x: 4, y: 12 },
    { x: 11, y: 16 },
    { x: 5, y: 23 },
    { x: 12, y: 27 },
  ];
  const step = Math.floor(t / 1.7);
  const target = path[mod(step, path.length)];
  const previous = path[mod(step - 1, path.length)];
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

// Duel: balanced but organic color regions like the real versus arena.
const duel: FloorAnim = (x, y, cols, rows, t) => {
  const previewPlayers = 4;
  const fine = hash(x * 97 + y * 193 + 41);
  const coarse = hash(Math.floor(x / 2) * 271 + Math.floor(y / 2) * 379 + 17);
  const drift = hash(Math.floor((x + Math.sin(t * 0.35) * 2) / 4) * 811 + Math.floor(y / 4) * 431 + 53);
  const owner = mod((fine % previewPlayers) + (coarse % previewPlayers) + (drift % previewPlayers), previewPlayers);
  const color = playerColors[owner] || playerColors[0];
  const claimedWave = mod(Math.floor(t * 3) + y, rows);
  const claimed = y < claimedWave && hash(x * 43 + y * 89) % 5 === 0;
  const flash = claimed && Math.floor(t * 12 + x + y) % 6 === 0;
  if (flash) return [255, 255, 255];
  const brightness = claimed ? 0.18 : 0.72 + 0.28 * Math.sin(t * 2.4 + x * 0.4 + y * 0.11);
  return [color[0] * brightness, color[1] * brightness, color[2] * brightness];
};

// Memory challenge: player lanes reveal a route, then the route fades into lava.
const memory: FloorAnim = (x, y, cols, rows, t) => {
  const laneWidth = Math.floor(cols / 4);
  const lane = Math.min(3, Math.floor(x / laneWidth));
  const laneX = lane * laneWidth;
  const localX = x - laneX;
  const color = playerColors[lane] || playerColors[0];
  const cycle = mod(t, 5.8);
  const reveal = cycle < 2.2;
  const fade = clamp01(1 - (cycle - 2.2) / 1.5);
  const runProgress = clamp01((cycle - 3.0) / 2.0);
  const pathX = 1 + mod(Math.floor((y - 2) / 5) + lane, Math.max(1, laneWidth - 1));
  const onStart = y < 2 && localX >= 0 && localX < laneWidth;
  const onPath = y >= 2 && localX === pathX;

  if (onStart) {
    const pulse = 0.66 + 0.28 * Math.sin(t * 4.2 + x * 0.4);
    return [color[0] * pulse, color[1] * pulse, color[2] * pulse];
  }

  const f1 = 0.5 + 0.5 * Math.sin(x * 0.85 + y * 0.32 + t * 2.0);
  const f2 = 0.5 + 0.5 * Math.sin(y * 0.5 - t * 1.5);
  const f3 = 0.5 + 0.5 * Math.sin((x + y) * 0.41 + t * 3.7);
  const lavaBase: RGB = [18 + 54 * f1 + 16 * f3, 2 + 16 * f2 + 6 * f3, 1 + 4 * (1 - f1)];

  if (!onPath) return lavaBase;
  const indexRatio = clamp01((y - 2) / (rows - 3));
  const claimed = indexRatio < runProgress;
  const visible = reveal ? 1 : fade;
  const playerGlow = claimed ? 0.92 : 0.22 + 0.78 * visible;
  const sparkle = claimed && Math.floor(t * 12 + y) % 9 === 0 ? 1 : 0;
  return [
    lavaBase[0] * (1 - playerGlow) + color[0] * playerGlow + sparkle * 90,
    lavaBase[1] * (1 - playerGlow) + color[1] * playerGlow + sparkle * 90,
    lavaBase[2] * (1 - playerGlow) + color[2] * playerGlow + sparkle * 90,
  ];
};

// Patrones: black central canvas with bright blue target shapes and green safe border.
const patrones: FloorAnim = (x, y, cols, rows, t) => {
  const canvas = { x: 3, y: 8, w: 10, h: 16 };
  const onCanvas = onRect(x, y, canvas.x, canvas.y, canvas.w, canvas.h);
  if (!onCanvas) {
    const pulse = 0.82 + 0.18 * Math.sin(t * 3.2 + x * 0.31 + y * 0.09);
    return [0, 255 * pulse, 0];
  }

  const cx = canvas.x + Math.floor(canvas.w / 2);
  const cy = canvas.y + Math.floor(canvas.h / 2);
  const variant = Math.floor(t / 3.5) % 5;
  const points = new Set<string>();
  const add = (px: number, py: number) => points.add(`${Math.max(canvas.x + 1, Math.min(canvas.x + canvas.w - 2, px))},${Math.max(canvas.y + 1, Math.min(canvas.y + canvas.h - 2, py))}`);
  const radius = 3;
  if (variant === 1) {
    for (let i = -radius; i <= radius; i++) {
      add(cx + i, cy + i);
      add(cx + i, cy - i);
    }
  } else if (variant === 2) {
    for (let i = -radius; i <= radius; i++) {
      add(cx + i, cy - radius);
      add(cx + i, cy + radius);
      add(cx - radius, cy + i);
      add(cx + radius, cy + i);
    }
  } else if (variant === 3) {
    for (let i = 0; i <= radius * 2; i++) {
      add(cx - radius + i, cy + radius - i);
      if (i % 2 === 0) add(cx - radius + i, cy + radius - i - 1);
    }
  } else {
    for (let i = -radius; i <= radius; i++) {
      add(cx + i, cy);
      add(cx, cy + i);
    }
    if (variant === 4) {
      add(cx - radius, cy - radius);
      add(cx + radius, cy - radius);
      add(cx - radius, cy + radius);
      add(cx + radius, cy + radius);
    }
  }

  if (!points.has(`${x},${y}`)) return [0, 0, 0];
  const order = [...points].sort().findIndex((key) => key === `${x},${y}`);
  const progress = Math.floor(mod(t, 3.5) / 3.5 * (points.size + 1));
  if (order >= 0 && order < progress) return safeZoneGreen;
  const pulse = 0.78 + 0.22 * Math.sin(t * 4.4 + order * 0.5);
  return [20 * pulse, 104 * pulse, 255 * pulse];
};

const parkour: FloorAnim = (x, y, cols, rows, t) => {
  const route: Array<[number, number]> = [
    [7, 29], [7, 28], [7, 27], [8, 26], [8, 25], [8, 24],
    [7, 23], [6, 22], [6, 21], [7, 20], [8, 19], [8, 18],
    [9, 17], [9, 16], [8, 15], [7, 14], [7, 13], [6, 12],
    [6, 11], [7, 10], [8, 9], [9, 8], [9, 7], [8, 6],
    [7, 5], [7, 4], [8, 3],
  ];
  const routeIndex = route.findIndex(([rx, ry]) => rx === x && ry === y);
  const checkpoint = coinAt(x, y, [[7, 29], [9, 17], [8, 3]], t);
  if (checkpoint) return checkpoint;
  if (routeIndex >= 0) {
    const runner = mod(t * 5.2, route.length);
    const distance = Math.abs(routeIndex - runner);
    const wrapDistance = Math.min(distance, route.length - distance);
    const runnerGlow = Math.max(0, 1 - wrapDistance / 3);
    const routePulse = 0.72 + 0.18 * Math.sin(t * 4.8 + routeIndex * 0.42);
    return [
      8 + 62 * runnerGlow,
      160 + 95 * Math.max(routePulse, runnerGlow),
      56 + 120 * runnerGlow,
    ];
  }

  const sideWall = x === 0 || x === cols - 1 || y === 0 || y === rows - 1;
  const lavaWave =
    0.48 +
    0.52 *
      Math.sin((x * 0.32 + y * 0.18 + t * 1.25) * Math.PI) *
      Math.cos((x * 0.18 - y * 0.22 - t * 0.82) * Math.PI);
  const heat = clamp01(0.24 + lavaWave * 0.44 + (sideWall ? 0.18 : 0));
  const ember = Math.floor(t * 8 + x * 3 + y * 5) % 31 === 0 ? 0.24 : 0;
  return [
    Math.min(255, 86 + 132 * heat + 40 * ember),
    10 + 34 * heat + 20 * ember,
    6 + 10 * heat,
  ];
};

export function parkourLevelPreview(seedText: string): FloorAnim {
  const seed = hashText(seedText);
  const phase = (seed & 0xff) / 255;
  const waveA = 1.2 + ((seed >>> 8) % 9) / 7;
  const waveB = 0.55 + ((seed >>> 17) % 11) / 10;
  const routeWidth = 1 + ((seed >>> 28) % 2);
  const coinYs = Array.from({ length: 4 }, (_, index) => 5 + index * 7 + ((seed >>> (index * 5)) % 4));

  return (x, y, cols, rows, t) => {
    const progress = y / Math.max(1, rows - 1);
    const center =
      (cols - 1) / 2 +
      Math.sin(progress * Math.PI * (1.4 + waveA) + phase * Math.PI * 2) * (2.1 + waveB) +
      Math.sin(progress * Math.PI * (3.2 + waveB) + phase * Math.PI * 5) * 1.15;
    const routeDistance = Math.abs(x - center);
    const route = routeDistance <= routeWidth;
    const checkpoint = coinAt(
      x,
      y,
      coinYs.map((coinY, index) => [Math.round(center + (index % 2 === 0 ? -1 : 1)), coinY] as [number, number]),
      t,
    );
    if (checkpoint) return checkpoint;
    if (route) {
      const runnerY = mod(t * 5 + phase * rows, rows);
      const runnerDistance = Math.abs(y - runnerY);
      const wrappedRunnerDistance = Math.min(runnerDistance, rows - runnerDistance);
      const runnerGlow = Math.max(0, 1 - wrappedRunnerDistance / 3.2);
      const routePulse = 0.7 + 0.18 * Math.sin(t * 4.5 + y * 0.34 + phase * 6);
      return [
        8 + 64 * runnerGlow,
        150 + 105 * Math.max(routePulse, runnerGlow),
        48 + 128 * runnerGlow,
      ];
    }

    const wall = x === 0 || x === cols - 1 || y === 0 || y === rows - 1;
    const heat =
      0.36 +
      0.42 *
        Math.sin((x * (0.25 + phase * 0.12) + y * 0.19 + t * (0.7 + waveB * 0.2)) * Math.PI) *
        Math.cos((x * 0.18 - y * (0.18 + phase * 0.05) - t * 0.62) * Math.PI) +
      (wall ? 0.12 : 0);
    const ember = hash((seed + x * 31 + y * 47 + Math.floor(t * 7)) >>> 0) % 37 === 0 ? 0.18 : 0;
    const clamped = clamp01(heat);
    return [
      Math.min(255, 78 + 136 * clamped + 38 * ember),
      8 + 34 * clamped + 18 * ember,
      5 + 10 * clamped,
    ];
  };
}

function onRect(x: number, y: number, rx: number, ry: number, rw: number, rh: number): boolean {
  return x >= rx && x < rx + rw && y >= ry && y < ry + rh;
}

function coinAt(x: number, y: number, points: Array<[number, number]>, t: number): RGB | undefined {
	for (let i = 0; i < points.length; i++) {
		const [cx, cy] = points[i];
    if (x !== cx || y !== cy) continue;
    const pulse = 0.62 + 0.38 * Math.sin(t * 5.4 + i * 0.7);
    return [25 * pulse, 106 * pulse, 255 * pulse];
  }
	return undefined;
}

function purpleCoinAt(x: number, y: number, points: Array<[number, number]>, t: number): RGB | undefined {
  for (let i = 0; i < points.length; i++) {
    const [cx, cy] = points[i];
    if (x !== cx || y !== cy) continue;
    const pulse = 0.62 + 0.38 * Math.sin(t * 5.4 + i * 0.7);
    return [205 * pulse, 42 * pulse, 255 * pulse];
  }
  return undefined;
}

function pingPong(step: number, max: number): number {
  const period = max * 2;
  const value = mod(step, period);
  return value > max ? period - value : value;
}

function temporada1Preview(level: number): FloorAnim {
  return (x, y, _cols, _rows, t) => {
    let cellType: 0 | 1 | 2 | 3 | null = null;
    for (let index = temporada1Level1FrameCells.length - 1; index >= 0; index -= 1) {
      const [cellX, cellY, type] = temporada1Level1FrameCells[index];
      if (cellX === x && cellY === y) {
        cellType = type;
        break;
      }
    }
    if (cellType === null) return [2, 7, 12];
    if (cellType === 0) return safeZoneGreen;
    const phase = t + level * 0.07;
    if (cellType === 1) {
      const pulse = 0.82 + 0.18 * Math.sin(phase * 5.4 + x * 0.31 + y * 0.17);
      return [0, 0, 255 * pulse];
    }
    if (cellType === 3) {
      const pulse = 0.82 + 0.18 * Math.sin(phase * 5.4 + x * 0.37 + y * 0.13);
      return [245 * pulse, 38 * pulse, 255 * pulse];
    }
    const flicker = 0.9 + 0.1 * Math.sin(phase * 8.2 + x * 0.19);
    return [255 * flicker, 0, 0];
  };
}

export const floorAnimations: Record<string, FloorAnim> = {
  "whack-a-mole": whackAMole,
  "simon-dice": simonDice,
  animations: rainbowPreview,
  "ambient-comet": ambientComet,
  "ambient-pulse": ambientPulse,
  "ambient-spark": ambientSpark,
  lava,
  saltos,
  duel,
  memory,
  patrones,
  parkour,
  "temporada1-level-1": temporada1Preview(1),
  "temporada1-niveles": temporada1Preview(1),
};

for (let level = 2; level <= 24; level++) {
  floorAnimations[`temporada1-level-${level}`] = temporada1Preview(level);
}
