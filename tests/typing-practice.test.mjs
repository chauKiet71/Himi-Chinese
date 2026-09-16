import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { getTypingPinyinProgress, isTypingPinyinCorrect, normalizeTypingPinyin } from "../lib/typing-answer.ts";

const root = process.cwd();

test("typing pinyin ignores tones, spaces, punctuation and letter case", () => {
  assert.equal(normalizeTypingPinyin("NǏ  HǍO!"), "nihao");
  assert.equal(normalizeTypingPinyin("lǚ xíng"), "luxing");
  assert.equal(normalizeTypingPinyin("LV XING"), "luxing");
  assert.equal(isTypingPinyinCorrect("ni hao", "Nǐhǎo"), true);
  assert.equal(isTypingPinyinCorrect("qing jin", "qǐng jìn"), true);
  assert.equal(isTypingPinyinCorrect("qing chu", "qǐng jìn"), false);
  assert.equal(isTypingPinyinCorrect("", "nǐ"), false);
});

test("typing progress advances only across the correctly typed pinyin prefix", () => {
  const firstCharacter = getTypingPinyinProgress("z", "zhōumò");
  assert.equal(firstCharacter.hasInput, true);
  assert.equal(firstCharacter.isValidPrefix, true);
  assert.equal(firstCharacter.matched, 1);
  assert.ok(Math.abs(firstCharacter.percent - (100 / 6)) < 1e-12);
  assert.equal(firstCharacter.total, 6);
  assert.equal(getTypingPinyinProgress("ZH O", "zhōumò").matched, 3);
  assert.equal(getTypingPinyinProgress("zhx", "zhōumò").matched, 2);
  assert.equal(getTypingPinyinProgress("zhx", "zhōumò").isValidPrefix, false);
});

test("typing catalog exposes every HSK level and points to deployable lesson audio", async () => {
  const catalog = JSON.parse(await readFile(path.join(root, "content", "typing-practice", "catalog.json"), "utf8"));
  assert.deepEqual(catalog.map((level) => level.id), ["hsk-1", "hsk-2", "hsk-3", "hsk-4", "hsk-5", "hsk-6"]);
  assert.equal(catalog.reduce((total, level) => total + level.lessonCount, 0), 146);

  const firstLessonFile = path.join(root, "public", "content", "typing", "hsk-1", "hsk1-l1.json");
  const firstLesson = JSON.parse(await readFile(firstLessonFile, "utf8"));
  assert.equal(firstLesson.words.length, 20);
  assert.equal(firstLesson.words[0].pinyin, "nǐ");
  assert.equal(firstLesson.words[0].meaning, "bạn; cậu; anh/chị/em");
  for (const audioUrl of Object.values(firstLesson.words[0].audio)) {
    assert.equal(existsSync(path.join(root, "public", audioUrl)), true, `${audioUrl} should exist`);
  }
});

test("every HSK word and phrase item uses the shared adaptive answer flow", async () => {
  const catalog = JSON.parse(await readFile(path.join(root, "content", "typing-practice", "catalog.json"), "utf8"));
  const studio = await readFile(path.join(root, "components", "typing-practice-studio.tsx"), "utf8");
  const stylesheet = await readFile(path.join(root, "app", "typing-practice.css"), "utf8");
  let itemCount = 0;
  let multiCharacterItemCount = 0;

  for (const level of catalog) {
    for (const lesson of level.lessons) {
      const lessonFile = path.join(root, "public", "content", "typing", level.id, `${lesson.id}.json`);
      const payload = JSON.parse(await readFile(lessonFile, "utf8"));
      assert.ok(payload.words.length > 0, `${level.id}/${lesson.id} should expose word practice items`);
      assert.ok(payload.words.every((item) => item.stage === "word"), `${level.id}/${lesson.id} should use the shared word stage`);
      itemCount += payload.words.length;
      multiCharacterItemCount += payload.words.filter((item) => Array.from(item.hanzi).length > 1).length;
    }
  }

  assert.equal(itemCount, 5001);
  assert.equal(multiCharacterItemCount, 4580);
  assert.match(studio, /className="typing-word-answer"/);
  assert.match(stylesheet, /\.typing-word-answer\s*\{[^}]*width:\s*fit-content;/s);
  assert.match(stylesheet, /max-width:\s*min\(360px, 76vw\);/);
});

