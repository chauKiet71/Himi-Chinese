import { getTypingCatalog, getTypingLesson, getTypingLevel } from "./typing-practice.ts";
import { loadTypingLessonContent } from "./typing-content-repository.ts";
import { typingLevelTarget, typingLessonTarget, typingQuestionTarget } from "./content-access-types.ts";

export async function buildAdminTypingAccessView(levelId?: string, lessonId?: string) {
  const levels = getTypingCatalog();
  const selectedLevel = levelId ? getTypingLevel(levelId) : undefined;
  const selectedLesson = levelId && lessonId ? getTypingLesson(levelId, lessonId)?.lesson : undefined;
  const levelTarget = selectedLevel ? typingLevelTarget(selectedLevel.id) : undefined;
  const lessonTarget = selectedLevel && selectedLesson ? typingLessonTarget(selectedLevel.id, selectedLesson.id) : undefined;
  const content = selectedLevel && selectedLesson ? await loadTypingLessonContent(selectedLevel.id, selectedLesson.id) : null;
  const questions = content ? [...content.words, ...content.sentences].map((item) => ({
    item, target: typingQuestionTarget(content.level, content.id, item.stage, item.id),
  })) : [];
  const lessonEntries = selectedLevel && !selectedLesson ? selectedLevel.lessons.map((lesson) => ({
    ...lesson, target: typingLessonTarget(selectedLevel.id, lesson.id),
  })) : [];
  const targets = levelTarget
    ? [levelTarget, ...(lessonTarget ? [lessonTarget, ...questions.map(({ target }) => target)] : lessonEntries.map(({ target }) => target))]
    : levels.map((level) => typingLevelTarget(level.id));
  return { levels, selectedLevel, selectedLesson, levelTarget, lessonTarget, lessonEntries, questions, targets };
}
