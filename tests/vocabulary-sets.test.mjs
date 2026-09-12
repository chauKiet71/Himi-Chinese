import test, { before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../db/schema.ts";
import { builtinVocabularySets, hanziCharacters, validateSet, validateSetWord, isSetStudyMode } from "../lib/vocabulary-sets.ts";
import { createVocabularySet, listMyVocabularySets, readVocabularySet, mutateVocabularySet } from "../lib/vocabulary-set-service.ts";

const owner = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const other = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const word = { hanzi: "学习", pinyin: "xuéxí", meaning: "Học tập", example: "我学习中文。", translation: "Tôi học tiếng Trung." };
let client, db;
before(async () => {
  client = new PGlite(); db = drizzle(client, { schema });
  await client.exec("CREATE TABLE users (id uuid PRIMARY KEY);");
  await client.exec(await readFile(new URL("../drizzle/0022_vocabulary_sets.sql", import.meta.url), "utf8"));
  await client.query("INSERT INTO users VALUES ($1), ($2)", [owner, other]);
});
after(async () => client?.close());
beforeEach(async () => client.exec("TRUNCATE vocabulary_sets CASCADE"));
const create = () => createVocabularySet(db, owner, { title: "Từ mới", description: "Tuần này" });

test("validates metadata, Chinese words, lengths and malformed inputs", () => {
  assert.deepEqual(validateSet({ title: "  Bộ mới  " }), { title: "Bộ mới", description: "" });
  for (const input of [null, [], {}, { title: " " }, { title: "x".repeat(101) }, { title: "ok", description: 4 }]) assert.throws(() => validateSet(input));
  for (const input of [{ ...word, hanzi: "hello" }, { ...word, pinyin: "" }, { ...word, meaning: "" }, { ...word, example: "x".repeat(501) }]) assert.throws(() => validateSetWord(input));
  assert.equal(validateSetWord({ ...word, hanzi: " 学习 " }).hanzi, "学习");
});
test("every builtin has valid unique words and supports all three study modes", () => {
  for (const set of builtinVocabularySets) {
    validateSet(set);
    assert.ok(set.words.length);
    set.words.forEach(validateSetWord);
    assert.equal(new Set(set.words.map((word) => word.id)).size, set.words.length);
    assert.ok(hanziCharacters(set.words).length);
  }
  assert.deepEqual(hanziCharacters([{ ...word, hanzi: "学习，学中文！A1" }]), ["学", "习", "中", "文"]);
  for (const mode of ["vocabulary", "hanzi", "flashcard"]) assert.equal(isSetStudyMode(mode), true);
  assert.equal(isSetStudyMode("unknown"), false);
});
test("create, add, reload, rename, remove and cascade delete persist correctly", async () => {
  const { id } = await create();
  assert.equal((await readVocabularySet(db, owner, id)).words.length, 0);
  await mutateVocabularySet(db, owner, id, { action: "addWord", data: word });
  const loaded = await readVocabularySet(db, owner, id);
  assert.equal(loaded.words[0].example, word.example);
  assert.equal((await listMyVocabularySets(db, owner))[0].wordCount, 1);
  await mutateVocabularySet(db, owner, id, { action: "update", data: { title: "Đổi tên" } });
  assert.equal((await readVocabularySet(db, owner, id)).title, "Đổi tên");
  await mutateVocabularySet(db, owner, id, { action: "removeWord", wordId: loaded.words[0].id });
  assert.equal((await readVocabularySet(db, owner, id)).words.length, 0);
  await mutateVocabularySet(db, owner, id, { action: "addWord", data: word });
  await mutateVocabularySet(db, owner, id, { action: "delete" });
  assert.equal(await readVocabularySet(db, owner, id), null);
  assert.equal((await db.select().from(schema.vocabularySetWords)).length, 0);
});
test("another account cannot list, read, edit, delete or add/remove words", async () => {
  const { id } = await create();
  await mutateVocabularySet(db, owner, id, { action: "addWord", data: word });
  const loaded = await readVocabularySet(db, owner, id);
  assert.deepEqual(await listMyVocabularySets(db, other), []);
  assert.equal(await readVocabularySet(db, other, id), null);
  for (const mutation of [{ action: "update", data: { title: "hijacked" } }, { action: "delete" }, { action: "addWord", data: word }, { action: "removeWord", wordId: loaded.words[0].id }]) {
    await assert.rejects(mutateVocabularySet(db, other, id, mutation), { status: 404 });
  }
  assert.equal((await readVocabularySet(db, owner, id)).title, "Từ mới");
  assert.equal((await readVocabularySet(db, owner, id)).words.length, 1);
});
test("rejects duplicates after normalization and cannot remove a word in another set", async () => {
  const a = await create(); const b = await create();
  await mutateVocabularySet(db, owner, a.id, { action: "addWord", data: word });
  await assert.rejects(mutateVocabularySet(db, owner, a.id, { action: "addWord", data: { ...word, hanzi: " 学习 " } }), { status: 409 });
  const loaded = await readVocabularySet(db, owner, a.id);
  await assert.rejects(mutateVocabularySet(db, owner, b.id, { action: "removeWord", wordId: loaded.words[0].id }), { status: 404 });
  assert.equal((await readVocabularySet(db, owner, a.id)).words.length, 1);
});
test("copy makes independent owned words and leaves builtin intact", async () => {
  const builtin = builtinVocabularySets[0];
  const { id } = await createVocabularySet(db, owner, {}, builtin.id);
  const copied = await readVocabularySet(db, owner, id);
  assert.equal(copied.words.length, builtin.words.length);
  assert.deepEqual(copied.words.map((w) => w.hanzi), builtin.words.map((w) => w.hanzi));
  assert.notEqual(copied.words[0].id, builtin.words[0].id);
  await mutateVocabularySet(db, owner, id, { action: "removeWord", wordId: copied.words[0].id });
  assert.equal(builtin.words.length, 8);
  await assert.rejects(createVocabularySet(db, owner, {}, "missing-source"), { status: 404 });
  await assert.rejects(mutateVocabularySet(db, owner, builtin.id, { action: "delete" }), { status: 404 });
});
test("set and word limits reject additions without losing existing data", async () => {
  await db.insert(schema.vocabularySets).values(Array.from({ length: 100 }, (_, i) => ({ userId: owner, title: `Bộ ${i}` })));
  await assert.rejects(create(), { status: 409 });
  const [set] = await listMyVocabularySets(db, owner);
  await db.insert(schema.vocabularySetWords).values(Array.from({ length: 500 }, (_, i) => ({ ...word, setId: set.id, hanzi: `词${i}` })));
  await assert.rejects(mutateVocabularySet(db, owner, set.id, { action: "addWord", data: word }), { status: 409 });
  assert.equal((await readVocabularySet(db, owner, set.id)).words.length, 500);
});
