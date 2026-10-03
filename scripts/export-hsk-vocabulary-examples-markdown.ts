import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { applyCuratedHskLessonData } from "../lib/hsk-curated-content.ts";
import { HSK_CURRICULUM } from "../lib/hsk-curriculum.ts";
import { HSK_LESSONS } from "../lib/hsk-lesson-content.ts";
import type { HskLessonContent } from "../lib/hsk-lesson-content.ts";
import { HSK2_TEXTBOOK_LESSONS } from "../lib/hsk2-textbook-content.ts";
import { HSK3_TEXTBOOK_LESSONS } from "../lib/hsk3-textbook-content.ts";
import { HSK4_TEXTBOOK_LESSONS } from "../lib/hsk4-textbook-content.ts";
import { HSK4_UPPER_TEXTBOOK_LESSONS } from "../lib/hsk4-upper-textbook-content.ts";
import { HSK5_LOWER_TEXTBOOK_LESSONS } from "../lib/hsk5-lower-textbook-content.ts";
import { HSK5_WORKBOOK_1_LESSONS } from "../lib/hsk5-workbook-1-content.ts";
import { HSK6_VOLUME1_TEXTBOOK_LESSONS } from "../lib/hsk6-volume1-textbook-content.ts";
import { HSK6_VOLUME2_TEXTBOOK_LESSONS } from "../lib/hsk6-volume2-textbook-content.ts";

const DEFAULT_OUTPUT = "artifacts/cau-vi-du-tu-vung-hsk.md";
const requestedLevelId = process.argv
  .slice(2)
  .find((argument) => argument.startsWith("--level="))
  ?.slice("--level=".length);
const outputArgument = process.argv
  .slice(2)
  .find((argument) => !argument.startsWith("--")) ?? DEFAULT_OUTPUT;

const rawLessons: HskLessonContent[] = [
  ...HSK_LESSONS,
  ...HSK2_TEXTBOOK_LESSONS,
  ...HSK3_TEXTBOOK_LESSONS,
  ...HSK4_UPPER_TEXTBOOK_LESSONS,
  ...HSK4_TEXTBOOK_LESSONS,
  ...HSK5_WORKBOOK_1_LESSONS,
  ...HSK5_LOWER_TEXTBOOK_LESSONS,
  ...HSK6_VOLUME1_TEXTBOOK_LESSONS,
  ...HSK6_VOLUME2_TEXTBOOK_LESSONS,
];

const lessonsById = new Map(
  rawLessons.map((lesson) => {
    const curated = applyCuratedHskLessonData(lesson);
    return [curated.id, curated] as const;
  }),
);

if (lessonsById.size !== rawLessons.length) {
  throw new Error(`Có ID bài học bị trùng: ${rawLessons.length} nguồn nhưng chỉ có ${lessonsById.size} ID.`);
}

