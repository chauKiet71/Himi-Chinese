import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../db/schema.ts";
import { listSavedVocabulary, removeSavedVocabulary, saveLearningVocabulary, validateSavedVocabulary } from "../lib/saved-vocabulary-service.ts";
import { eq } from "drizzle-orm";

async function migratedDatabase() {
  const client = new PGlite();
  for (const migration of [
    "0000_amused_the_initiative.sql",
    "0001_mushy_donald_blake.sql",
    "0002_reflective_lilandra.sql",
    "0004_hesitant_cerise.sql",
    "0006_spooky_shocker.sql",
    "0016_natural_marvel_apes.sql",
    "0023_saved_vocabulary_words.sql",
    "0024_review_saved_visibility.sql",
  ]) await client.exec(await readFile(new URL(`../drizzle/${migration}`, import.meta.url), "utf8"));
  return { client, db: drizzle(client, { schema }) };
}

test("saved vocabulary combines HSK saves with reviewed course words", async () => {
  const { client, db } = await migratedDatabase();
  try {
    const [user] = await db.insert(schema.users).values({ email: "learner@example.com" }).returning({ id: schema.users.id });
    const [course] = await db.insert(schema.courses).values({
      slug: "giao-tiep-cong-so",
      titleVi: "Giao tiếp công sở",
      titleZh: "办公室沟通",
      hanzi: "说",
      category: "communication",
      description: "Giao tiếp",
      level: "Cơ bản",
      status: "published",
    }).returning({ id: schema.courses.id });
    const [module] = await db.insert(schema.modules).values({ courseId: course.id, slug: "chao-hoi", title: "Chào hỏi" }).returning({ id: schema.modules.id });
    const [lesson] = await db.insert(schema.lessons).values({ moduleId: module.id, slug: "xin-chao", title: "Xin chào", status: "published" }).returning({ id: schema.lessons.id });
    const [courseWord] = await db.insert(schema.vocabulary).values({ slug: "xin-chao", hanzi: "你好", pinyin: "nǐ hǎo", meaningVi: "Xin chào" }).returning({ id: schema.vocabulary.id });
    await db.insert(schema.lessonVocabulary).values({ lessonId: lesson.id, vocabularyId: courseWord.id });
    await db.insert(schema.reviewItems).values({ userId: user.id, vocabularyId: courseWord.id, lastReviewedAt: new Date("2026-01-01T00:00:00Z") });

    await saveLearningVocabulary(user.id, {
      sourceType: "hsk",
      sourceKey: "hsk1-lesson-01:word-01",
      sourceTitle: "HSK 1 · Bài 1",
      hanzi: "您",
      pinyin: "nín",
      meaning: "Ngài; ông; bà",
      example: "您好！",
      translation: "Xin chào!",
    }, db);

    const words = await listSavedVocabulary(user.id, db);
    assert.equal(words.length, 2);
    assert.deepEqual(words.map((word) => word.hanzi).sort(), ["你好", "您"].sort());
    assert.equal(words.find((word) => word.hanzi === "您")?.sourceType, "hsk");
    assert.equal(words.find((word) => word.hanzi === "你好")?.sourceTitle, "Giao tiếp công sở");

    const [otherUser] = await db.insert(schema.users).values({ email: "other@example.com" }).returning({ id: schema.users.id });
    const hskWord = words.find((word) => word.hanzi === "您");
    await assert.rejects(removeSavedVocabulary(otherUser.id, { id: hskWord.id }, db), { status: 404 });
    assert.equal((await listSavedVocabulary(user.id, db)).length, 2);

    await removeSavedVocabulary(user.id, { id: hskWord.id }, db);
    assert.deepEqual((await listSavedVocabulary(user.id, db)).map((word) => word.hanzi), ["你好"]);

    // A word saved from multiple sources must not reappear after refresh.
    const duplicate = { sourceType: "hsk", sourceKey: "hsk1:hello", sourceTitle: "HSK 1", hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào" };
    await saveLearningVocabulary(user.id, duplicate, db);
    await saveLearningVocabulary(user.id, { ...duplicate, sourceKey: "hsk2:hello" }, db);
    await saveLearningVocabulary(otherUser.id, duplicate, db);
    const reviewBefore = (await db.select().from(schema.reviewItems).where(eq(schema.reviewItems.userId, user.id)))[0];
    await removeSavedVocabulary(user.id, { id: courseWord.id }, db);
    assert.deepEqual(await listSavedVocabulary(user.id, db), []);
    assert.equal((await listSavedVocabulary(otherUser.id, db)).length, 1);
    const reviewAfter = (await db.select().from(schema.reviewItems).where(eq(schema.reviewItems.userId, user.id)))[0];
    assert.deepEqual(reviewAfter, { ...reviewBefore, isSaved: false });

    // Saving again restores the word without resetting review progress.
    await saveLearningVocabulary(user.id, duplicate, db);
    assert.equal((await listSavedVocabulary(user.id, db)).length, 1);
    await removeSavedVocabulary(user.id, { id: (await listSavedVocabulary(user.id, db))[0].id }, db);
    assert.deepEqual(await listSavedVocabulary(user.id, db), []);
  } finally {
    await client.close();
  }
});

test("saved vocabulary input rejects unsupported sources", () => {
  assert.throws(() => validateSavedVocabulary({ sourceType: "unknown" }), { status: 400 });
});

test("unsaving rejects malformed identifiers before database access", async () => {
  for (const value of [null, {}, { id: "invalid" }, { id: 123 }]) {
    await assert.rejects(removeSavedVocabulary("unused", value), { status: 400 });
  }
});