test("previous resets the destination exercise in the shared HSK practice studio", async () => {
  const studio = await readFile(path.join(root, "components", "typing-practice-studio.tsx"), "utf8");

  assert.match(studio, /function goPrevious\(\)\s*\{/);
  assert.match(studio, /delete nextAnswers\[previousItem\.id\];/);
  assert.match(studio, /setActiveSegment\(0\);/);
  assert.match(studio, /disabled=\{index === 0\} onClick=\{goPrevious\}/);
});

test("advancing plays the normal audio for the next typing item once", async () => {
  const studio = await readFile(path.join(root, "components", "typing-practice-studio.tsx"), "utf8");

  assert.match(studio, /const playNextAudioRef = useRef\(false\)/);
  assert.match(studio, /const shouldAutoplay = mode === "listening" \|\| playNextAudioRef\.current;/);
  assert.match(studio, /playNextAudioRef\.current = false;\s*if \(!shouldAutoplay\) return;/);
  assert.match(studio, /playNextAudioRef\.current = true;\s*moveTo\(index \+ 1\);/);
  assert.match(studio, /void playAudio\(currentItem\.audio\.normal, false\);/);
});

test("mobile typing practice places memory content above navigation", async () => {
  const stylesheet = await readFile(path.join(root, "app", "typing-practice.css"), "utf8");

  assert.match(stylesheet, /@media \(max-width: 720px\)\s*\{[\s\S]*?\.typing-question-card\s*\{\s*order:\s*1;\s*\}[\s\S]*?\.typing-memory-card\s*\{\s*order:\s*2;\s*\}[\s\S]*?\.typing-action-bar\s*\{\s*order:\s*3;\s*\}/);
});

test("mobile typing inputs keep iOS focus at the current zoom level", async () => {
  const stylesheet = await readFile(path.join(root, "app", "typing-practice.css"), "utf8");

  assert.match(stylesheet, /@media \(max-width: 720px\)\s*\{[\s\S]*?\.typing-word-input input\s*\{[^}]*font-size:\s*16px;[^}]*font-size:\s*max\(16px, 1\.12rem\);[^}]*touch-action:\s*manipulation;[^}]*\}/);
  assert.match(stylesheet, /@media \(max-width: 720px\)\s*\{[\s\S]*?\.typing-segment-field input\s*\{[^}]*font-size:\s*16px;[^}]*touch-action:\s*manipulation;[^}]*\}/);
});

test("mobile typing actions remain fixed above scrolling content and the virtual keyboard", async () => {
  const studio = await readFile(path.join(root, "components", "typing-practice-studio.tsx"), "utf8");
  const stylesheet = await readFile(path.join(root, "app", "typing-practice.css"), "utf8");

  assert.match(studio, /const viewport = window\.visualViewport;/);
  assert.match(studio, /window\.innerHeight - viewport\.height - viewport\.offsetTop/);
  assert.match(studio, /--typing-keyboard-offset/);
  assert.match(stylesheet, /@media \(max-width: 720px\)\s*\{[\s\S]*?\.typing-session-page\s*\{[^}]*padding:[^;]*126px[^;]*safe-area-inset-bottom/);
  assert.match(stylesheet, /\.typing-action-bar\s*\{[^}]*position:\s*fixed;[^}]*bottom:[^;]*safe-area-inset-bottom[^;]*--typing-keyboard-offset[^;]*;[^}]*z-index:\s*100;/s);
  assert.match(stylesheet, /\.typing-word-input input,[\s\S]*?\.typing-segment-field input\s*\{[^}]*scroll-margin-bottom:[^;]*safe-area-inset-bottom/);
});

test("revealed typing answers omit the redundant segmented memory box", async () => {
  const studio = await readFile(path.join(root, "components", "typing-practice-studio.tsx"), "utf8");
  const stylesheet = await readFile(path.join(root, "app", "typing-practice.css"), "utf8");

  assert.doesNotMatch(studio, /typing-memory-segments/);
  assert.doesNotMatch(stylesheet, /typing-memory-segments/);
  assert.match(studio, /className="typing-memory-hanzi"/);
  assert.match(studio, /currentItem\.pinyin/);
  assert.match(studio, /currentItem\.meaning/);
});

test("sentence answers reuse the vocabulary answer card and progress treatment", async () => {
  const studio = await readFile(path.join(root, "components", "typing-practice-studio.tsx"), "utf8");
  const stylesheet = await readFile(path.join(root, "app", "typing-practice.css"), "utf8");

  assert.match(studio, /const segmentProgress = getTypingPinyinProgress\(value, segment\.pinyin\);/);
  assert.match(studio, /className="typing-segment-progress"/);
  assert.match(studio, /className="typing-word-answer typing-segment-answer"/);
  assert.match(stylesheet, /\.typing-segment-field input,\s*\.typing-segment-answer\s*\{[^}]*border-radius:\s*13px 13px 0 0;/);
  assert.match(stylesheet, /\.typing-word-answer::after\s*\{[^}]*right:\s*-2px;[^}]*bottom:\s*-2px;[^}]*left:\s*-2px;[^}]*background:\s*#ff4f45;/);
  assert.doesNotMatch(stylesheet, /\.typing-segment-answer::after/);
});

