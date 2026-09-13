import type { Metadata } from "next";
import { GameCenter } from "@/components/game-center";
import { isGameId } from "@/lib/activity-progress";
import { getGameProgress } from "@/lib/activity-progress-repository";
import { requireLearnerUser } from "@/lib/learner-auth";

export const metadata: Metadata = {
  title: "Trò chơi luyện tiếng Trung",
  description: "Bảy trò chơi ngắn giúp tăng phản xạ từ vựng, nghe hiểu, ghi nhớ và gõ tiếng Trung.",
};

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string | string[]; session?: string | string[] }>;
}) {
  const { game, session } = await searchParams;
  const requestedGameId = Array.isArray(game) ? game[0] : game;
  const dailyFlow = (Array.isArray(session) ? session[0] : session) === "today";
  const returnParams = new URLSearchParams();
  if (requestedGameId) returnParams.set("game", requestedGameId);
  if (dailyFlow) returnParams.set("session", "today");
  const returnTo = `/games${returnParams.size ? `?${returnParams}` : ""}`;
  const user = await requireLearnerUser(returnTo);
  const progress = await getGameProgress(user.id);
  return <GameCenter
    authenticated
    dailyFlow={dailyFlow}
    initialGameId={isGameId(requestedGameId) ? requestedGameId : null}
    initialProgress={progress}
  />;
}
