import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

type AssignmentMethod = "exact-anchor" | "semantic-balance";

type VocabularyItem = {
  id: string;
  hanzi: string;
  pinyin: string;
  wordType: string;
  meaningVi: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleVi: string;
  sourceIndex: number;
  assignmentMethod: AssignmentMethod;
  assignmentScore: number;
};

type LessonVocabularyFile = {
  source: string;
  levelId: string;
  levelLabel: string;
  lessonId: string;
  lessonNumber: number;
  lessonTitle: string;
  topicId: string;
  topicTitle: string;
  route: string;
  vocabularyCount: number;
  vocabulary: VocabularyItem[];
};

type LessonManifest = {
  id: string;
  lessonNumber: number;
  title: string;
  topicId: string;
  topicTitle: string;
  route: string;
  vocabularyCount: number;
  file: string;
};

type PartitionManifest = {
  levels: Array<{
    levelId: string;
    label: string;
    source: string;
    totalVocabulary: number;
    lessons: LessonManifest[];
  }>;
};

type ExerciseType = "meaning" | "pinyin" | "listening";

type VocabularyExercise = {
  id: string;
  vocabularyId: string;
  sourceIndex: number;
  assignmentMethod: AssignmentMethod;
  type: ExerciseType;
  instruction: string;
  prompt: string;
  pinyin?: string;
  note: string;
  speakText: string;
  options: string[];
  answer: string;
  exampleHanzi: string;
  exampleVi: string;
};

const PARTITION_ROOT = resolve(process.cwd(), "output/tiengtrunghero-hsk-lessons");
const OUTPUT_ROOT = resolve(process.cwd(), "output/tiengtrunghero-hsk-practice");

function normalizeOption(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\s,.;:!?，。；：！？'“”‘’()\[\]-]+/gu, "")
    .toLocaleLowerCase("vi-VN");
}

function exerciseTypeFor(): ExerciseType {
  return "meaning";
}

function exerciseAnswer(word: VocabularyItem, type: ExerciseType): string {
  return type === "pinyin" ? word.pinyin : word.meaningVi;
}

function buildOptions(
  vocabulary: VocabularyItem[],
  targetIndex: number,
  type: ExerciseType,
): string[] {
  const target = vocabulary[targetIndex];
  const answer = exerciseAnswer(target, type);
  const sameWordType = vocabulary
    .map((word, index) => ({ word, index }))
    .filter(({ word, index }) => index !== targetIndex && word.wordType === target.wordType);
  const otherWordTypes = vocabulary
    .map((word, index) => ({ word, index }))
    .filter(({ word, index }) => index !== targetIndex && word.wordType !== target.wordType);
  const candidates = [...sameWordType, ...otherWordTypes];
  const rotatedCandidates = [
    ...candidates.slice(targetIndex % Math.max(candidates.length, 1)),
    ...candidates.slice(0, targetIndex % Math.max(candidates.length, 1)),
  ];
  const options = [answer];
  const normalizedOptions = new Set([normalizeOption(answer)]);

  for (const { word } of rotatedCandidates) {
    const option = exerciseAnswer(word, type);
    const normalized = normalizeOption(option);
    if (!option.trim() || normalizedOptions.has(normalized)) continue;
    options.push(option);
    normalizedOptions.add(normalized);
    if (options.length === 4) break;
  }

  if (options.length !== 4) {
    throw new Error(`Không đủ 4 phương án cho ${target.hanzi} (${target.id}).`);
  }

  const [correct, ...distractors] = options;
  const answerPosition = (targetIndex + target.sourceIndex) % 4;
  distractors.splice(answerPosition, 0, correct);
  return distractors;
}

