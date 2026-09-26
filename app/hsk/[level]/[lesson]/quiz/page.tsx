import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HskQuizSession } from "@/components/hsk-quiz-session";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";
import { getCurrentUser } from "@/lib/auth-session";
import { learnerLoginPath } from "@/lib/learner-auth";

type PageProps = { params: Promise<{ level: string; lesson: string }> };

export const metadata: Metadata = { title: "Quiz HSK" };

export default async function HskQuizPage({ params }: PageProps) {
  const { level, lesson: lessonId } = await params;
  const returnTo = `/hsk/${encodeURIComponent(level)}/${encodeURIComponent(lessonId)}/quiz`;
  const user = await getCurrentUser();
  const data = await getHskLessonPageData({ level, lessonId, userId: user?.id ?? null });
  if (!data) notFound();
  if (!user && data.access.source !== "guest") redirect(learnerLoginPath(returnTo));
  if (!data.access.allowed) return <HskVipLocked lesson={data.lesson} />;
  if (!data.lesson.exercises.length) notFound();
  return <HskQuizSession lesson={data.lesson} />;
}
