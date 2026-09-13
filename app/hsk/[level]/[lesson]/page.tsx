import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HskLessonWorkspace } from "@/components/hsk-lesson-workspace";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";
import { getHskLearningLessonContent } from "@/lib/hsk-learning-content";
import { requireLearnerUser } from "@/lib/learner-auth";

type HskLessonPageProps = {
  params: Promise<{ level: string; lesson: string }>;
};

async function getLessonFromParams(params: HskLessonPageProps["params"]) {
  const { level, lesson } = await params;
  return getHskLearningLessonContent(level, lesson);
}

export async function generateMetadata({ params }: HskLessonPageProps): Promise<Metadata> {
  const lesson = await getLessonFromParams(params);
  if (!lesson) return { title: "Bài học HSK" };
  return {
    title: `Bài ${lesson.lessonNumber}: ${lesson.title} · ${lesson.levelLabel}`,
    description: lesson.summary,
  };
}

export default async function HskLessonPage({ params }: HskLessonPageProps) {
  const { level, lesson: lessonId } = await params;
  const user = await requireLearnerUser(`/hsk/${encodeURIComponent(level)}/${encodeURIComponent(lessonId)}`);
  const data = await getHskLessonPageData({ level, lessonId, userId: user.id });
  if (!data) notFound();
  if (!data.access.allowed) return <HskVipLocked lesson={data.lesson} />;
  return <HskLessonWorkspace authenticated lesson={data.lesson} />;
}
