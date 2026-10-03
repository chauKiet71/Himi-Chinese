"use client";

import { lazy } from "react";
import { CachedLessonBoundary } from "@/components/cached-lesson-boundary";
import type { HskLessonContent } from "@/lib/hsk-lesson-content";
import { getHskCurriculumHref, getHskLessonHref } from "@/lib/hsk-routing";
import type { LessonResource } from "@/lib/lesson-resource";

const Guided = lazy(() => import("./hsk-guided-lesson").then((module) => ({ default: module.HskGuidedLesson })));
const Workspace = lazy(() => import("./hsk-lesson-workspace").then((module) => ({ default: module.HskLessonWorkspace })));
const Quiz = lazy(() => import("./hsk-quiz-session").then((module) => ({ default: module.HskQuizSession })));
const Flashcard = lazy(() => import("./hsk-flashcard-session").then((module) => ({ default: module.HskFlashcardSession })));

export function HskLessonLoader({ resource, title, levelId, mode, authenticated, nextLessonHref }: {
  resource: LessonResource;
  title: string;
  levelId: string;
  mode: "play" | "workspace" | "quiz" | "flashcard";
  authenticated: boolean;
  nextLessonHref?: string | null;
}) {
  const shellClassName = mode === "play" ? "hsk-guided-page" : mode === "quiz" ? "hsk-quiz-session" : "lesson-page";
  return <CachedLessonBoundary<HskLessonContent> resource={resource} title={title} shellClassName={shellClassName} backHref={getHskCurriculumHref(levelId)}>
    {(lesson) => {
      if (mode === "play") return <Guided lesson={lesson} authenticated={authenticated} nextLessonHref={nextLessonHref} />;
      if (mode === "quiz") return <Quiz lesson={lesson} />;
      if (mode === "flashcard") return <Flashcard lesson={lesson} authenticated={authenticated} backHref={getHskLessonHref(lesson.levelId, lesson.id)} />;
      return <Workspace lesson={lesson} authenticated={authenticated} />;
    }}
  </CachedLessonBoundary>;
}
