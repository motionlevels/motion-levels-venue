import type { PlatformGameCatalogEntry } from "./api";
import type { DifficultyID, GameCard, GameLevel } from "./catalog";

export const catalogDifficultyIDs = ["easy", "medium", "hard", "expert"] as const satisfies readonly DifficultyID[];

const difficultyLabels: Record<DifficultyID, string> = {
  easy: "Fácil",
  medium: "Media",
  hard: "Difícil",
  expert: "Experto",
};

export type PlayerBounds = {
  maxPlayers: number;
  minPlayers: number;
};

export function normalizeEstimatedDurationSeconds(value: unknown): number {
  return clampInteger(value, 0, 24 * 60 * 60, 0);
}

export function estimatedDurationLabel(seconds: number): string {
  const clean = normalizeEstimatedDurationSeconds(seconds);
  if (clean <= 0) return "";
  if (clean < 60) return `${clean}s`;
  const minutes = Math.round(clean / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainderMinutes = minutes % 60;
  return remainderMinutes ? `${hours}h ${remainderMinutes} min` : `${hours}h`;
}

export function platformDurationLabel(
  entry: Pick<PlatformGameCatalogEntry, "duration_label" | "estimated_duration_seconds">,
  fallback?: Pick<GameCard, "duration">,
): string {
  const configured = String(entry.duration_label || "").trim();
  return configured || estimatedDurationLabel(entry.estimated_duration_seconds) || fallback?.duration || "";
}

export function platformSupportsLevels(
  entry: Pick<PlatformGameCatalogEntry, "supports_levels">,
  fallback?: Pick<GameCard, "supportsLevels">,
): boolean {
  if (typeof entry.supports_levels === "boolean") return entry.supports_levels;
  return fallback?.supportsLevels === true;
}

export function normalizeDifficultyIDs(value: unknown): DifficultyID[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<DifficultyID>();
  for (const item of value) {
    if (catalogDifficultyIDs.includes(item as DifficultyID)) {
      seen.add(item as DifficultyID);
    }
  }
  return catalogDifficultyIDs.filter((difficulty) => seen.has(difficulty));
}

export function platformPlayerBounds(entry: Pick<PlatformGameCatalogEntry, "max_players" | "min_players">): PlayerBounds {
  const minPlayers = clampInteger(entry.min_players, 1, 99, 1);
  const maxPlayers = Math.max(minPlayers, clampInteger(entry.max_players, 1, 99, minPlayers));
  return { maxPlayers, minPlayers };
}

export function platformPlayerRangeLabel(entry: PlatformGameCatalogEntry, fallback?: Pick<GameCard, "players">): string {
  const { maxPlayers, minPlayers } = platformPlayerBounds(entry);
  const structured = minPlayers === maxPlayers ? String(minPlayers) : `${minPlayers}-${maxPlayers}`;
  const configured = String(entry.players_label || "").trim();
  return configured && configured !== structured ? configured : structured;
}

export function platformSupportedDifficulties(
  entry: Pick<PlatformGameCatalogEntry, "difficulties">,
  fallback?: Pick<GameCard, "difficulties">,
): DifficultyID[] | undefined {
  const supported = normalizeDifficultyIDs(entry.difficulties);
  if (supported.length) return supported;
  return fallback?.difficulties?.length ? fallback.difficulties : undefined;
}

export function platformDifficultyLabel(
  entry: Pick<PlatformGameCatalogEntry, "difficulties" | "difficulty_label">,
  fallback?: Pick<GameCard, "difficulty" | "difficulties">,
): string {
  const configured = String(entry.difficulty_label || "").trim();
  if (configured) return configured;
  const supported = platformSupportedDifficulties(entry, fallback);
  if (supported?.length === catalogDifficultyIDs.length) return "Fácil-Experto";
  if (supported && supported.length > 1) {
    return `${difficultyLabels[supported[0]]}-${difficultyLabels[supported[supported.length - 1]]}`;
  }
  if (supported?.length === 1) return difficultyLabels[supported[0]];
  return fallback?.difficulty || "Juego";
}

export function supportedDifficultiesForGame(game: Pick<GameCard, "difficulties">, level?: Pick<GameLevel, "difficulties">): DifficultyID[] {
  const gameSupported = game.difficulties?.length ? game.difficulties : [...catalogDifficultyIDs];
  if (!level?.difficulties?.length) return gameSupported;
  const levelSupported = level.difficulties.filter((difficulty) => gameSupported.includes(difficulty));
  return levelSupported.length ? levelSupported : gameSupported;
}

export function difficultyRank(difficulty: DifficultyID): number {
  return catalogDifficultyIDs.indexOf(difficulty);
}

export function closestSupportedDifficulty(requested: DifficultyID, supported: DifficultyID[]): DifficultyID {
  if (supported.includes(requested)) return requested;
  const fallback = supported[0] || catalogDifficultyIDs[0];
  return supported.reduce((best, candidate) => {
    const bestDistance = Math.abs(difficultyRank(best) - difficultyRank(requested));
    const candidateDistance = Math.abs(difficultyRank(candidate) - difficultyRank(requested));
    if (candidateDistance !== bestDistance) return candidateDistance < bestDistance ? candidate : best;
    return difficultyRank(candidate) > difficultyRank(best) ? candidate : best;
  }, fallback);
}

export function playerBoundsForGame(
  game: Pick<GameCard, "engineGame" | "id" | "category" | "maxPlayers" | "minPlayers">,
): PlayerBounds {
  if (Number.isFinite(game.minPlayers) && Number.isFinite(game.maxPlayers)) {
    const minPlayers = clampInteger(game.minPlayers, 1, 99, 1);
    const maxPlayers = Math.max(minPlayers, clampInteger(game.maxPlayers, 1, 99, minPlayers));
    return { maxPlayers, minPlayers };
  }
  if (game.category === "individual") return { minPlayers: 1, maxPlayers: 1 };
  if ((game.engineGame || game.id) === "duel" || (game.engineGame || game.id) === "memory") {
    return { minPlayers: 2, maxPlayers: 4 };
  }
  return { minPlayers: 1, maxPlayers: 6 };
}

export function rosterForGame<T extends { active: boolean }>(
  game: Pick<GameCard, "engineGame" | "id" | "category" | "maxPlayers" | "minPlayers">,
  players: T[],
): T[] {
  const { maxPlayers } = playerBoundsForGame(game);
  return players.filter((player) => player.active).slice(0, maxPlayers);
}

function clampInteger(value: unknown, min: number, max: number, fallback: number) {
  const next = Number(value);
  if (!Number.isFinite(next)) return fallback;
  return Math.min(max, Math.max(min, Math.round(next)));
}
