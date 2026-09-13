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

test("game catalog defers the GSAP-powered slice engine until the learner starts it", async () => {
  const center = await read("components/game-center.tsx");
  assert.doesNotMatch(center, /from ["'](?:@gsap\/react|gsap|gsap\/MotionPathPlugin)["']/);
  assert.doesNotMatch(center, /import \{ WritingSliceGame \}/);
  assert.match(center, /lazy\(\(\) => import\("@\/components\/writing-slice-game"\)/);
  assert.match(center, /traveler\.animate\(/);
  assert.match(center, /<Suspense fallback=\{<GameRuntimeLoading \/>\}>/);
});

test("media catalogs limit eager assets and automatic route prefetching", async () => {
  const [courses, videos] = await Promise.all([
    read("components/course-explorer.tsx"),
    read("components/video-library.tsx"),
  ]);
  assert.match(courses, /index < \(showHskCard \? 2 : 3\)/);
  assert.match(videos, /priority=\{index < 3\}/);
  assert.ok((videos.match(/prefetch=\{false\}/g) ?? []).length >= 3);
});

test("common catalog motion uses CSS instead of shipping a runtime animation library", async () => {
  const [home, courses, practice, homeStyles, bannerStyles] = await Promise.all([
    read("components/review-home-studio.tsx"),
    read("components/course-explorer.tsx"),
    read("components/practice-board.tsx"),
    read("app/home-portal.css"),
    read("app/himi-section-banner.css"),
  ]);

  for (const component of [home, courses, practice]) {
    assert.doesNotMatch(component, /motion\/react|AnimatePresence|<motion\./);
  }
  assert.match(homeStyles, /home-portal-scene-drift/);
  assert.match(homeStyles, /max-width: 720px[\s\S]*himi-wave\.webp/);
  assert.match(bannerStyles, /max-width: 720px[\s\S]*himi-video\.webp/);
});

test("chatbot code and styles wait for browser idle time", async () => {
  const [layout, deferred] = await Promise.all([
    read("app/layout.tsx"),
    read("components/deferred-himi-chatbot.tsx"),
  ]);
  assert.doesNotMatch(layout, /chatbot-widget\.css/);
  assert.match(deferred, /chatbot-widget\.css\?url/);
  assert.match(deferred, /requestIdleCallback/);
  assert.match(deferred, /if \(!ready\) return null/);
});

test("VIP plan catalog is cached while viewer-specific payment state stays fresh", async () => {
  const [service, actions] = await Promise.all([
    read("lib/vip-activation-request-service.ts"),
    read("app/admin/actions.ts"),
  ]);

  assert.match(service, /getCachedActiveVipPlans = unstable_cache/);
  assert.match(service, /tags: \["vip-plans"\]/);
  assert.match(service, /readDb\(async \(db\) => \{[\s\S]*pendingRows[\s\S]*getActiveVipSubscription\(userId, db\)/);
  assert.match(actions, /updateTag\("vip-plans"\)/);
});

test("public content access policy reads are cached and admin changes invalidate them immediately", async () => {
  const [repository, actions] = await Promise.all([
    read("lib/content-access-repository.ts"),
    read("app/admin/actions.ts"),
  ]);

  assert.match(repository, /getCachedContentAccessPolicyRows = unstable_cache/);
  assert.match(repository, /tags: \["content-access-policies"\]/);
  assert.match(repository, /database \? await query\(database\) : await getCachedContentAccessPolicyRows\(\)/);
  assert.match(actions, /updateTag\("content-access-policies"\)/);
});
