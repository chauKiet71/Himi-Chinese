import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import path from "node:path";
import { getCourse } from "../lib/course-data.ts";
import { officeLessons, officeModules } from "../lib/office-course-seed.ts";
import { buildCourseRoadmap } from "../lib/course-roadmap.ts";

test("course card chevron remains visually static on hover", async () => {
  const css = (await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/brand-theme.css", import.meta.url), "utf8"),
    readFile(new URL("../app/motion.css", import.meta.url), "utf8"),
  ])).join("\n");

  assert.doesNotMatch(css, /\.icon-link:hover/);
  assert.doesNotMatch(css, /:is\(:hover,\s*:focus-visible\)\s+\.icon-link/);
  const iconLinkRule = css.match(/\.icon-link\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(iconLinkRule, /color:\s*#FF4C3B;/);
  assert.doesNotMatch(iconLinkRule, /(?:width|height|border|border-radius|background)\s*:/);
  assert.doesNotMatch(css, /:focus-visible\s+\.icon-link\s*\{[^}]*(?:border|background|color)\s*:/);
  assert.match(css, /:focus-visible\s+\.icon-link/);
});

test("an available course opens an overview that leads to the learner's next lesson", async (t) => {
  const server = await createServer({
    appType: "custom",
    cacheDir: "tmp/vite-course-roadmap-test",
    configFile: false,
    resolve: {
      alias: [
        { find: "next/image", replacement: path.resolve("tests/fixtures/next-image.tsx") },
        { find: "server-only", replacement: path.resolve("tests/fixtures/server-only.ts") },
        { find: "@", replacement: process.cwd() },
      ],
    },
    root: process.cwd(),
    server: { hmr: false, middlewareMode: true },
  });
  t.after(() => server.close());

  const { CourseCard } = await server.ssrLoadModule("/components/course-card.tsx");
  const course = getCourse("van-phong-hanh-chinh");
  assert.ok(course);
  const html = renderToStaticMarkup(React.createElement(CourseCard, { course }));

  assert.match(html, /href="\/courses\/van-phong-hanh-chinh"/);
  assert.match(html, /lucide-chevrons-right/);
  assert.doesNotMatch(html, /href="\/learn\/van-phong-hanh-chinh"/);

  const lockedCardHtml = renderToStaticMarkup(React.createElement(CourseCard, {
    course: { ...course, access: { allowed: false } },
  }));
  assert.match(lockedCardHtml, /course-card-trigger is-vip-locked/);
  assert.match(lockedCardHtml, /Bài học này chỉ có ở [\s\S]*Himi VIP/);
  assert.match(lockedCardHtml, /Nâng cấp ngay/);
  assert.doesNotMatch(lockedCardHtml, /href="\/courses\/van-phong-hanh-chinh"/);

  const guestLockedCardHtml = renderToStaticMarkup(React.createElement(CourseCard, {
    authenticated: false,
    course: { ...course, access: { allowed: false } },
  }));
  assert.match(guestLockedCardHtml, /Đăng nhập để mở khóa/);
  assert.match(guestLockedCardHtml, /href="\/login\?returnTo=%2Fcourses"/);
  assert.match(guestLockedCardHtml, /href="\/register\?returnTo=%2Fcourses"/);
  assert.match(guestLockedCardHtml, /Xem quyền lợi VIP/);
  assert.doesNotMatch(guestLockedCardHtml, /Nâng cấp ngay/);

  const viewModule = await server.ssrLoadModule("/components/course-roadmap.tsx").catch(() => null);
  assert.ok(viewModule, "the roadmap overview should be renderable");
  const roadmap = buildCourseRoadmap({
    courseSlug: course.slug,
    lessons: officeLessons.map((lesson, order) => ({
      ...lesson,
      order,
      moduleTitle: officeModules.find((module) => module.slug === lesson.moduleSlug)?.title ?? "",
      moduleOrder: officeModules.findIndex((module) => module.slug === lesson.moduleSlug),
    })),
    completedLessonSlugs: officeLessons.slice(0, 8).map((lesson) => lesson.slug),
    viewerHasVip: true,
  });
  const overviewHtml = renderToStaticMarkup(React.createElement(viewModule.CourseRoadmap, {
    authenticated: true,
    course,
    roadmap,
  }));

  assert.match(overviewHtml, /aria-label="Chi tiết lộ trình Văn phòng &amp; hành chính"/);
  assert.match(overviewHtml, /href="\/courses"[^>]*>[\s\S]*course-roadmap-back-action[\s\S]*lucide-arrow-left[\s\S]*Về trang Lộ trình[\s\S]*course-roadmap-back-context[\s\S]*Văn phòng &amp; Hành chính/);
  assert.match(overviewHtml, /<h1 class="sr-only">Lộ trình Văn phòng &amp; hành chính<\/h1>/);
  assert.doesNotMatch(overviewHtml, /course-roadmap-switch|Đổi lộ trình/);
  assert.doesNotMatch(overviewHtml, /course-roadmap-progress-row/);
  assert.match(overviewHtml, />Tổng quan lộ trình</);
  assert.match(overviewHtml, />8 \/ 30 bài</);
  assert.match(overviewHtml, />1 \/ 5 chặng</);
  assert.match(overviewHtml, /Bạn có thể chọn bất kỳ bài học đang mở/);
  assert.match(overviewHtml, /href="\/learn\/van-phong-hanh-chinh\?lesson=xu-ly-thay-doi-uu-tien"/);
  assert.match(overviewHtml, new RegExp(`href="/learn/van-phong-hanh-chinh\\?lesson=${officeLessons[29].slug}"`));
  assert.match(overviewHtml, /Mở bài/);
  assert.match(overviewHtml, /Đã hoàn thành/);
  assert.doesNotMatch(overviewHtml, />Bắt đầu bài học|>Tiếp tục học|>Học lại</);

  const continuedRoadmap = buildCourseRoadmap({
    courseSlug: course.slug,
    lessons: officeLessons.map((lesson, order) => ({
      ...lesson,
      order,
      moduleTitle: officeModules.find((module) => module.slug === lesson.moduleSlug)?.title ?? "",
      moduleOrder: officeModules.findIndex((module) => module.slug === lesson.moduleSlug),
    })),
    completedLessonSlugs: officeLessons.slice(0, 8).map((lesson) => lesson.slug),
    openedLessonSlugs: [officeLessons[8].slug],
    lessonProgressBySlug: { [officeLessons[8].slug]: 4 },
    viewerHasVip: true,
  });
  const continuedHtml = renderToStaticMarkup(React.createElement(viewModule.CourseRoadmap, { authenticated: true, course, roadmap: continuedRoadmap }));
  assert.match(continuedHtml, /class="roadmap-circular-progress"/);
  assert.match(continuedHtml, /aria-label="4% đã học"/);
  assert.match(continuedHtml, />4%<\/strong>/);

  const justOpenedRoadmap = buildCourseRoadmap({
    courseSlug: course.slug,
    lessons: officeLessons.map((lesson, order) => ({
      ...lesson,
      order,
      moduleTitle: officeModules.find((module) => module.slug === lesson.moduleSlug)?.title ?? "",
      moduleOrder: officeModules.findIndex((module) => module.slug === lesson.moduleSlug),
    })),
    completedLessonSlugs: [],
    openedLessonSlugs: [officeLessons[0].slug],
    viewerHasVip: true,
  });
  const justOpenedHtml = renderToStaticMarkup(React.createElement(viewModule.CourseRoadmap, { authenticated: true, course, roadmap: justOpenedRoadmap }));
  const justOpenedRow = justOpenedHtml.match(/<a[^>]*href="\/learn\/van-phong-hanh-chinh\?lesson=chao-hoi-tai-noi-lam-viec"[\s\S]*?<\/a>/)?.[0] ?? "";
  assert.match(justOpenedRow, /class="roadmap-circular-progress"/);
  assert.match(justOpenedRow, /aria-label="0% đã học"/);
  assert.match(justOpenedRow, />0%<\/strong>/);
  assert.doesNotMatch(justOpenedRow, /Mở bài/);
  assert.match(justOpenedRow, /^<a /);

  const vipRoadmap = buildCourseRoadmap({
    courseSlug: course.slug,
    lessons: officeLessons.map((lesson, order) => ({
      ...lesson,
      order,
      moduleTitle: officeModules.find((module) => module.slug === lesson.moduleSlug)?.title ?? "",
      moduleOrder: officeModules.findIndex((module) => module.slug === lesson.moduleSlug),
    })),
    completedLessonSlugs: officeLessons.slice(0, 6).map((lesson) => lesson.slug),
    viewerHasVip: false,
  });
  const vipOverviewHtml = renderToStaticMarkup(React.createElement(viewModule.CourseRoadmap, {
    authenticated: true,
    course,
    roadmap: vipRoadmap,
  }));
  assert.match(vipOverviewHtml, /roadmap-stage is-locked is-vip-locked/);
  assert.match(vipOverviewHtml, /aria-label="Bài học VIP"/);
  assert.match(vipOverviewHtml, /Bài học này chỉ có ở [\s\S]*Himi VIP/);
  assert.match(vipOverviewHtml, /href="\/vip"/);

  const routeModule = await server.ssrLoadModule("/app/courses/[slug]/page.tsx").catch(() => null);
  assert.ok(routeModule, "the dynamic course roadmap route should be available");
  const staticParams = await routeModule.generateStaticParams();
  assert.equal(staticParams.length, 8);
  assert.ok(staticParams.some((params) => params.slug === "van-phong-hanh-chinh"));
});

