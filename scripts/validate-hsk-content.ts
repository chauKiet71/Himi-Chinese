import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

type Audio = { normal?: string; slow?: string };
type Entry = {
  key: string;
  levelId: string;
  lessonNumber: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  audio?: Audio;
};

const projectRoot = process.cwd();
const curatedPath = path.join(projectRoot, "content", "hsk-curated-lexicon.json");
const curated = JSON.parse(readFileSync(curatedPath, "utf8")) as {
  entries: Entry[];
  sentenceEntries: Entry[];
};
const issues: string[] = [];
const expectedLessonCounts = new Map([[1, 15], [2, 15], [3, 20], [4, 20], [5, 36], [6, 40]]);
const corruptedMeaning = /(?:www\.|GiaoTrinh|\.com\/|!R\.|\?R\.|[A-Za-z]{18,})/u;

for (const [level, expectedCount] of expectedLessonCounts) {
  const root = path.join(projectRoot, "public", "content", "typing", `hsk-${level}`);
  const actualCount = readdirSync(root).filter((file) => file.endsWith(".json")).length;
  if (actualCount !== expectedCount) issues.push(`HSK ${level}: cần ${expectedCount} bài dữ liệu chuẩn, hiện có ${actualCount}.`);
}

for (const entry of [...curated.entries, ...curated.sentenceEntries]) {
  if (!entry.hanzi.trim() || !entry.pinyin.trim() || !entry.meaning.trim()) {
    issues.push(`${entry.key}: thiếu Hán tự, pinyin hoặc nghĩa tiếng Việt.`);
  }
  if (corruptedMeaning.test(entry.meaning)) issues.push(`${entry.key}: nghĩa có dấu hiệu OCR hỏng: ${entry.meaning}`);
  for (const source of [entry.audio?.normal, entry.audio?.slow].filter(Boolean) as string[]) {
    const localPath = path.join(projectRoot, "public", ...source.replace(/^\//u, "").split("/"));
    if (!existsSync(localPath)) issues.push(`${entry.key}: thiếu audio ${source}.`);
  }
}

const sentenceVariants = new Map<string, Set<string>>();
for (const entry of curated.sentenceEntries) {
  const key = `${entry.levelId}:${entry.hanzi}`;
  const variants = sentenceVariants.get(key) ?? new Set<string>();
  variants.add(`${entry.pinyin}\u0000${entry.meaning}`);
  sentenceVariants.set(key, variants);
}
for (const [key, variants] of sentenceVariants) {
  if (variants.size > 1) issues.push(`${key}: câu trùng có pinyin hoặc bản dịch không nhất quán.`);
}

const wordPinyin = new Map<string, Set<string>>();
for (const entry of curated.entries) {
  const key = `${entry.levelId}:${entry.hanzi}`;
  const variants = wordPinyin.get(key) ?? new Set<string>();
  variants.add(entry.pinyin);
  wordPinyin.set(key, variants);
}
const allowedPolyphonicWords = new Set(["hsk-3:还"]);
for (const [key, variants] of wordPinyin) {
  if (variants.size > 1 && !allowedPolyphonicWords.has(key)) {
    issues.push(`${key}: có pinyin mâu thuẫn (${[...variants].join(", ")}).`);
  }
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`HSK hợp lệ: ${curated.entries.length} mục từ, ${curated.sentenceEntries.length} câu và toàn bộ audio tham chiếu đều sẵn sàng.`);
}
