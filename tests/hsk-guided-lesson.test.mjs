import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { readFile } from "node:fs/promises";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("guided HSK lesson builds its journey from the textbook section counts", async () => {
  const [contentModule, guidedModule] = await Promise.all([
    import("../lib/hsk-lesson-content.ts").catch(() => null),
    import("../lib/hsk-guided-lesson.ts").catch(() => null),
  ]);
  assert.ok(contentModule, "the HSK lesson content module should exist");
  assert.ok(guidedModule, "the guided lesson model should exist");

  const lesson = contentModule.getHskLessonContent("hsk-1", "hsk1-bai-01-chao-anh");
  assert.ok(lesson);
  const steps = guidedModule.buildHskGuidedLessonSteps(lesson);
  const sections = guidedModule.buildHskGuidedSections(lesson);
  const exercises = guidedModule.buildHskGuidedExercises(lesson);

  assert.equal(exercises.length, lesson.vocabulary.length);
  assert.ok(exercises.every((exercise) => exercise.answer && exercise.options.includes(exercise.answer)));
  assert.equal(steps.length, 15);
  assert.deepEqual(
    steps.map((step) => step.kind),
    [
      "introduction",
      ...Array(6).fill("vocabulary"),
      "writing",
      ...Array(6).fill("practice"),
      "complete",
    ],
  );
  assert.deepEqual(
    sections.map(({ label, count }) => [label, count]),
    [
      ["Giới thiệu", undefined],
      ["Từ vựng", 6],
      ["Luyện viết", undefined],
      ["Luyện tập", 6],
      ["Hoàn thành", undefined],
    ],
  );
});

test("guided HSK practice creates one exercise for every vocabulary word", async () => {
  const [contentModule, guidedModule] = await Promise.all([
    import("../lib/hsk-lesson-content.ts"),
    import("../lib/hsk-guided-lesson.ts"),
  ]);

  for (const lesson of contentModule.HSK_LESSONS) {
    const exercises = guidedModule.buildHskGuidedExercises(lesson);
    assert.equal(exercises.length, lesson.vocabulary.length, lesson.id);
    assert.deepEqual(exercises.map((exercise) => exercise.prompt), lesson.vocabulary.map((word) => word.hanzi), lesson.id);
  }
});

test("guided HSK practice preserves a VIP placeholder for a locked vocabulary item", async () => {
  const [contentModule, guidedModule] = await Promise.all([
    import("../lib/hsk-lesson-content.ts"),
    import("../lib/hsk-guided-lesson.ts"),
  ]);
  const lesson = contentModule.getHskLessonContent("hsk-1", "hsk1-bai-01-chao-anh");
  const lockedLesson = {
    ...lesson,
    vocabulary: lesson.vocabulary.map((word, index) => index ? word : {
      ...word,
      hanzi: "",
      pinyin: "",
      meaning: "",
      example: "",
      examplePinyin: "",
      translation: "",
      locked: true,
    }),
  };
  const [exercise] = guidedModule.buildHskGuidedExercises(lockedLesson);
  assert.equal(exercise.locked, true);
  assert.equal(exercise.prompt, "");
  assert.deepEqual(exercise.options, []);
});

test("guided progress is restored safely and can complete the whole lesson", async () => {
  const [contentModule, progressModule] = await Promise.all([
    import("../lib/hsk-lesson-content.ts"),
    import("../lib/hsk-lesson-progress.ts"),
  ]);
  const lesson = contentModule.getHskLessonContent("hsk-1", "hsk1-bai-01-chao-anh");
  assert.ok(lesson);

  const restored = progressModule.parseHskLessonProgress(JSON.stringify({
    guidedStep: 99,
    guidedCompleted: false,
  }));
  assert.equal(restored.guidedStep, 99);
  assert.equal(restored.guidedCompleted, false);

  const completed = {
    ...progressModule.EMPTY_HSK_LESSON_PROGRESS,
    guidedStep: 14,
    guidedCompleted: true,
  };
  assert.equal(progressModule.calculateHskLessonProgress(lesson, completed), 100);
});

test("guided HSK lesson exposes progress, controls, sections and step navigation", async (t) => {
  const server = await createServer({
    appType: "custom",
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "hsk-guided-lesson"),
    configFile: false,
    resolve: {
      alias: [
        { find: "next/image", replacement: path.resolve("tests/fixtures/next-image.tsx") },
        { find: "@", replacement: process.cwd() },
      ],
    },
    root: process.cwd(),
    server: { hmr: { port: 24784 }, middlewareMode: true },
  });
  t.after(() => server.close());

  const [viewModule, contentModule] = await Promise.all([
    server.ssrLoadModule("/components/hsk-guided-lesson.tsx").catch(() => null),
    server.ssrLoadModule("/lib/hsk-lesson-content.ts"),
  ]);
  assert.ok(viewModule, "the guided lesson workspace should be renderable");
  const lesson = contentModule.getHskLessonContent("hsk-1", "hsk1-bai-01-chao-anh");
  const html = renderToStaticMarkup(React.createElement(viewModule.HskGuidedLesson, {
    lesson,
    nextLessonHref: "/hsk/1/hsk1-bai-02-cam-on-anh/play",
  }));

  assert.match(html, /hsk-guided-toolbar/);
  assert.match(html, /aria-label="Thoát bài học"/);
  assert.match(html, /aria-valuenow="1"/);
  assert.match(html, /1 \/ 15/);
  assert.doesNotMatch(html, /Ẩn pinyin/);
  assert.doesNotMatch(html, /0\.75×/);
  assert.match(html, /Từ vựng/);
  assert.doesNotMatch(html, /<span>ngữ pháp<\/span>/);
  assert.doesNotMatch(html, /<span>Ngữ pháp<\/span>/);
  assert.doesNotMatch(html, /<span>Hội thoại<\/span>/);
  assert.doesNotMatch(html, /<span>Phát âm<\/span>/);
  assert.doesNotMatch(html, /hội thoại/);
  assert.doesNotMatch(html, /Trọng tâm ghép âm và thanh điệu/);
  assert.match(html, /Luyện viết/);
  assert.doesNotMatch(html, /Xem hoạt họa nét/);
  assert.match(html, /Luyện tập/);
  assert.match(html, /Hoàn thành/);
  assert.match(html, />Trước</);
  assert.match(html, />Tiếp</);
});

test("guided HSK vocabulary exposes the save-word control and account-aware persistence", async () => {
  const [component, page, client] = await Promise.all([
    readFile(new URL("../components/hsk-guided-lesson.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hsk/[level]/[lesson]/play/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/saved-vocabulary-client.ts", import.meta.url), "utf8"),
  ]);

  assert.match(component, /"Lưu từ"/);
  assert.match(component, /"Đã lưu"/);
  assert.match(component, /trySaveHskVocabularyWord/);
  assert.match(component, /disabled=\{selected !== null\}/);
  assert.doesNotMatch(component, /<span>điểm ngữ pháp<\/span>/);
  assert.match(component, /nextLessonHref \? "Bài tiếp theo" : "Về lộ trình"/);
  assert.match(page, /requireLearnerUser\(/);
  assert.match(page, /getHskLessonHref\(data\.lesson\.levelId, nextLesson\.id\)/);
  assert.match(page, /<HskGuidedLesson authenticated lesson=/);
  assert.match(client, /return response\.ok/);
});
