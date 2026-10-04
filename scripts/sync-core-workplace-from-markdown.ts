import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { coreWorkplaceLessons, coreWorkplaceModules } from "../lib/core-workplace-course-seed.ts";
import type { DialogueLine, Vocabulary } from "../lib/content-types.ts";
import type { CourseLessonSeed, CourseModuleSeed } from "../lib/course-seed-types.ts";

type MarkdownRow = {
  hanzi: string;
  pinyin: string;
  translation: string;
};

type MarkdownLesson = {
  number: number;
  moduleIndex: number;
  title: string;
  objective: string;
  vocabulary: MarkdownRow[];
  phrases: MarkdownRow[];
  sentences: MarkdownRow[];
};

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const sourcePath = resolve(process.argv[2] ?? "D:/Code/HiMi/lo-trinh-giao-tiep-cong-so-cot-loi.md");
const targetPath = resolve(projectRoot, "lib", "core-workplace-course-seed.ts");

function parseTable(block: string, heading: string): MarkdownRow[] {
  const headingIndex = block.indexOf(`### ${heading}`);
  if (headingIndex < 0) throw new Error(`Không tìm thấy mục “${heading}”.`);

  return block
    .slice(headingIndex + heading.length + 4)
    .split("\n")
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) => {
      const cells = line.slice(1, line.lastIndexOf("|")).split("|").map((cell) => cell.trim());
      if (cells.length !== 4) throw new Error(`Dòng bảng không hợp lệ: ${line}`);
      return { hanzi: cells[1], pinyin: cells[2], translation: cells[3] };
    })
    .slice(0, 10);
}

