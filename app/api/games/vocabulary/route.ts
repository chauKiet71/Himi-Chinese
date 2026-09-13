import { getCurrentUser } from "@/lib/auth-session";
import { getHskLevelLessonAccess } from "@/lib/hsk-access-repository";
import { isSliceHskLevel } from "@/lib/slice-game";
import { getSliceHskVocabulary } from "@/lib/slice-hsk-vocabulary";

export async function GET(request: Request) {
  const level = new URL(request.url).searchParams.get("level");
  if (!isSliceHskLevel(level)) {
    return Response.json({ error: "Vui lòng chọn khóa HSK1 đến HSK6." }, { status: 400 });
  }
  const user = await getCurrentUser();
  if (!user) {
    return Response.json(
      { error: "Vui lòng đăng nhập để chơi game.", code: "AUTH_REQUIRED" },
      { status: 401, headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } },
    );
  }
  const access = await getHskLevelLessonAccess(level, user.id);
  if (!access.levelAccess.allowed || access.allowedLessonIds.size === 0 || access.allowedVocabularyKeys.size === 0) {
    return Response.json({ error: "Nội dung từ vựng của khóa HSK này dành cho thành viên VIP.", code: "VIP_REQUIRED" }, { status: 403 });
  }
  return Response.json({ level, words: getSliceHskVocabulary(level, access.allowedLessonIds, access.allowedVocabularyKeys) });
}
