import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { industryCurricula } from "../lib/industry-curriculum.ts";
import { getCourse } from "../lib/course-data.ts";

test("all 36 authored lessons render vocabulary, phrases, pronunciation and an answerable quiz", async (t) => {
  const server = await createServer({ appType: "custom", configFile: false, resolve: { alias: [{ find: "@", replacement: process.cwd() }] }, server: { middlewareMode: true, hmr: false } });
  t.after(() => server.close());
  const [{ LessonWorkspace }, { LessonPhrasebook }, { LessonPronunciationCoach }, { LessonChallengePanel }] = await Promise.all([
    server.ssrLoadModule("/components/lesson-workspace.tsx"),
    server.ssrLoadModule("/components/lesson-phrasebook.tsx"),
    server.ssrLoadModule("/components/lesson-pronunciation-coach.tsx"),
    server.ssrLoadModule("/components/lesson-challenge.tsx"),
  ]);
  for (const curriculum of industryCurricula) {
    for (const [index, source] of curriculum.lessons.slice(24).entries()) {
      const lessonModule = curriculum.modules[4];
      const lesson = { ...source, ...source.content, order: 24 + index, moduleTitle: lessonModule.title, moduleOrder: 4 };
      const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
      const workspace = render(LessonWorkspace, { course: getCourse(curriculum.courseSlug), lessons: curriculum.lessons, lesson, access: { allowed: true, source: "vip" }, progress: null, authenticated: true, dailyFlow: false, dailyNextStep: null });
      const tabs = [...workspace.matchAll(/role="tab"[^>]*><span>(.*?)<\/span>/g)].map(match => match[1]);
      assert.deepEqual(tabs, ["Từ vựng", "Cụm từ", "Nghe &amp; nói", "Kiểm tra"]);
      assert.ok(workspace.includes(source.vocabulary[0].hanzi));
      assert.match(workspace, /disabled=""[^>]*>.*?Hoàn thành kiểm tra trước/);
      const phrases = render(LessonPhrasebook, { words: lesson.vocabulary, dialogue: lesson.phrases, notes: [], onFinished() {} });
      assert.ok(phrases.includes(lesson.phrases[0].hanzi));
      assert.ok(phrases.includes(lesson.phrases[0].pinyin));
      const pronunciation = render(LessonPronunciationCoach, { words: lesson.vocabulary, dialogue: lesson.phrases });
      assert.ok(pronunciation.includes(lesson.phrases[0].hanzi));
      const quiz = render(LessonChallengePanel, { challenge: lesson.challenge, onPassed() {} });
      assert.equal((quiz.match(/<fieldset/g) ?? []).length, 3);
      assert.equal((quiz.match(/type="radio"/g) ?? []).length, 9);
      assert.match(quiz, /disabled=""[^>]*>Chấm kết quả/);
    }
  }
});
