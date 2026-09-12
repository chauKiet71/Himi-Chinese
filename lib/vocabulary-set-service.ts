import { and, asc, count, desc, eq } from "drizzle-orm";
import type { Database } from "../db/index.ts";
import { users, vocabularySets, vocabularySetWords } from "../db/schema.ts";
import { getBuiltinSet, isSetId, validateSet, validateSetWord, VocabularySetError, type VocabularySet } from "./vocabulary-sets.ts";

export async function listMyVocabularySets(db: Database, userId: string) {
  return db.select({ id: vocabularySets.id, title: vocabularySets.title, description: vocabularySets.description, wordCount: count(vocabularySetWords.id) })
    .from(vocabularySets).leftJoin(vocabularySetWords, eq(vocabularySetWords.setId, vocabularySets.id))
    .where(eq(vocabularySets.userId, userId)).groupBy(vocabularySets.id).orderBy(desc(vocabularySets.updatedAt));
}

export async function readVocabularySet(db: Database, userId: string, id: string): Promise<VocabularySet | null> {
  if (!isSetId(id)) return null;
  const [set] = await db.select().from(vocabularySets).where(and(eq(vocabularySets.id, id), eq(vocabularySets.userId, userId))).limit(1);
  if (!set) return null;
  const words = await db.select().from(vocabularySetWords).where(eq(vocabularySetWords.setId, id)).orderBy(asc(vocabularySetWords.createdAt), asc(vocabularySetWords.id));
  return { id: set.id, title: set.title, description: set.description, category: "Cá nhân", builtin: false, words: words.map(({ id, hanzi, pinyin, meaning, example, translation }) => ({ id, hanzi, pinyin, meaning, example, translation })) };
}

export async function createVocabularySet(db: Database, userId: string, input: unknown, sourceId?: string) {
  const source = sourceId ? getBuiltinSet(sourceId) : undefined;
  if (sourceId && !source) throw new VocabularySetError("Không tìm thấy bộ có sẵn.", 404);
  const metadata = validateSet(source ?? input);
  return db.transaction(async (tx) => {
    // Serialize set creation per account so concurrent requests cannot exceed the limit.
    await tx.select({ id: users.id }).from(users).where(eq(users.id, userId)).for("update");
    const [total] = await tx.select({ value: count() }).from(vocabularySets).where(eq(vocabularySets.userId, userId));
    if (total.value >= 100) throw new VocabularySetError("Bạn đã có 100 bộ. Hãy xóa bộ không còn dùng.", 409);
    const [set] = await tx.insert(vocabularySets).values({ ...metadata, userId }).returning({ id: vocabularySets.id });
    if (source?.words.length) await tx.insert(vocabularySetWords).values(source.words.map((word, index) => ({ ...validateSetWord(word), setId: set.id, createdAt: new Date(Date.now() + index) })));
    return set;
  });
}

export type SetMutation = { action: "update"; data: unknown } | { action: "delete" } | { action: "addWord"; data: unknown } | { action: "removeWord"; wordId: string };
export async function mutateVocabularySet(db: Database, userId: string, id: string, mutation: SetMutation) {
  if (!isSetId(id)) throw new VocabularySetError("Không tìm thấy bộ từ vựng.", 404);
  return db.transaction(async (tx) => {
    const [set] = await tx.select({ id: vocabularySets.id }).from(vocabularySets)
      .where(and(eq(vocabularySets.id, id), eq(vocabularySets.userId, userId))).for("update");
    if (!set) throw new VocabularySetError("Không tìm thấy bộ từ vựng.", 404);
    if (mutation.action === "delete") {
      await tx.delete(vocabularySets).where(eq(vocabularySets.id, id));
      return;
    }
    if (mutation.action === "update") {
      await tx.update(vocabularySets).set({ ...validateSet(mutation.data), updatedAt: new Date() }).where(eq(vocabularySets.id, id));
      return;
    }
    if (mutation.action === "addWord") {
      const word = validateSetWord(mutation.data);
      const [total] = await tx.select({ value: count() }).from(vocabularySetWords).where(eq(vocabularySetWords.setId, id));
      if (total.value >= 500) throw new VocabularySetError("Mỗi bộ chứa tối đa 500 từ.", 409);
      const added = await tx.insert(vocabularySetWords).values({ ...word, setId: id }).onConflictDoNothing().returning({ id: vocabularySetWords.id });
      if (!added.length) throw new VocabularySetError("Từ này với pinyin này đã có trong bộ.", 409);
    } else {
      if (!isSetId(mutation.wordId)) throw new VocabularySetError("Không tìm thấy từ.", 404);
      const removed = await tx.delete(vocabularySetWords).where(and(eq(vocabularySetWords.setId, id), eq(vocabularySetWords.id, mutation.wordId))).returning({ id: vocabularySetWords.id });
      if (!removed.length) throw new VocabularySetError("Không tìm thấy từ trong bộ này.", 404);
    }
    await tx.update(vocabularySets).set({ updatedAt: new Date() }).where(eq(vocabularySets.id, id));
  });
}
