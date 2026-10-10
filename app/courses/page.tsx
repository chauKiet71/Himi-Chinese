import type { Metadata } from "next";
import { Suspense } from "react";
import { CourseGridSkeleton } from "@/components/course-catalog-skeleton";
import { CourseLibraryView, type CourseLibraryViewName } from "@/components/course-library-view";
import { getCurrentUser } from "@/lib/auth-session";
import { listPublishedCoursesForViewer } from "@/lib/course-repository";
import { getHskCurriculumPageData } from "@/lib/hsk-access-repository";
import { HSK_CURRICULUM } from "@/lib/hsk-curriculum";

export const metadata: Metadata = {
  title: "Giáo trình HSK & lộ trình chuyên ngành",
  description: "Học theo cấp độ HSK hoặc chọn lộ trình tiếng Trung phù hợp với công việc của bạn.",
};

type CoursesSearchParams = {
  level?: string | string[];
  view?: string | string[];
  upgradeLesson?: string | string[];
};

const hskSummary = {
  lessonCount: HSK_CURRICULUM.reduce(
    (levelTotal, level) => levelTotal + level.topics.reduce(
      (topicTotal, topic) => topicTotal + topic.lessons.length,
      0,
    ),
    0,
  ),
  levelCount: HSK_CURRICULUM.length,
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function CourseCatalog({ userId }: { userId: string | null }) {
  const courses = await listPublishedCoursesForViewer(userId);
  return <CourseLibraryView authenticated={Boolean(userId)} courses={courses} hskCurriculum={[]} hskSummary={hskSummary} view="catalog" />;
}

export default async function CoursesPage({
  searchParams = Promise.resolve({}),
}: {
  searchParams?: Promise<CoursesSearchParams>;
}) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  const view: CourseLibraryViewName = firstValue(params.view) === "hsk" ? "hsk" : "catalog";
  const hskCurriculum = view === "hsk" ? await getHskCurriculumPageData(user?.id ?? null) : [];
  const requestedLevelId = firstValue(params.level);
  const initialHskLevelId = hskCurriculum.some((level) => level.id === requestedLevelId)
    ? requestedLevelId
    : undefined;

  return <main className={`course-library-page hsk-curriculum-page ${view === "catalog" ? "learner-full-width-catalog" : ""}`.trim()}>
    {view === "hsk" ? <CourseLibraryView authenticated={Boolean(user)} courses={[]} hskCurriculum={hskCurriculum} hskSummary={hskSummary} initialHskLevelId={initialHskLevelId} initialUpgradeLessonId={firstValue(params.upgradeLesson)} view="hsk" /> : <div id="course-catalog">
      <Suspense fallback={<CourseGridSkeleton />}><CourseCatalog userId={user?.id ?? null} /></Suspense>
    </div>}
  </main>;
}
