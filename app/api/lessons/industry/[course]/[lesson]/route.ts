import { getCurrentUser } from "@/lib/auth-session";
import { getLessonPageData } from "@/lib/lesson-repository";
import { industryLessonResourceUrl, learningContentScope } from "@/lib/lesson-resource";
import { lessonApiError, lessonApiResponse } from "@/lib/lesson-resource-server";

export async function GET(request: Request, { params }: { params: Promise<{ course: string; lesson: string }> }) {
  const { course, lesson } = await params;
  const user = await getCurrentUser();
  const scope = learningContentScope(user);
  if (request.headers.get("X-Himi-Lesson-Scope") !== scope) return lessonApiError("Phiên đăng nhập đã thay đổi.", 401);
  const data = await getLessonPageData({ courseSlug: course, lessonSlug: lesson, userId: user?.id ?? null });
  if (!data || data.invalidLesson || !data.lesson || !data.access) return lessonApiError("Không tìm thấy bài học.", 404);
  if (!user && data.access.source !== "guest") return lessonApiError("Vui lòng đăng nhập.", 401);
  if (!data.access.allowed) return lessonApiError("Bài học yêu cầu quyền VIP.", 403);
  return lessonApiResponse(request, industryLessonResourceUrl(course, data.lesson.slug), data.lesson, scope);
}
