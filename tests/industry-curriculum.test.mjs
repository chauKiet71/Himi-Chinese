import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { industryCurricula, industryCurriculumTerminology } from "../lib/industry-curriculum.ts";
import { validateIndustryCurriculum, validateIndustryCurriculumCollection } from "../lib/industry-curriculum-validation.ts";
import { balanceChallengeOptions, getLessonPageData } from "../lib/lesson-repository.ts";

test("all six industry curricula are complete and have six original applied lessons per track", () => {
  assert.equal(industryCurricula.length, 6);
  assert.deepEqual(new Set(industryCurricula.map(course => course.category)), new Set(["Văn phòng", "Nhà máy", "Logistics", "Kinh doanh", "Dịch vụ"]));
  const manifest = JSON.parse(readFileSync("content/industry-curriculum/manifest.json", "utf8"));
  assert.equal(manifest.totals.lessons, industryCurricula.reduce((sum, course) => sum + course.lessons.length, 0));
  const scenarios = new Set();
  for (const course of industryCurricula) {
    assert.equal(course.lessons.length, 30);
    assert.equal(course.modules.length, 5);
    assert.equal(course.lessons.filter(lesson => lesson.isFree).length, 6);
    assert.ok(course.modules.every(module => course.lessons.filter(lesson => lesson.moduleSlug === module.slug).length === 6));
    for (const lessonIndex of [5, 11, 17, 23]) {
      assert.match(course.lessons[lessonIndex].title, /^Tình huống tổng hợp:/, `${course.courseSlug}: module closer ${lessonIndex + 1} must not present new vocabulary as a test`);
    }
    for (const lesson of course.lessons.slice(24)) {
      assert.equal(lesson.vocabulary.length, 6);
      assert.equal(lesson.content.phrases.length, 4);
      assert.equal(lesson.content.challenge.questions.length, 3);
      assert.equal(lesson.content.challenge.passScore, 3);
      for (const word of lesson.vocabulary) assert.ok(word.example.includes(word.hanzi), `${lesson.slug}: example must actually demonstrate ${word.hanzi}`);
      for (const line of lesson.content.phrases) {
        assert.match(line.hanzi, /\p{Script=Han}/u);
        assert.doesNotMatch(line.pinyin, /\p{Script=Han}/u);
        assert.ok(line.pinyin.length > 5 && line.translation.length > 5);
      }
      const prompt = lesson.content.challenge.questions[0].prompt;
      assert.ok(!scenarios.has(prompt), `Repeated scenario: ${prompt}`);
      scenarios.add(prompt);
    }
  }
  assert.equal(scenarios.size, 36);
});

test("the curriculum validator rejects broken cross references and unanswerable checks before import", () => {
  const mutations = [
    [course => { course.lessons[0].moduleSlug = "missing"; }, /unknown module/],
    [course => { course.lessons[1].slug = course.lessons[0].slug; }, /duplicate/],
    [course => { course.lessons[24].content.challenge.questions[0].correctOption = 7; }, /integer out of range/],
    [course => { course.lessons[24].content.challenge.passScore = 4; }, /integer out of range/],
    [course => { course.lessons[24].content.challenge.questions[0].options[1] = course.lessons[24].content.challenge.questions[0].options[0]; }, /duplicate/],
    [course => { course.lessons[24].content.phrases[0].pinyin = ""; }, /non-empty/],
    [course => { course.lessons[24].vocabulary[0].audioUrl = "javascript:alert(1)"; }, /audioUrl/],
    [course => { course.lessons[24].vocabulary[0].example = "Ví dụ không có từ đang dạy"; }, /must contain the vocabulary term/],
    [course => { course.schemaVersion = 2; }, /unsupported/],
  ];
  for (const [mutate, message] of mutations) {
    const copy = structuredClone(industryCurricula[0]);
    mutate(copy);
    assert.throws(() => validateIndustryCurriculum(copy), message);
  }
});

