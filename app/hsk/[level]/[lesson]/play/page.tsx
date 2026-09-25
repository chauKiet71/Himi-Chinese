import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HskGuidedLesson } from "@/components/hsk-guided-lesson";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";
import { HSK_CURRICULUM } from "@/lib/hsk-curriculum";
import { getHskLessonHref } from "@/lib/hsk-lesson-content";
import { requireLearnerUser } from "@/lib/learner-auth";

type PageProps = { params: Promise<{ level: string; lesson: string }> };

async function getLesson(params: PageProps["params"]) {
  const { level, lesson } = await params;
  return getHskLessonPageData({ level, lessonId: lesson, userId: null });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lesson = await getLesson(params);
  return { title: lesson ? `Học bài ${lesson.lesson.lessonNumber}: ${lesson.lesson.title}` : "Học bài HSK" };
}

export default async function HskGuidedLessonPage({ params }: PageProps) {
  const { level, lesson: lessonId } = await params;
  const user = await requireLearnerUser(`/hsk/${encodeURIComponent(level)}/${encodeURIComponent(lessonId)}/play`);
  const data = await getHskLessonPageData({ level, lessonId, userId: user.id });
  if (!data) notFound();
  if (!data.access.allowed) return <HskVipLocked lesson={data.lesson} />;
  const levelLessons = HSK_CURRICULUM
    .find((curriculumLevel) => curriculumLevel.id === data.lesson.levelId)
    ?.topics.flatMap((topic) => topic.lessons) ?? [];
  const lessonIndex = levelLessons.findIndex((lesson) => lesson.id === data.lesson.id);
  const nextLesson = lessonIndex >= 0 ? levelLessons[lessonIndex + 1] : undefined;
  const nextLessonHref = nextLesson?.available
    ? `${getHskLessonHref(data.lesson.levelId, nextLesson.id)}/play`
    : null;
  return <HskGuidedLesson authenticated lesson={data.lesson} nextLessonHref={nextLessonHref} />;
}
