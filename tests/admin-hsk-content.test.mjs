import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("admin exposes every available HSK lesson and all source and generated learning content", async (t) => {
  const server = await createServer({
    configFile: false, appType: "custom", root: process.cwd(),
    cacheDir: "tmp/vite-admin-hsk-content-test",
    resolve: { alias: { "@": process.cwd() } },
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { hmr: false, middlewareMode: true, watch: null },
  });
  t.after(() => server.close());
  const [admin, learning, guided, component] = await Promise.all([
    server.ssrLoadModule("/lib/admin-hsk-content.ts"),
    server.ssrLoadModule("/lib/hsk-learning-content.ts"),
    server.ssrLoadModule("/lib/hsk-guided-lesson.ts"),
    server.ssrLoadModule("/components/admin-hsk-lesson-content.tsx"),
  ]);
  const root = await admin.getAdminHskContentView();
  assert.equal(root.lesson, undefined);
  assert.deepEqual(root.practice, []);
  assert.equal(await admin.getAdminHskContentView("unknown"), null);
  assert.equal(await admin.getAdminHskContentView(undefined, "invalid"), null);
  assert.equal(await admin.getAdminHskContentView("hsk-1", "invalid"), null);
  const report = [];
  for (const level of root.levels) {
    const levelView = await admin.getAdminHskContentView(level.id);
    assert.equal(levelView.lesson, undefined, "The level view must not load full lesson content");
    const counts = { level: level.id, topics: level.topics.length, lessons: 0, planned: 0, vocabulary: 0, examples: 0, grammar: 0, dialogues: 0, sentences: 0, pronunciation: 0, writing: 0, sourceExercises: 0, guidedExercises: 0 };
    for (const topic of level.topics) for (const reference of topic.lessons) {
      const view = await admin.getAdminHskContentView(level.id, reference.id);
      assert.equal(view.topic.title, topic.title);
      assert.equal(view.reference.id, reference.id);
      if (!reference.available) {
        counts.planned++;
        assert.equal(view.lesson, undefined);
        assert.deepEqual(view.practice, []);
        continue;
      }
      const source = learning.getHskLearningLessonContent(level.id, reference.id);
      assert.ok(source, `Missing source: ${level.id}/${reference.id}`);
      assert.deepEqual(view.lesson, source);
      assert.deepEqual(view.practice, guided.buildHskGuidedExercises(source));
      counts.lessons++;
      counts.vocabulary += source.vocabulary.length;
      counts.examples += source.vocabulary.filter((word) => word.example).length;
      counts.grammar += source.grammar.length;
      counts.dialogues += source.dialogues.length;
      counts.sentences += source.dialogues.reduce((sum, dialogue) => sum + dialogue.turns.length, 0);
      counts.pronunciation += source.pronunciationTopics.length;
      counts.writing += source.writingCharacters.length;
      counts.sourceExercises += source.exercises.length;
      counts.guidedExercises += view.practice.length;
      for (const section of admin.ADMIN_HSK_SECTIONS) {
        const html = renderToStaticMarkup(React.createElement(component.AdminHskLessonContent, { lesson: source, practice: view.practice, section }));
        assert.ok(html.includes('class="admin-access-group"'), `${reference.id}/${section} renders`);
        if (section === "vocabulary") {
          assert.equal((html.match(/<article /g) ?? []).length, source.vocabulary.length);
          for (const word of source.vocabulary) {
            for (const value of [word.hanzi, word.pinyin, word.meaning, word.example, word.examplePinyin, word.translation]) {
              if (value) assert.ok(html.includes(renderToStaticMarkup(value)), `${reference.id} exposes vocabulary and example text`);
            }
          }
        }
        if (section === "practice") assert.equal((html.match(/<article /g) ?? []).length, view.practice.length);
        if (section === "exercises") assert.equal((html.match(/<article /g) ?? []).length, source.exercises.length);
        if (section === "dialogues") assert.equal((html.match(/<article /g) ?? []).length, source.dialogues.length);
        if (section === "writing") assert.equal((html.match(/<article /g) ?? []).length, source.writingCharacters.length);
        if (section === "grammar") assert.equal((html.match(/<article /g) ?? []).length, source.grammar.length);
        assert.doesNotMatch(html, /<audio(?![^>]*preload="none")/);
      }
    }
    assert.equal(counts.lessons, level.availableLessons);
    assert.equal(counts.planned, level.plannedLessons);
    report.push(counts);
  }
  const totals = Object.fromEntries(Object.keys(report[0]).filter((key) => key !== "level").map((key) => [key, report.reduce((sum, item) => sum + item[key], 0)]));
  await mkdir("qa-artifacts", { recursive: true });
  await writeFile("qa-artifacts/hsk-admin-coverage.json", JSON.stringify({ checkedAt: new Date().toISOString(), source: "Same runtime HSK lesson resolver as the learner web", levels: report, totals, missingAvailableLessons: [] }, null, 2) + "\n");
  console.log(JSON.stringify(totals));
});
