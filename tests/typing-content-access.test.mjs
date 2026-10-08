import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { typingLevelTarget, typingLessonTarget, typingQuestionTarget } from "../lib/content-access-types.ts";
import { resolveTypingLessonContent } from "../lib/typing-content-access.ts";

const lesson = JSON.parse(await readFile(new URL("../content/typing-practice/lessons/hsk-1/hsk1-l2.json", import.meta.url), "utf8"));
const policy = (target, tier = "vip") => ({ targetType: target.type, targetKey: target.key, tier });
const resolve = (policies = [], viewerAuthenticated = true, viewerHasVip = false) => resolveTypingLessonContent({ lesson, policies, viewerAuthenticated, viewerHasVip });
const parents = [typingLevelTarget(lesson.level), typingLessonTarget(lesson.level, lesson.id)];

for (const target of parents) {
  test(`${target.type} VIP lock blocks the whole typing lesson and child free rules cannot bypass it`, () => {
    const child = typingQuestionTarget(lesson.level, lesson.id, "word", lesson.words[0].id);
    const policies = [policy(target), policy(child, "guest")];
    assert.equal(resolve(policies).access.source, "vip_required");
    assert.equal(resolve(policies).lesson, null);
    assert.equal(resolve(policies, false).lesson, null);
    assert.deepEqual(resolve(policies, true, true).lesson, lesson);
  });
}

test("word and sentence locks redact answers, audio and segments without hiding accessible siblings", () => {
  for (const [stage, collection] of [["word", "words"], ["sentence", "sentences"]]) {
    const original = lesson[collection][0];
    const target = typingQuestionTarget(lesson.level, lesson.id, stage, original.id);
    const result = resolve([policy(target)]);
    assert.equal(result.access.allowed, true);
    const locked = result.lesson[collection][0];
    assert.equal(locked.id, original.id);
    assert.equal(locked.locked, true);
    assert.equal(locked.requiredTier, "vip");
    assert.equal(locked.hanzi, "");
    assert.equal(locked.pinyin, "");
    assert.equal(locked.meaning, "");
    assert.deepEqual(locked.audio, { normal: "", slow: "" });
    assert.deepEqual(locked.words, []);
    assert.deepEqual(locked.segments, []);
    assert.equal(locked.partOfSpeech, undefined);
    assert.deepEqual(result.lesson[collection][1], lesson[collection][1]);
    assert.deepEqual(resolve([policy(target)], true, true).lesson, lesson);
    assert.notEqual(original.hanzi, "", "redaction must not mutate the server source");
  }
});

test("typing rules are independent from HSK roadmap policies", () => {
  const policies = [
    { targetType: "hsk_level", targetKey: lesson.level, tier: "vip" },
    { targetType: "hsk_lesson", targetKey: `${lesson.level}:${lesson.id}`, tier: "vip" },
  ];
  assert.deepEqual(resolve(policies).lesson, lesson);
});

test("default typing needs login; guest lessons open while free child questions still require login", () => {
  assert.equal(resolve([], false).access.source, "login_required");
  assert.equal(resolve([], false).lesson, null);
  const guest = policy(parents[1], "guest");
  assert.deepEqual(resolve([guest], false).lesson, lesson);
  const item = typingQuestionTarget(lesson.level, lesson.id, "word", lesson.words[0].id);
  const result = resolve([guest, policy(item, "free")], false);
  assert.equal(result.lesson.words[0].locked, true);
  assert.equal(result.lesson.words[0].requiredTier, "free");
  assert.deepEqual(result.lesson.words[1], lesson.words[1]);
  assert.equal(typingQuestionTarget(lesson.level, lesson.id, "sentence", lesson.words[0].id).key === item.key, false);
});
