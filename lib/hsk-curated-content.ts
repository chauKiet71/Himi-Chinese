import curatedData from "../content/hsk-curated-lexicon.json" with { type: "json" };
import editorialOverridesData from "../content/hsk-editorial-overrides.json" with { type: "json" };
import type { HskLessonContent, HskVocabularyAudio, HskVocabularyItem } from "./hsk-lesson-content.ts";

type CuratedEntry = {
  sourceId: string;
  key: string;
  levelId: string;
  lessonNumber: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  partOfSpeech?: string;
  audio?: HskVocabularyAudio;
};

type VocabularyOverride = Partial<Pick<HskVocabularyItem, "hanzi" | "meaning" | "pinyin" | "wordClass">>;
type GrammarOverride = Partial<Pick<HskLessonContent["grammar"][number], "title" | "formula" | "explanation">>;

const CURATED_DATA = curatedData as unknown as { entries: CuratedEntry[]; sentenceEntries: CuratedEntry[] };
const CURATED_ENTRIES = CURATED_DATA.entries;
const CURATED_BY_KEY = new Map(CURATED_ENTRIES.map((entry) => [entry.key, entry]));
const CURATED_SENTENCES_BY_KEY = new Map(CURATED_DATA.sentenceEntries.map((entry) => [entry.key, entry]));

function groupByLesson(entries: CuratedEntry[]): Map<string, CuratedEntry[]> {
  const grouped = new Map<string, CuratedEntry[]>();
  for (const entry of entries) {
    const key = `${entry.levelId}:${entry.lessonNumber}`;
    grouped.set(key, [...(grouped.get(key) ?? []), entry]);
  }
  return grouped;
}

const CURATED_WORDS_BY_LESSON = groupByLesson(CURATED_ENTRIES);
const CURATED_SENTENCES_BY_LESSON = groupByLesson(CURATED_DATA.sentenceEntries);
const EDITORIAL_OVERRIDES = editorialOverridesData as unknown as {
  vocabulary: Record<string, VocabularyOverride>;
  grammar: Record<string, GrammarOverride>;
};
const CURATED_UNIQUE_BY_LEVEL_HANZI = new Map<string, CuratedEntry>();
const AMBIGUOUS_LEVEL_HANZI = new Set<string>();
for (const entry of CURATED_ENTRIES) {
  const key = `${entry.levelId}:${entry.hanzi}`;
  const current = CURATED_UNIQUE_BY_LEVEL_HANZI.get(key);
  if (current && (current.pinyin !== entry.pinyin || current.meaning !== entry.meaning)) {
    CURATED_UNIQUE_BY_LEVEL_HANZI.delete(key);
    AMBIGUOUS_LEVEL_HANZI.add(key);
  } else if (!current && !AMBIGUOUS_LEVEL_HANZI.has(key)) {
    CURATED_UNIQUE_BY_LEVEL_HANZI.set(key, entry);
  }
}

function entryKey(levelId: string, lessonNumber: number, hanzi: string): string {
  return `${levelId}:${lessonNumber}:${hanzi.trim()}`;
}

export function getCuratedHskEntry(
  levelId: string,
  lessonNumber: number,
  hanzi: string,
): CuratedEntry | undefined {
  return CURATED_BY_KEY.get(entryKey(levelId, lessonNumber, hanzi));
}

function curateVocabularyItem(
  lesson: HskLessonContent,
  item: HskVocabularyItem,
): HskVocabularyItem {
  const override = EDITORIAL_OVERRIDES.vocabulary[item.id];
  const lookupHanzi = override?.hanzi ?? item.hanzi;
  const exact = getCuratedHskEntry(lesson.levelId, lesson.lessonNumber, lookupHanzi);
  const curated = exact ?? CURATED_UNIQUE_BY_LEVEL_HANZI.get(`${lesson.levelId}:${lookupHanzi.trim()}`);
  if (!curated && !override) return item;
  return {
    ...item,
    ...(curated ? {
      pinyin: curated.pinyin,
      meaning: curated.meaning,
      wordClass: curated.partOfSpeech || item.wordClass,
    } : {}),
    ...override,
    audio: exact?.audio,
    translation: item.example === item.hanzi ? override?.meaning ?? curated?.meaning ?? item.translation : item.translation,
  };
}

