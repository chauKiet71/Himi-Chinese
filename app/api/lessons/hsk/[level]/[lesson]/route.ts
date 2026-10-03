import { getCurrentUser } from "@/lib/auth-session";
import { getHskLessonPageData } from "@/lib/hsk-access-repository";
import { hskLessonResourceUrl, learningContentScope } from "@/lib/lesson-resource";
import { lessonApiError, lessonApiResponse } from "@/lib/lesson-resource-server";

export async function GET(request: Request, { params }: { params: Promise<{ level: string; lesson: string }> }) {
  const { level, lesson: lessonId } = await params;
  const user = await getCurrentUser();
  const scope = learningContentScope(user);
  if (request.headers.get("X-Himi-Lesson-Scope") !== scope) return lessonApiError("Phiên đăng nhập đã thay đổi.", 401);
  const data = await getHskLessonPageData({ level, lessonId, userId: user?.id ?? null });
  if (!data) return lessonApiError("Không tìm thấy bài học.", 404);
  if (!user && data.access.source !== "guest") return lessonApiError("Vui lòng đăng nhập.", 401);
  if (!data.access.allowed) return lessonApiError("Bài học yêu cầu quyền VIP.", 403);
  return lessonApiResponse(request, hskLessonResourceUrl(data.lesson.levelId, data.lesson.id), data.lesson, scope);
}
