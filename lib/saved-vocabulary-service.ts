import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { readDb, writeDb, type Database } from "../db/index.ts";
import {
  courses,
  lessons,
  lessonVocabulary,
  modules,
  reviewItems,
  savedVocabularyWords,
  vocabulary,
} from "../db/schema.ts";
import type { SavedVocabulary } from "./content-types.ts";

export type SaveLearningVocabularyInput = {
  sourceType: "hsk" | "course";
  sourceKey: string;
  sourceTitle: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example?: string;
  translation?: string;
  audioUrl?: string | null;
};

export class SavedVocabularyError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

function text(value: unknown, label: string, max: number, required = true): string {
  if (value === undefined && !required) return "";
  if (typeof value !== "string") throw new SavedVocabularyError(`${label} không hợp lệ.`);
  const normalized = value.normalize("NFC").trim();
  if ((required && !normalized) || normalized.length > max) throw new SavedVocabularyError(`${label} không hợp lệ.`);
  return normalized;
}

export function validateSavedVocabulary(value: unknown): SaveLearningVocabularyInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new SavedVocabularyError("Dữ liệu không hợp lệ.");
  const input = value as Record<string, unknown>;
  if (input.sourceType !== "hsk" && input.sourceType !== "course") throw new SavedVocabularyError("Nguồn từ vựng không hợp lệ.");
  const audioUrl = input.audioUrl === null || input.audioUrl === undefined ? null : text(input.audioUrl, "Audio", 2_000, false);
  return {
    sourceType: input.sourceType,
    sourceKey: text(input.sourceKey, "Mã nguồn", 180),
    sourceTitle: text(input.sourceTitle, "Tên nguồn", 180),
    hanzi: text(input.hanzi, "Từ tiếng Trung", 120),
    pinyin: text(input.pinyin, "Pinyin", 220),
    meaning: text(input.meaning, "Nghĩa tiếng Việt", 500),
    example: text(input.example, "Ví dụ", 1_000, false),
    translation: text(input.translation, "Dịch ví dụ", 1_000, false),
    audioUrl,
  };
}

export async function saveLearningVocabulary(userId: string, value: unknown, database?: Database): Promise<void> {
  const input = validateSavedVocabulary(value);
  const operation = async (db: Database) => {
    const now = new Date();
    await db.insert(savedVocabularyWords).values({ userId, ...input, updatedAt: now })
      .onConflictDoUpdate({
        target: [savedVocabularyWords.userId, savedVocabularyWords.sourceType, savedVocabularyWords.sourceKey],
        set: { ...input, updatedAt: now },
      });
  };
  if (database) await operation(database); else await writeDb(operation);
}

type SavedRow = SavedVocabulary & { savedAt: Date };

export async function removeSavedVocabulary(userId: string, value: unknown, database?: Database): Promise<void> {
  const id = value && typeof value === "object" ? (value as Record<string, unknown>).id : undefined;
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new SavedVocabularyError("Mã từ vựng không hợp lệ.");
  }
  const operation = async (db: Database) => db.transaction(async (tx) => {
    const [explicit] = await tx.select({ hanzi: savedVocabularyWords.hanzi, pinyin: savedVocabularyWords.pinyin })
      .from(savedVocabularyWords).where(and(eq(savedVocabularyWords.userId, userId), eq(savedVocabularyWords.id, id))).limit(1);
    const word = explicit ?? (await tx.select({ hanzi: vocabulary.hanzi, pinyin: vocabulary.pinyin })
      .from(reviewItems).innerJoin(vocabulary, eq(reviewItems.vocabularyId, vocabulary.id))
      .where(and(eq(reviewItems.userId, userId), eq(vocabulary.id, id))).limit(1))[0];
    if (!word) throw new SavedVocabularyError("Không tìm thấy từ đã lưu.", 404);

    // The library merges identical words across sources. Remove every saved
    // copy for this learner, while retaining the review schedule and scores.
    await tx.delete(savedVocabularyWords).where(and(
      eq(savedVocabularyWords.userId, userId), eq(savedVocabularyWords.hanzi, word.hanzi), eq(savedVocabularyWords.pinyin, word.pinyin),
    ));
    await tx.update(reviewItems).set({ isSaved: false }).where(and(
      eq(reviewItems.userId, userId),
      inArray(reviewItems.vocabularyId, tx.select({ id: vocabulary.id }).from(vocabulary)
        .where(and(eq(vocabulary.hanzi, word.hanzi), eq(vocabulary.pinyin, word.pinyin)))),
    ));
  });
  if (database) await operation(database); else await writeDb(operation);
}

