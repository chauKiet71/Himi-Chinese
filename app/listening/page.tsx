import type { Metadata } from "next";
import { ListeningCatalogStudio } from "@/components/listening-catalog-studio";
import { getCurrentUser } from "@/lib/auth-session";
import { requireLearnerUser } from "@/lib/learner-auth";
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

  const requestedLevel = firstValue(params.level);
  const initialLessonId = firstValue(params.lesson);
  const returnParams = new URLSearchParams();
  if (requestedLevel) returnParams.set("level", requestedLevel);
  if (initialLessonId) returnParams.set("lesson", initialLessonId);
  const returnTo = `/listening${returnParams.size ? `?${returnParams}` : ""}`;
  const user = initialLessonId
    ? await requireLearnerUser(returnTo)
    : await getCurrentUser();
  const initialGroupId = catalogGroupForHskLevel(requestedLevel);

  return <ListeningCatalogStudio
    authenticated={Boolean(user)}
    initialGroupId={initialGroupId}
    initialLessonId={initialLessonId}
  />;
}