function buildExercise(
  lesson: LessonVocabularyFile,
  word: VocabularyItem,
  wordIndex: number,
): VocabularyExercise {
  const type = exerciseTypeFor();
  const typeSuffix = type === "meaning" ? "meaning" : type === "pinyin" ? "pinyin" : "listening";
  const instructions: Record<ExerciseType, string> = {
    meaning: "Chọn nghĩa đúng của từ",
    pinyin: "Chọn pinyin đúng của từ",
    listening: "Nghe và chọn nghĩa đúng",
  };

  return {
    id: `hero-${lesson.levelId}-${word.id}-${typeSuffix}`,
    vocabularyId: word.id,
    sourceIndex: word.sourceIndex,
    assignmentMethod: word.assignmentMethod,
    type,
    instruction: instructions[type],
    prompt: type === "listening" ? "Nghe từ và chọn nghĩa phù hợp" : word.hanzi,
    ...(type === "meaning" ? { pinyin: word.pinyin } : {}),
    note: `Ví dụ: ${word.exampleHanzi} — ${word.exampleVi}`,
    speakText: word.hanzi,
    options: buildOptions(lesson.vocabulary, wordIndex, type),
    answer: exerciseAnswer(word, type),
    exampleHanzi: word.exampleHanzi,
    exampleVi: word.exampleVi,
  };
}

function markdownCell(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\|/gu, "\\|")
    .replace(/\r?\n/gu, "<br>") || "—";
}

const partitionManifest = JSON.parse(
  await readFile(resolve(PARTITION_ROOT, "manifest.json"), "utf8"),
) as PartitionManifest;

await mkdir(OUTPUT_ROOT, { recursive: true });

const globalExerciseIds = new Set<string>();
const practiceLevels: Array<{
  levelId: string;
  label: string;
  lessonCount: number;
  vocabularyCount: number;
  exerciseCount: number;
  typeCounts: Record<ExerciseType, number>;
  lessons: Array<LessonManifest & {
    exerciseCount: number;
    typeCounts: Record<ExerciseType, number>;
    file: string;
  }>;
}> = [];

