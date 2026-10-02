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

const DEFAULT_OUTPUT = "artifacts/lo-trinh-hsk-chi-tiet.md";

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

const availableCurriculumLessons = HSK_CURRICULUM.flatMap((level) =>
  level.topics.flatMap((topic) => topic.lessons.filter((lesson) => lesson.available)),
);
const missingContent = availableCurriculumLessons.filter((lesson) => !lessonsById.has(lesson.id));

if (missingContent.length > 0) {
  throw new Error(
    `Thiếu dữ liệu nội dung cho các bài: ${missingContent.map((lesson) => lesson.id).join(", ")}`,
  );
}

const contentIssues: string[] = [];
for (const lesson of lessonsById.values()) {
  for (const [index, word] of lesson.vocabulary.entries()) {
    if (![word.hanzi, word.pinyin, word.meaning, word.example, word.examplePinyin, word.translation]
      .every((value) => value.trim())) {
      contentIssues.push(`${lesson.id}: từ vựng ${index + 1} thiếu Hán tự, pinyin, nghĩa hoặc câu ví dụ.`);
    }
  }
  for (const [dialogueIndex, dialogue] of lesson.dialogues.entries()) {
    for (const [turnIndex, turn] of dialogue.turns.entries()) {
      if (![turn.hanzi, turn.pinyin, turn.translation].every((value) => value.trim())) {
        contentIssues.push(`${lesson.id}: phần ${dialogueIndex + 1}, câu ${turnIndex + 1} thiếu Hán tự, pinyin hoặc nghĩa.`);
      }
    }
  }
  for (const [grammarIndex, point] of lesson.grammar.entries()) {
    for (const [exampleIndex, example] of point.examples.entries()) {
      if (![example.hanzi, example.translation].every((value) => value.trim())) {
        contentIssues.push(`${lesson.id}: ngữ pháp ${grammarIndex + 1}, câu ${exampleIndex + 1} thiếu Hán tự hoặc nghĩa.`);
      }
    }
  }
}

if (contentIssues.length > 0) {
  throw new Error(contentIssues.slice(0, 20).join("\n"));
}

const stats = {
  levels: HSK_CURRICULUM.length,
  topics: 0,
  lessons: 0,
  availableLessons: 0,
  plannedLessons: 0,
  vocabulary: 0,
  vocabularyExamples: 0,
  dialogueSentences: 0,
  grammarPoints: 0,
  grammarExamples: 0,
  grammarExamplesWithoutPinyin: 0,
};

for (const level of HSK_CURRICULUM) {
  stats.topics += level.topics.length;
  for (const topic of level.topics) {
    stats.lessons += topic.lessons.length;
    for (const lesson of topic.lessons) {
      if (!lesson.available) {
        stats.plannedLessons += 1;
        continue;
      }

      stats.availableLessons += 1;
      const content = lessonsById.get(lesson.id);
      if (!content) continue;
      stats.vocabulary += content.vocabulary.length;
      stats.vocabularyExamples += content.vocabulary.filter((word) => word.example.trim()).length;
      stats.dialogueSentences += content.dialogues.reduce(
        (total, dialogue) => total + dialogue.turns.length,
        0,
      );
      stats.grammarPoints += content.grammar.length;
      stats.grammarExamples += content.grammar.reduce(
        (total, point) => total + point.examples.length,
        0,
      );
      stats.grammarExamplesWithoutPinyin += content.grammar.reduce(
        (total, point) => total + point.examples.filter((example) => !example.pinyin.trim()).length,
        0,
      );
    }
  }
}

