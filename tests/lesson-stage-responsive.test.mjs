import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/lesson-stage.css", import.meta.url), "utf8");
const responsiveHardeningMarker = "/* Cross-device hardening for the three lesson study modes. */";

function firstRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `Missing rule: ${selector}`);
  return match[1];
}

test("phrase structure wraps complete segments instead of clipping a single row", () => {
  const structure = firstRule(".lesson-phrase-structure");
  const segment = firstRule(".lesson-phrase-structure-part");
  const token = firstRule(".lesson-phrase-structure-part > b");

  assert.match(structure, /flex-wrap:\s*wrap/);
  assert.match(structure, /overflow:\s*visible/);
  assert.doesNotMatch(structure, /overflow-x:\s*auto/);
  assert.match(segment, /display:\s*flex/);
  assert.match(segment, /max-width:\s*100%/);
  assert.match(token, /min-width:\s*0/);
  assert.match(token, /white-space:\s*normal/);
  assert.match(token, /overflow-wrap:\s*anywhere/);
});

test("long vocabulary and phonetic text can shrink beside audio controls", () => {
  const content = firstRule(".lesson-study-content");
  const hanzi = firstRule(".lesson-vocab-hanzi");
  const phoneticText = firstRule(".lesson-vocab-meaning");

  assert.match(content, /min-width:\s*0/);
  assert.match(content, /box-sizing:\s*border-box/);
  assert.match(hanzi, /min-width:\s*0/);
  assert.match(hanzi, /max-width:\s*calc\(100% - 74px\)/);
  assert.match(hanzi, /overflow-wrap:\s*anywhere/);
  assert.match(phoneticText, /max-width:\s*100%/);
  assert.match(phoneticText, /overflow-wrap:\s*anywhere/);
  assert.match(firstRule(".lesson-character-list"), /flex-wrap:\s*wrap/);
});

