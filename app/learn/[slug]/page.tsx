import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { IndustryGuidedLesson } from "@/components/industry-guided-lesson";
import { IndustryLessonLoader } from "@/components/industry-lesson-loader";
import { listPublishedCourses } from "@/lib/course-repository";
import { getCurrentUser } from "@/lib/auth-session";
import { learnerLoginPath } from "@/lib/learner-auth";
import { getLessonPageData } from "@/lib/lesson-repository";
import { industryLessonResourceUrl, learningContentScope } from "@/lib/lesson-resource";
import { createLessonResource } from "@/lib/lesson-resource-server";

export async function generateStaticParams() {
  const courses = await listPublishedCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string; session?: string }>;
}) {
  const [{ slug }, { lesson: lessonSlug, session }] = await Promise.all([params, searchParams]);
  const returnParams = new URLSearchParams();
  if (lessonSlug) returnParams.set("lesson", lessonSlug);
  if (session) returnParams.set("session", session);
  const returnTo = `/learn/${encodeURIComponent(slug)}${returnParams.size ? `?${returnParams}` : ""}`;
  const user = await getCurrentUser();
  const data = await getLessonPageData({ courseSlug: slug, lessonSlug, userId: user?.id ?? null });
  if (!data || data.invalidLesson) notFound();
  if (!user && data.access?.source !== "guest") redirect(learnerLoginPath(returnTo));

  if (data.lesson && data.access?.allowed) {
    const resource = await createLessonResource(industryLessonResourceUrl(slug, data.lesson.slug), data.lesson, learningContentScope(user));
    return <IndustryLessonLoader resource={resource} title={data.lesson.title} course={data.course} lessons={data.lessons} access={data.access} progress={data.progress} authenticated={Boolean(user)} />;
  }

  return data.lesson && data.access
      ? <IndustryGuidedLesson
        course={data.course}
        lessons={data.lessons}
        lesson={data.lesson}
        access={data.access}
        progress={data.progress}
        authenticated={Boolean(user)}
        key={data.lesson.slug}
      />
      : <main className="lesson-page"><div className="section-shell lesson-responsive-shell"><div className="empty-state"><h1>Nội dung đang được biên soạn</h1><p>Lộ trình này đã có trong catalog nhưng chưa có bài học được xuất bản.</p><Link className="button button-primary" href="/courses">Chọn lộ trình khác</Link></div></div></main>;
}
