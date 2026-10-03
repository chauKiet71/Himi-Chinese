import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("HSK 3 and HSK 6 writing badges use the requested red", async () => {
  const [writingStyles, brandStyles] = await Promise.all([
    readFile(new URL("../app/writing-studio.css", import.meta.url), "utf8"),
    readFile(new URL("../app/brand-theme.css", import.meta.url), "utf8"),
  ]);
  const levelRule = /\.writing-topic-card\.is-level-3 \.writing-topic-card-topline > span,\s*\.writing-topic-card\.is-level-6 \.writing-topic-card-topline > span\s*\{([^}]*)\}/g;

  const writingRules = [...writingStyles.matchAll(levelRule)].map((match) => match[1]);
  const brandRules = [...brandStyles.matchAll(levelRule)].map((match) => match[1]);

  assert.equal(writingRules.length, 2);
  assert.equal(brandRules.length, 1);
  for (const rule of [...writingRules, ...brandRules]) {
    assert.match(rule, /background:\s*#FF4C3B;/);
    assert.doesNotMatch(rule, /--himi-orange|#b76f18/);
  }
});
