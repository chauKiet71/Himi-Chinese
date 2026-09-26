import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HskFlashcardSession } from "@/components/hsk-flashcard-session";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";
import { getHskLessonHref } from "@/lib/hsk-lesson-content";
import { getCurrentUser } from "@/lib/auth-session";
import { learnerLoginPath } from "@/lib/learner-auth";

type PageProps = { params: Promise<{ level: string; lesson: string }> };

export const metadata: Metadata = { title: "Flashcard HSK" };

export default async function HskFlashcardPage({ params }: PageProps) {
  const { level, lesson: lessonId } = await params;
  const returnTo = `/hsk/${encodeURIComponent(level)}/${encodeURIComponent(lessonId)}/flashcard`;
  const user = await getCurrentUser();
  const data = await getHskLessonPageData({ level, lessonId, userId: user?.id ?? null });
  if (!data) notFound();
  if (!user && data.access.source !== "guest") redirect(learnerLoginPath(returnTo));
  if (!data.access.allowed) return <HskVipLocked lesson={data.lesson} />;
  if (!data.lesson.vocabulary.length) notFound();
  return <HskFlashcardSession authenticated={Boolean(user)} backHref={getHskLessonHref(data.lesson.levelId, data.lesson.id)} lesson={data.lesson} />;
}
