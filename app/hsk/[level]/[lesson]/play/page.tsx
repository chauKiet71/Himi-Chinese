import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HskGuidedLesson } from "@/components/hsk-guided-lesson";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getCurrentUser } from "@/lib/auth-session";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";

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
  const [{ level, lesson: lessonId }, user] = await Promise.all([params, getCurrentUser()]);
  const data = await getHskLessonPageData({ level, lessonId, userId: user?.id ?? null });
  if (!data) notFound();
  if (!data.access.allowed) return <HskVipLocked lesson={data.lesson} />;
  return <HskGuidedLesson lesson={data.lesson} />;
}