test("roadmap progress ring is thirty percent smaller", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.roadmap-circular-progress \{[^}]*width: 34px;[^}]*height: 34px;/);
  assert.match(css, /\.roadmap-circular-progress::after \{[^}]*inset: 3px;/);
  assert.match(css, /\.roadmap-circular-progress > strong \{[^}]*font-size: 9px;/);
});

test("industry roadmap stages use the neutral HSK lesson tone", async () => {
  const [css, globals] = await Promise.all([
    readFile(new URL("../app/brand-theme.css", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(css, /\.roadmap-stage\.is-active \.roadmap-stage-card\s*\{[^}]*border-color:\s*var\(--himi-line\);[^}]*background:\s*var\(--himi-white\);[^}]*box-shadow:\s*none;/);
  assert.match(css, /\.roadmap-stage\.is-available \.roadmap-stage-card\s*\{[^}]*border-color:\s*var\(--himi-line\);[^}]*background:\s*var\(--himi-white\);/);
  assert.match(css, /\.roadmap-stage-status\.is-active\s*\{[^}]*color:\s*var\(--himi-muted\);[^}]*border-color:\s*var\(--himi-line\);[^}]*background:\s*var\(--himi-white\);/);
  assert.match(css, /\.roadmap-stage-status\.is-available\s*\{[^}]*color:\s*var\(--himi-muted\);[^}]*border-color:\s*var\(--himi-line\);[^}]*background:\s*var\(--himi-white\);/);
  assert.match(css, /\.course-roadmap-stages \.roadmap-lesson-row\.is-in-progress\s*\{[^}]*background:\s*var\(--himi-white\);/);
  assert.match(css, /\.course-roadmap-stages \.roadmap-lesson-row\.is-completed\s*\{[^}]*background:\s*var\(--himi-white\);/);
  assert.match(css, /\.course-roadmap-stages \.roadmap-lesson-list\s*\{[^}]*border-color:\s*var\(--himi-line\);/);
  assert.match(css, /\.course-roadmap-stages \.roadmap-stage-expand\s*\{\s*color:\s*var\(--himi-red\);\s*\}/);
  assert.match(globals, /\.course-roadmap-back:hover \.course-roadmap-back-action,[\s\S]*\.course-roadmap-back:focus-visible \.course-roadmap-back-action\s*\{\s*color:\s*#ff4c3b;/);
  assert.match(globals, /\.course-roadmap-back-context, \.course-roadmap-back-separator\s*\{\s*color:\s*#3f4b50;/);
});
