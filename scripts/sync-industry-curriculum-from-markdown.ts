import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { DialogueLine } from "../lib/content-types.ts";
import type { IndustryCurriculum } from "../lib/industry-curriculum-validation.ts";

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
const curriculumDirectory = resolve(projectRoot, "content", "industry-curriculum");
const sourcePath = resolve(process.argv[2] ?? "D:/Code/HiMi/lo-trinh-van-phong-hanh-chinh.md");
const courseSlug = process.argv[3] ?? "van-phong-hanh-chinh";
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(courseSlug)) throw new Error("Course slug không hợp lệ.");
const targetPath = resolve(curriculumDirectory, `${courseSlug}.json`);
const vocabularyPrefixes: Record<string, string> = {
  "van-phong-hanh-chinh": "office",
  "thuong-mai-dien-tu": "ecommerce",
  "nha-may-san-xuat": "factory",
  "nha-hang-dich-vu": "restaurant",
  "kho-van-logistics": "logistics",
  "ban-hang-cham-soc-khach-hang": "sales",
};
const vocabularyPrefix = vocabularyPrefixes[courseSlug] ?? courseSlug;

function parseTable(block: string, heading: string): MarkdownRow[] {
  const headingIndex = block.indexOf(`### ${heading}`);
  if (headingIndex < 0) throw new Error(`Không tìm thấy mục “${heading}”.`);

  return block
    .slice(headingIndex + heading.length + 4)
    .split("\n")
    .filter(line => /^\|\s*\d+\s*\|/.test(line))
    .map(line => {
      const cells = line.slice(1, line.lastIndexOf("|")).split("|").map(cell => cell.trim());
      if (cells.length !== 4) throw new Error(`Dòng bảng không hợp lệ: ${line}`);
      return { hanzi: cells[1], pinyin: cells[2], translation: cells[3] };
    })
    .slice(0, 10);
}

