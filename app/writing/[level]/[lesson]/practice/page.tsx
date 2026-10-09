import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HimiWritingStudio } from "@/components/himi-writing-studio";
import { VipContentGate } from "@/components/vip-upgrade-prompt";
import { getWritingPractice, getWritingCatalog } from "@/lib/practice-content-repository";
import { getCurrentUser } from "@/lib/auth-session";
import { learnerLoginPath } from "@/lib/learner-auth";

type WritingPracticePageProps = {
  params: Promise<{ level: string; lesson: string }>;
};

export async function generateMetadata({ params }: WritingPracticePageProps): Promise<Metadata> {
  const { level, lesson } = await params;
  const levelId = level.startsWith("hsk-") ? level : `hsk-${level}`;
  const topic = (await getWritingCatalog())?.lessons[levelId]?.find((entry) => entry.id === lesson);
  if (!topic) return { title: "Không tìm thấy bài luyện viết" };
  return {
    title: `Bài ${topic.lessonNumber}: ${topic.title} · Luyện viết ${levelId}`,
    description: `Luyện viết ${topic.characterCount} chữ trong bài ${topic.title}.`,
  };
}

export default async function WritingPracticePage({ params }: WritingPracticePageProps) {
  const { level, lesson } = await params;
  const returnTo = `/writing/${encodeURIComponent(level)}/${encodeURIComponent(lesson)}/practice`;
  const user = await getCurrentUser();
  const data = await getWritingPractice(level, lesson, user?.id ?? null);
  if (!data) notFound();
  if (data.access.source === "login_required") redirect(learnerLoginPath(returnTo));
  if (!data.access.allowed) return <VipContentGate title="Bài luyện viết dành cho thành viên VIP" closeHref={`/writing/${level}`} />;
  const topic = data.topic;
  if (!topic) notFound();

  return <HimiWritingStudio key={`${topic.levelId}-${topic.slug}`} topic={topic} />;
}
