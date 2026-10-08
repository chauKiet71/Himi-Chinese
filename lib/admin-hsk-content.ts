import { HSK_CURRICULUM } from "./hsk-curriculum.ts";
import { buildHskGuidedExercises } from "./hsk-guided-lesson.ts";
import type { HskLessonContent } from "./hsk-lesson-content.ts";

export const ADMIN_HSK_SECTIONS = ["vocabulary", "practice", "exercises", "writing", "grammar", "dialogues", "pronunciation"] as const;
export type AdminHskSection = typeof ADMIN_HSK_SECTIONS[number];

export function getAdminHskCatalog() {
  return HSK_CURRICULUM.map((level) => ({
    ...level,
    availableLessons: level.topics.reduce((sum, topic) => sum + topic.lessons.filter((lesson) => lesson.available).length, 0),
    plannedLessons: level.topics.reduce((sum, topic) => sum + topic.lessons.filter((lesson) => !lesson.available).length, 0),
  }));
}

export async function getAdminHskContentView(levelId?: string, lessonId?: string) {
  const levels = getAdminHskCatalog();
  const level = levelId ? levels.find((entry) => entry.id === levelId) : undefined;
  if ((levelId && !level) || (lessonId && !level)) return null;
  const topic = lessonId ? level?.topics.find((entry) => entry.lessons.some((lesson) => lesson.id === lessonId)) : undefined;
  const reference = topic?.lessons.find((lesson) => lesson.id === lessonId);
  if (lessonId && !reference) return null;

  // Only load detailed lesson data after the administrator selects a lesson.
  let lesson: HskLessonContent | undefined;
  if (level && reference?.available) {
    const { getHskLearningLessonContent } = await import("./hsk-learning-content.ts");
    lesson = getHskLearningLessonContent(level.id, reference.id);
  }
  return { levels, level, topic, reference, lesson, practice: lesson ? buildHskGuidedExercises(lesson) : [] };
}
