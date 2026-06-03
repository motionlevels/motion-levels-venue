export function hexToRGB(hex: string): string {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return `${(value >> 16) & 255},${(value >> 8) & 255},${value & 255}`;
}

export function hexToColor(hex: string): { r: number; g: number; b: number } {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function initials(value: string): string {
  return value.trim().slice(0, 1).toUpperCase() || "?";
}

export function mix(left: string, right: string, amount: number): string {
  const a = parseHex(left);
  const b = parseHex(right);
  const out = a.map((value, index) => Math.round(value + (b[index] - value) * amount));
  return `rgb(${out[0]},${out[1]},${out[2]})`;
}

function parseHex(hex: string): number[] {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
