import assert from "node:assert/strict";
import test from "node:test";
import { getLessonPageData } from "../lib/lesson-repository.ts";
import { travelCourseStats, travelLessons, travelModules } from "../lib/travel-course-seed.ts";

test("travel course contains five complete 10-10-10 lessons", () => {
  assert.equal(travelModules.length, 1);
  assert.equal(travelLessons.length, 5);
  assert.deepEqual(travelCourseStats, {
    lessons: 5,
    minutes: 75,
    freeLessons: 1,
    vocabulary: 50,
    modules: 1,
  });

  for (const lesson of travelLessons) {
    assert.equal(lesson.vocabulary.length, 10, lesson.slug);
    assert.equal(lesson.content.phrases?.length, 10, lesson.slug);
    assert.equal(lesson.content.dialogue.length, 10, lesson.slug);
    assert.equal(lesson.content.notes.length, 2, lesson.slug);
    assert.ok(lesson.vocabulary.every((word) => word.example.includes(word.hanzi)), lesson.slug);
  }
});

test("travel course is available through the demo lesson repository", async () => {
  const previous = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const data = await getLessonPageData({ courseSlug: "tu-tin-kham-pha-trung-quoc" });
    assert.equal(data?.lessons.length, 5);
    assert.equal(data?.lesson?.slug, "dat-ve-va-chuan-bi-hanh-trinh");
    assert.equal(data?.lesson?.vocabulary.length, 10);
    assert.equal(data?.lesson?.phrases?.length, 10);
    assert.equal(data?.lesson?.dialogue.length, 10);
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous;
  }
});
