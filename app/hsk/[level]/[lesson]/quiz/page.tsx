import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HskQuizSession } from "@/components/hsk-quiz-session";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getCurrentUser } from "@/lib/auth-session";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";

type PageProps = { params: Promise<{ level: string; lesson: string }> };

export const metadata: Metadata = { title: "Quiz HSK" };

export default async function HskQuizPage({ params }: PageProps) {
  const [{ level, lesson: lessonId }, user] = await Promise.all([params, getCurrentUser()]);
  const data = await getHskLessonPageData({ level, lessonId, userId: user?.id ?? null });
  if (!data) notFound();
  if (!data.access.allowed) return <HskVipLocked lesson={data.lesson} />;
  if (!data.lesson.exercises.length) notFound();
  return <HskQuizSession lesson={data.lesson} />;
}
