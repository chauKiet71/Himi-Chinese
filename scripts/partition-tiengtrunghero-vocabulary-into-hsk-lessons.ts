import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

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

type ScrapedVocabularyItem = {
  id: string;
  hanzi: string;
  pinyin: string;
  wordType: string;
  meaningVi: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleVi: string;
};

type ScrapedVocabularyFile = {
  source: string;
  level: string;
  count: number;
  items: ScrapedVocabularyItem[];
};

type AssignmentMethod = "exact-anchor" | "semantic-balance";

type AssignedVocabularyItem = ScrapedVocabularyItem & {
  sourceIndex: number;
  assignmentMethod: AssignmentMethod;
  assignmentScore: number;
};

type LessonBucket = {
  id: string;
  lessonNumber: number;
  title: string;
  topicId: string;
  topicTitle: string;
  route: string;
  content: HskLessonContent;
  targetCount: number;
  items: AssignedVocabularyItem[];
};

type LevelConfig = {
  levelId: string;
  label: string;
  sourcePath: string;
  content: HskLessonContent[];
};

const OUTPUT_ROOT = resolve(process.cwd(), "output/tiengtrunghero-hsk-lessons");
const LEVEL_CONFIGS: LevelConfig[] = [
  {
    levelId: "hsk-1",
    label: "HSK1",
    sourcePath: "output/tiengtrunghero-hsk1-vocabulary.json",
    content: HSK_LESSONS,
  },
  {
    levelId: "hsk-2",
    label: "HSK2",
    sourcePath: "output/tiengtrunghero-hsk2-vocabulary.json",
    content: HSK2_TEXTBOOK_LESSONS,
  },
  {
    levelId: "hsk-3",
    label: "HSK3",
    sourcePath: "output/tiengtrunghero-hsk3-vocabulary.json",
    content: HSK3_TEXTBOOK_LESSONS,
  },
  {
    levelId: "hsk-4",
    label: "HSK4",
    sourcePath: "output/tiengtrunghero-hsk4-vocabulary.json",
    content: [...HSK4_UPPER_TEXTBOOK_LESSONS, ...HSK4_TEXTBOOK_LESSONS],
  },
  {
    levelId: "hsk-5",
    label: "HSK5",
    sourcePath: "output/tiengtrunghero-hsk5-vocabulary.json",
    content: [...HSK5_WORKBOOK_1_LESSONS, ...HSK5_LOWER_TEXTBOOK_LESSONS],
  },
  {
    levelId: "hsk-6",
    label: "HSK6",
    sourcePath: "output/tiengtrunghero-hsk6-vocabulary.json",
    content: [...HSK6_VOLUME1_TEXTBOOK_LESSONS, ...HSK6_VOLUME2_TEXTBOOK_LESSONS],
  },
];

const VIETNAMESE_STOP_WORDS = new Set([
  "anh", "ban", "cac", "cho", "cua", "co", "dang", "day", "den", "duoc", "gia", "la", "lam",
  "mot", "nhung", "nhieu", "nay", "nguoi", "nhu", "o", "qua", "rat", "sau", "se", "thi", "the",
  "toi", "trong", "truoc", "tu", "va", "voi",
]);

