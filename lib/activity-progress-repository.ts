import "server-only";

import { eq } from "drizzle-orm";
import { readDb, writeDb } from "../db/index.ts";
import { gameAttempts, practiceAttempts } from "../db/schema.ts";
import {
  emptyGameProgress,
  emptyPracticeProgress,
  gameCourseCompletionKey,
  isGameId,
  xpForGameScore,
  type GameId,
  type GameProgressSnapshot,
  type PracticeProgressSnapshot,
} from "./activity-progress.ts";
import { isSliceHskLevel, type SliceHskLevel } from "./slice-game.ts";
import { aggregateListeningAttempts } from "./listening-performance.ts";
import { summarizePracticePerformance } from "./practice-performance.ts";

export async function getPracticeProgress(userId: string): Promise<PracticeProgressSnapshot> {
  const rows = await readDb((db) => db
    .select({
      scenarioId: practiceAttempts.scenarioId,
      correctAnswers: practiceAttempts.correctAnswers,
      totalQuestions: practiceAttempts.totalQuestions,
      totalReactionMs: practiceAttempts.totalReactionMs,
    })
    .from(practiceAttempts)
    .where(eq(practiceAttempts.userId, userId)));

  if (!rows.length) return emptyPracticeProgress;
  return {
    completedScenarioIds: Array.from(new Set(rows.map((row) => row.scenarioId))),
    attemptCount: rows.length,
    ...aggregateListeningAttempts(rows),
    ...summarizePracticePerformance(rows),
  };
}

export async function recordPracticeAttempt(input: {
  userId: string;
  scenarioId: string;
  industry: string;
  correctAnswers: number;
  totalQuestions: number;
  totalReactionMs: number;
}): Promise<PracticeProgressSnapshot> {
  await writeDb((db) => db.insert(practiceAttempts).values(input));
  return getPracticeProgress(input.userId);
}

export async function getGameProgress(userId: string): Promise<GameProgressSnapshot> {
  const rows = await readDb((db) => db
    .select({ gameId: gameAttempts.gameId, hskLevel: gameAttempts.hskLevel, score: gameAttempts.score, xpEarned: gameAttempts.xpEarned })
    .from(gameAttempts)
    .where(eq(gameAttempts.userId, userId)));

  if (!rows.length) return emptyGameProgress;
  return {
    completed: Array.from(new Set(rows.map((row) => row.gameId).filter(isGameId))),
    completedCourses: Array.from(new Set(rows.flatMap((row) => (
      isGameId(row.gameId) && isSliceHskLevel(row.hskLevel)
        ? [gameCourseCompletionKey(row.gameId, row.hskLevel)]
        : []
    )))),
    totalXp: rows.reduce((total, row) => total + row.xpEarned, 0),
    bestScore: rows.reduce((best, row) => Math.max(best, row.score), 0),
    attemptCount: rows.length,
  };
}

export async function recordGameAttempt(input: {
  userId: string;
  gameId: GameId;
  hskLevel?: SliceHskLevel | null;
  score: number;
}): Promise<GameProgressSnapshot> {
  await writeDb((db) => db.insert(gameAttempts).values({
    ...input,
    xpEarned: xpForGameScore(input.score),
  }));
  return getGameProgress(input.userId);
}
