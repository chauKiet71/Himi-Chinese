import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  catalogGroupForHskLevel,
  formatListeningDuration,
  isListeningCatalogIndex,
  isListeningCatalogLesson,
  listeningSentenceAtTime,
} from "../lib/listening-catalog.ts";

const publicRoot = resolve(process.cwd(), "public");
const catalogRoot = resolve(publicRoot, "listening-catalog");
const index = JSON.parse(readFileSync(resolve(catalogRoot, "index.json"), "utf8"));
const studioSource = readFileSync(resolve(process.cwd(), "components/listening-catalog-studio.tsx"), "utf8");

test("active sentence advances from the penultimate line to the final line and survives seeking into the audio tail", () => {
  const lesson = JSON.parse(readFileSync(resolve(catalogRoot, "lessons/dialogue-beginner-topic-chat-with-chinese-001-daily-001.json"), "utf8"));
  const penultimate = lesson.sentences.at(-2);
  const last = lesson.sentences.at(-1);
  assert.equal(listeningSentenceAtTime(lesson.sentences, penultimate.start).id, penultimate.id);
  assert.equal(listeningSentenceAtTime(lesson.sentences, last.start - 0.001).id, penultimate.id);
  assert.equal(listeningSentenceAtTime(lesson.sentences, last.start).id, last.id);
  assert.equal(listeningSentenceAtTime(lesson.sentences, last.end + 1).id, last.id);
  assert.equal(listeningSentenceAtTime(lesson.sentences, penultimate.start + 1).id, penultimate.id);
  assert.equal(listeningSentenceAtTime([], 0), undefined);
});

test("imported listening catalog exposes every dialogue and monologue lesson", () => {
  assert.equal(isListeningCatalogIndex(index), true);
  assert.deepEqual(index.stats, { tracks: 2, lessons: 174, sentences: 2875, keywords: 2725 });
  assert.equal(index.tracks.find((track) => track.id === "dialogue")?.lessonCount, 149);
  assert.equal(index.tracks.find((track) => track.id === "monologue")?.lessonCount, 25);
});

test("every catalog lesson has a valid detail file and playable imported audio", () => {
  const summaries = index.tracks.flatMap((track) => track.groups.flatMap((group) => group.topics.flatMap((topic) => topic.lessons)));
  assert.equal(summaries.length, 174);
  assert.equal(new Set(summaries.map((lesson) => lesson.id)).size, summaries.length);

  for (const summary of summaries) {
    const detailPath = resolve(catalogRoot, "lessons", `${summary.id}.json`);
    assert.equal(existsSync(detailPath), true, detailPath);
    const detail = JSON.parse(readFileSync(detailPath, "utf8"));
    assert.equal(isListeningCatalogLesson(detail), true, summary.id);
    assert.equal(detail.sentences.length, summary.sentenceCount);
    assert.equal(detail.keywords.length, summary.keywordCount);
    assert.ok(detail.sentences.every((sentence) => sentence.end > sentence.start || sentence.audioUrl), summary.id);

    for (const url of [detail.mainAudioUrl, detail.titleAudioUrl]) {
      assert.match(url, /^\/listening-catalog\/audio\/.+\.mp3$/);
      assert.equal(existsSync(resolve(publicRoot, url.slice(1))), true, url);
    }
    for (const sentence of detail.sentences.filter((item) => item.audioUrl)) {
      assert.equal(existsSync(resolve(publicRoot, sentence.audioUrl.slice(1))), true, sentence.audioUrl);
    }
  }
});

test("HSK deep links map to the closest listening catalog group", () => {
  assert.equal(catalogGroupForHskLevel("hsk-1"), "beginner");
  assert.equal(catalogGroupForHskLevel("hsk-4"), "intermediate");
  assert.equal(catalogGroupForHskLevel("hsk-6"), "advanced");
  assert.equal(catalogGroupForHskLevel("unknown"), undefined);
  assert.equal(formatListeningDuration(95), "1:35");
});

test("mobile transcript visibility controls use explicit state buttons", () => {
  const mobileControls = studioSource.match(/<div className="listening-focus-display-options"[\s\S]*?<\/div>/)?.[0] ?? "";
  assert.match(mobileControls, /aria-pressed=\{showTranslation\}[\s\S]*setShowTranslation\(\(value\) => !value\)/);
  assert.match(mobileControls, /aria-pressed=\{showChinese\}[\s\S]*setShowChinese\(\(value\) => !value\)/);
  assert.match(mobileControls, /aria-pressed=\{showPinyin\}[\s\S]*setShowPinyin\(\(value\) => !value\)/);
  assert.doesNotMatch(mobileControls, /type="checkbox"/);
});
