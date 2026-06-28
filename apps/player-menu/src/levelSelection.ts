import type { DifficultyID, GameCard, GameLevel } from "./catalog";
import { closestSupportedDifficulty, supportedDifficultiesForGame } from "./catalogSync.ts";

export function selectableDifficultiesForGame(game: Pick<GameCard, "difficulties" | "levels">): DifficultyID[] {
  const gameSupported = supportedDifficultiesForGame(game);
  if (!game.levels?.length) return gameSupported;

  const levelSupported = new Set<DifficultyID>();
  for (const level of game.levels) {
    for (const difficulty of supportedDifficultiesForGame(game, level)) {
      levelSupported.add(difficulty);
    }
  }
  const filtered = gameSupported.filter((difficulty) => levelSupported.has(difficulty));
  return filtered.length ? filtered : gameSupported;
}

export function levelSupportsDifficulty(
  game: Pick<GameCard, "difficulties">,
  level: Pick<GameLevel, "difficulties"> | undefined,
  difficulty: DifficultyID,
): boolean {
  if (!level) return false;
  return supportedDifficultiesForGame(game, level).includes(difficulty);
}

export function levelsForDifficulty(game: Pick<GameCard, "difficulties" | "levels">, difficulty: DifficultyID): GameLevel[] {
  const levels = game.levels || [];
  if (!levels.length) return [];
  const activeDifficulty = closestSupportedDifficulty(difficulty, selectableDifficultiesForGame(game));
  const filtered = levels.filter((level) => levelSupportsDifficulty(game, level, activeDifficulty));
  return filtered.length ? filtered : levels;
}

export function defaultLevelIDForDifficulty(game: Pick<GameCard, "difficulties" | "levels">, difficulty: DifficultyID): string {
  return levelsForDifficulty(game, difficulty)[0]?.id || game.levels?.[0]?.id || "";
}

export function closestLevelIDForDifficulty(
  game: Pick<GameCard, "difficulties" | "levels">,
  levelID: string,
  difficulty: DifficultyID,
): string {
  const levels = game.levels || [];
  if (!levels.length) return "";
  const activeDifficulty = closestSupportedDifficulty(difficulty, selectableDifficultiesForGame(game));
  const currentLevel = levels.find((level) => level.id === levelID);
  if (currentLevel && levelSupportsDifficulty(game, currentLevel, activeDifficulty)) return currentLevel.id;

  const available = levelsForDifficulty(game, activeDifficulty);
  if (!available.length) return levels[0]?.id || "";
  const currentIndex = levels.findIndex((level) => level.id === levelID);
  if (currentIndex < 0) return available[0].id;
  const nextIndex = Math.min(currentIndex, available.length - 1);
  return available[nextIndex]?.id || available[0].id;
}

export function normalizedDifficultyForGame(game: Pick<GameCard, "difficulties" | "levels">, difficulty: DifficultyID): DifficultyID {
  return closestSupportedDifficulty(difficulty, selectableDifficultiesForGame(game));
}
