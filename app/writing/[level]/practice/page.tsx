import { notFound, redirect } from "next/navigation";
import { WRITING_LEVEL_IDS } from "@/lib/writing-content";
import { getWritingCatalog } from "@/lib/practice-content-repository";

type LegacyWritingPracticePageProps = {
  params: Promise<{ level: string }>;
};

export function generateStaticParams() {
  return WRITING_LEVEL_IDS.map((level) => ({ level }));
}

export default async function LegacyWritingPracticePage({ params }: LegacyWritingPracticePageProps) {
  const { level } = await params;
  const levelId = level.startsWith("hsk-") ? level : `hsk-${level}`;
  const firstLesson = (await getWritingCatalog())?.lessons[levelId]?.[0];
  if (!firstLesson) notFound();
  redirect(`/writing/${level}/${firstLesson.id}/practice`);
}
