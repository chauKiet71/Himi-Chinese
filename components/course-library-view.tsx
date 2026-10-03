"use client";

import { CourseExplorer } from "@/components/course-explorer";
import { HskCurriculumExplorer } from "@/components/hsk-curriculum-explorer";
import type { HskCourseSummary } from "@/components/hsk-course-card";
import type { Course } from "@/lib/content-types";
import type { HskCurriculumLevel } from "@/lib/hsk-curriculum";

export type CourseLibraryViewName = "catalog" | "hsk";
const emptyHskSummary: HskCourseSummary = { lessonCount: 0, levelCount: 0 };

export function CourseLibraryView({
  authenticated,
  courses,
  hskCurriculum,
  hskSummary = emptyHskSummary,
  initialHskLevelId,
  view,
}: {
  authenticated: boolean;
  courses: Course[];
  hskCurriculum: HskCurriculumLevel[];
  hskSummary?: HskCourseSummary;
  initialHskLevelId?: string;
  view: CourseLibraryViewName;
}) {
  if (view === "hsk") {
    return <HskCurriculumExplorer authenticated={authenticated} catalogHref="/courses" curriculum={hskCurriculum} initialLevelId={initialHskLevelId} />;
  }

  return <>
    <header className="section-shell industry-course-heading course-catalog-heading">
      <h1>Chọn chủ đề bạn muốn học</h1>
    </header>
    <CourseExplorer authenticated={authenticated} courses={courses} hskSummary={hskSummary} includeHskCard />
  </>;
}
