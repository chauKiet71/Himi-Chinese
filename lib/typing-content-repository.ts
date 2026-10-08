import "server-only";
import { typingContentLoaders } from "./typing-content-loaders.ts";
import { getTypingLesson } from "./typing-practice.ts";
import { getContentAccessPolicies } from "./content-access-repository.ts";
import { hasActiveVipAccess } from "./lesson-access.ts";
import { resolveTypingLessonContent, typingLessonTargets } from "./typing-content-access.ts";
import { resolveContentAccess, typingQuestionTarget, type ContentAccessTarget } from "./content-access-types.ts";

export async function loadTypingLessonContent(levelId: string, lessonId: string) {
  if (!getTypingLesson(levelId, lessonId)) return null;
  const loader = typingContentLoaders[`${levelId}:${lessonId}`];
  return loader ? loader() : null;
}

export async function getTypingAccessStates(targetGroups: ContentAccessTarget[][], userId: string | null) {
  const [policies, viewerHasVip] = await Promise.all([
    getContentAccessPolicies(targetGroups.flat(), undefined, { failClosed: true }),
    userId && process.env.DATABASE_URL ? hasActiveVipAccess(userId) : Promise.resolve(false),
  ]);
  return targetGroups.map((targets) => resolveContentAccess({
    targets, policies, viewerHasVip, viewerAuthenticated: Boolean(userId),
  }));
}

export async function getTypingLessonContent(levelId: string, lessonId: string, userId: string | null) {
  const lesson = await loadTypingLessonContent(levelId, lessonId);
  if (!lesson) return null;
  const targets = [
    ...typingLessonTargets(levelId, lessonId),
    ...[...lesson.words, ...lesson.sentences].map((item) => typingQuestionTarget(levelId, lessonId, item.stage, item.id)),
  ];
  const [policies, viewerHasVip] = await Promise.all([
    getContentAccessPolicies(targets, undefined, { failClosed: true }),
    userId && process.env.DATABASE_URL ? hasActiveVipAccess(userId) : Promise.resolve(false),
  ]);
  return resolveTypingLessonContent({ lesson, policies, viewerHasVip, viewerAuthenticated: Boolean(userId) });
}
