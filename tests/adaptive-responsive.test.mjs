import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the final adaptive stylesheet is loaded after page-specific responsive layers", async () => {
  const layout = await readFile(new URL("app/layout.tsx", root), "utf8");
  const journeyIndex = layout.indexOf('import "./learning-journey-responsive.css"');
  const adaptiveIndex = layout.indexOf('import "./adaptive-responsive.css"');

  assert.ok(journeyIndex >= 0);
  assert.ok(adaptiveIndex > journeyIndex);
});

test("learner routes respond to usable laptop width and keep phone controls accessible", async () => {
  const css = await readFile(new URL("app/adaptive-responsive.css", root), "utf8");

  assert.match(css, /@container learner-content \(max-width: 1020px\)/);
  assert.match(css, /@container learner-content \(max-width: 860px\)/);
  assert.match(css, /\.youtube-study-studio[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /\.himi-writing-workspace[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /:where\(input, select, textarea\)[\s\S]*font-size: 16px/);
  assert.match(css, /\.youtube-study-toolstrip button[\s\S]*min-height: 52px/);
  assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
});

test("adaptive layouts cover small phones, short landscape screens and reduced motion", async () => {
  const css = await readFile(new URL("app/adaptive-responsive.css", root), "utf8");

  assert.match(css, /@media \(max-width: 359px\)/);
  assert.match(css, /orientation: landscape[\s\S]*max-height: 500px/);
  assert.match(css, /@media \(pointer: coarse\)/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
