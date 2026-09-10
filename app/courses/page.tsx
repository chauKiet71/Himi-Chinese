import type { Metadata } from "next";
import { Suspense } from "react";
import { CourseGridSkeleton } from "@/components/course-catalog-skeleton";
import { CourseLibraryView, type CourseLibraryViewName } from "@/components/course-library-view";
import { getCurrentUser } from "@/lib/auth-session";
import { listPublishedCoursesForViewer } from "@/lib/course-repository";
import { getHskCurriculumPageData } from "@/lib/hsk-access-repository";

export const metadata: Metadata = {
  title: "Giáo trình HSK & lộ trình chuyên ngành",
  description: "Học theo cấp độ HSK hoặc chọn lộ trình tiếng Trung phù hợp với công việc của bạn.",
};

type CoursesSearchParams = {
  view?: string | string[];
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function CourseCatalog({ userId }: { userId: string | null }) {
  const courses = await listPublishedCoursesForViewer(userId);
  return <CourseLibraryView courses={courses} hskCurriculum={[]} view="catalog" />;
}

export default async function CoursesPage({
  searchParams = Promise.resolve({}),
}: {
  searchParams?: Promise<CoursesSearchParams>;
}) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  const view: CourseLibraryViewName = firstValue(params.view) === "hsk" ? "hsk" : "catalog";
  const hskCurriculum = view === "hsk" ? await getHskCurriculumPageData(user?.id ?? null) : [];

  return <main className="course-library-page hsk-curriculum-page">
    {view === "hsk" ? <CourseLibraryView courses={[]} hskCurriculum={hskCurriculum} view="hsk" /> : <div id="course-catalog">
      <Suspense fallback={<CourseGridSkeleton />}><CourseCatalog userId={user?.id ?? null} /></Suspense>
    </div>}
  </main>;
}
