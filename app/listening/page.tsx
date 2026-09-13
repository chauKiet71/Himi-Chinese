import type { Metadata } from "next";
import { ListeningCatalogStudio } from "@/components/listening-catalog-studio";
import { catalogGroupForHskLevel } from "@/lib/listening-catalog";

export const metadata: Metadata = {
  title: "Luyện nghe",
  description: "Luyện nghe và phản xạ tiếng Trung chủ động cùng Himi Chinese.",
};

type ListeningSearchParams = {
  mode?: string | string[];
  scenario?: string | string[];
  session?: string | string[];
  level?: string | string[];
  lesson?: string | string[];
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ListeningPage({
  searchParams = Promise.resolve({}),
}: {
  searchParams?: Promise<ListeningSearchParams>;
}) {
  const params = await searchParams;
  if (firstValue(params.mode) === "scenario") {
    const { ScenarioPractice } = await import("@/components/scenario-practice");
    return <ScenarioPractice {...params} />;
  }

  const initialGroupId = catalogGroupForHskLevel(firstValue(params.level));

  return <ListeningCatalogStudio
    initialGroupId={initialGroupId}
    initialLessonId={firstValue(params.lesson)}
  />;
}
