import type { SliceVocabulary } from "./slice-game.ts";

export type HskGameId = "memory" | "connect" | "listen" | "write" | "flash" | "quiz";
export const HSK_GAME_ROUND_SIZE: Record<HskGameId, number> = {
  memory: 4, connect: 5, listen: 5, write: 5, flash: 6, quiz: 5,
};

export function shuffleGameItems<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function comparisonKey(value: string) {
  return value.normalize("NFC").toLowerCase().replace(/\s+/gu, "");
}

export function createHskGameRound(
  vocabulary: readonly SliceVocabulary[],
  gameId: HskGameId,
  previous: readonly SliceVocabulary[] = [],
  random = Math.random,
): SliceVocabulary[] {
  const count = HSK_GAME_ROUND_SIZE[gameId];
  const previousIds = new Set(previous.map((word) => word.id));
  const shuffled = shuffleGameItems(vocabulary, random);
  const candidates = [
    ...shuffled.filter((word) => !previousIds.has(word.id)),
    ...shuffled.filter((word) => previousIds.has(word.id)),
  ];
  const hanzi = new Set<string>();
  const pinyin = new Set<string>();
  const meanings = new Set<string>();
  const round: SliceVocabulary[] = [];
  for (const word of candidates) {
    const keys = [word.hanzi, word.pinyin, word.meaning].map(comparisonKey);
    if (keys.some((key) => !key) || hanzi.has(keys[0]) || pinyin.has(keys[1]) || meanings.has(keys[2])) continue;
    round.push(word);
    hanzi.add(keys[0]);
    pinyin.add(keys[1]);
    meanings.add(keys[2]);
    if (round.length === count) return round;
  }
  throw new Error("Khóa học chưa đủ từ vựng khác nhau để tạo lượt chơi.");
}

export function hskMeaningOptions(words: readonly SliceVocabulary[], index: number, random = Math.random): string[] {
  const answer = words[index].meaning;
  const wrong = shuffleGameItems([...new Set(words.map((word) => word.meaning))].filter((meaning) => meaning !== answer), random).slice(0, 3);
  return shuffleGameItems([answer, ...wrong], random);
}