test("desktop typing practice fills the available viewport", async () => {
  const stylesheet = await readFile(path.join(root, "app", "typing-practice.css"), "utf8");

  assert.match(stylesheet, /\.typing-session-page\s*\{[^}]*padding:\s*24px 100px;/s);
  assert.match(stylesheet, /\.typing-studio\s*\{[^}]*width:\s*100%;/s);
  assert.match(stylesheet, /@media \(min-width: 721px\)\s*\{[\s\S]*?\.typing-studio\s*\{[^}]*min-height:\s*calc\(100dvh - 48px\);[^}]*flex-direction:\s*column;[^}]*\}[\s\S]*?\.typing-practice-grid\s*\{[^}]*flex:\s*1;[^}]*grid-template-rows:\s*minmax\(440px, 1fr\) auto;/);
  assert.match(stylesheet, /@media \(min-width: 721px\) and \(max-height: 760px\)\s*\{[\s\S]*?\.typing-session-page\s*\{\s*padding:\s*12px 100px;\s*\}[\s\S]*?\.typing-studio\s*\{\s*min-height:\s*calc\(100dvh - 24px\);\s*\}[\s\S]*?\.typing-practice-grid\s*\{\s*grid-template-rows:\s*minmax\(320px, 1fr\) auto;\s*\}/);
  assert.match(stylesheet, /@media \(max-width: 720px\)\s*\{[\s\S]*?\.typing-session-page\s*\{[^}]*padding:\s*12px 10px calc\(126px \+ env\(safe-area-inset-bottom, 0px\)\);/);
});

test("correct typing celebrates once with shared confetti and a generated chime", async () => {
  const studio = await readFile(path.join(root, "components", "typing-practice-studio.tsx"), "utf8");
  const stylesheet = await readFile(path.join(root, "app", "typing-practice.css"), "utf8");

  assert.match(studio, /function playCorrectChime\(\)/);
  assert.match(studio, /function celebrateCorrect\(itemId: string\)/);
  assert.match(studio, /correct && !currentAnswer\.correct && currentItem/);
  assert.match(studio, /allCorrect && !currentAnswer\.correct/);
  assert.match(studio, /src="\/assets\/quiz\/correct-confetti\.gif"/);
  assert.match(studio, /className="typing-answer-confetti"/);
  assert.match(studio, /CONFETTI_PARTICLE_COUNT = 18/);
  assert.match(studio, /className="typing-answer-confetti-particles"/);
  assert.match(stylesheet, /\.typing-answer-confetti\s*\{[^}]*pointer-events:\s*none;/s);
  assert.match(stylesheet, /@keyframes typing-answer-particle-burst/);
  assert.doesNotMatch(stylesheet, /\.typing-answer-confetti\s*\{\s*display:\s*none;/s);
  assert.match(stylesheet, /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\.typing-answer-confetti\s*\{[^}]*animation-duration:\s*1400ms !important;/s);
  assert.match(stylesheet, /\.typing-answer-confetti-particles i\s*\{[^}]*animation-duration:\s*820ms !important;/s);
});

test("every HSK level uses the shared reference-style lesson card layout", async () => {
  const levelPage = await readFile(path.join(root, "app", "typing", "[level]", "page.tsx"), "utf8");
  const stylesheet = await readFile(path.join(root, "app", "typing-practice.css"), "utf8");

  assert.match(levelPage, /level\.lessons\.map/);
  assert.match(levelPage, /className="typing-lesson-card-topline"/);
  assert.match(levelPage, /lesson\.previewHanzi\.slice\(0, 4\)/);
  assert.match(levelPage, /className="typing-lesson-card-description"/);
  assert.match(levelPage, /lesson\.titleZh !== lesson\.titleVi/);
  assert.match(levelPage, /className="typing-lesson-card-footer"/);
  assert.match(stylesheet, /\.typing-lesson-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,/s);
  assert.match(stylesheet, /\.typing-lesson-card\s*\{[^}]*min-height:\s*350px;/s);
  assert.match(stylesheet, /\.typing-lesson-list-section\s*\{[^}]*padding:\s*0;/s);
});

test("learner practice navigation includes the typing route", async () => {
  const shell = await readFile(path.join(root, "components", "learner-app-shell.tsx"), "utf8");
  assert.match(shell, /href: "\/typing", label: "Luyện gõ"/);
  assert.match(shell, /pathname\.startsWith\("\/typing"\)/);
});

test("typing practice requires login and returns learners to the selected exercise", async () => {
  const practicePage = await readFile(path.join(root, "app", "typing", "[level]", "[lesson]", "practice", "page.tsx"), "utf8");
  const lessonPage = await readFile(path.join(root, "app", "typing", "[level]", "[lesson]", "page.tsx"), "utf8");

  assert.match(practicePage, /await requireLearnerUser\(returnTo\)/);
  assert.match(practicePage, /new URLSearchParams\(\{ stage: initialStage, mode: initialMode \}\)/);
  assert.match(lessonPage, /learnerLoginPath\(wordPracticeHref\)/);
  assert.match(lessonPage, /learnerLoginPath\(sentencePracticeHref\)/);
  assert.match(lessonPage, /Đăng nhập để luyện/);
});
