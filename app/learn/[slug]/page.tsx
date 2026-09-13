import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { LessonWorkspace } from "@/components/lesson-workspace";
import { listPublishedCourses } from "@/lib/course-repository";
import { getDailySessionSource } from "@/lib/daily-session-repository";
import { requireLearnerUser } from "@/lib/learner-auth";
import { getLessonPageData } from "@/lib/lesson-repository";

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
  const user = await requireLearnerUser(returnTo);
  const dailyFlow = session === "today";
  const [data, dailySource] = await Promise.all([
    getLessonPageData({ courseSlug: slug, lessonSlug, userId: user.id }),
    dailyFlow ? getDailySessionSource(user.id) : Promise.resolve(null),
  ]);
  if (!data || data.invalidLesson) notFound();
  const dailyNextStep = !dailySource
    ? null
    : !dailySource.practiceCompletedToday
      ? dailySource.practice
      : !dailySource.gameCompletedToday
        ? dailySource.game
        : { href: "/#today-summary", title: "Tổng kết phiên 10 phút" };

  return <main className="lesson-page"><div className="section-shell lesson-responsive-shell">
    <nav aria-label="Điều hướng bài học" className="lesson-breadcrumb"><Link href="/courses">Lộ trình</Link><ChevronRight aria-hidden="true" size={13} /><Link href={`/courses/${data.course.slug}`}>{data.course.title}</Link>{data.lesson ? <><ChevronRight aria-hidden="true" size={13} /><span aria-current="page">{data.lesson.title}</span></> : null}</nav>
    {data.lesson && data.access
      ? <LessonWorkspace
        course={data.course}
        lessons={data.lessons}
        lesson={data.lesson}
        access={data.access}
        progress={data.progress}
        authenticated
        dailyFlow={dailyFlow}
        dailyNextStep={dailyNextStep}
        key={data.lesson.slug}
      />
      : <div className="empty-state"><h1>Nội dung đang được biên soạn</h1><p>Lộ trình này đã có trong catalog nhưng chưa có bài học được xuất bản.</p><Link className="button button-primary" href="/courses">Chọn lộ trình khác</Link></div>}
  </div></main>;
}
