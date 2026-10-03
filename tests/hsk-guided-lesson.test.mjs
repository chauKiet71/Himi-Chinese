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
  assert.equal(steps.length, 13);
  assert.deepEqual(
    steps.map((step) => step.kind),
    [
      ...Array(6).fill("vocabulary"),
      "writing",
      ...Array(6).fill("practice"),
    ],
  );
  assert.deepEqual(
    sections.map(({ label, count }) => [label, count]),
    [
      ["Từ vựng", 6],
      ["Luyện viết", undefined],
      ["Luyện tập", 6],
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
    assert.deepEqual(exercises.map((exercise) => exercise.pinyin), lesson.vocabulary.map((word) => word.pinyin), lesson.id);
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
    guidedFlowVersion: 2,
  }));
  assert.equal(restored.guidedStep, 99);
  assert.equal(restored.guidedCompleted, false);
  assert.equal(restored.guidedFlowVersion, 2);

  const migrated = progressModule.parseHskLessonProgress(JSON.stringify({
    guidedStep: 6,
    guidedCompleted: false,
  }));
  assert.equal(migrated.guidedStep, 5);
  assert.equal(migrated.guidedFlowVersion, 2);

  const lessonWithGrammar = contentModule.getHskLessonContent("hsk-1", "hsk1-bai-05-con-gai-co-ay-hai-muoi-tuoi");
  assert.ok(lessonWithGrammar?.grammar.length);
  const migratedWithoutGrammar = progressModule.parseHskLessonProgress(JSON.stringify({
    guidedStep: lessonWithGrammar.vocabulary.length + 1,
    guidedCompleted: false,
    guidedFlowVersion: 2,
  }), lessonWithGrammar);
  assert.equal(migratedWithoutGrammar.guidedStep, lessonWithGrammar.vocabulary.length);
  assert.equal(migratedWithoutGrammar.guidedFlowVersion, 3);

  const completed = {
    ...progressModule.EMPTY_HSK_LESSON_PROGRESS,
    guidedStep: 12,
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
  assert.match(html, /aria-label="Thoát bài học" href="\/courses\?view=hsk&amp;level=hsk-1"/);
  assert.match(html, /aria-valuenow="1"/);
  assert.match(html, /1 \/ 13/);
  assert.doesNotMatch(html, /Giới thiệu/);
  assert.doesNotMatch(html, /Ẩn pinyin/);
  assert.doesNotMatch(html, /0\.75×/);
  assert.match(html, /Từ vựng/);
  assert.doesNotMatch(html, /hsk-guided-structure-card/);
  assert.doesNotMatch(html, /Bộ thủ &amp; cấu tạo Hán tự/);
  assert.doesNotMatch(html, /<span>ngữ pháp<\/span>/);
  assert.doesNotMatch(html, /<span>Ngữ pháp<\/span>/);
  assert.doesNotMatch(html, /<span>Hội thoại<\/span>/);
  assert.doesNotMatch(html, /<span>Phát âm<\/span>/);
  assert.doesNotMatch(html, /hội thoại/);
  assert.doesNotMatch(html, /Trọng tâm ghép âm và thanh điệu/);
  assert.match(html, /Luyện viết/);
  assert.doesNotMatch(html, /Xem hoạt họa nét/);
  assert.match(html, /Luyện tập/);
  assert.doesNotMatch(html, />Hoàn thành<\/span>/);
  assert.match(html, />Trước</);
  assert.match(html, />Tiếp</);
});

