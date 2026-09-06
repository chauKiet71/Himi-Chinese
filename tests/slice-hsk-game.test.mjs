import assert from "node:assert/strict";
import test from "node:test";
import { HSK_LESSONS } from "../lib/hsk-lesson-content.ts";
import { HSK4_UPPER_TEXTBOOK_LESSONS } from "../lib/hsk4-upper-textbook-content.ts";
import { HSK4_TEXTBOOK_LESSONS } from "../lib/hsk4-textbook-content.ts";
import { HSK6_VOLUME1_TEXTBOOK_LESSONS } from "../lib/hsk6-volume1-textbook-content.ts";
import { HSK6_VOLUME2_TEXTBOOK_LESSONS } from "../lib/hsk6-volume2-textbook-content.ts";
import { getSliceHskVocabulary } from "../lib/slice-hsk-vocabulary.ts";
import { createSliceDeck, isSliceHskLevel, normalizeSliceAnswer, SLICE_HSK_COURSES } from "../lib/slice-game.ts";

test("all six HSK courses have playable, deduplicated lesson vocabulary", () => {
  assert.equal(SLICE_HSK_COURSES.length, 6);
  for (const course of SLICE_HSK_COURSES) {
    const words = getSliceHskVocabulary(course.id);
    assert.ok(words.length >= 14, `${course.label} has enough words for 12 correct answers and two misses`);
    assert.ok(words.every((word) => word.hanzi && word.pinyin && word.meaning));
    const keys = words.map((word) => `${word.hanzi.normalize("NFC")}:${word.pinyin.normalize("NFC").toLowerCase().replace(/\s+/gu, "")}`);
    assert.equal(new Set(keys).size, words.length);
  }
  assert.equal(isSliceHskLevel("hsk-6"), true);
  for (const level of [null, "hsk-7", "__proto__", ""]) assert.equal(isSliceHskLevel(level), false);
});

test("vocabulary covers lesson sources, including both HSK4 and HSK6 volumes", () => {
  for (const [level, lessons] of [
    ["hsk-1", HSK_LESSONS],
    ["hsk-4", [...HSK4_UPPER_TEXTBOOK_LESSONS, ...HSK4_TEXTBOOK_LESSONS]],
    ["hsk-6", [...HSK6_VOLUME1_TEXTBOOK_LESSONS, ...HSK6_VOLUME2_TEXTBOOK_LESSONS]],
  ]) {
    const actual = new Set(getSliceHskVocabulary(level).map((word) => word.hanzi));
    const expected = new Set(lessons.flatMap((lesson) => lesson.vocabulary).filter((word) => word.hanzi.trim() && word.pinyin.trim() && word.meaning.trim()).map((word) => word.hanzi.trim()));
    assert.deepEqual(actual, expected);
  }
});

test("new runs shuffle the whole course without duplicates or changing source vocabulary", () => {
  const words = getSliceHskVocabulary("hsk-3");
  const before = structuredClone(words);
  const first = createSliceDeck(words, () => 0.25);
  const second = createSliceDeck(words, () => 0.75);
  assert.notDeepEqual(first.slice(0, 14).map((word) => word.id), second.slice(0, 14).map((word) => word.id));
  assert.deepEqual(new Set(first.map((word) => word.id)), new Set(words.map((word) => word.id)));
  assert.equal(new Set(first.slice(0, 14).map((word) => word.id)).size, 14);
  assert.deepEqual(words, before);
  assert.ok(first.every((word) => word.duration >= 9 && word.duration <= 14 && word.lane >= 28 && word.lane <= 72));
});

test("HSK pinyin accepts accents, joined syllables, spaces and apostrophes", () => {
  for (const [typed, target] of [["jue de", "juéde"], ["NI HAO", "nǐ hǎo"], ["xian", "xī'ān"], ["lu you", "lǚ yóu"]]) {
    assert.equal(normalizeSliceAnswer(typed), normalizeSliceAnswer(target));
  }
  assert.notEqual(normalizeSliceAnswer("ni"), normalizeSliceAnswer("nǐ hǎo"));
});
