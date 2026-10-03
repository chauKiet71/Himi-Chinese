"use client";

import { lazy } from "react";
import { CachedLessonBoundary } from "@/components/cached-lesson-boundary";
import type { Course, LessonAccess, LessonDetail, LessonProgressState, LessonSummary } from "@/lib/content-types";
import type { LessonResource } from "@/lib/lesson-resource";

const IndustryLesson = lazy(() => import("./industry-guided-lesson").then((module) => ({ default: module.IndustryGuidedLesson })));

export function IndustryLessonLoader({ resource, title, ...props }: {
  resource: LessonResource;
  title: string;
  course: Course;
  lessons: LessonSummary[];
  access: LessonAccess;
  progress: LessonProgressState | null;
  authenticated: boolean;
}) {
  return <CachedLessonBoundary<LessonDetail> resource={resource} title={title} shellClassName="industry-guided-lesson" backHref={`/courses/${props.course.slug}`}>
    {(lesson) => <IndustryLesson {...props} lesson={lesson} />}
  </CachedLessonBoundary>;
}
