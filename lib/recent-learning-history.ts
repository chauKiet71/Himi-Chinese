export const RECENT_LEARNING_HISTORY_KEY = "himi-recent-learning-history:v1";
export const RECENT_LEARNING_HISTORY_CHANGED_EVENT = "himi:recent-learning-history-changed";

const MAX_RECENT_LESSONS = 20;

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export type RecentLearningHistoryEntry = {
  id: string;
  kind: "hsk" | "industry";
  lessonId: string;
  levelId: string;
  title: string;
  subtitle: string;
  href: string;
  progress: number;
  lastStudiedAt: number;
};

function clampProgress(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function isRecentLearningHistoryEntry(value: unknown): value is RecentLearningHistoryEntry {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entry = value as Partial<RecentLearningHistoryEntry>;
  return (entry.kind === "hsk" || entry.kind === "industry")
    && typeof entry.id === "string"
    && entry.id.length > 0
    && typeof entry.lessonId === "string"
    && entry.lessonId.length > 0
    && typeof entry.levelId === "string"
    && entry.levelId.length > 0
    && typeof entry.title === "string"
    && entry.title.length > 0
    && typeof entry.subtitle === "string"
    && entry.subtitle.length > 0
    && typeof entry.href === "string"
    && entry.href.startsWith("/")
    && typeof entry.progress === "number"
    && Number.isFinite(entry.progress)
    && typeof entry.lastStudiedAt === "number"
    && Number.isFinite(entry.lastStudiedAt)
    && entry.lastStudiedAt > 0;
}

export function parseRecentLearningHistory(raw: string | null): RecentLearningHistoryEntry[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value
      .filter(isRecentLearningHistoryEntry)
      .map((entry) => ({ ...entry, progress: clampProgress(entry.progress) }))
      .sort((left, right) => right.lastStudiedAt - left.lastStudiedAt)
      .slice(0, MAX_RECENT_LESSONS);
  } catch {
    return [];
  }
}

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readRecentLearningHistory(storage: StorageLike | null = browserStorage()): RecentLearningHistoryEntry[] {
  if (!storage) return [];
  try {
    return parseRecentLearningHistory(storage.getItem(RECENT_LEARNING_HISTORY_KEY));
  } catch {
    return [];
  }
}

export function upsertRecentLearningHistory(
  entry: Omit<RecentLearningHistoryEntry, "lastStudiedAt">,
  storage: StorageLike | null = browserStorage(),
  lastStudiedAt = Date.now(),
): RecentLearningHistoryEntry[] {
  if (!storage) return [];
  const nextEntry: RecentLearningHistoryEntry = {
    ...entry,
    progress: clampProgress(entry.progress),
    lastStudiedAt,
  };
  const next = [
    nextEntry,
    ...readRecentLearningHistory(storage).filter((item) => item.id !== nextEntry.id),
  ].slice(0, MAX_RECENT_LESSONS);

  try {
    storage.setItem(RECENT_LEARNING_HISTORY_KEY, JSON.stringify(next));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(RECENT_LEARNING_HISTORY_CHANGED_EVENT));
    }
    return next;
  } catch {
    return readRecentLearningHistory(storage);
  }
}