function parseMarkdown(markdown: string) {
  const normalized = markdown.replaceAll("\r\n", "\n");
  const topics = [...normalized.matchAll(/^# Chủ đề\s+\d+\s+(.+)$/gm)];
  const headings = [...normalized.matchAll(/^## Bài\s+(\d+)\s+(.+)$/gm)];
  const topicTitles = topics.map((match) => match[1].trim());
  const lessons: MarkdownLesson[] = headings.map((heading, index) => {
    const block = normalized.slice(heading.index, headings[index + 1]?.index ?? normalized.length);
    const objective = block.match(/^\*\*Mục tiêu:\*\*\s*(.+)$/m)?.[1]?.trim();
    if (!objective) throw new Error(`Bài ${heading[1]} thiếu mục tiêu.`);
    const lesson = {
      number: Number(heading[1]),
      moduleIndex: topics.findLastIndex((topic) => topic.index < heading.index),
      title: heading[2].trim(),
      objective,
      vocabulary: parseTable(block, "10 từ vựng"),
      phrases: parseTable(block, "10 cụm từ liên quan"),
      sentences: parseTable(block, "10 câu giao tiếp thực tế"),
    };
    for (const [label, rows] of [["từ vựng", lesson.vocabulary], ["cụm từ", lesson.phrases], ["câu giao tiếp", lesson.sentences]] as const) {
      if (rows.length !== 10) throw new Error(`Bài ${lesson.number} phải có đúng 10 ${label}, hiện có ${rows.length}.`);
    }
    return lesson;
  });

  if (topicTitles.length !== 4) throw new Error(`Tài liệu phải có đúng 4 chủ đề, hiện có ${topicTitles.length}.`);
  if (lessons.length !== 24 || lessons.some((lesson, index) => lesson.number !== index + 1 || lesson.moduleIndex < 0)) {
    throw new Error("Tài liệu phải có đúng 24 bài, được đánh số liên tục và thuộc một chủ đề hợp lệ.");
  }
  if (topicTitles.some((_, moduleIndex) => lessons.filter((lesson) => lesson.moduleIndex === moduleIndex).length !== 6)) {
    throw new Error("Mỗi chủ đề phải có đúng 6 bài.");
  }
  return { topicTitles, lessons };
}

function toLine(row: MarkdownRow, speaker: string): DialogueLine {
  return { speaker, hanzi: row.hanzi, pinyin: row.pinyin, translation: row.translation };
}

function toVocabulary(row: MarkdownRow, lesson: MarkdownLesson, wordIndex: number, existing: CourseLessonSeed): Vocabulary {
  const preserved = existing.vocabulary.find((word) => word.hanzi === row.hanzi);
  const matchingLine = [...lesson.sentences, ...lesson.phrases].find((line) => line.hanzi.includes(row.hanzi));
  return {
    slug: preserved?.slug ?? `core-${String(lesson.number).padStart(2, "0")}-${String(wordIndex + 1).padStart(2, "0")}`,
    hanzi: row.hanzi,
    pinyin: row.pinyin,
    meaning: row.translation,
    example: matchingLine?.hanzi ?? `本课的重点词语是“${row.hanzi}”。`,
    translation: matchingLine?.translation ?? `Từ trọng tâm của bài này là “${row.translation}”.`,
    audioUrl: preserved?.audioUrl ?? null,
  };
}

const source = parseMarkdown(readFileSync(sourcePath, "utf8"));
if (coreWorkplaceModules.length !== source.topicTitles.length || coreWorkplaceLessons.length !== source.lessons.length) {
  throw new Error("Cấu trúc dữ liệu hiện tại không khớp tài liệu nguồn; không thể giữ nguyên ID/slug an toàn.");
}

const modules: CourseModuleSeed[] = coreWorkplaceModules.map((courseModule, index) => ({
  ...courseModule,
  title: source.topicTitles[index],
}));

const lessons: CourseLessonSeed[] = source.lessons.map((authored, index) => {
  const existing = coreWorkplaceLessons[index];
  const courseModule = modules[authored.moduleIndex];
  if (!existing || !courseModule) throw new Error(`Không thể ánh xạ bài ${authored.number}.`);
  return {
    ...existing,
    moduleSlug: courseModule.slug,
    title: authored.title,
    summary: authored.objective,
    vocabulary: authored.vocabulary.map((word, wordIndex) => toVocabulary(word, authored, wordIndex, existing)),
    content: {
      dialogue: authored.sentences.map((line, lineIndex) => toLine(line, lineIndex % 2 === 0 ? "A" : "B")),
      phrases: authored.phrases.map((line, lineIndex) => toLine(line, `Cụm từ ${String(lineIndex + 1).padStart(2, "0")}`)),
      notes: existing.content.notes,
      ...(existing.content.challenge ? { challenge: existing.content.challenge } : {}),
    },
  };
});

const output = `// Generated from ${basename(sourcePath)} by scripts/sync-core-workplace-from-markdown.ts.\n`
  + `// Run \`npm run content:core-workplace:sync\` after editing the authored Markdown.\n\n`
  + `import type { CourseLessonSeed, CourseModuleSeed } from "./course-seed-types.ts";\n\n`
  + `export const coreWorkplaceModules: CourseModuleSeed[] = ${JSON.stringify(modules, null, 2)};\n\n`
  + `export const coreWorkplaceLessons: CourseLessonSeed[] = ${JSON.stringify(lessons, null, 2)};\n\n`
  + `export const coreWorkplaceCourseStats = {\n`
  + `  lessons: coreWorkplaceLessons.length,\n`
  + `  minutes: coreWorkplaceLessons.reduce((total, lesson) => total + lesson.estimatedMinutes, 0),\n`
  + `  freeLessons: coreWorkplaceLessons.filter((lesson) => lesson.isFree).length,\n`
  + `  vocabulary: new Set(coreWorkplaceLessons.flatMap((lesson) => lesson.vocabulary.map((word) => word.slug))).size,\n`
  + `  modules: coreWorkplaceModules.length,\n`
  + `};\n`;

writeFileSync(targetPath, output, "utf8");
console.log(JSON.stringify({
  source: basename(sourcePath),
  target: basename(targetPath),
  modules: modules.length,
  lessons: lessons.length,
  vocabulary: lessons.reduce((total, lesson) => total + lesson.vocabulary.length, 0),
  phrases: lessons.reduce((total, lesson) => total + (lesson.content.phrases?.length ?? 0), 0),
  sentences: lessons.reduce((total, lesson) => total + lesson.content.dialogue.length, 0),
}, null, 2));
