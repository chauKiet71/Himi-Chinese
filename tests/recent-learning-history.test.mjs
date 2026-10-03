import assert from "node:assert/strict";
import test from "node:test";

import {
  parseRecentLearningHistory,
  readRecentLearningHistory,
  RECENT_LEARNING_HISTORY_KEY,
  upsertRecentLearningHistory,
} from "../lib/recent-learning-history.ts";

function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

function lesson(id, progress) {
  return {
    id: `hsk:hsk-1:${id}`,
    kind: "hsk",
    lessonId: id,
    levelId: "hsk-1",
    title: `Bài ${id}`,
    subtitle: "HSK 1",
    href: `/hsk/1/${id}/play`,
    progress,
  };
}

test("recent learning history keeps the latest lesson first and updates duplicates", () => {
  const storage = memoryStorage();

  upsertRecentLearningHistory(lesson("lesson-1", 25), storage, 100);
  upsertRecentLearningHistory(lesson("lesson-2", 50), storage, 200);
  upsertRecentLearningHistory(lesson("lesson-1", 75), storage, 300);

  const history = readRecentLearningHistory(storage);
  assert.deepEqual(history.map((entry) => entry.lessonId), ["lesson-1", "lesson-2"]);
  assert.equal(history[0].progress, 75);
  assert.equal(history[0].lastStudiedAt, 300);
});

test("recent learning history ignores malformed data and clamps progress", () => {
  const storage = memoryStorage();
  storage.setItem(RECENT_LEARNING_HISTORY_KEY, JSON.stringify([
    { ...lesson("lesson-1", 150), lastStudiedAt: 100 },
    { title: "invalid" },
  ]));

  const history = readRecentLearningHistory(storage);
  assert.equal(history.length, 1);
  assert.equal(history[0].progress, 100);
  assert.deepEqual(parseRecentLearningHistory("not-json"), []);
});