function fullyCuratedVocabulary(lesson: HskLessonContent): HskVocabularyItem[] | undefined {
  const shouldReplace = lesson.levelId === "hsk-6"
    || (lesson.levelId === "hsk-5" && lesson.id.startsWith("hsk5l-lesson-"));
  if (!shouldReplace) return undefined;
  const key = `${lesson.levelId}:${lesson.lessonNumber}`;
  const words = CURATED_WORDS_BY_LESSON.get(key);
  if (!words?.length) return undefined;
  const sentences = CURATED_SENTENCES_BY_LESSON.get(key) ?? [];

  return words.map((entry) => {
    const example = sentences.find((sentence) => sentence.hanzi.includes(entry.hanzi));
    return {
      id: entry.sourceId,
      hanzi: entry.hanzi,
      pinyin: entry.pinyin,
      meaning: entry.meaning,
      wordClass: entry.partOfSpeech || `Từ vựng ${lesson.levelLabel}`,
      example: example?.hanzi ?? entry.hanzi,
      examplePinyin: example?.pinyin ?? entry.pinyin,
      translation: example?.meaning ?? entry.meaning,
      audio: entry.audio,
    };
  });
}

function curatedDialogues(lesson: HskLessonContent): HskLessonContent["dialogues"] | undefined {
  const shouldReplace = lesson.levelId === "hsk-6"
    || (lesson.levelId === "hsk-5" && lesson.id.startsWith("hsk5l-lesson-"));
  if (!shouldReplace) return undefined;
  const sentences = CURATED_SENTENCES_BY_LESSON.get(`${lesson.levelId}:${lesson.lessonNumber}`);
  if (!sentences?.length) return [];
  return [{
    id: `${lesson.id}-curated-reading`,
    title: `Bài khóa · ${lesson.title}`,
    setting: "Bài đọc đã được chuẩn hóa pinyin, nghĩa tiếng Việt và audio theo từng câu.",
    turns: sentences.map((sentence, index) => ({
      speaker: `Câu ${index + 1}`,
      hanzi: sentence.hanzi,
      pinyin: sentence.pinyin,
      translation: sentence.meaning,
      audio: sentence.audio,
    })),
  }];
}

export function applyCuratedHskLessonData(lesson: HskLessonContent): HskLessonContent {
  const vocabulary = fullyCuratedVocabulary(lesson)
    ?? lesson.vocabulary.map((item) => curateVocabularyItem(lesson, item));
  const vocabularyById = new Map(vocabulary.map((item) => [item.id, item]));
  const writingCharacters = lesson.writingCharacters.map((character) => {
    const word = vocabularyById.get(character.id);
    return word ? { ...character, meaning: word.meaning } : character;
  });
  const audioAvailable = vocabulary.length > 0
    && vocabulary.every((item) => Boolean(item.audio?.normal));
  const dialogues = curatedDialogues(lesson) ?? lesson.dialogues.map((dialogue) => ({
    ...dialogue,
    turns: dialogue.turns.map((turn) => {
      const curated = CURATED_SENTENCES_BY_KEY.get(entryKey(lesson.levelId, lesson.lessonNumber, turn.hanzi));
      return curated ? {
        ...turn,
        pinyin: curated.pinyin,
        translation: curated.meaning,
        audio: curated.audio,
      } : turn;
    }),
  }));
  const grammar = lesson.grammar.map((point) => ({
    ...point,
    ...EDITORIAL_OVERRIDES.grammar[point.id],
    examples: point.examples.map((example) => {
      const cleanHanzi = example.hanzi.replace(/^[（(]\d+[）)]\s*/u, "").trim();
      const curated = CURATED_SENTENCES_BY_KEY.get(entryKey(lesson.levelId, lesson.lessonNumber, cleanHanzi));
      return curated ? {
        ...example,
        pinyin: curated.pinyin,
        translation: curated.meaning,
      } : example;
    }),
  }));

  return {
    ...lesson,
    vocabulary,
    grammar,
    dialogues,
    writingCharacters,
    audioAvailable,
  };
}

export function curatedHskEntryCount(): number {
  return CURATED_ENTRIES.length;
}
