import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { industryCurricula } from "../lib/industry-curriculum.ts";
import { validateIndustryCurriculum } from "../lib/industry-curriculum-validation.ts";
import { getLessonPageData } from "../lib/lesson-repository.ts";

test("all five industry groups have a complete JSON curriculum and six original applied lessons per track", () => {
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
    [course => { course.schemaVersion = 2; }, /unsupported/],
  ];
  for (const [mutate, message] of mutations) {
    const copy = structuredClone(industryCurricula[0]);
    mutate(copy);
    assert.throws(() => validateIndustryCurriculum(copy), message);
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
