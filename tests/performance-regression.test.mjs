import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("learner navigation prefetches on intent without warming every route and HSK dataset", async () => {
  const [shell, provider] = await Promise.all([
    read("components/learner-app-shell.tsx"),
    read("components/learning-data-provider.tsx"),
  ]);

  assert.doesNotMatch(shell, /warmPrimaryRoutes|learnerPrefetchItems/);
  assert.match(shell, /prefetchedHrefsRef\.current\.has\(href\)/);
  assert.match(shell, /onPointerOverCapture=\{prepareContentNavigation\}/);
  assert.match(shell, /onTouchStartCapture=\{prepareContentNavigation\}/);
  assert.doesNotMatch(provider, /Array\.from\(\{ length: 6 \}/);
  assert.match(provider, /pathname === "\/games"/);
});

test("course catalog keeps textbook JSON out of its client card", async () => {
  const card = await read("components/hsk-course-card.tsx");
  assert.doesNotMatch(card, /HSK_CURRICULUM|from\s+["'][^"']*hsk-curriculum[^"']*["']/);
  assert.match(card, /lessonCount/);
  assert.match(card, /levelCount/);
});

test("large route stylesheets are emitted as route resources", async () => {
  const [rootLayout, listeningLayout, hskLayout] = await Promise.all([
    read("app/layout.tsx"),
    read("app/listening/layout.tsx"),
    read("app/hsk/layout.tsx"),
  ]);

  assert.doesNotMatch(rootLayout, /listening-studio|hsk-lesson\.css|account-wallet/);
  assert.match(listeningLayout, /listening-studio\.css\?url/);
  assert.match(hskLayout, /hsk-lesson\.css\?url/);
});

test("optimized course and animated mascot assets are substantially smaller", async () => {
  const pairs = [
    ["public/assets/courses/himi-concepts/himi-hsk-curriculum-v2.png", "public/assets/courses/himi-concepts/himi-hsk-curriculum-v2.webp"],
    ["public/assets/mascot/himi-v2/himi-wave.gif", "public/assets/mascot/himi-v2/himi-wave-animated.webp"],
    ["public/assets/brand/himi-sidebar-logo-transparent.png", "public/assets/brand/himi-sidebar-logo-transparent.webp"],
  ];

  for (const [original, optimized] of pairs) {
    const [originalSize, optimizedSize] = await Promise.all([
      stat(new URL(original, root)),
      stat(new URL(optimized, root)),
    ]);
    assert.ok(optimizedSize.size < originalSize.size * 0.35, `${optimized} should be at least 65% smaller`);
  }
});