function normalizePinyin(value: string): string {
  return value.toLowerCase().replace(/[\s'’\-()[\]]/gu, "");
}

function vietnameseTokens(value: string): Set<string> {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/đ/gu, "d")
    .toLowerCase();
  return new Set(
    normalized
      .split(/[^a-z0-9]+/gu)
      .filter((token) => token.length >= 2 && !VIETNAMESE_STOP_WORDS.has(token)),
  );
}

function lessonRoute(levelId: string, lessonId: string): string {
  return `/hsk/${levelId.replace(/^hsk-?/u, "")}/${lessonId}/play`;
}

function buildProfile(content: HskLessonContent, title: string) {
  const chineseText = [
    ...content.vocabulary.flatMap((word) => [word.hanzi, word.example]),
    ...content.dialogues.flatMap((dialogue) => dialogue.turns.map((turn) => turn.hanzi)),
    ...content.grammar.flatMap((point) => point.examples.map((example) => example.hanzi)),
  ].join(" ");
  const vietnameseText = [
    title,
    content.summary,
    ...content.vocabulary.flatMap((word) => [word.meaning, word.translation]),
    ...content.dialogues.flatMap((dialogue) => dialogue.turns.map((turn) => turn.translation)),
    ...content.grammar.flatMap((point) => [
      point.title,
      point.explanation,
      ...point.examples.map((example) => example.translation),
    ]),
  ].join(" ");

  return {
    chineseText,
    vietnameseTokens: vietnameseTokens(vietnameseText),
    anchorWords: Array.from(new Set(content.vocabulary.map((word) => word.hanzi))),
  };
}

function semanticScore(
  item: ScrapedVocabularyItem,
  profile: ReturnType<typeof buildProfile>,
): number {
  let score = 0;
  if (item.hanzi.length >= 2 && profile.chineseText.includes(item.hanzi)) score += 14;

  for (const anchor of profile.anchorWords) {
    if (anchor.length >= 2 && item.exampleHanzi.includes(anchor)) {
      score += 3 + Math.min(anchor.length, 4);
    }
  }

  const itemTokens = vietnameseTokens(`${item.meaningVi} ${item.exampleVi}`);
  for (const token of itemTokens) {
    if (profile.vietnameseTokens.has(token)) score += token.length >= 5 ? 2 : 1;
  }
  return score;
}

function balanceTargets(buckets: LessonBucket[], totalCount: number): void {
  for (const bucket of buckets) bucket.targetCount = bucket.items.length;

  while (buckets.reduce((sum, bucket) => sum + bucket.targetCount, 0) < totalCount) {
    const next = [...buckets].sort((left, right) =>
      left.targetCount - right.targetCount || left.lessonNumber - right.lessonNumber,
    )[0];
    next.targetCount += 1;
  }
}

function markdownCell(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\|/gu, "\\|")
    .replace(/\r?\n/gu, "<br>") || "—";
}

await mkdir(OUTPUT_ROOT, { recursive: true });

const manifestLevels: Array<{
  levelId: string;
  label: string;
  source: string;
  totalVocabulary: number;
  exactAnchorCount: number;
  semanticBalanceCount: number;
  lessons: Array<Omit<LessonBucket, "content" | "items"> & {
    vocabularyCount: number;
    exactAnchorCount: number;
    semanticBalanceCount: number;
    file: string;
  }>;
}> = [];