const lines: string[] = [
  "# Lộ trình HSK chi tiết – 162 bài học",
  "",
  "> Bản xuất đầy đủ từ dữ liệu mà giao diện Himi Chinese đang sử dụng. Mỗi bài có toàn bộ từ vựng, câu ví dụ của từng từ, câu/bài khóa và ví dụ ngữ pháp hiện có trong kho nội dung.",
  "",
  "## Tổng quan dữ liệu",
  "",
  `- Cấp độ: **${formatNumber(stats.levels)}**.`,
  `- Chủ đề: **${formatNumber(stats.topics)}**.`,
  `- Tổng số bài trong lộ trình: **${formatNumber(stats.lessons)}**.`,
  `- Bài đã có nội dung chi tiết: **${formatNumber(stats.availableLessons)}**.`,
  `- Bài định hướng đang xây dựng: **${formatNumber(stats.plannedLessons)}**.`,
  `- Từ vựng: **${formatNumber(stats.vocabulary)}** mục.`,
  `- Câu ví dụ đi cùng từ vựng: **${formatNumber(stats.vocabularyExamples)}** câu.`,
  `- Câu hội thoại/bài khóa: **${formatNumber(stats.dialogueSentences)}** câu.`,
  `- Điểm ngữ pháp: **${formatNumber(stats.grammarPoints)}** điểm, kèm **${formatNumber(stats.grammarExamples)}** câu ví dụ.`,
  `- Câu/vế câu ngữ pháp chưa có pinyin ở dữ liệu gốc: **${formatNumber(stats.grammarExamplesWithoutPinyin)}** mục (được đánh dấu \`—\`, không tự suy diễn).`,
  "",
  "## Cách đọc",
  "",
  "- **Từ vựng:** giữ nguyên thứ tự trong từng bài; mỗi dòng gồm chữ Hán, pinyin, từ loại, nghĩa và câu ví dụ đầy đủ.",
  "- **Câu và bài khóa:** giữ nguyên thứ tự hội thoại/bài đọc; với HSK 5–6, đoạn văn đã được lớp dữ liệu biên tập của ứng dụng tách thành từng câu.",
  "- **Ngữ pháp:** liệt kê công thức, giải thích và toàn bộ câu ví dụ đang có.",
  "- Ô `—` là trường dữ liệu chưa có trong nguồn của ứng dụng.",
  "- **Đang xây dựng:** 16 bài HSK 7–9 mới có tên định hướng nên chưa thể liệt kê từ và câu.",
  "",
];

