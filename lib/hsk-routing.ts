// Client-safe helpers: importing a URL helper must not bundle textbook JSON.
export function normalizeHskLevelParam(level: string): string {
  return level.startsWith("hsk-") ? level : `hsk-${level}`;
}

export function getHskLessonHref(levelId: string, lessonId: string): string {
  return `/hsk/${levelId.replace(/^hsk-/, "")}/${lessonId}`;
}

export function getHskCurriculumHref(levelId: string): string {
  return `/courses?view=hsk&level=${encodeURIComponent(normalizeHskLevelParam(levelId))}`;
}
