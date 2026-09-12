import type { HskLessonContent, HskVocabularyItem } from "./hsk-lesson-content.ts";
import type { SliceHskLevel, SliceVocabulary } from "./slice-game.ts";

async function postSavedVocabulary(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch("/api/saved-vocabulary", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function trySaveHskVocabularyWord(lesson: HskLessonContent, word: HskVocabularyItem): Promise<boolean> {
  return postSavedVocabulary({
    sourceType: "hsk",
    sourceKey: `${lesson.id}:${word.id}`,
    sourceTitle: `${lesson.levelLabel} · Bài ${lesson.lessonNumber}`,
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    meaning: word.meaning,
    example: word.example,
    translation: word.translation,
  });
}

export async function trySaveHskGameVocabularyWord(level: SliceHskLevel, word: SliceVocabulary): Promise<boolean> {
  const levelLabel = level.toUpperCase().replace("-", "");
  return postSavedVocabulary({
    sourceType: "hsk",
    sourceKey: `${level}:flashcard:${word.id}`,
    sourceTitle: `${levelLabel} · Flashcard 3D`,
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    meaning: word.meaning,
    example: word.example,
  });
}

export function saveHskVocabularyWord(lesson: HskLessonContent, word: HskVocabularyItem): void {
  void trySaveHskVocabularyWord(lesson, word);
}
