import { notFound } from "next/navigation";
import { HimiWritingStudio } from "@/components/himi-writing-studio";
import { getWritingLessons, getWritingTopic } from "@/lib/writing-content";

export default function WritingFitPreviewPage() {
  const lesson = getWritingLessons("hsk-2")[0];
  const topic = lesson ? getWritingTopic("hsk-2", lesson.id) : undefined;
  if (!topic) notFound();

  return <HimiWritingStudio topic={topic} />;
}
