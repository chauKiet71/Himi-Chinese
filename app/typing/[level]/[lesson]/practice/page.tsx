import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TypingPracticeStudio } from "@/components/typing-practice-studio";
import {
  getTypingLesson,
  getTypingLessonDataUrl,
  getTypingLessonParams,
  type TypingPracticeMode,
  type TypingPracticeStage,
} from "@/lib/typing-practice";
import { getCurrentUser } from "@/lib/auth-session";
import { getTypingAccessStates } from "@/lib/typing-content-repository";
import { typingLessonTargets } from "@/lib/typing-content-access";
import { TypingAccessGate } from "@/components/typing-access-gate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Phiên luyện gõ pinyin",
  description: "Luyện gõ pinyin theo nghĩa tiếng Việt hoặc âm thanh.",
};

type PracticePageProps = {
  params: Promise<{ level: string; lesson: string }>;
  searchParams?: Promise<{ stage?: string | string[]; mode?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function generateStaticParams() {
  return getTypingLessonParams();
}

export default async function TypingPracticePage({ params, searchParams = Promise.resolve({}) }: PracticePageProps) {
  const [{ level: levelId, lesson: lessonId }, query] = await Promise.all([params, searchParams]);
  const selection = getTypingLesson(levelId, lessonId);
  if (!selection) notFound();
  const stageValue = firstValue(query.stage);
  const modeValue = firstValue(query.mode);
  const initialStage: TypingPracticeStage = stageValue === "sentence" ? "sentence" : "word";
  const initialMode: TypingPracticeMode = modeValue === "listening" ? "listening" : "meaning";
  const stageCount = initialStage === "word" ? selection.lesson.wordCount : selection.lesson.sentenceCount;
  if (!stageCount) notFound();

  const returnParams = new URLSearchParams({ stage: initialStage, mode: initialMode });
  const returnTo = `/typing/${selection.level.id}/${selection.lesson.id}/practice?${returnParams.toString()}`;
  const user = await getCurrentUser();
  const [access] = await getTypingAccessStates([typingLessonTargets(selection.level.id, selection.lesson.id)], user?.id ?? null);
  if (!access.allowed) return <main className="typing-session-page">
    <TypingAccessGate backHref={`/typing/${selection.level.id}`} loginRequired={access.source === "login_required"} returnTo={returnTo} title={selection.lesson.titleVi} />
  </main>;

  return <main className="typing-session-page">
    <TypingPracticeStudio
      initialMode={initialMode}
      initialStage={initialStage}
      lesson={{ ...selection.lesson, previewHanzi: [] }}
      lessonDataUrl={getTypingLessonDataUrl(selection.level.id, selection.lesson.id)}
      level={{ ...selection.level, previewHanzi: [], lessons: selection.level.lessons.map((lesson) => ({ ...lesson, previewHanzi: [] })) }}
    />
  </main>;
}
