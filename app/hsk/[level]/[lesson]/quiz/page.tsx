import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HskQuizSession } from "@/components/hsk-quiz-session";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";
import { requireLearnerUser } from "@/lib/learner-auth";

type PageProps = { params: Promise<{ level: string; lesson: string }> };

export const metadata: Metadata = { title: "Quiz HSK" };

export default async function HskQuizPage({ params }: PageProps) {
  const { level, lesson: lessonId } = await params;
  const user = await requireLearnerUser(`/hsk/${encodeURIComponent(level)}/${encodeURIComponent(lessonId)}/quiz`);
  const data = await getHskLessonPageData({ level, lessonId, userId: user.id });
  if (!data) notFound();
  if (!data.access.allowed) return <HskVipLocked lesson={data.lesson} />;
  if (!data.lesson.exercises.length) notFound();
  return <HskQuizSession lesson={data.lesson} />;
}
