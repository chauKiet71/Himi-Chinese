import { isSliceHskLevel, type SliceHskLevel } from "./slice-game.ts";

export const gameIds = ["slice", "memory", "connect", "listen", "write", "flash", "quiz"] as const;

export type GameId = typeof gameIds[number];
export type GameCourseCompletionKey = `${GameId}:${SliceHskLevel}`;

export type PracticeProgressSnapshot = {
  completedScenarioIds: string[];
  attemptCount: number;
  correctAnswers: number;
  totalQuestions: number;
  totalReactionMs: number;
  reactionQuestions: number;
  accuracyPercent: number | null;
  averageReactionMs: number | null;
};

export type GameProgressSnapshot = {
  completed: GameId[];
  completedCourses: GameCourseCompletionKey[];
  totalXp: number;
  bestScore: number;
  attemptCount: number;
};

export const emptyPracticeProgress: PracticeProgressSnapshot = {
  completedScenarioIds: [],
  attemptCount: 0,
  correctAnswers: 0,
  totalQuestions: 0,
  totalReactionMs: 0,
  reactionQuestions: 0,
  accuracyPercent: null,
  averageReactionMs: null,
};

export const emptyGameProgress: GameProgressSnapshot = {
  completed: [],
  completedCourses: [],
  totalXp: 0,
  bestScore: 0,
  attemptCount: 0,
};

export function isGameId(value: unknown): value is GameId {
  return typeof value === "string" && (gameIds as readonly string[]).includes(value);
}

export function gameCourseCompletionKey(gameId: GameId, level: SliceHskLevel): GameCourseCompletionKey {
  return `${gameId}:${level}`;
}

export function isGameCourseCompletionKey(value: unknown): value is GameCourseCompletionKey {
  if (typeof value !== "string") return false;
  const separator = value.indexOf(":");
  if (separator < 1) return false;
  return isGameId(value.slice(0, separator)) && isSliceHskLevel(value.slice(separator + 1));
}

export function hasCompletedGameCourse(
  completedCourses: readonly GameCourseCompletionKey[],
  gameId: GameId,
  level: SliceHskLevel,
): boolean {
  return completedCourses.includes(gameCourseCompletionKey(gameId, level));
}

export function xpForGameScore(score: number): number {
  return Math.max(100, Math.round(score / 2));
}