function parseMarkdown(markdown: string): { topicTitles: string[]; lessons: MarkdownLesson[] } {
  const normalized = markdown.replaceAll("\r\n", "\n");
  const topics = [...normalized.matchAll(/^# Chủ đề\s+\d+\s+(.+)$/gm)];
  const topicTitles = topics.map(match => match[1].trim());
  const headings = [...normalized.matchAll(/^## Bài\s+(\d+)\s+(.+)$/gm)];
  const lessons = headings.map((heading, index) => {
    const block = normalized.slice(heading.index, headings[index + 1]?.index ?? normalized.length);
    const objective = block.match(/^\*\*Mục tiêu:\*\*\s*(.+)$/m)?.[1]?.trim();
    if (!objective) throw new Error(`Bài ${heading[1]} thiếu mục tiêu.`);
    const lesson = {
      number: Number(heading[1]),
      moduleIndex: topics.findLastIndex(topic => topic.index < heading.index),
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

  if (topicTitles.length !== 5) throw new Error(`Tài liệu phải có đúng 5 chủ đề, hiện có ${topicTitles.length}.`);
  if (lessons.length < topicTitles.length || lessons.some((lesson, index) => lesson.number !== index + 1 || lesson.moduleIndex < 0)) {
    throw new Error("Tài liệu phải có các bài được đánh số liên tục và thuộc một chủ đề hợp lệ.");
  }
  return { topicTitles, lessons };
}

function referenceMaps() {
  const vocabulary = new Map<string, string>();
  const sentences = new Map<string, { pinyin: string; translation: string }>();
  for (const filename of readdirSync(curriculumDirectory).filter(file => file.endsWith(".json") && !["manifest.json", "terminology.zh-CN.json", "course.schema.json"].includes(file))) {
    const course = JSON.parse(readFileSync(resolve(curriculumDirectory, filename), "utf8")) as IndustryCurriculum;
    for (const lesson of course.lessons) {
      for (const word of lesson.vocabulary) vocabulary.set(word.hanzi, word.pinyin);
      for (const line of [...lesson.content.dialogue, ...(lesson.content.phrases ?? [])]) {
        sentences.set(line.hanzi, { pinyin: line.pinyin, translation: line.translation });
      }
    }
  }
  const terminology = JSON.parse(readFileSync(resolve(curriculumDirectory, "terminology.zh-CN.json"), "utf8")) as { terms: Array<{ hanzi: string; pinyin: string }> };
  for (const term of terminology.terms) vocabulary.set(term.hanzi, term.pinyin);
  return { vocabulary, sentences };
}

function normalizeLine(
  row: MarkdownRow,
  speaker: string,
  references: ReturnType<typeof referenceMaps>,
  generatedSentences: Map<string, { pinyin: string; translation: string }>,
): DialogueLine {
  const existing = generatedSentences.get(row.hanzi) ?? references.sentences.get(row.hanzi);
  const line = {
    speaker,
    hanzi: row.hanzi,
    pinyin: existing?.pinyin ?? row.pinyin,
    translation: existing?.translation ?? row.translation,
  };
  generatedSentences.set(row.hanzi, { pinyin: line.pinyin, translation: line.translation });
  return line;
}

function buildChallenge(lesson: MarkdownLesson, phrases: DialogueLine[]) {
  const questions = [0, 1, 2].map(questionIndex => ({
    prompt: `Trong bài “${lesson.title}”, câu nào diễn đạt đúng ý “${phrases[questionIndex].translation}”?`,
    options: [phrases[questionIndex].hanzi, phrases[questionIndex + 3].hanzi, phrases[questionIndex + 6].hanzi],
    correctOption: 0,
    explanation: `${phrases[questionIndex].hanzi} có nghĩa là “${phrases[questionIndex].translation}”.`,
  }));
  return {
    title: `Kiểm tra: ${lesson.title}`,
    description: "Chọn cách diễn đạt phù hợp với tình huống trong bài học.",
    passScore: 3,
    questions,
  };
}

function slugify(value: string) {
  return value
    .replaceAll("đ", "d")
    .replaceAll("Đ", "D")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const source = parseMarkdown(readFileSync(sourcePath, "utf8"));
const curriculum = JSON.parse(readFileSync(targetPath, "utf8")) as IndustryCurriculum;
const references = referenceMaps();
const generatedVocabulary = new Map<string, string>();
const generatedSentences = new Map<string, { pinyin: string; translation: string }>();

curriculum.modules.forEach((courseModule, index) => {
  courseModule.title = source.topicTitles[index];
});

const previousLessons = curriculum.lessons;
const usedLessonSlugs = new Set<string>();
const assignedSlugs = new Set<string>();

curriculum.lessons = source.lessons.map((authored, index) => {
  const courseModule = curriculum.modules[authored.moduleIndex];
  if (!courseModule) throw new Error(`Bài ${authored.number} tham chiếu chủ đề không tồn tại.`);
  const isModuleCloser = source.lessons[index + 1]?.moduleIndex !== authored.moduleIndex;
  const candidates = previousLessons.filter(lesson => lesson.moduleSlug === courseModule.slug && !usedLessonSlugs.has(lesson.slug));
  const existing = candidates.find(lesson => lesson.title === authored.title)
    ?? (isModuleCloser ? candidates.find(lesson => lesson.title.startsWith("Tình huống tổng hợp:")) : undefined)
    ?? (!isModuleCloser ? candidates.find(lesson => !lesson.title.startsWith("Tình huống tổng hợp:")) : undefined);
  if (existing) usedLessonSlugs.add(existing.slug);

  let lessonSlug = existing?.slug ?? slugify(authored.title);
  for (let suffix = 2; assignedSlugs.has(lessonSlug); suffix++) lessonSlug = `${slugify(authored.title)}-${suffix}`;
  assignedSlugs.add(lessonSlug);
  const dialogue = authored.sentences.map((row, lineIndex) => normalizeLine(row, lineIndex % 2 === 0 ? "A" : "B", references, generatedSentences));
  const phrases = authored.phrases.map((row, lineIndex) => normalizeLine(row, `Cụm từ ${String(lineIndex + 1).padStart(2, "0")}`, references, generatedSentences));
  const vocabulary = authored.vocabulary.map((word, wordIndex) => {
    const matchingSentence = dialogue.find(line => line.hanzi.includes(word.hanzi));
    const pinyin = generatedVocabulary.get(word.hanzi) ?? references.vocabulary.get(word.hanzi) ?? word.pinyin;
    generatedVocabulary.set(word.hanzi, pinyin);
    return {
      slug: `${vocabularyPrefix}-${String(authored.number).padStart(2, "0")}-${String(wordIndex + 1).padStart(2, "0")}`,
      hanzi: word.hanzi,
      pinyin,
      meaning: word.translation,
      example: matchingSentence?.hanzi ?? `本课的重点词语是“${word.hanzi}”。`,
      translation: matchingSentence?.translation ?? `Từ trọng tâm của bài này là “${word.translation}”.`,
      audioUrl: null,
    };
  });

  return {
    moduleSlug: courseModule.slug,
    slug: lessonSlug,
    title: isModuleCloser && existing ? existing.title : authored.title,
    summary: authored.objective,
    situation: existing?.situation ?? authored.title,
    estimatedMinutes: existing?.estimatedMinutes ?? 15,
    isFree: existing?.isFree ?? false,
    vocabulary,
    content: {
      dialogue,
      phrases,
      notes: existing?.content.notes ?? [],
      ...(existing?.content.challenge ? { challenge: buildChallenge(authored, phrases) } : {}),
    },
  };
});

const appliedLessonCount = source.lessons.filter(lesson => lesson.moduleIndex === curriculum.modules.length - 1).length;
curriculum.learningDesign.originalLessonCount = source.lessons.length - appliedLessonCount;
curriculum.learningDesign.authoredAppliedLessons = appliedLessonCount;

curriculum.learningDesign.sequence = [
  "Học 10 từ vựng qua câu giao tiếp thực tế",
  "Luyện 10 cụm từ theo đúng ngữ cảnh công việc",
  "Nghe, đọc và đóng vai 10 câu giao tiếp",
  "Hoàn thành bài tập ứng dụng và kiểm tra tình huống",
];

writeFileSync(targetPath, `${JSON.stringify(curriculum, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  source: basename(sourcePath),
  target: basename(targetPath),
  modules: curriculum.modules.length,
  lessons: curriculum.lessons.length,
  vocabulary: curriculum.lessons.reduce((sum, lesson) => sum + lesson.vocabulary.length, 0),
  phrases: curriculum.lessons.reduce((sum, lesson) => sum + (lesson.content.phrases?.length ?? 0), 0),
  sentences: curriculum.lessons.reduce((sum, lesson) => sum + lesson.content.dialogue.length, 0),
}, null, 2));
