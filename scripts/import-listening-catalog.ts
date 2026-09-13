import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

const DEFAULT_SOURCE_ROOT = "D:/Code/HuaMei/HocTrung_Final/16_30th7/pinda-v2-staging-lab/public/listening-app";
const sourceRoot = resolve(process.argv[2] || process.env.LISTENING_CATALOG_SOURCE || DEFAULT_SOURCE_ROOT);
const sourceCatalogPath = resolve(sourceRoot, "data/listening-catalog.json");
const publicRoot = resolve(process.cwd(), "public");
const outputRoot = resolve(publicRoot, "listening-catalog");

if (!outputRoot.startsWith(`${publicRoot}${sep}`)) {
  throw new Error(`Refusing to write outside the public directory: ${outputRoot}`);
}
if (!existsSync(sourceCatalogPath)) {
  throw new Error(`Listening catalog was not found at ${sourceCatalogPath}`);
}

type SourceSentence = {
  id: string;
  order: number;
  speaker?: string;
  zh: string;
  pinyin: string;
  vi: string;
  start: number;
  end: number;
  audio?: string;
};

type SourceExample = {
  order: number;
  zh: string;
  pinyin: string;
  vi: string;
};

type SourceKeyword = {
  id: string;
  order: number;
  zh: string;
  pinyin: string;
  vi: string;
  examples?: SourceExample[];
};

type SourceLesson = {
  id: string;
  track: string;
  title_zh: string;
  title_pinyin?: string;
  title_vi: string;
  speaker?: string;
  roles?: string[];
  title_audio: string;
  main_audio: string;
  main_audio_includes_title?: boolean;
  sentences: SourceSentence[];
  keywords?: SourceKeyword[];
};

type SourceTopic = {
  id: string;
  label_zh: string;
  label_vi: string;
  lessons: SourceLesson[];
};

type SourceLevel = {
  id: string;
  label_zh: string;
  label_vi: string;
  topics: SourceTopic[];
};

type SourceTrack = {
  id: string;
  label_zh: string;
  label_vi: string;
  levels?: SourceLevel[];
  topics?: SourceTopic[];
};

type SourceCatalog = {
  schema_version: string;
  tracks: SourceTrack[];
};

const catalog = JSON.parse(readFileSync(sourceCatalogPath, "utf8")) as SourceCatalog;
if (catalog.schema_version !== "pinda_listening_catalog_v1" || !Array.isArray(catalog.tracks)) {
  throw new Error("Unsupported listening catalog schema.");
}

rmSync(outputRoot, { force: true, recursive: true });
mkdirSync(resolve(outputRoot, "audio"), { recursive: true });
mkdirSync(resolve(outputRoot, "lessons"), { recursive: true });

const copiedAudio = new Set<string>();

function assertSafeId(value: string, label: string) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) throw new Error(`Unsafe ${label}: ${value}`);
}

function importAudio(sourcePath: string): string {
  const normalized = sourcePath.replaceAll("\\", "/");
  const prefix = "audio/catalog/";
  if (!normalized.startsWith(prefix) || !normalized.endsWith(".mp3") || normalized.includes("..")) {
    throw new Error(`Unsafe audio path: ${sourcePath}`);
  }
  const relativeAudioPath = normalized.slice(prefix.length);
  const sourceAudioPath = resolve(sourceRoot, normalized);
  const sourceRelativePath = relative(sourceRoot, sourceAudioPath);
  if (sourceRelativePath.startsWith("..") || isAbsolute(sourceRelativePath) || !existsSync(sourceAudioPath)) {
    throw new Error(`Audio file was not found inside the source directory: ${sourcePath}`);
  }

  if (!copiedAudio.has(relativeAudioPath)) {
    const destinationPath = resolve(outputRoot, "audio", relativeAudioPath);
    const destinationRelativePath = relative(outputRoot, destinationPath);
    if (destinationRelativePath.startsWith("..") || isAbsolute(destinationRelativePath)) {
      throw new Error(`Refusing to copy audio outside the output directory: ${sourcePath}`);
    }
    mkdirSync(dirname(destinationPath), { recursive: true });
    copyFileSync(sourceAudioPath, destinationPath);
    copiedAudio.add(relativeAudioPath);
  }

  return `/listening-catalog/audio/${relativeAudioPath}`;
}

