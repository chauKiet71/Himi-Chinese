import "server-only";
import { HSK_CURRICULUM, type HskCurriculumLevel } from "./hsk-curriculum.ts";
import { buildHskGuidedLessonSteps } from "./hsk-guided-lesson.ts";
import { getHskLearningLessonContent } from "./hsk-learning-content.ts";
import type { HskExercise, HskLessonContent, HskVocabularyItem, HskWritingCharacter } from "./hsk-lesson-content.ts";
import { getContentAccessPolicies } from "./content-access-repository.ts";
import {
  hskLessonTarget,
  hskLevelTarget,
  hskQuestionTarget,
  hskVocabularyTarget,
  hskWritingTarget,
  resolveContentAccess,
  type ContentAccessPolicy,
  type ContentAccessState,
  type ContentAccessTarget,
} from "./content-access-types.ts";
import { hasActiveVipAccess } from "./lesson-access.ts";

export type HskLessonPageData = {
  lesson: HskLessonContent;
  access: ContentAccessState;
};

function lessonTargets(lesson: HskLessonContent): ContentAccessTarget[] {
  return [
    hskLevelTarget(lesson.levelId),
    hskLessonTarget(lesson.levelId, lesson.id, lesson.accessTier ?? "free"),
  ];
}

function lockedExercise(exercise: HskExercise): HskExercise {
  return {
    id: exercise.id,
    type: exercise.type,
    instruction: "Câu hỏi dành cho thành viên VIP",
    prompt: "",
    options: [],
    answer: null,
    accessTier: "vip",
    locked: true,
  };
}

function lockedVocabulary(item: HskVocabularyItem): HskVocabularyItem {
  return {
    id: item.id,
    hanzi: "",
    pinyin: "",
    meaning: "",
    wordClass: "",
    example: "",
    examplePinyin: "",
    translation: "",
    accessTier: "vip",
    locked: true,
  };
}

function lockedWriting(character: HskWritingCharacter): HskWritingCharacter {
  return {
    id: character.id,
    word: "",
    hanzi: "",
    pinyin: "",
    meaning: "",
    accessTier: "vip",
    locked: true,
  };
}

function redactLesson(lesson: HskLessonContent): HskLessonContent {
  return {
    ...lesson,
    modes: [],
    vocabulary: [],
    grammar: [],
    dialogues: [],
    pronunciationTopics: [],
    exercises: [],
    writingCharacters: [],
  };
}

async function viewerVip(userId: string | null): Promise<boolean> {
  return Boolean(userId && process.env.DATABASE_URL && await hasActiveVipAccess(userId));
}

export async function getHskLessonPageData({
  level,
  lessonId,
  userId,
}: {
  level: string;
  lessonId: string;
  userId: string | null;
}): Promise<HskLessonPageData | null> {
  const lesson = getHskLearningLessonContent(level, lessonId);
  if (!lesson) return null;
  const parentTargets = lessonTargets(lesson);
  const questionTargets = lesson.exercises.map((exercise) => hskQuestionTarget(
    lesson.levelId,
    lesson.id,
    exercise.id,
    exercise.accessTier ?? "free",
  ));
  const vocabularyTargets = lesson.vocabulary.map((item) => hskVocabularyTarget(
    lesson.levelId,
    lesson.id,
    item.id,
    item.accessTier ?? "free",
  ));
  const writingTargets = lesson.writingCharacters.map((character) => hskWritingTarget(
    lesson.levelId,
    lesson.id,
    character.id,
    character.accessTier ?? "free",
  ));
  const [policies, hasVip] = await Promise.all([
    getContentAccessPolicies([...parentTargets, ...vocabularyTargets, ...writingTargets, ...questionTargets]),
    viewerVip(userId),
  ]);
  const access = resolveContentAccess({ targets: parentTargets, policies, viewerHasVip: hasVip });
  if (!access.allowed) return { lesson: redactLesson(lesson), access };

  return {
    lesson: {
      ...lesson,
      vocabulary: lesson.vocabulary.map((item, index) => resolveContentAccess({
        targets: [...parentTargets, vocabularyTargets[index]],
        policies,
        viewerHasVip: hasVip,
      }).allowed ? item : lockedVocabulary(item)),
      writingCharacters: lesson.writingCharacters.map((character, index) => resolveContentAccess({
        targets: [...parentTargets, writingTargets[index]],
        policies,
        viewerHasVip: hasVip,
      }).allowed ? character : lockedWriting(character)),
      exercises: lesson.exercises.map((exercise, index) => resolveContentAccess({
        targets: [...parentTargets, questionTargets[index]],
        policies,
        viewerHasVip: hasVip,
      }).allowed ? exercise : lockedExercise(exercise)),
    },
    access,
  };
}

