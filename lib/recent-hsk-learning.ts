import type { HskLessonContent } from "./hsk-lesson-content";
import {
  calculateHskLessonProgress,
  getHskLessonProgressStorageKey,
  parseHskLessonProgress,
  type HskLessonProgress,
} from "./hsk-lesson-progress";
import { upsertRecentLearningHistory, type RecentLearningHistoryEntry } from "./recent-learning-history";

export function recordRecentHskLesson(
  lesson: HskLessonContent,
  progress?: HskLessonProgress,
): RecentLearningHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const savedProgress = progress ?? parseHskLessonProgress(
      window.localStorage.getItem(getHskLessonProgressStorageKey(lesson.id)),
      lesson,
    );
    const level = lesson.levelId.replace(/^hsk-/u, "");
    return upsertRecentLearningHistory({
      id: `hsk:${lesson.levelId}:${lesson.id}`,
      kind: "hsk",
      lessonId: lesson.id,
      levelId: lesson.levelId,
      title: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
      subtitle: lesson.levelLabel,
      href: `/hsk/${level}/${lesson.id}/play`,
      progress: calculateHskLessonProgress(lesson, savedProgress),
    });
  } catch {
    return [];
  }
}
