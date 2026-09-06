import type { HskExercise, HskLessonContent, HskVocabularyItem } from "./hsk-lesson-content";

export type HskGuidedStepKind =
  | "introduction"
  | "vocabulary"
  | "grammar"
  | "dialogue"
  | "pronunciation"
  | "writing"
  | "practice"
  | "complete";

export type HskGuidedStep = {
  id: string;
  kind: HskGuidedStepKind;
  itemIndex?: number;
};

export type HskGuidedSection = {
  id: HskGuidedStepKind;
  label: string;
  count?: number;
  start: number;
};

const SECTION_LABELS: Array<[HskGuidedStepKind, string]> = [
  ["introduction", "Giới thiệu"],
  ["vocabulary", "Từ vựng"],
  ["grammar", "Ngữ pháp"],
  ["dialogue", "Hội thoại"],
  ["pronunciation", "Phát âm"],
  ["writing", "Luyện viết"],
  ["practice", "Luyện tập"],
  ["complete", "Hoàn thành"],
];

function normalizeExerciseValue(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\s,.;:!?，。；：！？'“”‘’()-]+/gu, "")
    .toLocaleLowerCase("vi-VN");
}

function exerciseMatchesWord(exercise: HskExercise, word: HskVocabularyItem): boolean {
  const prompt = normalizeExerciseValue(exercise.prompt);
  const answer = normalizeExerciseValue(exercise.answer);
  return prompt === normalizeExerciseValue(word.hanzi)
    || answer === normalizeExerciseValue(word.meaning)
    || answer === normalizeExerciseValue(word.pinyin)
    || normalizeExerciseValue(exercise.speakText) === normalizeExerciseValue(word.hanzi);
}

function buildGeneratedVocabularyExercise(
  lesson: HskLessonContent,
  word: HskVocabularyItem,
  wordIndex: number,
): HskExercise {
  const useMeaning = word.meaning.trim().length > 0;
  const answer = useMeaning ? word.meaning : word.pinyin;
  const otherAnswers = [
    ...lesson.vocabulary.slice(wordIndex + 1),
    ...lesson.vocabulary.slice(0, wordIndex),
  ].map((candidate) => useMeaning ? candidate.meaning : candidate.pinyin);
  const options = [answer, ...otherAnswers]
    .filter((option, index, items) => option.trim().length > 0
      && items.findIndex((candidate) => normalizeExerciseValue(candidate) === normalizeExerciseValue(option)) === index)
    .slice(0, 4);
  const [correctOption, ...distractors] = options;
  const answerPosition = options.length ? wordIndex % options.length : 0;
  distractors.splice(answerPosition, 0, correctOption);

  return {
    id: `guided-practice-${word.id}`,
    type: useMeaning ? "meaning" : "pinyin",
    instruction: useMeaning ? "Chọn nghĩa đúng" : "Chọn pinyin đúng",
    prompt: word.hanzi,
    options: distractors,
    answer,
  };
}

export function buildHskGuidedExercises(lesson: HskLessonContent): HskExercise[] {
  if (!lesson.vocabulary.length) return lesson.exercises;
  const usedExerciseIds = new Set<string>();

  return lesson.vocabulary.map((word, wordIndex) => {
    const sourceExercise = lesson.exercises.find((exercise) => (
      !usedExerciseIds.has(exercise.id) && exerciseMatchesWord(exercise, word)
    ));
    if (sourceExercise) {
      usedExerciseIds.add(sourceExercise.id);
      return sourceExercise;
    }
    return buildGeneratedVocabularyExercise(lesson, word, wordIndex);
  });
}

export function buildHskGuidedLessonSteps(lesson: HskLessonContent): HskGuidedStep[] {
  const placeholders = new Set(lesson.guidedPlaceholders ?? []);
  const exercises = buildHskGuidedExercises(lesson);
  return [
    { id: "introduction", kind: "introduction" },
    ...(lesson.vocabulary.length
      ? lesson.vocabulary.map((word, itemIndex) => ({ id: `vocabulary-${word.id}`, kind: "vocabulary" as const, itemIndex }))
      : placeholders.has("vocabulary") ? [{ id: "vocabulary-overview", kind: "vocabulary" as const }] : []),
    ...lesson.grammar.map((point, itemIndex) => ({ id: `grammar-${point.id}`, kind: "grammar" as const, itemIndex })),
    ...(lesson.dialogues.length
      ? lesson.dialogues.map((dialogue, itemIndex) => ({ id: `dialogue-${dialogue.id}`, kind: "dialogue" as const, itemIndex }))
      : placeholders.has("dialogue") ? [{ id: "dialogue-overview", kind: "dialogue" as const }] : []),
    ...(lesson.pronunciationTopics.length || placeholders.has("pronunciation") ? [{ id: "pronunciation", kind: "pronunciation" as const }] : []),
    ...(lesson.writingCharacters.length || placeholders.has("writing") ? [{ id: "writing", kind: "writing" as const }] : []),
    ...exercises.map((exercise, itemIndex) => ({ id: `practice-${exercise.id}`, kind: "practice" as const, itemIndex })),
    { id: "complete", kind: "complete" },
  ];
}

export function buildHskGuidedSections(lesson: HskLessonContent): HskGuidedSection[] {
  const steps = buildHskGuidedLessonSteps(lesson);
  return SECTION_LABELS.flatMap(([id, label]) => {
    const start = steps.findIndex((step) => step.kind === id);
    if (start < 0) return [];
    const count = steps.filter((step) => step.kind === id).length;
    return [{ id, label, start, ...(count > 1 ? { count } : {}) }];
  });
}

export function getGuidedSectionForStep(step: HskGuidedStep): HskGuidedStepKind {
  return step.kind;
}
