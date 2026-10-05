import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("home dashboard exposes the four core learning paths and useful continuation links", async () => {
  const page = await read("components/review-home-studio.tsx");

  assert.match(page, /Chào mừng bạn đến với <em>Himi Chinese!<\/em>/);
  assert.match(page, /href="\/hsk\/1\/hsk1-bai-01-chao-anh"[\s\S]*Tiếp tục học/);
  assert.match(page, /title: "Luyện viết"[\s\S]*href: "\/writing"/);
  assert.match(page, /title: "Luyện nghe"[\s\S]*href: "\/listening"/);
  assert.match(page, /title: "Luyện gõ"[\s\S]*href: "\/typing"/);
  assert.match(page, /title: "Giáo trình HSK"[\s\S]*href: "\/courses\?view=hsk"/);
  assert.match(page, /Chủ đề phổ biến/);
  assert.match(page, /Bài học gần đây/);
  assert.match(page, /readRecentLearningHistory\(\)\.slice\(0, 3\)/);
  assert.match(page, /RECENT_LEARNING_HISTORY_CHANGED_EVENT/);
  assert.doesNotMatch(page, /const RECENT_LESSONS/);
  assert.doesNotMatch(page, /href="\/practice" prefetch=\{false\}>Xem tất cả/);
  assert.doesNotMatch(page, /home-feature-title[\s\S]*?Xem tất cả[\s\S]*?home-redesign-feature-grid/);
  assert.match(page, /home-topic-title[\s\S]*?href="\/courses\/tieng-trung-tan-suat-cao"[\s\S]*?Xem tất cả/);
  assert.doesNotMatch(page, /home-recent-title[\s\S]*href="\/courses"[\s\S]*home-redesign-recent-list/);
});

test("home dashboard uses the selected Himi study artwork and keeps four features in one desktop row", async () => {
  const page = await read("components/review-home-studio.tsx");
  const css = await read("app/home-portal.css");

  assert.match(page, /\/assets\/mascot\/himi-v2\/himi-wave\.webp/);
  assert.match(page, /\/assets\/home\/features\/feature-himi-writing\.png/);
  assert.match(page, /\/assets\/home\/features\/feature-himi-listening\.png/);
  assert.match(page, /\/assets\/home\/features\/feature-himi-typing\.png/);
  assert.match(page, /\/assets\/home\/features\/feature-himi-hsk\.png/);
  assert.match(page, /\/assets\/home\/himi-recent-reading\.png/);
  assert.match(page, /\/assets\/home\/himi-topics-landscape\.png/);
  assert.match(page, /home-hero-cover-desktop\.png/);
  assert.match(css, /\.home-redesign-cover-image\s*\{[^}]*object-fit:\s*cover/);
  assert.match(css, /\.home-study-feature-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.home-study-topic-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(page, /recentLessonsLoaded && recentLessons\.length === 0[\s\S]*?Bạn chưa học bài nào/);
  assert.match(page, /recentLessons\.map\(\(lesson\) =>[\s\S]*?lesson\.href/);
  assert.match(page, /home-study-progress[\s\S]*?lesson\.progress/);
});

test("home dashboard matches the compact mobile reference and preserves bottom navigation clearance", async () => {
  const page = await read("components/review-home-studio.tsx");
  const css = await read("app/home-portal.css");
  const shell = await read("components/learner-app-shell.tsx");
  const brand = await read("components/brand-logo.tsx");

  assert.match(page, /home-mobile-hero-penguin-cutout\.png/);
  assert.match(page, /home-redesign-mobile-title[\s\S]*Học tiếng Trung thật/);
  assert.doesNotMatch(page, /home-redesign-mobile-nav|href="\/practice"/);
  assert.match(css, /Mobile home composition based on the selected compact app reference/);
  assert.match(css, /padding:\s*0 12px calc\(104px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.home-study-feature-grid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.home-study-topic-grid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.home-study-recent-item\s*\{[\s\S]*?grid-template-columns:\s*40px minmax\(0, 1fr\) 58px 16px/);
  assert.match(css, /#home-feature-title\s*\{[\s\S]*padding-left:\s*18px;[\s\S]*border-left:\s*7px solid #ff5a4e/);
  assert.doesNotMatch(css, /#home-feature-title\s*\{\s*padding-left:\s*0;\s*border-left:\s*0/);
  assert.match(css, /#home-topic-title,\s*#home-recent-title\s*\{[\s\S]*padding-left:\s*18px;[\s\S]*border-left:\s*7px solid #ff5a4e/);
  assert.doesNotMatch(css, /\.learner-app-shell\.is-home-route > \.learner-mobile-nav\s*\{\s*display:\s*none/);
  assert.match(shell, /const mobilePracticeItems = \[learnerRailItems\[1\], \.\.\.learnerPracticeItems, learnerRailItems\[3\]\]/);
  assert.match(shell, /mobile-practice-menu[\s\S]*mobilePracticeItems\.map/);
  assert.match(shell, /<BrandMark priority variant=\{pathname === "\/" \? "face" : "mascot"\} \/>/);
  assert.match(brand, /variant === "face" \? FACE_BRAND_LOGO_SOURCE : BRAND_LOGO_SOURCE/);
  assert.match(brand, /himi-sidebar-logo-transparent\.webp/);
});

test("home welcome offer remains compact on desktop and phone viewports", async () => {
  const css = await read("app/home-portal.css");

  assert.match(css, /\.home-welcome-offer-dialog\s*\{[\s\S]*width:\s*min\(560px, calc\(100vw - 48px\)\);[\s\S]*max-height:\s*calc\(100dvh - 40px\)/);
  assert.match(css, /\.home-welcome-offer-card\s*\{[\s\S]*min-height:\s*0;[\s\S]*padding:\s*32px 30px 24px/);
  assert.match(css, /@media \(max-width: 390px\)[\s\S]*\.home-welcome-offer-hero \{ min-height: 255px; \}/);
});
