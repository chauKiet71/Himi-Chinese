import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/lesson-stage.css", import.meta.url), "utf8");

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
    ".lesson-reading-deck .lesson-study-surface",
    ".lesson-reading-deck .lesson-phrase-structure-part > b",
    ".lesson-reading-deck .lesson-example-card",
    ".lesson-reading-deck :is(.lesson-disclosure, .lesson-save-button)",
    ".lesson-reading-deck .lesson-character-list span",
    ".lesson-reading-deck .lesson-audio-bar",
  ];
  for (const selector of unframedSelectors) {
    const rule = firstRule(selector);
    assert.match(rule, /border:\s*0/);
    assert.match(rule, /background:\s*transparent/);
  }
  assert.match(firstRule(".lesson-reading-deck :is(.lesson-vocab-hanzi, .lesson-phrase-hanzi)"), /max-width:\s*100%/);
  assert.match(firstRule(".lesson-reading-deck .lesson-vocab-pinyin"), /max-width:\s*min\(70ch, 100%\)/);
  assert.match(firstRule(".lesson-reading-deck .lesson-disclosure > summary"), /min-height:\s*44px/);
});

test("both reading decks keep a single pronunciation action and study tools", async () => {
  for (const filename of ["lesson-phrasebook.tsx", "lesson-vocabulary-deck.tsx"]) {
    const source = await readFile(new URL(`../components/${filename}`, import.meta.url), "utf8");
    assert.match(source, /lesson-reading-deck/);
    assert.doesNotMatch(source, /lesson-inline-sound|AudioLines/);
    assert.equal((source.match(/onClick=\{playPronunciation\}/g) ?? []).length, 1);
    assert.match(source, /className="lesson-disclosure"/);
    assert.match(source, /onClick=\{saveForReview\}/);
  }
});
