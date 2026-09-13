import catalogSource from "@/content/typing-practice/catalog.json";

export const TYPING_LEVEL_IDS = ["hsk-1", "hsk-2", "hsk-3", "hsk-4", "hsk-5", "hsk-6"] as const;

export type TypingLevelId = (typeof TYPING_LEVEL_IDS)[number];
export type TypingPracticeStage = "word" | "sentence";
export type TypingPracticeMode = "meaning" | "listening";

export type TypingLessonSummary = {
  id: string;
  number: number;
  titleZh: string;
  titleVi: string;
  wordCount: number;
  sentenceCount: number;
  previewHanzi: string[];
};

export type TypingLevel = {
  id: TypingLevelId;
  level: number;
  label: string;
  lessonCount: number;
  wordCount: number;
  sentenceCount: number;
  previewHanzi: string[];
  lessons: TypingLessonSummary[];
};

export type TypingPracticeSegment = {
  text: string;
  pinyin: string;
  meaning: string;
  type?: string;
  partOfSpeech?: string;
};

export type TypingPracticeItem = {
  id: string;
  stage: TypingPracticeStage;
  meaning: string;
  hanzi: string;
  pinyin: string;
  partOfSpeech?: string;
  audio: {
    normal: string;
    slow: string;
  };
  words: TypingPracticeSegment[];
  segments: TypingPracticeSegment[];
};

export type TypingLessonPayload = {
  id: string;
  level: TypingLevelId;
  levelLabel: string;
  number: number;
  titleZh: string;
  titleVi: string;
  words: TypingPracticeItem[];
  sentences: TypingPracticeItem[];
};

const typingCatalog = catalogSource as TypingLevel[];

export function getTypingCatalog(): TypingLevel[] {
  return typingCatalog;
}

export function getTypingLevel(levelId: string): TypingLevel | undefined {
  return typingCatalog.find((level) => level.id === levelId);
}

export function getTypingLesson(levelId: string, lessonId: string) {
  const level = getTypingLevel(levelId);
  const lesson = level?.lessons.find((item) => item.id === lessonId);
  return level && lesson ? { level, lesson } : undefined;
}

export function getTypingLessonDataUrl(levelId: TypingLevelId, lessonId: string): string {
  return `/content/typing/${levelId}/${encodeURIComponent(lessonId)}.json`;
}

export function getTypingLessonParams() {
  return typingCatalog.flatMap((level) => level.lessons.map((lesson) => ({
    level: level.id,
    lesson: lesson.id,
  })));
}