for (const level of partitionManifest.levels) {
  const levelDirectory = resolve(OUTPUT_ROOT, level.label.toLowerCase());
  await mkdir(levelDirectory, { recursive: true });
  const levelTypeCounts: Record<ExerciseType, number> = { meaning: 0, pinyin: 0, listening: 0 };
  const lessonManifests = [];

  for (const lessonMetadata of level.lessons) {
    const vocabularyPath = resolve(PARTITION_ROOT, lessonMetadata.file);
    const lesson = JSON.parse(await readFile(vocabularyPath, "utf8")) as LessonVocabularyFile;
    if (lesson.vocabulary.length !== lesson.vocabularyCount) {
      throw new Error(`${lesson.lessonId}: vocabularyCount không khớp.`);
    }

    const exercises = lesson.vocabulary.map((word, index) => buildExercise(lesson, word, index));
    const typeCounts: Record<ExerciseType, number> = { meaning: 0, pinyin: 0, listening: 0 };
    for (const exercise of exercises) {
      if (globalExerciseIds.has(exercise.id)) throw new Error(`ID bài tập bị trùng: ${exercise.id}.`);
      globalExerciseIds.add(exercise.id);
      typeCounts[exercise.type] += 1;
      levelTypeCounts[exercise.type] += 1;
      if (exercise.options.length !== 4 || !exercise.options.includes(exercise.answer)) {
        throw new Error(`${exercise.id}: phương án không hợp lệ.`);
      }
      if (new Set(exercise.options.map(normalizeOption)).size !== 4) {
        throw new Error(`${exercise.id}: phương án bị trùng.`);
      }
      if (!exercise.vocabularyId || !exercise.speakText || !exercise.answer) {
        throw new Error(`${exercise.id}: thiếu liên kết từ vựng, nội dung đọc hoặc đáp án.`);
      }
    }

    const fileName = `lesson-${String(lesson.lessonNumber).padStart(2, "0")}.json`;
    const relativeFile = `${level.label.toLowerCase()}/${fileName}`;
    const lessonOutput = {
      schemaVersion: "1.0.0",
      source: lesson.source,
      levelId: lesson.levelId,
      levelLabel: lesson.levelLabel,
      lessonId: lesson.lessonId,
      lessonNumber: lesson.lessonNumber,
      lessonTitle: lesson.lessonTitle,
      topicId: lesson.topicId,
      topicTitle: lesson.topicTitle,
      route: lesson.route,
      vocabularyCount: lesson.vocabularyCount,
      exerciseCount: exercises.length,
      typeCounts,
      exercises,
    };
    const outputPath = resolve(OUTPUT_ROOT, relativeFile);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(lessonOutput, null, 2)}\n`, "utf8");
    lessonManifests.push({ ...lessonMetadata, exerciseCount: exercises.length, typeCounts, file: relativeFile });
  }

  const exerciseCount = lessonManifests.reduce((sum, lesson) => sum + lesson.exerciseCount, 0);
  if (exerciseCount !== level.totalVocabulary) {
    throw new Error(`${level.label}: ${exerciseCount} bài tập cho ${level.totalVocabulary} từ.`);
  }
  const levelOutput = {
    schemaVersion: "1.0.0",
    source: level.source,
    levelId: level.levelId,
    label: level.label,
    levelLabel: level.label,
    lessonCount: lessonManifests.length,
    vocabularyCount: level.totalVocabulary,
    exerciseCount,
    typeCounts: levelTypeCounts,
    lessons: lessonManifests,
  };
  await writeFile(
    resolve(OUTPUT_ROOT, `${level.label.toLowerCase()}.json`),
    `${JSON.stringify(levelOutput, null, 2)}\n`,
    "utf8",
  );
  practiceLevels.push(levelOutput);
}

const totals = {
  levels: practiceLevels.length,
  lessons: practiceLevels.reduce((sum, level) => sum + level.lessonCount, 0),
  vocabulary: practiceLevels.reduce((sum, level) => sum + level.vocabularyCount, 0),
  exercises: practiceLevels.reduce((sum, level) => sum + level.exerciseCount, 0),
  meaning: practiceLevels.reduce((sum, level) => sum + level.typeCounts.meaning, 0),
  pinyin: practiceLevels.reduce((sum, level) => sum + level.typeCounts.pinyin, 0),
  listening: practiceLevels.reduce((sum, level) => sum + level.typeCounts.listening, 0),
};

const manifest = {
  schemaVersion: "1.0.0",
  generatedAt: new Date().toISOString(),
  compatibility: "HskExercise",
  rules: {
    exercisesPerVocabulary: 1,
    optionsPerExercise: 4,
    types: ["meaning"],
    listeningPlaybackField: "speakText",
    editorialReviewRequiredForSemanticAssignments: true,
  },
  totals,
  levels: practiceLevels,
};
await writeFile(resolve(OUTPUT_ROOT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const readmeLines = [
  "# Dữ liệu luyện tập từ vựng HSK1–HSK6",
  "",
  `- Cấp độ: **${totals.levels}**.`,
  `- Bài học: **${totals.lessons}**.`,
  `- Từ vựng: **${totals.vocabulary}**.`,
  `- Bài tập: **${totals.exercises}** — đúng một bài tập cho mỗi mục từ.`,
  `- Dạng bài duy nhất: hiển thị chữ Hán, pinyin, nút nghe và bốn phương án nghĩa tiếng Việt.`,
  "- Mỗi bài tập có bốn phương án không trùng, một đáp án đúng và trường `vocabularyId` để nối với từ vựng.",
  "- Nút nghe dùng `speakText` để phát âm chữ Hán bằng luồng đọc hiện tại của giao diện.",
  "",
  "> Bài tập của các mục từ `semantic-balance` cần được biên tập viên rà soát cùng vị trí bài học trước khi đưa lên production.",
  "",
  "## Thống kê theo bài",
  "",
  "| Cấp | Bài | Chủ đề | Tên bài | Từ | Bài tập chọn nghĩa | File |",
  "|---|---:|---|---|---:|---:|---|",
];

for (const level of practiceLevels) {
  for (const lesson of level.lessons) {
    readmeLines.push(
      `| ${level.label} | ${lesson.lessonNumber} | ${markdownCell(lesson.topicTitle)} | ${markdownCell(lesson.title)} | ${lesson.vocabularyCount} | ${lesson.typeCounts.meaning} | \`${lesson.file}\` |`,
    );
  }
}

await writeFile(resolve(OUTPUT_ROOT, "README.md"), `${readmeLines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ outputRoot: OUTPUT_ROOT, ...totals }, null, 2));
