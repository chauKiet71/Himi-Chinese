import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type TypingAudio = {
  normal?: string;
  slow?: string;
};

type TypingWord = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  partOfSpeech?: string;
  audio?: TypingAudio;
};

type TypingLesson = {
  level: string;
  number: number;
  words: TypingWord[];
  sentences: TypingWord[];
};

type CuratedEntry = Omit<TypingWord, "id"> & {
  sourceId: string;
  key: string;
  levelId: string;
  lessonNumber: number;
};

const projectRoot = process.cwd();
const typingRoot = path.join(projectRoot, "public", "content", "typing");
const outputPath = path.join(projectRoot, "content", "hsk-curated-lexicon.json");
const entries: CuratedEntry[] = [];
const sentenceEntries: CuratedEntry[] = [];

for (let level = 1; level <= 6; level += 1) {
  const levelId = `hsk-${level}`;
  const levelRoot = path.join(typingRoot, levelId);
  const lessonFiles = (await readdir(levelRoot))
    .filter((file) => file.endsWith(".json"))
    .sort((left, right) => left.localeCompare(right, "en"));

  for (const lessonFile of lessonFiles) {
    const lesson = JSON.parse(await readFile(path.join(levelRoot, lessonFile), "utf8")) as TypingLesson;
    const seenHanzi = new Set<string>();
    for (const word of lesson.words) {
      const hanzi = word.hanzi.trim();
      if (!hanzi || seenHanzi.has(hanzi)) continue;
      seenHanzi.add(hanzi);
      entries.push({
        sourceId: word.id,
        key: `${levelId}:${lesson.number}:${hanzi}`,
        levelId,
        lessonNumber: lesson.number,
        hanzi,
        pinyin: word.pinyin.trim(),
        meaning: word.meaning.trim(),
        ...(word.partOfSpeech ? { partOfSpeech: word.partOfSpeech.trim() } : {}),
        ...(word.audio?.normal || word.audio?.slow ? {
          audio: {
            ...(word.audio.normal ? { normal: word.audio.normal } : {}),
            ...(word.audio.slow ? { slow: word.audio.slow } : {}),
          },
        } : {}),
      });
    }

    const seenSentences = new Set<string>();
    for (const sentence of lesson.sentences ?? []) {
      const hanzi = sentence.hanzi.trim();
      if (!hanzi || seenSentences.has(hanzi)) continue;
      seenSentences.add(hanzi);
      sentenceEntries.push({
        sourceId: sentence.id,
        key: `${levelId}:${lesson.number}:${hanzi}`,
        levelId,
        lessonNumber: lesson.number,
        hanzi,
        pinyin: sentence.pinyin.trim(),
        meaning: sentence.meaning.trim(),
        ...(sentence.audio?.normal || sentence.audio?.slow ? {
          audio: {
            ...(sentence.audio.normal ? { normal: sentence.audio.normal } : {}),
            ...(sentence.audio.slow ? { slow: sentence.audio.slow } : {}),
          },
        } : {}),
      });
    }
  }
}

await writeFile(outputPath, `${JSON.stringify({
  schemaVersion: "1.0.0",
  source: "public/content/typing/hsk-1..6",
  entries,
  sentenceEntries,
})}\n`, "utf8");

console.log(`Đã tạo ${entries.length} mục từ và ${sentenceEntries.length} câu HSK chuẩn hóa tại ${outputPath}`);