function markdownCell(value: unknown): string {
  const text = String(value ?? "").trim();
  if (!text) return "—";

  return text
    .replace(/\\/gu, "\\\\")
    .replace(/\|/gu, "\\|")
    .replace(/\r?\n/gu, "<br>");
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function lessonRoute(levelId: string, lessonId: string): string {
  return `/hsk/${levelId.replace(/^hsk-?/u, "")}/${lessonId}/play`;
}

const selectedCurriculum = requestedLevelId
  ? HSK_CURRICULUM.filter((level) => level.id === requestedLevelId)
  : HSK_CURRICULUM;

if (selectedCurriculum.length === 0) {
  throw new Error(`Không tìm thấy cấp độ ${requestedLevelId}.`);
}

const availableLessons = selectedCurriculum.flatMap((level) =>
  level.topics.flatMap((topic) => topic.lessons.filter((lesson) => lesson.available)),
);
const missingLessons = availableLessons.filter((lesson) => !lessonsById.has(lesson.id));
if (missingLessons.length > 0) {
  throw new Error(`Thiếu dữ liệu nội dung cho: ${missingLessons.map((lesson) => lesson.id).join(", ")}`);
}

const issues: string[] = [];
const uniqueExamples = new Set<string>();
let exampleCount = 0;

for (const lessonMetadata of availableLessons) {
  const lesson = lessonsById.get(lessonMetadata.id);
  if (!lesson) continue;
  for (const [index, word] of lesson.vocabulary.entries()) {
    exampleCount += 1;
    uniqueExamples.add(`${word.example.trim()}\u0000${word.examplePinyin.trim()}\u0000${word.translation.trim()}`);
    if (![word.hanzi, word.pinyin, word.meaning, word.example, word.examplePinyin, word.translation]
      .every((value) => value.trim())) {
      issues.push(`${lesson.id}: mục từ ${index + 1} thiếu dữ liệu.`);
    }
  }
}

if (issues.length > 0) {
  throw new Error(issues.slice(0, 20).join("\n"));
}

const lines: string[] = [
  `# Toàn bộ câu ví dụ trong phần từ vựng ${selectedCurriculum.length === 1 ? selectedCurriculum[0].label : "HSK"}`,
  "",
  "> Xuất từ dữ liệu bài học mà giao diện Himi Chinese đang sử dụng, sau khi áp dụng lớp dữ liệu biên tập HSK.",
  "",
  "## Tổng quan",
  "",
  `- Bài học có nội dung: **${formatNumber(availableLessons.length)}**.`,
  `- Tổng số mục từ/câu ví dụ: **${formatNumber(exampleCount)}**.`,
  `- Số câu ví dụ khác nhau: **${formatNumber(uniqueExamples.size)}**.`,
  `- Số lượt câu trùng được giữ lại: **${formatNumber(exampleCount - uniqueExamples.size)}**.`,
  "- Mỗi dòng tương ứng với một mục từ. Câu giống nhau vẫn xuất nhiều lần nếu được dùng làm ví dụ cho nhiều từ.",
  ...(requestedLevelId ? [] : ["- 16 bài HSK 7–9 đang xây dựng chưa có dữ liệu từ vựng nên không có câu để xuất."]),
  "",
];

let globalIndex = 0;

for (const level of selectedCurriculum) {
  const levelContents = level.topics.flatMap((topic) =>
    topic.lessons
      .filter((lesson) => lesson.available)
      .map((lesson) => lessonsById.get(lesson.id))
      .filter((lesson): lesson is HskLessonContent => Boolean(lesson)),
  );
  const levelExampleCount = levelContents.reduce(
    (total, lesson) => total + lesson.vocabulary.length,
    0,
  );

  lines.push(`## ${level.label} · ${level.symbol}`, "");
  if (levelExampleCount === 0) {
    lines.push("_Cấp độ này chưa có câu ví dụ từ vựng trong dữ liệu hiện tại._", "");
    continue;
  }
  lines.push(`**Tổng số:** ${formatNumber(levelExampleCount)} mục từ/câu ví dụ.`, "");

  for (const [topicIndex, topic] of level.topics.entries()) {
    const topicLessons = topic.lessons.filter((lesson) => lesson.available);
    if (topicLessons.length === 0) continue;

    lines.push(`### Chủ đề ${topicIndex + 1}: ${topic.title}`, "");
    for (const lesson of topicLessons) {
      const content = lessonsById.get(lesson.id);
      if (!content) continue;

      lines.push(
        `#### Bài ${lesson.lessonNumber}: ${lesson.title}`,
        "",
        `- Route: \`${lessonRoute(level.id, lesson.id)}\`.`,
        `- Số mục từ/câu ví dụ: **${formatNumber(content.vocabulary.length)}**.`,
        "",
        "| STT | Từ vựng | Pinyin từ | Nghĩa của từ | Câu ví dụ | Pinyin câu | Nghĩa của câu |",
        "|---:|---|---|---|---|---|---|",
      );

      for (const word of content.vocabulary) {
        globalIndex += 1;
        lines.push(
          `| ${globalIndex} | ${markdownCell(word.hanzi)} | ${markdownCell(word.pinyin)} | ${markdownCell(word.meaning)} | ${markdownCell(word.example)} | ${markdownCell(word.examplePinyin)} | ${markdownCell(word.translation)} |`,
        );
      }
      lines.push("");
    }
  }
}

if (globalIndex !== exampleCount) {
  throw new Error(`Đã tính ${exampleCount} câu nhưng chỉ xuất ${globalIndex} dòng.`);
}

const outputPath = resolve(process.cwd(), outputArgument);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${lines.join("\n").replace(/\n{3,}/gu, "\n\n")}\n`, "utf8");

console.log(JSON.stringify({
  outputPath,
  availableLessons: availableLessons.length,
  exampleCount,
  uniqueExampleCount: uniqueExamples.size,
  duplicateExampleCount: exampleCount - uniqueExamples.size,
}, null, 2));