function curriculumTargets(curriculum: HskCurriculumLevel[]): ContentAccessTarget[] {
  return curriculum.flatMap((level) => [
    hskLevelTarget(level.id),
    ...level.topics.flatMap((topic) => topic.lessons.map((lesson) => {
      const content = getHskLearningLessonContent(level.id, lesson.id);
      return hskLessonTarget(level.id, lesson.id, content?.accessTier ?? "free");
    })),
  ]);
}

export async function getHskCurriculumPageData(userId: string | null): Promise<HskCurriculumLevel[]> {
  const targets = curriculumTargets(HSK_CURRICULUM);
  const [policies, hasVip] = await Promise.all([
    getContentAccessPolicies(targets),
    viewerVip(userId),
  ]);
  return HSK_CURRICULUM.map((level) => {
    const levelTarget = hskLevelTarget(level.id);
    const levelAccess = resolveContentAccess({ targets: [levelTarget], policies, viewerHasVip: hasVip });
    return {
      ...level,
      access: levelAccess,
      topics: level.topics.map((topic) => ({
        ...topic,
        lessons: topic.lessons.map((lesson) => {
          const content = getHskLearningLessonContent(level.id, lesson.id);
          const access = resolveContentAccess({
            targets: [levelTarget, hskLessonTarget(level.id, lesson.id, content?.accessTier ?? "free")],
            policies,
            viewerHasVip: hasVip,
          });
          return {
            ...lesson,
            guidedSteps: content ? buildHskGuidedLessonSteps(content).length : lesson.guidedSteps,
            access,
          };
        }),
      })),
    };
  });
}

export async function getHskLevelAccess(
  levelId: string,
  userId: string | null,
  policies?: ContentAccessPolicy[],
): Promise<ContentAccessState> {
  const target = hskLevelTarget(levelId);
  const [resolvedPolicies, hasVip] = await Promise.all([
    policies ?? getContentAccessPolicies([target]),
    viewerVip(userId),
  ]);
  return resolveContentAccess({ targets: [target], policies: resolvedPolicies, viewerHasVip: hasVip });
}

export async function getHskLevelLessonAccess(
  levelId: string,
  userId: string | null,
): Promise<{ levelAccess: ContentAccessState; allowedLessonIds: Set<string>; allowedVocabularyKeys: Set<string> }> {
  const level = HSK_CURRICULUM.find((candidate) => candidate.id === levelId);
  const levelTarget = hskLevelTarget(levelId);
  const curriculumLessons = level?.topics.flatMap((topic) => topic.lessons) ?? [];
  const lessonEntries = curriculumLessons.map((lesson) => {
    const content = getHskLearningLessonContent(levelId, lesson.id);
    return {
      content,
      lesson,
      target: hskLessonTarget(levelId, lesson.id, content?.accessTier ?? "free"),
    };
  });
  const lessonTargets = lessonEntries.map((entry) => entry.target);
  const vocabularyTargets = lessonEntries.flatMap((entry) => (entry.content?.vocabulary ?? []).map((item) => hskVocabularyTarget(
    levelId,
    entry.lesson.id,
    item.id,
    item.accessTier ?? "free",
  )));
  const [policies, hasVip] = await Promise.all([
    getContentAccessPolicies([levelTarget, ...lessonTargets, ...vocabularyTargets]),
    viewerVip(userId),
  ]);
  const levelAccess = resolveContentAccess({ targets: [levelTarget], policies, viewerHasVip: hasVip });
  const allowedLessonIds = new Set<string>();
  const allowedVocabularyKeys = new Set<string>();
  if (levelAccess.allowed) {
    lessonEntries.forEach((entry) => {
      const lessonAllowed = resolveContentAccess({ targets: [levelTarget, entry.target], policies, viewerHasVip: hasVip }).allowed;
      if (!lessonAllowed) return;
      allowedLessonIds.add(entry.lesson.id);
      (entry.content?.vocabulary ?? []).forEach((item) => {
        const target = hskVocabularyTarget(levelId, entry.lesson.id, item.id, item.accessTier ?? "free");
        if (resolveContentAccess({ targets: [levelTarget, entry.target, target], policies, viewerHasVip: hasVip }).allowed) {
          allowedVocabularyKeys.add(`${entry.lesson.id}:${item.id}`);
        }
      });
    });
  }
  return { levelAccess, allowedLessonIds, allowedVocabularyKeys };
}