test("guided HSK vocabulary exposes the save-word control and account-aware persistence", async () => {
  const [component, page, client, css] = await Promise.all([
    readFile(new URL("../components/hsk-guided-lesson.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hsk/[level]/[lesson]/play/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/saved-vocabulary-client.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/hsk-guided-lesson.css", import.meta.url), "utf8"),
  ]);

  assert.match(component, /"Lưu từ"/);
  assert.match(component, /"Đã lưu"/);
  assert.match(component, /trySaveHskVocabularyWord/);
  assert.match(component, /hsk-guided-vocabulary-grid/);
  assert.match(component, /hsk-guided-character-card/);
  assert.match(component, /function AutoFitHanzi/);
  assert.match(component, /ResizeObserver\(fitText\)/);
  assert.match(component, /const naturalWidth = text\.scrollWidth/);
  assert.match(component, /<AutoFitHanzi>\{word\.hanzi\}<\/AutoFitHanzi>/);
  assert.match(component, /hsk-guided-frequency/);
  assert.match(component, /hsk-guided-card-heading/);
  assert.match(component, /<Lightbulb aria-hidden="true"/);
  assert.doesNotMatch(component, /<p>\{details\.description\}<\/p>/);
  assert.match(component, /disabled=\{selected !== null\}/);
  assert.doesNotMatch(component, /<span>điểm ngữ pháp<\/span>/);
  assert.match(component, /nextLessonHref \? "Bài tiếp theo" : "Về lộ trình"/);
  assert.match(component, /getHskCurriculumHref\(lesson\.levelId\)/);
  assert.match(component, /onClick=\{persistCurrentProgress\}/);
  assert.match(component, /next >= steps\.length && currentStep === steps\.length - 1[\s\S]*?saveProgress\(lesson, nextProgress\)/);
  assert.match(component, /recordRecentHskLesson\(lesson, progress\)/);
  assert.match(page, /getCurrentUser\(\)/);
  assert.match(page, /data\.access\.source !== "guest"/);
  assert.match(page, /redirect\(learnerLoginPath\(returnTo\)\)/);
  assert.match(page, /getHskLessonHref\(data\.lesson\.levelId, nextLesson\.id\)/);
  assert.match(page, /<HskLessonLoader authenticated=\{Boolean\(user\)\}.*mode="play".*resource=\{resource\}/);
  assert.match(client, /return response\.ok/);
  assert.match(css, /\.hsk-guided-vocabulary-grid \{[\s\S]*?grid-template-columns: minmax\(360px, \.62fr\) minmax\(0, 1fr\)/);
  assert.match(css, /\.hsk-guided-word-glyph > strong \{[\s\S]*?white-space: nowrap/);
  assert.match(css, /\.hsk-guided-word-glyph \{[\s\S]*?min-width: 0/);
  assert.match(css, /\.hsk-guided-example-card \{[\s\S]*?grid-column: 1 \/ -1/);
  assert.match(css, /@media \(max-width: 820px\) \{[\s\S]*?\.hsk-guided-vocabulary-grid \{ grid-template-columns: 1fr; \}/);
});

test("guided HSK completion uses the trophy celebration card", async () => {
  const [component, css, trophy] = await Promise.all([
    readFile(new URL("../components/hsk-guided-lesson.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hsk-guided-lesson.css", import.meta.url), "utf8"),
    readFile(new URL("../public/assets/hsk/hsk-completion-trophy.png", import.meta.url)),
  ]);

  assert.match(component, /hsk-guided-completion-trophy/);
  assert.match(component, /\/assets\/hsk\/hsk-completion-trophy\.png/);
  assert.match(component, /hsk-guided-completion-badge/);
  assert.match(component, /Đóng thông báo hoàn thành/);
  assert.match(component, /next >= steps\.length && currentStep === steps\.length - 1 && step\.kind === "practice"/);
  assert.match(component, /setCompletionOpen\(true\)/);
  assert.match(component, /hsk-guided-page\$\{completionOpen \? " is-complete" : ""\}/);
  assert.match(component, /!completionOpen \? <header className="hsk-guided-header">/);
  assert.match(component, /completionOpen \? "complete" : step\.kind/);
  assert.match(component, /!completionOpen \? <footer/);
  assert.match(component, /Danh sách bài học/);
  assert.match(component, /nextLessonHref \? "Bài tiếp theo" : "Về lộ trình"/);
  assert.match(component, /window\.location\.assign\(href\)/);
  assert.match(component, /followCompletionLink\(event, courseHref\)/);
  assert.match(component, /followCompletionLink\(event, continueHref\)/);
  assert.match(css, /\.hsk-guided-completion \{[\s\S]*?border-radius: 42px;[\s\S]*?box-shadow:/);
  assert.match(css, /\.hsk-guided-main\.is-complete \{[\s\S]*?background: transparent;/);
  assert.match(css, /\.hsk-guided-page\.is-complete \{ grid-template-rows: minmax\(0, 1fr\); \}/);
  assert.match(css, /\.hsk-guided-writing-modes button \{[^}]*font-size: 15px;/);
  assert.match(css, /\.hsk-guided-writing-picker button small \{ font-size: 15px; \}/);
  assert.match(css, /\.hsk-guided-writing-layout > aside b \{[^}]*font-size: 30px;/);
  assert.match(css, /\.hsk-guided-writing-layout > aside > p \{[^}]*font-size: 20px;/);
  assert.match(css, /\.hsk-guided-writing-layout > aside > button \{[^}]*font-size: 15px;/);
  assert.match(component, /aria-label=\{`Phát âm \$\{exercise\.prompt\}`\}/);
  assert.match(component, /speak\(exercise\.speakText \?\? exercise\.prompt\)/);
  assert.match(css, /\.hsk-guided-main\.is-practice \{ display: grid; align-items: center; \}/);
  assert.match(css, /\.hsk-guided-sections button \{[^}]*min-height: 50px;[^}]*font-size: 18px;/);
  assert.match(css, /\.hsk-guided-sections button > svg \{ width: 22px; height: 22px; \}/);
  assert.match(css, /\.hsk-guided-sections button\.is-active b \{ min-width: 26px; height: 26px;/);
  assert.match(css, /\.hsk-guided-practice:not\(\.vip-content-gate\) \{[^}]*background: transparent;[^}]*box-shadow: none;/);
  assert.match(css, /\.hsk-guided-practice-options \{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.hsk-guided-practice-options button \{[^}]*min-height: 84px;/);
  assert.match(css, /@media \(max-width: 620px\) \{[\s\S]*?\.hsk-guided-page\.is-complete \{[\s\S]*?height: 100dvh;[\s\S]*?overflow: hidden;/);
  assert.match(css, /\.hsk-guided-main\.is-complete \{[\s\S]*?height: 100dvh;[\s\S]*?align-items: safe center;[\s\S]*?overflow-y: auto;/);
  assert.match(css, /\.hsk-guided-completion-stats \{[\s\S]*?grid-template-columns: repeat\(3, 1fr\)/);
  assert.ok(trophy.length > 100_000, "the completion trophy should be a real rendered asset");
});

test("guided HSK desktop lesson keeps header, content, and footer inside the viewport", async () => {
  const css = await readFile(new URL("../app/hsk-guided-lesson.css", import.meta.url), "utf8");

  assert.match(css, /height: calc\(100dvh \/ var\(--guided-page-scale\)\)/);
  assert.match(css, /grid-template-rows: auto minmax\(0, 1fr\) auto/);
  assert.match(css, /\.hsk-guided-main \{[\s\S]*?min-height: 0;[\s\S]*?overflow: hidden;/);
  assert.match(css, /\.hsk-guided-footer \{[\s\S]*?position: relative;/);
  assert.match(css, /@media \(min-width: 821px\) and \(max-height: 800px\)/);
});