for (const config of LEVEL_CONFIGS) {
  const sourceFile = JSON.parse(
    await readFile(resolve(process.cwd(), config.sourcePath), "utf8"),
  ) as ScrapedVocabularyFile;
  if (sourceFile.items.length !== sourceFile.count) {
    throw new Error(`${config.label}: count không khớp số phần tử.`);
  }

  const curriculumLevel = HSK_CURRICULUM.find((level) => level.id === config.levelId);
  if (!curriculumLevel) throw new Error(`Không tìm thấy lộ trình ${config.levelId}.`);

  const contentById = new Map(
    config.content.map((lesson) => {
      const curated = applyCuratedHskLessonData(lesson);
      return [curated.id, curated] as const;
    }),
  );
  const buckets: LessonBucket[] = curriculumLevel.topics.flatMap((topic) =>
    topic.lessons.filter((lesson) => lesson.available).map((lesson) => {
      const content = contentById.get(lesson.id);
      if (!content) throw new Error(`${config.label}: thiếu nội dung ${lesson.id}.`);
      return {
        id: lesson.id,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        topicId: topic.id,
        topicTitle: topic.title,
        route: lessonRoute(config.levelId, lesson.id),
        content,
        targetCount: 0,
        items: [],
      };
    }),
  );

  const anchorCandidates = new Map<string, Array<{ bucketIndex: number; pinyin: string }>>();
  for (const [bucketIndex, bucket] of buckets.entries()) {
    for (const word of bucket.content.vocabulary) {
      const candidates = anchorCandidates.get(word.hanzi) ?? [];
      candidates.push({ bucketIndex, pinyin: normalizePinyin(word.pinyin) });
      anchorCandidates.set(word.hanzi, candidates);
    }
  }

  const unmatched: Array<{ item: ScrapedVocabularyItem; sourceIndex: number }> = [];
  for (const [sourceIndex, item] of sourceFile.items.entries()) {
    const candidates = anchorCandidates.get(item.hanzi) ?? [];
    if (candidates.length === 0) {
      unmatched.push({ item, sourceIndex });
      continue;
    }

    const normalizedPinyin = normalizePinyin(item.pinyin);
    const pinyinMatches = candidates.filter((candidate) => candidate.pinyin === normalizedPinyin);
    const eligible = pinyinMatches.length > 0 ? pinyinMatches : candidates;
    const chosen = [...eligible].sort((left, right) =>
      buckets[left.bucketIndex].items.length - buckets[right.bucketIndex].items.length
        || buckets[left.bucketIndex].lessonNumber - buckets[right.bucketIndex].lessonNumber,
    )[0];
    buckets[chosen.bucketIndex].items.push({
      ...item,
      sourceIndex: sourceIndex + 1,
      assignmentMethod: "exact-anchor",
      assignmentScore: 100,
    });
  }

  balanceTargets(buckets, sourceFile.items.length);
  const profiles = buckets.map((bucket) => buildProfile(bucket.content, bucket.title));
  const rankedUnmatched = unmatched.map(({ item, sourceIndex }) => {
    const scores = profiles.map((profile) => semanticScore(item, profile));
    const rankedScores = [...scores].sort((left, right) => right - left);
    return {
      item,
      sourceIndex,
      scores,
      bestScore: rankedScores[0] ?? 0,
      margin: (rankedScores[0] ?? 0) - (rankedScores[1] ?? 0),
    };
  }).sort((left, right) =>
    right.bestScore - left.bestScore || right.margin - left.margin || left.sourceIndex - right.sourceIndex,
  );

  for (const candidate of rankedUnmatched) {
    const eligibleBuckets = buckets
      .map((bucket, bucketIndex) => ({ bucket, bucketIndex, score: candidate.scores[bucketIndex] }))
      .filter(({ bucket }) => bucket.items.length < bucket.targetCount)
      .sort((left, right) =>
        right.score - left.score
          || left.bucket.items.length / left.bucket.targetCount - right.bucket.items.length / right.bucket.targetCount
          || left.bucket.lessonNumber - right.bucket.lessonNumber,
      );
    const chosen = eligibleBuckets[0];
    if (!chosen) throw new Error(`${config.label}: không còn chỗ cho ${candidate.item.hanzi}.`);
    chosen.bucket.items.push({
      ...candidate.item,
      sourceIndex: candidate.sourceIndex + 1,
      assignmentMethod: "semantic-balance",
      assignmentScore: chosen.score,
    });
  }

  const assignedItems = buckets.flatMap((bucket) => bucket.items);
  if (assignedItems.length !== sourceFile.items.length) {
    throw new Error(`${config.label}: đã gán ${assignedItems.length}/${sourceFile.items.length} mục.`);
  }
  if (new Set(assignedItems.map((item) => item.sourceIndex)).size !== sourceFile.items.length) {
    throw new Error(`${config.label}: có mục nguồn bị thiếu hoặc gán trùng.`);
  }

  const levelDirectory = resolve(OUTPUT_ROOT, config.label.toLowerCase());
  await mkdir(levelDirectory, { recursive: true });
  const lessonManifest = [];
  for (const bucket of buckets) {
    bucket.items.sort((left, right) => left.sourceIndex - right.sourceIndex);
    const fileName = `lesson-${String(bucket.lessonNumber).padStart(2, "0")}.json`;
    const relativeFile = `${config.label.toLowerCase()}/${fileName}`;
    const lessonPayload = {
      schemaVersion: "1.0.0",
      source: sourceFile.source,
      levelId: config.levelId,
      levelLabel: config.label,
      lessonId: bucket.id,
      lessonNumber: bucket.lessonNumber,
      lessonTitle: bucket.title,
      topicId: bucket.topicId,
      topicTitle: bucket.topicTitle,
      route: bucket.route,
      vocabularyCount: bucket.items.length,
      assignmentSummary: {
        exactAnchor: bucket.items.filter((item) => item.assignmentMethod === "exact-anchor").length,
        semanticBalance: bucket.items.filter((item) => item.assignmentMethod === "semantic-balance").length,
      },
      vocabulary: bucket.items,
    };
    await writeFile(resolve(levelDirectory, fileName), `${JSON.stringify(lessonPayload, null, 2)}\n`, "utf8");
    lessonManifest.push({
      id: bucket.id,
      lessonNumber: bucket.lessonNumber,
      title: bucket.title,
      topicId: bucket.topicId,
      topicTitle: bucket.topicTitle,
      route: bucket.route,
      targetCount: bucket.targetCount,
      vocabularyCount: bucket.items.length,
      exactAnchorCount: lessonPayload.assignmentSummary.exactAnchor,
      semanticBalanceCount: lessonPayload.assignmentSummary.semanticBalance,
      file: relativeFile,
    });
  }

  const levelPayload = {
    schemaVersion: "1.0.0",
    source: sourceFile.source,
    levelId: config.levelId,
    levelLabel: config.label,
    vocabularyCount: sourceFile.items.length,
    lessonCount: buckets.length,
    lessons: lessonManifest,
  };
  await writeFile(
    resolve(OUTPUT_ROOT, `${config.label.toLowerCase()}.json`),
    `${JSON.stringify(levelPayload, null, 2)}\n`,
    "utf8",
  );

  manifestLevels.push({
    levelId: config.levelId,
    label: config.label,
    source: sourceFile.source,
    totalVocabulary: sourceFile.items.length,
    exactAnchorCount: assignedItems.filter((item) => item.assignmentMethod === "exact-anchor").length,
    semanticBalanceCount: assignedItems.filter((item) => item.assignmentMethod === "semantic-balance").length,
    lessons: lessonManifest,
  });
}