test("reading decks remove nested frames without limiting long text", () => {
  const unframedSelectors = [
    ".lesson-reading-deck .lesson-phrase-structure-part > b",
    ".lesson-reading-deck .lesson-example-card",
    ".lesson-reading-deck :is(.lesson-disclosure, .lesson-save-button)",
    ".lesson-reading-deck .lesson-character-list span",
  ];
  for (const selector of unframedSelectors) {
    const rule = firstRule(selector);
    assert.match(rule, /border:\s*0/);
    assert.match(rule, /background:\s*transparent/);
  }
  assert.match(firstRule(".lesson-reading-deck :is(.lesson-vocab-hanzi, .lesson-phrase-hanzi)"), /max-width:\s*100%/);
  assert.match(firstRule(".lesson-reading-deck .lesson-vocab-pinyin"), /max-width:\s*min\(70ch, 100%\)/);
  assert.match(firstRule(".lesson-reference-deck .lesson-study-surface"), /border:\s*1px solid/);
  assert.match(firstRule(".lesson-reference-deck .lesson-study-surface"), /border-radius:\s*22px/);
  assert.match(firstRule(".lesson-reference-deck .lesson-audio-bar"), /background:\s*#ff554e/);
});

test("both reading decks keep a single pronunciation action and remove optional disclosures", async () => {
  for (const filename of ["lesson-phrasebook.tsx", "lesson-vocabulary-deck.tsx"]) {
    const source = await readFile(new URL(`../components/${filename}`, import.meta.url), "utf8");
    assert.match(source, /lesson-reading-deck/);
    assert.doesNotMatch(source, /lesson-inline-sound|AudioLines/);
    assert.equal((source.match(/onClick=\{playPronunciation\}/g) ?? []).length, 1);
    assert.doesNotMatch(source, /Xem cách viết|Xem thêm ví dụ|Xem giải thích|className="lesson-disclosure"/);
    assert.match(source, /onClick=\{saveForReview\}/);
    assert.match(source, /lesson-card-edge-nav is-back/);
    assert.match(source, /lesson-card-edge-nav is-next/);
    assert.doesNotMatch(source, /className="lesson-stage-nav"|<span>Tiếp tục<\/span>/);
  }
  const vocabulary = await readFile(new URL("../components/lesson-vocabulary-deck.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(vocabulary, /lesson-word-type|lesson-example-card|>Từ vựng<|>Ví dụ</);
  assert.match(vocabulary, /lesson-audio-speed[\s\S]*onClick=\{saveForReview\}/);
  assert.match(vocabulary, /const nextSaved = !saved/);
  assert.match(vocabulary, /saved: nextSaved/);
  assert.match(vocabulary, /disabled=\{savePending\}/);
  assert.doesNotMatch(vocabulary, /disabled=\{savePending \|\| saved\}/);
  assert.match(vocabulary, /savePending \? " is-toggling" : ""/);
  assert.doesNotMatch(vocabulary, /LoaderCircle|lesson-vocab-spinner/);
});

test("vocabulary save state can be loaded, selected and unselected without changing review scores", async () => {
  const [route, repository] = await Promise.all([
    readFile(new URL("../app/api/progress/review/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/progress-repository.ts", import.meta.url), "utf8"),
  ]);
  assert.match(route, /export async function GET/);
  assert.match(route, /setVocabularySaved/);
  assert.match(route, /updatesSavedState \? data\.saved : true/);
  assert.match(repository, /export async function setVocabularySaved/);
  assert.match(repository, /set: \{ isSaved: saved \}/);
  assert.match(repository, /export async function getSavedVocabularySlugs/);
});

test("listening and speaking shows pinyin by default and completes on the tenth target", async () => {
  const source = await readFile(new URL("../components/lesson-pronunciation-coach.tsx", import.meta.url), "utf8");
  assert.match(source, /PRACTICE_TARGET_LIMIT = 10/);
  assert.match(source, /<small className="pronunciation-pinyin">\{current\.pinyin\}<\/small>/);
  assert.doesNotMatch(source, /showPinyin|Hiện pinyin|Ẩn pinyin|lesson-pinyin-toggle/);
  assert.match(source, /aria-label="Câu trước" className="lesson-card-edge-nav is-back"/);
  assert.match(source, /className="lesson-card-edge-nav is-next" disabled=\{atEnd\}/);
  assert.doesNotMatch(source, /pronunciation-target-list|pronunciation-target-dot|String\(targetIndex \+ 1\)\.padStart|<span>Tiếp tục<\/span>|aria-label="Điều hướng câu luyện nói"/);
  assert.match(source, /atEnd \? <div className="lesson-pronunciation-completion">/);
  assert.match(source, /onClick=\{onFinished\}/);
});

test("the three study modes cover narrow phones, landscape phones, tablets and short laptops", () => {
  const sharedCardIndex = css.indexOf("/* Shared reference-card treatment for vocabulary, phrases, listening and speaking. */");
  const hardeningIndex = css.indexOf(responsiveHardeningMarker);
  assert.ok(sharedCardIndex >= 0 && hardeningIndex > sharedCardIndex, "Responsive overrides must follow the shared card styles");
  const responsive = css.slice(hardeningIndex);

  assert.match(responsive, /@media \(min-width: 641px\) and \(max-width: 980px\)/);
  assert.match(responsive, /@media \(min-width: 981px\) and \(max-height: 800px\)/);
  assert.match(responsive, /@media \(max-width: 640px\)/);
  assert.match(responsive, /@media \(max-width: 360px\)/);
  assert.match(responsive, /@media \(max-width: 980px\) and \(max-height: 500px\) and \(orientation: landscape\)/);
  assert.match(responsive, /@media \(pointer: coarse\)/);

  assert.match(responsive, /\.lesson-stage-workspace \.lesson-tabs[\s\S]*overflow-x:\s*auto/);
  assert.match(responsive, /\.lesson-reference-deck \.lesson-study-panel[\s\S]*min-height:\s*0/);
  assert.match(responsive, /\.lesson-reference-deck \.lesson-audio-actions[\s\S]*flex-wrap:\s*wrap/);
  assert.match(responsive, /\.lesson-reference-deck \.lesson-audio-bar[\s\S]*flex:\s*1 0 100%/);
  assert.match(responsive, /\.lesson-reference-deck \.lesson-coach-rail[\s\S]*display:\s*none/);
  assert.match(responsive, /\.lesson-card-edge-nav,[\s\S]*min-width:\s*44px[\s\S]*min-height:\s*44px/);
  assert.match(responsive, /word-break:\s*break-word/);
});