function normalizeLesson(
  lesson: SourceLesson,
  track: SourceTrack,
  group: { id: string; label_zh: string; label_vi: string },
  topic: SourceTopic,
) {
  assertSafeId(lesson.id, "lesson id");
  if (!lesson.sentences?.length) throw new Error(`Lesson ${lesson.id} has no sentences.`);
  const durationSeconds = Math.max(...lesson.sentences.map((sentence) => Number(sentence.end) || 0));
  const detail = {
    id: lesson.id,
    trackId: track.id,
    trackLabel: track.label_vi,
    groupId: group.id,
    groupLabel: group.label_vi,
    topicId: topic.id,
    topicLabel: topic.label_vi,
    titleZh: lesson.title_zh,
    titlePinyin: lesson.title_pinyin ?? "",
    titleVi: lesson.title_vi,
    speaker: lesson.speaker ?? "",
    roles: lesson.roles ?? [],
    durationSeconds,
    titleAudioUrl: importAudio(lesson.title_audio),
    mainAudioUrl: importAudio(lesson.main_audio),
    mainAudioIncludesTitle: Boolean(lesson.main_audio_includes_title),
    sentences: lesson.sentences.map((sentence) => {
      const start = Number(sentence.start);
      const end = Number(sentence.end);
      const hasTiming = Number.isFinite(start) && Number.isFinite(end) && end > start;
      return {
        id: sentence.id,
        order: sentence.order,
        speaker: sentence.speaker ?? lesson.speaker ?? "",
        zh: sentence.zh,
        pinyin: sentence.pinyin,
        vi: sentence.vi,
        start: hasTiming ? start : 0,
        end: hasTiming ? end : 0,
        ...(!hasTiming && sentence.audio ? { audioUrl: importAudio(sentence.audio) } : {}),
      };
    }),
    keywords: (lesson.keywords ?? []).map((keyword) => ({
      id: keyword.id,
      order: keyword.order,
      zh: keyword.zh,
      pinyin: keyword.pinyin,
      vi: keyword.vi,
      examples: (keyword.examples ?? []).map((example) => ({
        order: example.order,
        zh: example.zh,
        pinyin: example.pinyin,
        vi: example.vi,
      })),
    })),
  };

  writeFileSync(
    resolve(outputRoot, "lessons", `${lesson.id}.json`),
    `${JSON.stringify(detail)}\n`,
    "utf8",
  );

  return {
    id: lesson.id,
    titleZh: lesson.title_zh,
    titleVi: lesson.title_vi,
    speaker: lesson.speaker ?? "",
    sentenceCount: lesson.sentences.length,
    keywordCount: lesson.keywords?.length ?? 0,
    durationSeconds,
  };
}

let lessonCount = 0;
let sentenceCount = 0;
let keywordCount = 0;

const tracks = catalog.tracks.map((track) => {
  assertSafeId(track.id, "track id");
  const sourceGroups = track.levels?.length
    ? track.levels
    : [{ id: `${track.id}-all`, label_zh: track.label_zh, label_vi: "Tất cả chủ đề", topics: track.topics ?? [] }];
  const groups = sourceGroups.map((group) => ({
    id: group.id,
    labelZh: group.label_zh,
    labelVi: group.label_vi,
    topics: group.topics.map((topic) => {
      assertSafeId(topic.id, "topic id");
      const lessons = topic.lessons.map((lesson) => {
        lessonCount += 1;
        sentenceCount += lesson.sentences.length;
        keywordCount += lesson.keywords?.length ?? 0;
        return normalizeLesson(lesson, track, group, topic);
      });
      return { id: topic.id, labelZh: topic.label_zh, labelVi: topic.label_vi, lessons };
    }),
  }));
  return {
    id: track.id,
    labelZh: track.label_zh,
    labelVi: track.label_vi,
    lessonCount: groups.flatMap((group) => group.topics).reduce((total, topic) => total + topic.lessons.length, 0),
    groups,
  };
});

const index = {
  schemaVersion: "himi_listening_catalog_v1",
  sourceSchemaVersion: catalog.schema_version,
  stats: { tracks: tracks.length, lessons: lessonCount, sentences: sentenceCount, keywords: keywordCount },
  tracks,
};

writeFileSync(resolve(outputRoot, "index.json"), `${JSON.stringify(index)}\n`, "utf8");
console.log(`Imported ${lessonCount} lessons, ${sentenceCount} sentences and ${copiedAudio.size} audio files into ${outputRoot}.`);
