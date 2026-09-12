import type { HskLessonContent, HskVocabularyItem } from "./hsk-lesson-content.ts";

export async function trySaveHskVocabularyWord(lesson: HskLessonContent, word: HskVocabularyItem): Promise<boolean> {
  try {
    const response = await fetch("/api/saved-vocabulary", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sourceType: "hsk",
        sourceKey: `${lesson.id}:${word.id}`,
        sourceTitle: `${lesson.levelLabel} · Bài ${lesson.lessonNumber}`,
        hanzi: word.hanzi,
        pinyin: word.pinyin,
        meaning: word.meaning,
        example: word.example,
        translation: word.translation,
      }),
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function saveHskVocabularyWord(lesson: HskLessonContent, word: HskVocabularyItem): void {
  void trySaveHskVocabularyWord(lesson, word);
}
