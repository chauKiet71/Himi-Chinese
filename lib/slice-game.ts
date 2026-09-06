import type { GameWord } from "./game-content.ts";

export const SLICE_HSK_COURSES = [
  { id: "hsk-1", label: "HSK1", description: "Bắt đầu với những từ quen thuộc hằng ngày." },
  { id: "hsk-2", label: "HSK2", description: "Luyện từ vựng giao tiếp cơ bản." },
  { id: "hsk-3", label: "HSK3", description: "Mở rộng từ vựng trong cuộc sống." },
  { id: "hsk-4", label: "HSK4", description: "Thử sức với từ vựng trung cấp." },
  { id: "hsk-5", label: "HSK5", description: "Luyện phản xạ với từ vựng nâng cao." },
  { id: "hsk-6", label: "HSK6", description: "Chinh phục những từ vựng chuyên sâu." },
] as const;

export type SliceHskLevel = typeof SLICE_HSK_COURSES[number]["id"];
export type SliceVocabulary = Pick<GameWord, "id" | "hanzi" | "pinyin" | "meaning" | "example">;

export function normalizeSliceAnswer(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z]/gu, "");
}

export function isSliceHskLevel(value: string | null): value is SliceHskLevel {
  return SLICE_HSK_COURSES.some((course) => course.id === value);
}

export function createSliceDeck(words: readonly SliceVocabulary[], random = Math.random): GameWord[] {
  const deck = [...words];
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck.map((word) => ({
    ...word,
    lane: 28 + Math.floor(random() * 45),
    duration: Math.min(14, 9 + Array.from(word.hanzi).length * 0.6),
  }));
}
