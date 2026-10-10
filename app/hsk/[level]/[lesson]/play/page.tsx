import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HskLessonLoader } from "@/components/hsk-lesson-loader";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";
import { HSK_CURRICULUM } from "@/lib/hsk-curriculum";
import { getHskLessonHref } from "@/lib/hsk-lesson-content";
import { getCurrentUser } from "@/lib/auth-session";
import { learnerLoginPath } from "@/lib/learner-auth";
import { hskLessonResourceUrl, learningContentScope } from "@/lib/lesson-resource";
import { createLessonResource } from "@/lib/lesson-resource-server";

type PageProps = { params: Promise<{ level: string; lesson: string }>; searchParams?: Promise<{ from?: string }> };

async function getLesson(params: PageProps["params"]) {
  const { level, lesson } = await params;
  return getHskLessonPageData({ level, lessonId: lesson, userId: null });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lesson = await getLesson(params);
  return { title: lesson ? `Học bài ${lesson.lesson.lessonNumber}: ${lesson.lesson.title}` : "Học bài HSK" };
}

export default async function HskGuidedLessonPage({ params, searchParams }: PageProps) {
  const { level, lesson: lessonId } = await params;
  const returnTo = `/hsk/${encodeURIComponent(level)}/${encodeURIComponent(lessonId)}/play`;
  const user = await getCurrentUser();
  const data = await getHskLessonPageData({ level, lessonId, userId: user?.id ?? null });
  if (!data) notFound();
  if (!user && data.access.source !== "guest") redirect(learnerLoginPath(returnTo));
  if (!data.access.allowed) {
    const query = await searchParams;
    if (query?.from === "completion" && data.access.source === "vip_required") {
      redirect(`/courses?view=hsk&level=${encodeURIComponent(data.lesson.levelId)}&upgradeLesson=${encodeURIComponent(data.lesson.id)}`);
    }
    return <HskVipLocked lesson={data.lesson} />;
  }
  const levelLessons = HSK_CURRICULUM
    .find((curriculumLevel) => curriculumLevel.id === data.lesson.levelId)
    ?.topics.flatMap((topic) => topic.lessons) ?? [];
  const lessonIndex = levelLessons.findIndex((lesson) => lesson.id === data.lesson.id);
  const nextLesson = lessonIndex >= 0 ? levelLessons[lessonIndex + 1] : undefined;
  const nextLessonHref = nextLesson?.available
    ? `${getHskLessonHref(data.lesson.levelId, nextLesson.id)}/play`
    : null;
  const resource = await createLessonResource(hskLessonResourceUrl(data.lesson.levelId, data.lesson.id), data.lesson, learningContentScope(user));
  return <HskLessonLoader authenticated={Boolean(user)} levelId={data.lesson.levelId} mode="play" nextLessonHref={nextLessonHref} resource={resource} title={data.lesson.title} />;
}