const manifest = {
  schemaVersion: "1.0.0",
  generatedAt: new Date().toISOString(),
  methodology: {
    exactAnchor: "Từ trùng chữ Hán với nội dung bài hiện có; ưu tiên khớp thêm pinyin.",
    semanticBalance: "Từ mới được chấm điểm theo từ khóa Trung-Việt trong tiêu đề, bài khóa, câu ví dụ và được cân bằng số lượng giữa các bài.",
    reviewRequired: true,
  },
  totals: {
    levels: manifestLevels.length,
    lessons: manifestLevels.reduce((sum, level) => sum + level.lessons.length, 0),
    vocabulary: manifestLevels.reduce((sum, level) => sum + level.totalVocabulary, 0),
    exactAnchor: manifestLevels.reduce((sum, level) => sum + level.exactAnchorCount, 0),
    semanticBalance: manifestLevels.reduce((sum, level) => sum + level.semanticBalanceCount, 0),
  },
  levels: manifestLevels,
};

await writeFile(resolve(OUTPUT_ROOT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const readmeLines = [
  "# Phân bổ từ vựng Tiếng Trung Hero vào các bài HSK",
  "",
  `- Cấp độ: **${manifest.totals.levels}** (HSK1–HSK6).`,
  `- Bài học: **${manifest.totals.lessons}**.`,
  `- Tổng mục từ: **${manifest.totals.vocabulary}**.`,
  `- Gán theo từ neo có sẵn: **${manifest.totals.exactAnchor}**.`,
  `- Phân bổ tự động theo ngữ nghĩa và cân bằng: **${manifest.totals.semanticBalance}**.`,
  "",
  "> Các mục `semantic-balance` là đề xuất tự động, không phải thứ tự bài học chính thức của nguồn và cần được biên tập viên rà soát trước khi đưa lên production.",
  "",
  "## Phương pháp",
  "",
  "1. Nếu chữ Hán đã có trong một bài của khóa hiện tại, mục từ được giữ ở bài đó; khi cần sẽ ưu tiên khớp pinyin.",
  "2. Từ mới được so khớp với tiêu đề, tóm tắt, từ vựng, bài khóa và ví dụ của từng bài.",
  "3. Các mục còn lại được cân bằng để số lượng giữa các bài không chênh lệch lớn.",
  "4. Mỗi mục giữ `sourceIndex`, `assignmentMethod` và `assignmentScore` để truy vết và rà soát.",
  "",
  "## Danh sách bài",
  "",
  "| Cấp | Bài | Chủ đề | Tên bài | Tổng từ | Neo chính xác | Tự động | File |",
  "|---|---:|---|---|---:|---:|---:|---|",
];

for (const level of manifestLevels) {
  for (const lesson of level.lessons) {
    readmeLines.push(
      `| ${level.label} | ${lesson.lessonNumber} | ${markdownCell(lesson.topicTitle)} | ${markdownCell(lesson.title)} | ${lesson.vocabularyCount} | ${lesson.exactAnchorCount} | ${lesson.semanticBalanceCount} | \`${lesson.file}\` |`,
    );
  }
}

await writeFile(resolve(OUTPUT_ROOT, "README.md"), `${readmeLines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ outputRoot: OUTPUT_ROOT, ...manifest.totals }, null, 2));
