import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createServer } from "vite";

test("HSK publication gates, curated Vietnamese, pinyin and audio stay consistent", async (t) => {
  const server = await createServer({
    appType: "custom",
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "hsk-editorial-quality"),
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    resolve: { alias: { "@": process.cwd() } },
    root: process.cwd(),
    server: { middlewareMode: true },
  });
  t.after(() => server.close());

  const [curriculum, learning, guided] = await Promise.all([
    server.ssrLoadModule("/lib/hsk-curriculum.ts"),
    server.ssrLoadModule("/lib/hsk-learning-content.ts"),
    server.ssrLoadModule("/lib/hsk-guided-lesson.ts"),
  ]);
  const levels = curriculum.HSK_CURRICULUM;

  assert.ok(levels.slice(0, 2).every((level) => level.topics.flatMap((topic) => topic.lessons).every((lesson) => lesson.available)));
  assert.ok(levels.slice(2, 6).every((level) => level.topics.flatMap((topic) => topic.lessons).every((lesson) => (
    !lesson.available && lesson.availabilityLabel === "Đang biên tập"
  ))));
  assert.ok(levels[6].topics.flatMap((topic) => topic.lessons).every((lesson) => (
    !lesson.available
    && lesson.availabilityLabel === "Đang xây dựng"
    && lesson.vocabulary === 0
    && lesson.grammar === 0
    && lesson.dialogues === 0
  )));

  const hsk3Lesson18 = learning.getHskLearningLessonContent("hsk-3", "hsk3-tb-lesson-18");
  assert.equal(hsk3Lesson18.vocabulary.find((word) => word.hanzi === "万").meaning, "mười nghìn");
  assert.equal(hsk3Lesson18.vocabulary.find((word) => word.hanzi === "地").meaning, "trợ từ kết cấu đứng trước động từ hoặc tính từ");
  assert.match(hsk3Lesson18.grammar[0].explanation, /chỉ cần điều kiện/iu);

  const hsk4Upper9 = learning.getHskLearningLessonContent("hsk-4", "hsk4u-tb-lesson-09");
  const dei = hsk4Upper9.vocabulary.find((word) => word.hanzi === "得");
  assert.deepEqual([dei.pinyin, dei.meaning], ["děi", "phải; cần"]);
  const hsk4Lower16 = learning.getHskLearningLessonContent("hsk-4", "hsk4l-tb-lesson-16");
  assert.deepEqual(
    [hsk4Lower16.vocabulary[0].hanzi, hsk4Lower16.vocabulary[0].pinyin, hsk4Lower16.vocabulary[0].meaning],
    ["博士", "bóshì", "tiến sĩ"],
  );

  const unsafeMeaning = /(?:www\.|GiaoTrinh|\.com\/|!R\.|\?R\.|[A-Za-z]{18,})/u;
  for (const level of levels.slice(4, 6)) {
    for (const summary of level.topics.flatMap((topic) => topic.lessons).filter((lesson) => lesson.kind === "textbook")) {
      const lesson = learning.getHskLearningLessonContent(level.id, summary.id);
      assert.ok(lesson.vocabulary.length > 0, `${summary.id} phải có từ vựng chuẩn hóa`);
      assert.ok(lesson.vocabulary.every((word) => word.audio?.normal && !unsafeMeaning.test(word.meaning)), `${summary.id} không được lộ nghĩa OCR hoặc thiếu audio từ vựng`);
      assert.ok(lesson.dialogues.flatMap((dialogue) => dialogue.turns).every((turn) => turn.pinyin && turn.translation && turn.audio?.normal), `${summary.id} phải dùng câu đọc đã chuẩn hóa`);
    }
  }

  const workbook = learning.getHskLearningLessonContent("hsk-5", "hsk5w1-lesson-01");
  assert.equal(workbook.dialogues.length, 0, "câu đọc workbook không được giả làm hội thoại");
  assert.ok(workbook.exercises.every((exercise) => exercise.answer === null), "workbook thiếu đáp án nguồn không được chấm điểm");

  const answerPositions = [0, 0, 0, 0];
  for (const level of levels.slice(0, 2)) {
    for (const summary of level.topics.flatMap((topic) => topic.lessons)) {
      const lesson = learning.getHskLearningLessonContent(level.id, summary.id);
      for (const exercise of guided.buildHskGuidedExercises(lesson)) {
        const answerIndex = exercise.options.indexOf(exercise.answer);
        if (answerIndex >= 0) answerPositions[answerIndex] += 1;
      }
    }
  }
  const answerTotal = answerPositions.reduce((total, count) => total + count, 0);
  assert.ok(Math.max(...answerPositions) / answerTotal <= 0.35, `vị trí đáp án bị lệch: ${answerPositions.join("/")}`);
  assert.ok(Math.min(...answerPositions) / answerTotal >= 0.15, `vị trí đáp án bị lệch: ${answerPositions.join("/")}`);
});
