import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

type RawSegment = {
  text?: unknown;
  pinyin?: unknown;
  tone?: unknown;
  vietnamese?: unknown;
  vi?: unknown;
  segment_type?: unknown;
  pos?: unknown;
};

type RawPracticeItem = {
  id?: unknown;
  item_id?: unknown;
  stage?: unknown;
  item_type?: unknown;
  vi?: unknown;
  vietnamese?: unknown;
  hanzi?: unknown;
  chinese_text?: unknown;
  pinyin?: unknown;
  tone?: unknown;
  audio_normal_path?: unknown;
  audio_slow_path?: unknown;
  normal_audio?: unknown;
  slow_audio?: unknown;
  enabled?: unknown;
  source_pos?: unknown;
  words?: unknown;
  segments?: unknown;
};

type RawLesson = {
  id?: unknown;
  no?: unknown;
  title?: unknown;
  titleZh?: unknown;
  titleVi?: unknown;
  content?: {
    word?: unknown;
    sentence?: unknown;
  };
};

type Stage = "word" | "sentence";

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`Thiếu trường ${field}.`);
  return value.trim();
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizedAssetPath(value: unknown, field: string): string {
  const path = requiredString(value, field).replaceAll("\\", "/").replace(/^\/+/, "");
  if (!path || path.split("/").includes("..")) throw new Error(`Đường dẫn audio không hợp lệ: ${path}`);
  return path;
}

