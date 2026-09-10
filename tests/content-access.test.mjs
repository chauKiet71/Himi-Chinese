import assert from "node:assert/strict";
import test from "node:test";
import {
  hskLessonTarget,
  hskLevelTarget,
  hskQuestionTarget,
  hskVocabularyTarget,
  hskWritingTarget,
  learningLessonTarget,
  learningModuleTarget,
  learningPathTarget,
  resolveContentAccess,
} from "../lib/content-access-types.ts";

test("content access inherits a VIP lock from every parent level", () => {
  const targets = [learningPathTarget("course-1"), learningModuleTarget("module-1"), learningLessonTarget("lesson-1", true)];
  const policies = [{ targetType: "learning_module", targetKey: "module-1", tier: "vip" }];

  const guest = resolveContentAccess({ targets, policies, viewerHasVip: false });
  assert.equal(guest.allowed, false);
  assert.equal(guest.requiredTier, "vip");
  assert.deepEqual(guest.lockedAt, learningModuleTarget("module-1"));

  const member = resolveContentAccess({ targets, policies, viewerHasVip: true });
  assert.equal(member.allowed, true);
  assert.equal(member.source, "vip");
});

test("legacy paid lessons remain VIP without an explicit policy", () => {
  const access = resolveContentAccess({
    targets: [learningPathTarget("course-1"), learningModuleTarget("module-1"), learningLessonTarget("lesson-1", false)],
    policies: [],
    viewerHasVip: false,
  });
  assert.equal(access.allowed, false);
  assert.equal(access.lockedAt?.type, "learning_lesson");
});

test("question policies apply independently inside an accessible HSK lesson", () => {
  const targets = [hskLevelTarget("hsk-2"), hskLessonTarget("hsk-2", "lesson-1"), hskQuestionTarget("hsk-2", "lesson-1", "question-2")];
  const policies = [{ targetType: "hsk_question", targetKey: "hsk-2:lesson-1:question-2", tier: "vip" }];
  const access = resolveContentAccess({ targets, policies, viewerHasVip: false });
  assert.equal(access.allowed, false);
  assert.equal(access.lockedAt?.type, "hsk_question");
});

test("vocabulary and writing policies lock individual HSK items", () => {
  const parents = [hskLevelTarget("hsk-1"), hskLessonTarget("hsk-1", "lesson-1")];
  const vocabulary = hskVocabularyTarget("hsk-1", "lesson-1", "word-3");
  const writing = hskWritingTarget("hsk-1", "lesson-1", "word-5");
  const policies = [
    { targetType: "hsk_vocabulary", targetKey: vocabulary.key, tier: "vip" },
    { targetType: "hsk_writing", targetKey: writing.key, tier: "vip" },
  ];

  const vocabularyAccess = resolveContentAccess({ targets: [...parents, vocabulary], policies, viewerHasVip: false });
  const writingAccess = resolveContentAccess({ targets: [...parents, writing], policies, viewerHasVip: false });
  assert.equal(vocabularyAccess.allowed, false);
  assert.equal(vocabularyAccess.lockedAt?.type, "hsk_vocabulary");
  assert.equal(writingAccess.allowed, false);
  assert.equal(writingAccess.lockedAt?.type, "hsk_writing");
  assert.equal(resolveContentAccess({ targets: [...parents, vocabulary], policies, viewerHasVip: true }).allowed, true);
});

test("a child free rule never bypasses a VIP parent", () => {
  const targets = [hskLevelTarget("hsk-3"), hskLessonTarget("hsk-3", "lesson-1")];
  const access = resolveContentAccess({
    targets,
    policies: [
      { targetType: "hsk_level", targetKey: "hsk-3", tier: "vip" },
      { targetType: "hsk_lesson", targetKey: "hsk-3:lesson-1", tier: "free" },
    ],
    viewerHasVip: false,
  });
  assert.equal(access.allowed, false);
  assert.deepEqual(access.lockedAt, hskLevelTarget("hsk-3"));
});
