import { notFound } from "next/navigation";
import { isSetStudyMode } from "@/lib/vocabulary-sets";
import { loadVocabularySet } from "@/lib/vocabulary-set-loader";
import { VocabularySetStudy } from "@/components/vocabulary-set-study";

export const metadata = { title: "Học bộ từ vựng" };
export default async function StudyPage({ params }: { params: Promise<{ setId: string; mode: string }> }) {
  const { setId, mode } = await params;
  if (!isSetStudyMode(mode)) notFound();
  const set = await loadVocabularySet(setId);
  return <VocabularySetStudy key={`${set.id}:${mode}`} set={set} mode={mode} />;
}