function parseLevelSource(sourceFile: string, level: number): Record<string, RawLesson> {
  const source = readFileSync(sourceFile, "utf8");
  const anchor = `root.lessonContent.HSK${level} =`;
  const assignmentIndex = source.indexOf(anchor);
  const closingIndex = source.lastIndexOf("\n};");
  if (assignmentIndex < 0 || closingIndex < 0) {
    throw new Error(`Không tìm thấy payload HSK${level} trong ${sourceFile}.`);
  }

  const jsonStart = source.indexOf("{", assignmentIndex + anchor.length);
  if (jsonStart < 0 || jsonStart >= closingIndex) throw new Error(`Payload HSK${level} không hợp lệ.`);
  const payload = source.slice(jsonStart, closingIndex + 2);
  const parsed = JSON.parse(payload) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Payload HSK${level} phải là một object bài học.`);
  }
  return parsed as Record<string, RawLesson>;
}

function compactSegments(value: unknown, field: string) {
  if (!Array.isArray(value)) return [];
  return (value as RawSegment[]).map((segment, index) => ({
    text: requiredString(segment.text, `${field}[${index}].text`),
    pinyin: requiredString(segment.pinyin ?? segment.tone, `${field}[${index}].pinyin`),
    meaning: requiredString(segment.vietnamese ?? segment.vi, `${field}[${index}].vietnamese`),
    type: optionalString(segment.segment_type),
    partOfSpeech: optionalString(segment.pos),
  }));
}

function copyAudio(sourcePublicDirectory: string, targetPublicDirectory: string, assetPath: string): boolean {
  const sourceAudioFile = resolve(sourcePublicDirectory, ...assetPath.split("/"));
  const sourceRelative = relative(sourcePublicDirectory, sourceAudioFile);
  if (sourceRelative === ".." || sourceRelative.startsWith(`..${sep}`) || isAbsolute(sourceRelative)) {
    throw new Error(`Audio nằm ngoài thư mục public nguồn: ${assetPath}`);
  }
  if (!existsSync(sourceAudioFile)) throw new Error(`Không tìm thấy audio: ${sourceAudioFile}`);

  const targetAudioFile = resolve(targetPublicDirectory, ...assetPath.split("/"));
  mkdirSync(dirname(targetAudioFile), { recursive: true });
  if (existsSync(targetAudioFile) && statSync(targetAudioFile).size === statSync(sourceAudioFile).size) return false;
  copyFileSync(sourceAudioFile, targetAudioFile);
  return true;
}

function compactItems(
  value: unknown,
  stage: Stage,
  lessonId: string,
  sourcePublicDirectory: string,
  targetPublicDirectory: string,
  counters: { copiedAudio: number; reusedAudio: number },
) {
  if (!Array.isArray(value)) return [];
  return (value as RawPracticeItem[])
    .filter((item) => item.enabled !== false)
    .map((item, index) => {
      const id = requiredString(item.id ?? item.item_id, `${lessonId}.${stage}[${index}].id`);
      const normalPath = normalizedAssetPath(
        item.audio_normal_path ?? item.normal_audio,
        `${id}.audio_normal_path`,
      );
      const slowPath = normalizedAssetPath(
        item.audio_slow_path ?? item.slow_audio,
        `${id}.audio_slow_path`,
      );
      for (const assetPath of [normalPath, slowPath]) {
        if (copyAudio(sourcePublicDirectory, targetPublicDirectory, assetPath)) counters.copiedAudio += 1;
        else counters.reusedAudio += 1;
      }

      const words = compactSegments(item.words, `${id}.words`);
      const segments = compactSegments(item.segments, `${id}.segments`);
      return {
        id,
        stage,
        meaning: requiredString(item.vietnamese ?? item.vi, `${id}.vietnamese`),
        hanzi: requiredString(item.hanzi ?? item.chinese_text, `${id}.hanzi`),
        pinyin: requiredString(item.pinyin ?? item.tone, `${id}.pinyin`),
        partOfSpeech: optionalString(item.source_pos),
        audio: {
          normal: `/${normalPath}`,
          slow: `/${slowPath}`,
        },
        words,
        segments: segments.length ? segments : words,
      };
    });
}

const sourceDataDirectoryArgument = process.argv[2];
const sourcePublicDirectoryArgument = process.argv[3];
if (!sourceDataDirectoryArgument || !sourcePublicDirectoryArgument) {
  throw new Error(
    "Cách dùng: npm run content:typing:import -- <thư-mục-data> <thư-mục-public-nguồn>",
  );
}

const sourceDataDirectory = resolve(sourceDataDirectoryArgument);
const sourcePublicDirectory = resolve(sourcePublicDirectoryArgument);
const targetPublicDirectory = resolve(process.cwd(), "public");
const targetLessonDirectory = resolve(targetPublicDirectory, "content", "typing");
const targetCatalogFile = resolve(process.cwd(), "content", "typing-practice", "catalog.json");
const counters = { copiedAudio: 0, reusedAudio: 0 };

const catalog = [];
let totalWords = 0;
let totalSentences = 0;

for (let level = 1; level <= 6; level += 1) {
  const sourceFile = resolve(sourceDataDirectory, `lesson-hsk${level}-word-sentence-content.js`);
  if (!existsSync(sourceFile)) throw new Error(`Không tìm thấy dữ liệu HSK${level}: ${sourceFile}`);
  const rawLessons = parseLevelSource(sourceFile, level);
  const lessons = Object.values(rawLessons)
    .map((lesson, lessonIndex) => {
      const lessonId = requiredString(lesson.id, `HSK${level}.lessons[${lessonIndex}].id`);
      const lessonNumber = typeof lesson.no === "number" ? lesson.no : lessonIndex + 1;
      const words = compactItems(
        lesson.content?.word,
        "word",
        lessonId,
        sourcePublicDirectory,
        targetPublicDirectory,
        counters,
      );
      const sentences = compactItems(
        lesson.content?.sentence,
        "sentence",
        lessonId,
        sourcePublicDirectory,
        targetPublicDirectory,
        counters,
      );
      const titleZh = optionalString(lesson.titleZh ?? lesson.title) ?? `第${lessonNumber}课`;
      const titleVi = optionalString(lesson.titleVi) ?? titleZh;
      const lessonPayload = {
        id: lessonId,
        level: `hsk-${level}`,
        levelLabel: `HSK ${level}`,
        number: lessonNumber,
        titleZh,
        titleVi,
        words,
        sentences,
      };
      const levelDirectory = resolve(targetLessonDirectory, `hsk-${level}`);
      mkdirSync(levelDirectory, { recursive: true });
      writeFileSync(
        resolve(levelDirectory, `${lessonId}.json`),
        `${JSON.stringify(lessonPayload)}\n`,
        "utf8",
      );
      totalWords += words.length;
      totalSentences += sentences.length;
      return {
        id: lessonId,
        number: lessonNumber,
        titleZh,
        titleVi,
        wordCount: words.length,
        sentenceCount: sentences.length,
        previewHanzi: words.slice(0, 5).map((item) => item.hanzi),
      };
    })
    .sort((a, b) => a.number - b.number);

  catalog.push({
    id: `hsk-${level}`,
    level,
    label: `HSK ${level}`,
    lessonCount: lessons.length,
    wordCount: lessons.reduce((total, lesson) => total + lesson.wordCount, 0),
    sentenceCount: lessons.reduce((total, lesson) => total + lesson.sentenceCount, 0),
    previewHanzi: lessons.flatMap((lesson) => lesson.previewHanzi).slice(0, 6),
    lessons,
  });
}

mkdirSync(dirname(targetCatalogFile), { recursive: true });
writeFileSync(targetCatalogFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

console.log(
  `Đã nhập ${catalog.reduce((total, level) => total + level.lessonCount, 0)} bài, `
  + `${totalWords} từ, ${totalSentences} câu; `
  + `${counters.copiedAudio} audio mới, ${counters.reusedAudio} audio đã có.`,
);
