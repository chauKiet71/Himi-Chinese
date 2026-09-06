import { HSK_LESSONS, type HskLessonContent } from "./hsk-lesson-content.ts";
import { HSK2_TEXTBOOK_LESSONS } from "./hsk2-textbook-content.ts";
import { HSK3_TEXTBOOK_LESSONS } from "./hsk3-textbook-content.ts";
import { HSK4_TEXTBOOK_LESSONS } from "./hsk4-textbook-content.ts";
import { HSK4_UPPER_TEXTBOOK_LESSONS } from "./hsk4-upper-textbook-content.ts";
import { HSK5_LOWER_TEXTBOOK_LESSONS } from "./hsk5-lower-textbook-content.ts";
import { HSK5_WORKBOOK_1_LESSONS } from "./hsk5-workbook-1-content.ts";
import { HSK6_VOLUME1_TEXTBOOK_LESSONS } from "./hsk6-volume1-textbook-content.ts";
import { HSK6_VOLUME2_TEXTBOOK_LESSONS } from "./hsk6-volume2-textbook-content.ts";
import type { SliceHskLevel, SliceVocabulary } from "./slice-game.ts";

const lessonsByLevel: Record<SliceHskLevel, HskLessonContent[]> = {
  "hsk-1": HSK_LESSONS,
  "hsk-2": HSK2_TEXTBOOK_LESSONS,
  "hsk-3": HSK3_TEXTBOOK_LESSONS,
  "hsk-4": [...HSK4_UPPER_TEXTBOOK_LESSONS, ...HSK4_TEXTBOOK_LESSONS],
  "hsk-5": [...HSK5_WORKBOOK_1_LESSONS, ...HSK5_LOWER_TEXTBOOK_LESSONS],
  "hsk-6": [...HSK6_VOLUME1_TEXTBOOK_LESSONS, ...HSK6_VOLUME2_TEXTBOOK_LESSONS],
};

export function getSliceHskVocabulary(level: SliceHskLevel): SliceVocabulary[] {
  const words = new Map<string, SliceVocabulary>();
  for (const lesson of lessonsByLevel[level]) {
    for (const word of lesson.vocabulary) {
      const hanzi = word.hanzi.trim();
      const pinyin = word.pinyin.trim();
      if (!hanzi || !pinyin || !word.meaning.trim()) continue;
      const key = `${hanzi.normalize("NFC")}:${pinyin.normalize("NFC").toLowerCase().replace(/\s+/gu, "")}`;
      if (!words.has(key)) {
        words.set(key, { id: word.id, hanzi, pinyin, meaning: word.meaning, example: word.example });
      }
    }
  }
  return [...words.values()];
}
