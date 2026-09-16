import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createServer } from "vite";

const CORE_SECTION_LABELS = [
  "Giới thiệu",
  "Từ vựng",
  "Luyện viết",
  "Luyện tập",
  "Hoàn thành",
];

test("every available HSK lesson exposes the complete five-stage guided journey", async (t) => {
  const server = await createServer({
    appType: "custom",
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "hsk-guided-curriculum-coverage"),
    configFile: false,
    root: process.cwd(),
    server: { hmr: { port: 24796 }, middlewareMode: true },
  });
  t.after(() => server.close());

  const [curriculumModule, learningModule, guidedModule] = await Promise.all([
    server.ssrLoadModule("/lib/hsk-curriculum.ts"),
    server.ssrLoadModule("/lib/hsk-learning-content.ts"),
    server.ssrLoadModule("/lib/hsk-guided-lesson.ts"),
  ]);
  const availableLessons = curriculumModule.HSK_CURRICULUM
    .flatMap((level) => level.topics.flatMap((topic) => (
      topic.lessons
        .filter((lesson) => lesson.available)
        .map((lesson) => ({ level, lesson }))
    )));

  assert.equal(availableLessons.length, 30);
  assert.deepEqual(
    [...new Set(availableLessons.map(({ level }) => level.label))],
    ["HSK 1", "HSK 2"],
  );

  for (const { level, lesson: summary } of availableLessons) {
    const lesson = learningModule.getHskLearningLessonContent(level.id, summary.id);
    assert.ok(lesson, `${level.label} / ${summary.id} phải mở được nội dung học`);

    const steps = guidedModule.buildHskGuidedLessonSteps(lesson);
    const navigation = guidedModule.buildHskGuidedNavigationSections(lesson);
    assert.ok(
      steps.every((step) => step.kind !== "dialogue" && step.kind !== "pronunciation"),
      `${level.label} / ${summary.id} không được chèn Hội thoại hoặc Phát âm vào luồng học`,
    );
    assert.deepEqual(
      navigation.map((section) => section.label),
      CORE_SECTION_LABELS,
      `${level.label} / ${summary.id} phải có đủ 5 chặng`,
    );
    assert.ok(steps.length >= navigation.length, `${level.label} / ${summary.id} phải có tổng số bước hợp lệ`);
    assert.ok(lesson.vocabulary.length > 0, `${level.label} / ${summary.id} phải có từ vựng`);
    assert.equal(lesson.writingCharacters.length, lesson.vocabulary.length, `${level.label} / ${summary.id} phải có luyện viết cho từng từ`);
    assert.equal(guidedModule.buildHskGuidedExercises(lesson).length, lesson.vocabulary.length, `${level.label} / ${summary.id} phải có luyện tập cho từng từ`);
  }
});
