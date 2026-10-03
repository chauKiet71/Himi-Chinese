import type { Course, LessonDetail } from "./content-types";
import { upsertRecentLearningHistory, type RecentLearningHistoryEntry } from "./recent-learning-history";

export function recordRecentIndustryLesson(
  course: Course,
  lesson: LessonDetail,
  progress: number,
): RecentLearningHistoryEntry[] {
  return upsertRecentLearningHistory({
    id: `industry:${course.slug}:${lesson.slug}`,
    kind: "industry",
    lessonId: lesson.slug,
    levelId: course.slug,
    title: lesson.title,
    subtitle: course.title,
    href: `/learn/${course.slug}?lesson=${lesson.slug}`,
    progress,
  });
}