test("cross-course validation rejects inconsistent pinyin for the same vocabulary term", () => {
  const copy = structuredClone(industryCurricula);
  const occurrences = copy.flatMap(course => course.lessons.flatMap(lesson => lesson.vocabulary
    .filter(word => word.hanzi === "退货")
    .map(word => ({ course, lesson, word }))));
  assert.ok(occurrences.length >= 2);
  occurrences[1].word.pinyin = "tuì huò";
  assert.throws(() => validateIndustryCurriculumCollection(copy, industryCurriculumTerminology), /inconsistent pinyin for 退货/);
});

test("shared zh-CN terminology and repeated sentences stay consistent", () => {
  assert.equal(industryCurriculumTerminology.get("合规"), "héguī");
  assert.equal(industryCurriculumTerminology.get("转速"), "zhuànsù");
  assert.equal(industryCurriculumTerminology.get("曝光量"), "bàoguāngliàng");

  const wrongTerm = structuredClone(industryCurricula);
  wrongTerm.find(course => course.courseSlug === "nha-may-san-xuat")
    .lessons.flatMap(lesson => lesson.vocabulary)
    .find(word => word.hanzi === "转速").pinyin = "zhuǎnsù";
  assert.throws(() => validateIndustryCurriculumCollection(wrongTerm, industryCurriculumTerminology), /must use canonical pinyin zhuànsù/);

  const repeatedSentence = structuredClone(industryCurricula);
  repeatedSentence[0].lessons[24].content.phrases[0].translation = "Bản dịch không đồng nhất";
  assert.throws(() => validateIndustryCurriculumCollection(repeatedSentence, industryCurriculumTerminology), /inconsistent repeated sentence/);
});

test("challenge answers keep their meaning while their visible positions are balanced", () => {
  const questions = [0, 0, 1, 2].map((correctOption, index) => ({
    prompt: `Câu ${index + 1}`,
    options: [`A${index}`, `B${index}`, `C${index}`],
    correctOption,
    explanation: "Giải thích",
  }));
  const correctAnswers = questions.map(question => question.options[question.correctOption]);
  const balanced = balanceChallengeOptions(questions);

  assert.deepEqual(balanced.map(question => question.correctOption), [0, 1, 2, 0]);
  assert.deepEqual(balanced.map(question => question.options[question.correctOption]), correctAnswers);
  assert.deepEqual(questions.map(question => question.correctOption), [0, 0, 1, 2]);

  const legacyQuestions = industryCurricula.flatMap(course => course.lessons.slice(0, 24).flatMap(lesson => (
    balanceChallengeOptions(lesson.content.challenge?.questions ?? [], lesson.slug)
  )));
  const positionCounts = [0, 1, 2].map(position => legacyQuestions.filter(question => question.correctOption === position).length);
  assert.equal(legacyQuestions.length, 122);
  assert.ok(positionCounts.every(count => count > 0), `Every answer position must be used: ${positionCounts.join("/")}`);
  assert.ok(Math.max(...positionCounts) - Math.min(...positionCounts) <= 10, `Answer positions must stay balanced: ${positionCounts.join("/")}`);

  const giveawayPattern = /Bỏ qua|Không cần|Luôn |tùy ý|不重要|随便|不用|以后再|完全错/iu;
  for (const question of industryCurricula.flatMap(course => course.lessons.slice(0, 24).flatMap(lesson => lesson.content.challenge?.questions ?? []))) {
    question.options.forEach((option, optionIndex) => {
      if (optionIndex !== question.correctOption) assert.doesNotMatch(option, giveawayPattern, `Distractor is too obvious: ${option}`);
    });
  }
});

test("JSON lessons reach the web repository while new VIP bodies stay on the server", async () => {
  const previous = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    for (const course of industryCurricula) {
      const free = await getLessonPageData({ courseSlug: course.courseSlug });
      assert.equal(free.lessons.length, 30);
      assert.deepEqual(free.lesson.vocabulary, course.lessons[0].vocabulary);
      const applied = await getLessonPageData({ courseSlug: course.courseSlug, lessonSlug: course.lessons[24].slug });
      assert.equal(applied.lesson.title, course.lessons[24].title);
      assert.equal(applied.access.allowed, false);
      assert.deepEqual(applied.lesson.vocabulary, []);
      assert.deepEqual(applied.lesson.dialogue, []);
      assert.equal(applied.lesson.phrases, undefined);
      assert.equal(applied.lesson.challenge, undefined);
    }
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous;
  }
});