for (const level of HSK_CURRICULUM) {
  const levelLessonCount = level.topics.reduce((total, topic) => total + topic.lessons.length, 0);
  lines.push(
    `## ${level.label} · ${level.symbol}`,
    "",
    level.description,
    "",
    `**Quy mô:** ${formatNumber(level.topics.length)} chủ đề · ${formatNumber(levelLessonCount)} bài.`,
    "",
  );

  for (const [topicIndex, topic] of level.topics.entries()) {
    lines.push(`### Chủ đề ${topicIndex + 1}: ${topic.title}`, "");

    for (const lesson of topic.lessons) {
      const kind = lesson.kind === "workbook" ? "Bài tập" : "Giáo trình";
      lines.push(
        `#### Bài ${lesson.lessonNumber}: ${lesson.title}`,
        "",
        `- Loại: **${kind}**.`,
        `- Thời lượng dự kiến: **${lesson.minutes} phút**.`,
      );

      if (!lesson.available) {
        lines.push(
          "- Trạng thái: **Đang xây dựng**.",
          "",
          "> Bài này hiện chỉ có tên trong lộ trình; kho dữ liệu chưa có từ vựng và câu bài học.",
          "",
        );
        continue;
      }

      const content = lessonsById.get(lesson.id);
      if (!content) continue;
      const dialogueSentenceCount = content.dialogues.reduce(
        (total, dialogue) => total + dialogue.turns.length,
        0,
      );
      const grammarExampleCount = content.grammar.reduce(
        (total, point) => total + point.examples.length,
        0,
      );

      lines.push(
        `- Route: \`${lessonRoute(level.id, lesson.id)}\`.`,
        `- Dữ liệu: **${formatNumber(content.vocabulary.length)} từ** · **${formatNumber(dialogueSentenceCount)} câu/bài khóa** · **${formatNumber(content.grammar.length)} điểm ngữ pháp** · **${formatNumber(grammarExampleCount)} câu ngữ pháp**.`,
        `- Tóm tắt: ${content.summary}`,
        "",
        `##### Từ vựng (${formatNumber(content.vocabulary.length)} từ)`,
        "",
      );

      if (content.vocabulary.length === 0) {
        lines.push("_Bài này chưa có dữ liệu từ vựng._", "");
      } else {
        lines.push(
          "| # | Chữ Hán | Pinyin | Từ loại | Nghĩa tiếng Việt | Câu ví dụ | Pinyin câu | Dịch câu |",
          "|---:|---|---|---|---|---|---|---|",
        );
        for (const [wordIndex, word] of content.vocabulary.entries()) {
          lines.push(
            `| ${wordIndex + 1} | ${markdownCell(word.hanzi)} | ${markdownCell(word.pinyin)} | ${markdownCell(word.wordClass)} | ${markdownCell(word.meaning)} | ${markdownCell(word.example)} | ${markdownCell(word.examplePinyin)} | ${markdownCell(word.translation)} |`,
          );
        }
        lines.push("");
      }

      lines.push(`##### Câu và bài khóa (${formatNumber(dialogueSentenceCount)} câu)`, "");
      if (content.dialogues.length === 0 || dialogueSentenceCount === 0) {
        lines.push("_Bài này không có câu/bài khóa độc lập trong dữ liệu hiện tại._", "");
      } else {
        let sentenceIndex = 0;
        for (const [dialogueIndex, dialogue] of content.dialogues.entries()) {
          lines.push(
            `**Phần ${dialogueIndex + 1}: ${dialogue.title}**`,
            "",
            dialogue.setting ? `*Bối cảnh:* ${dialogue.setting}` : "",
            "",
            "| # | Người nói/nhãn câu | Chữ Hán | Pinyin | Nghĩa tiếng Việt |",
            "|---:|---|---|---|---|",
          );
          for (const turn of dialogue.turns) {
            sentenceIndex += 1;
            lines.push(
              `| ${sentenceIndex} | ${markdownCell(turn.speaker)} | ${markdownCell(turn.hanzi)} | ${markdownCell(turn.pinyin)} | ${markdownCell(turn.translation)} |`,
            );
          }
          lines.push("");
        }
      }

      lines.push(
        `##### Ngữ pháp và câu ví dụ (${formatNumber(content.grammar.length)} điểm)`,
        "",
      );
      if (content.grammar.length === 0) {
        lines.push("_Bài này không có mục ngữ pháp riêng trong dữ liệu hiện tại._", "");
      } else {
        for (const [grammarIndex, point] of content.grammar.entries()) {
          lines.push(
            `**${grammarIndex + 1}. ${point.title}**`,
            "",
            `- Công thức: \`${point.formula}\`.`,
            `- Giải thích: ${point.explanation}`,
            "",
          );
          if (point.examples.length === 0) {
            lines.push("_Chưa có câu ví dụ._", "");
            continue;
          }

          lines.push(
            "| # | Chữ Hán | Pinyin | Nghĩa tiếng Việt |",
            "|---:|---|---|---|",
          );
          for (const [exampleIndex, example] of point.examples.entries()) {
            lines.push(
              `| ${exampleIndex + 1} | ${markdownCell(example.hanzi)} | ${markdownCell(example.pinyin)} | ${markdownCell(example.translation)} |`,
            );
          }
          lines.push("");
        }
      }
    }
  }
}

const outputPath = resolve(process.cwd(), process.argv[2] ?? DEFAULT_OUTPUT);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${lines.join("\n").replace(/\n{3,}/gu, "\n\n")}\n`, "utf8");

console.log(JSON.stringify({ outputPath, ...stats }, null, 2));
