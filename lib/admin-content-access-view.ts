import {
  hskLessonTarget,
  hskLevelTarget,
  hskQuestionTarget,
  hskVocabularyTarget,
  hskWritingTarget,
  type ContentAccessTarget,
} from "./content-access-types";
import { HSK_CURRICULUM } from "./hsk-curriculum";

export async function buildAdminHskAccessView(levelId?: string, lessonId?: string) {
  const selectedLevel = HSK_CURRICULUM.find((level) => level.id === levelId);
  const levelTarget = selectedLevel ? hskLevelTarget(selectedLevel.id) : undefined;
  if (!selectedLevel || !levelTarget) {
    return {
      lessonEntries: [],
      levels: HSK_CURRICULUM,
      levelTarget,
      questions: [],
      selectedLesson: undefined,
      selectedLevel,
      targets: HSK_CURRICULUM.map((level) => hskLevelTarget(level.id)),
      vocabulary: [],
      writing: [],
    };
  }

  const { getHskLearningLessonContent } = await import("./hsk-learning-content");
  const lessonReferences = selectedLevel.topics.flatMap((topic) => topic.lessons.map((lesson) => ({
    lesson,
    topicTitle: topic.title,
  })));
  const selectedReference = lessonId
    ? lessonReferences.find(({ lesson }) => lesson.id === lessonId)
    : undefined;
  const selectedContent = selectedReference
    ? getHskLearningLessonContent(selectedLevel.id, selectedReference.lesson.id)
    : undefined;
  const selectedLesson = selectedReference ? {
    ...selectedReference.lesson,
    content: selectedContent,
    topicTitle: selectedReference.topicTitle,
    target: hskLessonTarget(selectedLevel.id, selectedReference.lesson.id, selectedContent?.accessTier ?? "free"),
  } : undefined;
  const lessonEntries = selectedReference ? [] : lessonReferences.map(({ lesson, topicTitle }) => {
    const content = getHskLearningLessonContent(selectedLevel.id, lesson.id);
    return {
      ...lesson,
      content,
      topicTitle,
      target: hskLessonTarget(selectedLevel.id, lesson.id, content?.accessTier ?? "free"),
    };
  });
  const vocabulary = selectedLesson ? (selectedLesson.content?.vocabulary ?? []).map((item) => ({
    item,
    target: hskVocabularyTarget(selectedLevel.id, selectedLesson.id, item.id, item.accessTier ?? "free"),
  })) : [];
  const writing = selectedLesson ? (selectedLesson.content?.writingCharacters ?? []).map((character) => ({
    character,
    target: hskWritingTarget(selectedLevel.id, selectedLesson.id, character.id, character.accessTier ?? "free"),
  })) : [];
  const questions = selectedLesson ? (selectedLesson.content?.exercises ?? []).map((exercise) => ({
    exercise,
    target: hskQuestionTarget(selectedLevel.id, selectedLesson.id, exercise.id, exercise.accessTier ?? "free"),
  })) : [];

  const targets: ContentAccessTarget[] = selectedLesson
    ? [levelTarget, selectedLesson.target, ...vocabulary.map((entry) => entry.target), ...writing.map((entry) => entry.target), ...questions.map((entry) => entry.target)]
    : [levelTarget, ...lessonEntries.map((lesson) => lesson.target)];

  return {
    lessonEntries,
    levels: HSK_CURRICULUM,
    levelTarget,
    questions,
    selectedLesson,
    selectedLevel,
    targets,
    vocabulary,
    writing,
  };
}
