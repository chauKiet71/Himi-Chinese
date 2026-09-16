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
});

test("adaptive layouts cover small phones, short landscape screens and reduced motion", async () => {
  const css = await readFile(new URL("app/adaptive-responsive.css", root), "utf8");

  assert.match(css, /@media \(max-width: 359px\)/);
  assert.match(css, /orientation: landscape[\s\S]*max-height: 500px/);
  assert.match(css, /@media \(pointer: coarse\)/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("mobile practice menu keeps both sets of three destinations on one row", async () => {
  const css = await readFile(new URL("app/learner-navigation.css", root), "utf8");

  assert.match(css, /\.learner-app-shell \.mobile-practice-menu\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/s);
  assert.doesNotMatch(css, /\.mobile-practice-menu a:nth-child\(4\)/);
  assert.doesNotMatch(css, /\.mobile-practice-menu a\s*\{[^}]*grid-column:/s);
});

test("phone video learning shows the transcript before attribution and hides duplicate sentence tools", async () => {
  const [css, studio] = await Promise.all([
    readFile(new URL("app/adaptive-responsive.css", root), "utf8"),
    readFile(new URL("components/youtube-learning-studio.tsx", root), "utf8"),
  ]);
  const phoneQuery = "(max-width: 720px), (orientation: landscape) and (max-height: 500px) and (max-width: 980px)";
  const phoneStyles = css.slice(css.indexOf(`@media ${phoneQuery}`));

  assert.match(studio, /showTranscript, setShowTranscript\] = useState\(true\)/);
  assert.match(studio, /aria-expanded=\{showTranscript\}/);
  assert.match(studio, /aria-label="Phát lại câu hiện tại" onClick=\{\(\) => playLine\(activeIndex\)\}/);
  assert.ok(phoneStyles.startsWith(`@media ${phoneQuery}`));
  assert.match(phoneStyles, /\.youtube-study-media-column\s*\{\s*display: contents;/);
  assert.match(phoneStyles, /\.youtube-study-studio \.youtube-study-switches,\s*\.youtube-study-studio \.youtube-shadow-card\s*\{\s*display: none;/);
  assert.match(phoneStyles, /\.youtube-dictation-panel\s*\{\s*order: 2;/);
  assert.match(phoneStyles, /\.youtube-transcript-panel\s*\{\s*order: 3;/);
  assert.match(phoneStyles, /\.youtube-source-row\s*\{\s*order: 4;/);
  assert.match(phoneStyles, /height: clamp\(320px, 60dvh, 480px\)/);
  assert.match(phoneStyles, /\.youtube-transcript-scroll\s*\{\s*min-height: 0;/);
});

test("phone video playback ignores hidden auto-pause and repeat settings after resizing", async () => {
  const studio = await readFile(new URL("components/youtube-learning-studio.tsx", root), "utf8");

  assert.match(studio, /window\.matchMedia\(phoneStudyMediaQuery\)/);
  assert.match(studio, /mediaQuery\.addEventListener\("change", syncPhoneLayout\)/);
  assert.match(studio, /mediaQuery\.removeEventListener\("change", syncPhoneLayout\)/);
  assert.match(studio, /if \(!phoneStudyRef\.current && repeating !== null\)/);
  assert.match(studio, /else if \(!phoneStudyRef\.current && autoPauseRef\.current\)/);
});