function mergeSavedRows(rows: SavedRow[]): SavedVocabulary[] {
  const unique = new Map<string, SavedRow>();
  for (const row of rows.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime())) {
    const key = `${row.hanzi}\u0000${row.pinyin}`;
    if (!unique.has(key)) unique.set(key, row);
  }
  return [...unique.values()].map((word) => ({
    id: word.id,
    slug: word.slug,
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    meaning: word.meaning,
    example: word.example,
    translation: word.translation,
    audioUrl: word.audioUrl,
    sourceTitle: word.sourceTitle,
    sourceType: word.sourceType,
  }));
}

export async function listSavedVocabulary(userId: string, database?: Database): Promise<SavedVocabulary[]> {
  const operation = async (db: Database) => {
    const [explicitRows, reviewRows] = await Promise.all([
      db.select({
        id: savedVocabularyWords.id,
        slug: savedVocabularyWords.sourceKey,
        hanzi: savedVocabularyWords.hanzi,
        pinyin: savedVocabularyWords.pinyin,
        meaning: savedVocabularyWords.meaning,
        example: savedVocabularyWords.example,
        translation: savedVocabularyWords.translation,
        audioUrl: savedVocabularyWords.audioUrl,
        sourceTitle: savedVocabularyWords.sourceTitle,
        sourceType: savedVocabularyWords.sourceType,
        savedAt: savedVocabularyWords.updatedAt,
      }).from(savedVocabularyWords)
        .where(eq(savedVocabularyWords.userId, userId))
        .orderBy(desc(savedVocabularyWords.updatedAt))
        .limit(300),
      db.select({
        id: vocabulary.id,
        slug: vocabulary.slug,
        hanzi: vocabulary.hanzi,
        pinyin: vocabulary.pinyin,
        meaning: vocabulary.meaningVi,
        example: vocabulary.exampleZh,
        translation: vocabulary.exampleVi,
        audioUrl: vocabulary.audioUrl,
        sourceTitle: courses.titleVi,
        savedAt: reviewItems.lastReviewedAt,
      }).from(reviewItems)
        .innerJoin(vocabulary, eq(reviewItems.vocabularyId, vocabulary.id))
        .innerJoin(lessonVocabulary, eq(lessonVocabulary.vocabularyId, vocabulary.id))
        .innerJoin(lessons, eq(lessonVocabulary.lessonId, lessons.id))
        .innerJoin(modules, eq(lessons.moduleId, modules.id))
        .innerJoin(courses, eq(modules.courseId, courses.id))
        .where(and(eq(reviewItems.userId, userId), eq(reviewItems.isSaved, true), eq(courses.status, "published"), eq(lessons.status, "published")))
        .orderBy(desc(reviewItems.lastReviewedAt), asc(courses.sortOrder), asc(modules.sortOrder), asc(lessons.sortOrder), asc(lessonVocabulary.sortOrder))
        .limit(600),
    ]);

    const normalizedExplicit: SavedRow[] = explicitRows.map((row) => ({
      ...row,
      sourceType: row.sourceType === "hsk" ? "hsk" : "course",
    }));
    const normalizedReviews: SavedRow[] = reviewRows.map((row) => ({
      ...row,
      example: row.example ?? "",
      translation: row.translation ?? "",
      sourceType: "course",
      savedAt: row.savedAt ?? new Date(0),
    }));
    return mergeSavedRows([...normalizedExplicit, ...normalizedReviews]);
  };
  return database ? operation(database) : readDb(operation);
}
