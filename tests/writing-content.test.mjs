import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("writing catalog exposes every available HSK 1–6 lesson", async (t) => {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    resolve: { alias: { "@": process.cwd() } },
    root: process.cwd(),
    server: { middlewareMode: true },
  });
  t.after(() => server.close());

  const [writing, content, studio] = await Promise.all([
    server.ssrLoadModule("/lib/writing-content.ts"),
    server.ssrLoadModule("/lib/hsk-lesson-content.ts"),
    server.ssrLoadModule("/components/himi-writing-studio.tsx"),
  ]);
  const levels = writing.getWritingLevels();

  assert.deepEqual(levels.map((level) => level.lessonCount), [15, 15, 20, 20, 36, 40]);
  assert.equal(levels.reduce((total, level) => total + level.lessonCount, 0), 146);

  for (const level of levels) {
    const lessons = writing.getWritingLessons(level.id);
    assert.equal(lessons.length, level.lessonCount);
    assert.ok(lessons.every((lesson) => lesson.characterCount > 0));

    const firstLesson = lessons[0];
    const topic = writing.getWritingTopic(level.id, firstLesson.id);
    assert.equal(topic.levelId, level.id);
    assert.equal(topic.lessonNumber, firstLesson.lessonNumber);
    assert.equal(topic.characters.length, firstLesson.characterCount);
    assert.ok(topic.characters.every((character) => character.id && character.hanzi));
  }

  const lesson = content.getHskLessonContent("hsk-1", "hsk1-bai-01-chao-anh");
  const sourceCharacter = lesson.writingCharacters[0];
  const protectedLesson = {
    ...lesson,
    writingCharacters: lesson.writingCharacters.map((character, index) => index ? character : {
      id: character.id,
      word: "",
      hanzi: "",
      pinyin: "",
      meaning: "",
      accessTier: "vip",
      locked: true,
    }),
  };
  const protectedTopic = writing.getWritingTopicFromLesson(lesson.levelId, lesson.id, protectedLesson);
  assert.equal(protectedTopic.characters[0].locked, true);
  assert.equal(protectedTopic.characters[0].hanzi, "");

  const html = renderToStaticMarkup(React.createElement(studio.HimiWritingStudio, {
    topic: { ...protectedTopic, characters: [protectedTopic.characters[0]] },
  }));
  assert.match(html, /Chữ này cần tài khoản VIP/);
  assert.match(html, /action="\/vip"/);
  assert.doesNotMatch(html, new RegExp(`Khu vực viết chữ ${sourceCharacter.hanzi}`));
  assert.doesNotMatch(html, new RegExp(sourceCharacter.pinyin));
});
