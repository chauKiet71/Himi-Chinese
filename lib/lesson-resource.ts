// The page supplies this small descriptor only after checking access. Lesson
// bodies are fetched separately and may be reused across the lesson's modes.
export type LessonResource = { url: string; version: string; scope: string };
export type LessonEnvelope<T = unknown> = { version: string; scope: string; data: T };

export function learningContentScope(user: {
  id: string;
  role: string;
  sessionCreatedAt?: Date;
} | null): string {
  return user ? `${user.id}:${user.role}:${user.sessionCreatedAt?.toISOString() ?? "session"}` : "guest";
}

export function hskLessonResourceUrl(level: string, lesson: string) {
  return `/api/lessons/hsk/${encodeURIComponent(level)}/${encodeURIComponent(lesson)}`;
}

export function industryLessonResourceUrl(course: string, lesson: string) {
  return `/api/lessons/industry/${encodeURIComponent(course)}/${encodeURIComponent(lesson)}`;
}

export function isLessonResourceUrl(url: string): boolean {
  return /^\/api\/lessons\/(hsk|industry)\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(url);
}

export function isLessonPayload(data: unknown, url: string): boolean {
  if (!data || typeof data !== "object") return false;
  const lesson = data as Record<string, unknown>;
  if (typeof lesson.title !== "string" || !Array.isArray(lesson.vocabulary)) return false;
  const arrays = url.startsWith("/api/lessons/hsk/")
    ? ["grammar", "dialogues", "pronunciationTopics", "exercises", "writingCharacters", "modes"]
    : ["dialogue", "notes"];
  const identity = url.startsWith("/api/lessons/hsk/") ? lesson.id : lesson.slug;
  return typeof identity === "string" && url.endsWith(`/${encodeURIComponent(identity)}`)
    && arrays.every((key) => Array.isArray(lesson[key]));
}
