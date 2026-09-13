export type ListeningCatalogLessonSummary = {
  id: string;
  titleZh: string;
  titleVi: string;
  speaker: string;
  sentenceCount: number;
  keywordCount: number;
  durationSeconds: number;
};

export type ListeningCatalogTopic = {
  id: string;
  labelZh: string;
  labelVi: string;
  lessons: ListeningCatalogLessonSummary[];
};

export type ListeningCatalogGroup = {
  id: string;
  labelZh: string;
  labelVi: string;
  topics: ListeningCatalogTopic[];
};

export type ListeningCatalogTrack = {
  id: string;
  labelZh: string;
  labelVi: string;
  lessonCount: number;
  groups: ListeningCatalogGroup[];
};

export type ListeningCatalogIndex = {
  schemaVersion: "himi_listening_catalog_v1";
  sourceSchemaVersion: string;
  stats: {
    tracks: number;
    lessons: number;
    sentences: number;
    keywords: number;
  };
  tracks: ListeningCatalogTrack[];
};

export type ListeningCatalogSentence = {
  id: string;
  order: number;
  speaker: string;
  zh: string;
  pinyin: string;
  vi: string;
  start: number;
  end: number;
  audioUrl?: string;
};

export type ListeningCatalogKeyword = {
  id: string;
  order: number;
  zh: string;
  pinyin: string;
  vi: string;
  examples: Array<{
    order: number;
    zh: string;
    pinyin: string;
    vi: string;
  }>;
};

export type ListeningCatalogLesson = {
  id: string;
  trackId: string;
  trackLabel: string;
  groupId: string;
  groupLabel: string;
  topicId: string;
  topicLabel: string;
  titleZh: string;
  titlePinyin: string;
  titleVi: string;
  speaker: string;
  roles: string[];
  durationSeconds: number;
  titleAudioUrl: string;
  mainAudioUrl: string;
  mainAudioIncludesTitle: boolean;
  sentences: ListeningCatalogSentence[];
  keywords: ListeningCatalogKeyword[];
};

export const LISTENING_CATALOG_INDEX_URL = "/listening-catalog/index.json";
export const LISTENING_CATALOG_PROGRESS_KEY = "himi-listening-catalog-progress-v1";

export function listeningSentenceAtTime(
  sentences: ListeningCatalogSentence[],
  time: number,
): ListeningCatalogSentence | undefined {
  // Keep the current sentence active through gaps and the audio's trailing silence.
  return sentences.findLast((sentence) => sentence.start <= time) ?? sentences[0];
}

export function catalogGroupForHskLevel(level: string | undefined): string | undefined {
  const match = level?.match(/^hsk-(\d)/);
  if (!match) return undefined;
  const number = Number(match[1]);
  if (number <= 2) return "beginner";
  if (number <= 4) return "intermediate";
  return "advanced";
}

export function formatListeningDuration(totalSeconds: number): string {
  const safeSeconds = Number.isFinite(totalSeconds) && totalSeconds > 0 ? Math.round(totalSeconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function isListeningCatalogIndex(value: unknown): value is ListeningCatalogIndex {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ListeningCatalogIndex>;
  return candidate.schemaVersion === "himi_listening_catalog_v1"
    && Array.isArray(candidate.tracks)
    && candidate.tracks.length > 0
    && candidate.tracks.every((track) => track && Array.isArray(track.groups));
}

export function isListeningCatalogLesson(value: unknown): value is ListeningCatalogLesson {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ListeningCatalogLesson>;
  return typeof candidate.id === "string"
    && typeof candidate.mainAudioUrl === "string"
    && Array.isArray(candidate.sentences)
    && candidate.sentences.length > 0
    && Array.isArray(candidate.keywords);
}
