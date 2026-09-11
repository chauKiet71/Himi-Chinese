import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HimiWritingStudio } from "@/components/himi-writing-studio";
import { HskVipLocked } from "@/components/hsk-vip-locked";
import { getCurrentUser } from "@/lib/auth-session";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";
import { getWritingPracticeParams, getWritingTopic, getWritingTopicFromLesson } from "@/lib/writing-content";

type WritingPracticePageProps = {
  params: Promise<{ level: string; lesson: string }>;
};

export function generateStaticParams() {
  return getWritingPracticeParams();
}

export async function generateMetadata({ params }: WritingPracticePageProps): Promise<Metadata> {
  const { level, lesson } = await params;
  const topic = getWritingTopic(level, lesson);
  if (!topic) return { title: "Không tìm thấy bài luyện viết" };
  return {
    title: `Bài ${topic.lessonNumber}: ${topic.title} · Luyện viết ${topic.level}`,
    description: `Luyện viết ${topic.characters.length} chữ trong bài ${topic.title}.`,
  };
}

export default async function WritingPracticePage({ params }: WritingPracticePageProps) {
  const [{ level, lesson }, user] = await Promise.all([params, getCurrentUser()]);
  const data = await getHskLessonPageData({ level, lessonId: lesson, userId: user?.id ?? null });
  if (!data) notFound();
  if (!data.access.allowed) return <HskVipLocked lesson={data.lesson} />;

  const topic = getWritingTopicFromLesson(level, lesson, data.lesson);
  if (!topic) notFound();

  return <HimiWritingStudio key={`${topic.levelId}-${topic.slug}`} topic={topic} />;
}
