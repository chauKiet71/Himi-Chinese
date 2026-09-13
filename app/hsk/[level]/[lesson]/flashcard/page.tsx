import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HskFlashcardSession } from "@/components/hsk-flashcard-session";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";
import { getHskLessonHref } from "@/lib/hsk-lesson-content";
import { requireLearnerUser } from "@/lib/learner-auth";

type PageProps = { params: Promise<{ level: string; lesson: string }> };

export const metadata: Metadata = { title: "Flashcard HSK" };

export default async function HskFlashcardPage({ params }: PageProps) {
  const { level, lesson: lessonId } = await params;
  const user = await requireLearnerUser(`/hsk/${encodeURIComponent(level)}/${encodeURIComponent(lessonId)}/flashcard`);
  const data = await getHskLessonPageData({ level, lessonId, userId: user.id });
  if (!data) notFound();
  if (!data.access.allowed) return <HskVipLocked lesson={data.lesson} />;
  if (!data.lesson.vocabulary.length) notFound();
  return <HskFlashcardSession authenticated backHref={getHskLessonHref(data.lesson.levelId, data.lesson.id)} lesson={data.lesson} />;
}
