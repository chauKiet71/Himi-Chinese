import type { HskLessonContent } from "./hsk-lesson-content";
import { buildHskGuidedLessonSteps } from "./hsk-guided-lesson.ts";

export type HskLessonProgress = {
  vocabulary: string[];
  pronunciation: string[];
  exerciseBestPercent: number;
  reviewedExercises: string[];
  writing: string[];
  guidedStep: number;
  guidedCompleted: boolean;
  guidedFlowVersion: number;
};

const CURRENT_GUIDED_FLOW_VERSION = 3;

export const EMPTY_HSK_LESSON_PROGRESS: HskLessonProgress = {
  vocabulary: [],
  pronunciation: [],
  exerciseBestPercent: 0,
  reviewedExercises: [],
  writing: [],
  guidedStep: -1,
  guidedCompleted: false,
  guidedFlowVersion: CURRENT_GUIDED_FLOW_VERSION,
};

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))];
}

export function parseHskLessonProgress(raw: string | null, lesson?: HskLessonContent): HskLessonProgress {
  if (!raw) return EMPTY_HSK_LESSON_PROGRESS;

  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return EMPTY_HSK_LESSON_PROGRESS;
    const candidate = value as Partial<HskLessonProgress>;
    const score = typeof candidate.exerciseBestPercent === "number" && Number.isFinite(candidate.exerciseBestPercent)
      ? Math.max(0, Math.min(100, Math.round(candidate.exerciseBestPercent)))
      : 0;
    const storedGuidedStep = typeof candidate.guidedStep === "number" && Number.isFinite(candidate.guidedStep)
      ? Math.max(-1, Math.round(candidate.guidedStep))
      : -1;
    const storedFlowVersion = typeof candidate.guidedFlowVersion === "number"
      ? Math.max(1, Math.min(CURRENT_GUIDED_FLOW_VERSION, Math.round(candidate.guidedFlowVersion)))
      : 1;
    const stepWithoutIntroduction = storedFlowVersion < 2 && storedGuidedStep > 0
      ? storedGuidedStep - 1
      : storedGuidedStep;
    let guidedStep = stepWithoutIntroduction;
    let guidedFlowVersion = Math.max(2, storedFlowVersion);
    if (lesson && storedFlowVersion < CURRENT_GUIDED_FLOW_VERSION) {
      const placeholders = new Set(lesson.guidedPlaceholders ?? []);
      const vocabularySteps = lesson.vocabulary.length || (placeholders.has("vocabulary") ? 1 : 0);
      const grammarEnd = vocabularySteps + lesson.grammar.length;
      if (guidedStep >= vocabularySteps && guidedStep < grammarEnd) guidedStep = vocabularySteps;
      else if (guidedStep >= grammarEnd) guidedStep -= lesson.grammar.length;
      guidedFlowVersion = CURRENT_GUIDED_FLOW_VERSION;
    }
    return {
      vocabulary: uniqueStrings(candidate.vocabulary),
      pronunciation: uniqueStrings(candidate.pronunciation),
      exerciseBestPercent: score,
      reviewedExercises: uniqueStrings(candidate.reviewedExercises),
      writing: uniqueStrings(candidate.writing),
      guidedStep,
      guidedCompleted: candidate.guidedCompleted === true,
      guidedFlowVersion,
    };
  } catch {
    return EMPTY_HSK_LESSON_PROGRESS;
  }
}

export function getHskLessonProgressStorageKey(lessonId: string): string {
  return `himi-hsk-lesson-progress:v1:${lessonId}`;
}

export function hasHskLessonProgress(progress: HskLessonProgress): boolean {
  return progress.guidedStep >= 0
    || progress.guidedCompleted
    || progress.vocabulary.length > 0
    || progress.pronunciation.length > 0
    || progress.exerciseBestPercent > 0
    || progress.reviewedExercises.length > 0
    || progress.writing.length > 0;
}

function ratio(completed: number, total: number): number {
  if (!total) return 1;
  return Math.min(1, completed / total);
}

export function calculateHskLessonProgress(lesson: HskLessonContent, progress: HskLessonProgress): number {
  const guidedSteps = buildHskGuidedLessonSteps(lesson).length;
  const accessibleVocabulary = lesson.vocabulary.filter((item) => !item.locked);
  const accessibleExercises = lesson.exercises.filter((item) => !item.locked);
  const accessibleWriting = lesson.writingCharacters.filter((item) => !item.locked);
  const accessibleVocabularyIds = new Set(accessibleVocabulary.map((item) => item.id));
  const accessibleExerciseIds = new Set(accessibleExercises.map((item) => item.id));
  const completedWriting = accessibleWriting
    .filter((item) => (progress.writing ?? []).includes(item.id) || (progress.writing ?? []).includes(item.hanzi))
    .map((item) => item.id);
  return calculateHskLessonProgressFromCounts({
    vocabulary: accessibleVocabulary.length,
    pronunciation: lesson.modes.includes("pronunciation") ? accessibleVocabulary.length : 0,
    exercises: accessibleExercises.length,
    scoredExercises: accessibleExercises.length > 0 && accessibleExercises.every((exercise) => exercise.answer !== null),
    writing: accessibleWriting.length,
    guidedSteps,
  }, {
    ...progress,
    vocabulary: (progress.vocabulary ?? []).filter((id) => accessibleVocabularyIds.has(id)),
    pronunciation: (progress.pronunciation ?? []).filter((id) => accessibleVocabularyIds.has(id)),
    reviewedExercises: (progress.reviewedExercises ?? []).filter((id) => accessibleExerciseIds.has(id)),
    writing: completedWriting,
  });
}

export function calculateHskLessonProgressFromCounts(
  counts: {
    vocabulary: number;
    pronunciation?: number;
    exercises?: number;
    scoredExercises?: boolean;
    writing: number;
    guidedSteps: number;
  },
  progress: HskLessonProgress,
): number {
  const modeRatios: number[] = [];
  if (counts.vocabulary) modeRatios.push(ratio(progress.vocabulary.length, counts.vocabulary));
  if (counts.pronunciation) modeRatios.push(ratio(progress.pronunciation.length, counts.pronunciation));
  if (counts.exercises) {
    modeRatios.push(counts.scoredExercises
      ? Math.min(1, progress.exerciseBestPercent / 100)
      : ratio(progress.reviewedExercises.length, counts.exercises));
  }
  if (counts.writing) modeRatios.push(ratio(progress.writing.length, counts.writing));
  const modeProgress = modeRatios.length
    ? Math.round((modeRatios.reduce((total, value) => total + value, 0) / modeRatios.length) * 100)
    : 0;
  const guidedStep = typeof progress.guidedStep === "number" ? progress.guidedStep : -1;
  const guidedProgress = progress.guidedCompleted || counts.guidedSteps <= 0
    ? 100
    : Math.round((Math.min(guidedStep + 1, counts.guidedSteps) / counts.guidedSteps) * 100);
  return Math.max(modeProgress, guidedProgress);
}
