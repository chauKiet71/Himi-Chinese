const COMBINING_MARKS = /\p{M}/gu;
const NON_PINYIN_CHARACTERS = /[^a-z0-9]/g;

export function normalizeTypingPinyin(value: string): string {
  return value
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replaceAll("v", "u")
    .replace(NON_PINYIN_CHARACTERS, "");
}

export function isTypingPinyinCorrect(value: string, target: string): boolean {
  const normalizedValue = normalizeTypingPinyin(value);
  return Boolean(normalizedValue) && normalizedValue === normalizeTypingPinyin(target);
}

export function getTypingPinyinProgress(value: string, target: string) {
  const normalizedValue = normalizeTypingPinyin(value);
  const normalizedTarget = normalizeTypingPinyin(target);
  let matched = 0;

  while (
    matched < normalizedValue.length
    && matched < normalizedTarget.length
    && normalizedValue[matched] === normalizedTarget[matched]
  ) {
    matched += 1;
  }

  const total = normalizedTarget.length;
  return {
    hasInput: normalizedValue.length > 0,
    isValidPrefix: matched === normalizedValue.length && normalizedValue.length <= total,
    matched,
    percent: total ? Math.min(100, (matched / total) * 100) : 0,
    total,
  };
}
