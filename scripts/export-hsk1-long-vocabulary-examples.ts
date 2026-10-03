import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { applyCuratedHskLessonData } from "../lib/hsk-curated-content.ts";
import { HSK_CURRICULUM } from "../lib/hsk-curriculum.ts";
import { HSK_LESSONS } from "../lib/hsk-lesson-content.ts";

const DEFAULT_OUTPUT = "artifacts/cau-vi-du-tu-vung-hsk1-tu-10-tu.md";
const MINIMUM_WORD_COUNT = 10;
const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });

type ExampleRecord = {
  hanzi: string;
  pinyin: string;
  translation: string;
  words: string[];
  vocabulary: Set<string>;
  lessons: Set<string>;
};

function markdownCell(value: unknown): string {
  const text = String(value ?? "").trim();
  if (!text) return "—";

  return text
    .replace(/\\/gu, "\\\\")
    .replace(/\|/gu, "\\|")
    .replace(/\r?\n/gu, "<br>");
}

function segmentChineseWords(sentence: string): string[] {
  return Array.from(segmenter.segment(sentence))
    .filter((item) => item.isWordLike)
    .map((item) => item.segment.trim())
    .filter(Boolean);
}

const level = HSK_CURRICULUM.find((item) => item.id === "hsk-1");
if (!level) throw new Error("Không tìm thấy lộ trình HSK 1.");

const lessonsById = new Map(
  HSK_LESSONS.map((lesson) => {
    const curated = applyCuratedHskLessonData(lesson);
    return [curated.id, curated] as const;
  }),
);

const recordsBySentence = new Map<string, ExampleRecord>();
let vocabularyExampleCount = 0;

for (const topic of level.topics) {
  for (const lessonMetadata of topic.lessons.filter((lesson) => lesson.available)) {
    const lesson = lessonsById.get(lessonMetadata.id);
    if (!lesson) throw new Error(`Thiếu dữ liệu cho ${lessonMetadata.id}.`);

    for (const word of lesson.vocabulary) {
      vocabularyExampleCount += 1;
      const words = segmentChineseWords(word.example);
      const key = `${word.example.trim()}\u0000${word.examplePinyin.trim()}\u0000${word.translation.trim()}`;
      const record = recordsBySentence.get(key) ?? {
        hanzi: word.example.trim(),
        pinyin: word.examplePinyin.trim(),
        translation: word.translation.trim(),
        words,
        vocabulary: new Set<string>(),
        lessons: new Set<string>(),
      };
      record.vocabulary.add(`${word.hanzi} (${word.pinyin})`);
      record.lessons.add(`Bài ${lessonMetadata.lessonNumber}: ${lessonMetadata.title}`);
      recordsBySentence.set(key, record);
    }
  }
}

const records = Array.from(recordsBySentence.values())
  .filter((record) => record.words.length >= MINIMUM_WORD_COUNT);

for (const record of records) {
  if (![record.hanzi, record.pinyin, record.translation].every(Boolean)) {
    throw new Error(`Câu thiếu Hán tự, pinyin hoặc nghĩa: ${record.hanzi}`);
  }
  if (record.words.length < MINIMUM_WORD_COUNT) {
    throw new Error(`Câu không đạt ngưỡng ${MINIMUM_WORD_COUNT} từ: ${record.hanzi}`);
  }
}

const lines: string[] = [
  "# Câu ví dụ từ vựng HSK 1 có từ 10 từ trở lên",
  "",
  "> Lọc từ toàn bộ câu ví dụ trong phần từ vựng HSK 1 của Himi Chinese.",
  "",
  "## Thống kê",
  "",
  `- Tổng số lượt câu gắn với mục từ HSK 1: **${vocabularyExampleCount}**.`,
  `- Tổng số câu khác nhau trước khi lọc: **${recordsBySentence.size}**.`,
  `- Số câu có ít nhất ${MINIMUM_WORD_COUNT} từ: **${records.length}**.`,
  "- Cách đếm: tách từ theo locale `zh-CN`; dấu câu và khoảng trắng không được tính là từ.",
  "- Mỗi câu chỉ xuất một lần; các từ vựng cùng sử dụng câu đó được gộp trong cột “Từ vựng liên quan”.",
  "",
  "## Danh sách câu",
  "",
  "| STT | Số từ | Cách tách từ | Câu ví dụ | Pinyin | Nghĩa tiếng Việt | Từ vựng liên quan | Bài học |",
  "|---:|---:|---|---|---|---|---|---|",
];

for (const [index, record] of records.entries()) {
  lines.push(
    `| ${index + 1} | ${record.words.length} | ${markdownCell(record.words.join(" / "))} | ${markdownCell(record.hanzi)} | ${markdownCell(record.pinyin)} | ${markdownCell(record.translation)} | ${markdownCell(Array.from(record.vocabulary).join("; "))} | ${markdownCell(Array.from(record.lessons).join("; "))} |`,
  );
}

const outputPath = resolve(process.cwd(), process.argv[2] ?? DEFAULT_OUTPUT);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  outputPath,
  minimumWordCount: MINIMUM_WORD_COUNT,
  vocabularyExampleCount,
  uniqueExampleCount: recordsBySentence.size,
  matchedExampleCount: records.length,
}, null, 2));
