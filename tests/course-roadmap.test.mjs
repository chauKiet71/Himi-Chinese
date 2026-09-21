import test from "node:test";
import assert from "node:assert/strict";
import { coreWorkplaceModules } from "../lib/core-workplace-course-seed.ts";
import { ecommerceModules } from "../lib/ecommerce-course-seed.ts";
import { factoryModules } from "../lib/factory-course-seed.ts";
import { highFrequencyModules } from "../lib/high-frequency-course-seed.ts";
import { logisticsModules } from "../lib/logistics-course-seed.ts";
import { officeLessons, officeModules } from "../lib/office-course-seed.ts";
import { restaurantModules } from "../lib/restaurant-course-seed.ts";
import { salesModules } from "../lib/sales-course-seed.ts";

test("course roadmap groups 30 lessons into five stages and identifies the next lesson", async () => {
  const roadmapModule = await import("../lib/course-roadmap.ts").catch(() => null);
  assert.ok(roadmapModule, "the course roadmap builder should be available");

  const completedLessonSlugs = officeLessons.slice(0, 8).map((lesson) => lesson.slug);
  const roadmap = roadmapModule.buildCourseRoadmap({
    courseSlug: "van-phong-hanh-chinh",
    lessons: officeLessons.map((lesson, order) => ({
      ...lesson,
      order,
      moduleTitle: officeModules.find((module) => module.slug === lesson.moduleSlug)?.title ?? "",
      moduleOrder: officeModules.findIndex((module) => module.slug === lesson.moduleSlug),
    })),
    completedLessonSlugs,
    viewerHasVip: true,
  });

  assert.equal(roadmap.modules.length, 5);
  assert.deepEqual(roadmap.modules.map((module) => module.lessons.length), [6, 6, 6, 6, 6]);
  assert.equal(roadmap.completedLessons, 8);
  assert.equal(roadmap.completedModules, 1);
  assert.equal(roadmap.progressPercent, 27);
  assert.equal(roadmap.modules[0].status, "completed");
  assert.equal(roadmap.modules[1].status, "active");
  assert.equal(roadmap.modules[1].lessons[2].status, "current");
  assert.equal(roadmap.modules[1].lessons[2].slug, officeLessons[8].slug);
  assert.equal(roadmap.modules[2].status, "locked");
  assert.equal(roadmap.remainingLessonsInActiveModule, 4);
});

test("course roadmap stops at the first VIP lesson when the viewer has no entitlement", async () => {
  const roadmapModule = await import("../lib/course-roadmap.ts").catch(() => null);
  assert.ok(roadmapModule, "the course roadmap builder should be available");

  const roadmap = roadmapModule.buildCourseRoadmap({
    courseSlug: "van-phong-hanh-chinh",
    lessons: officeLessons.map((lesson, order) => ({
      ...lesson,
      order,
      moduleTitle: officeModules.find((module) => module.slug === lesson.moduleSlug)?.title ?? "",
      moduleOrder: officeModules.findIndex((module) => module.slug === lesson.moduleSlug),
    })),
    completedLessonSlugs: officeLessons.slice(0, 6).map((lesson) => lesson.slug),
    viewerHasVip: false,
  });

  assert.equal(roadmap.modules[0].status, "completed");
  assert.equal(roadmap.modules[1].status, "active");
  assert.equal(roadmap.modules[1].lessons[0].status, "vip_locked");
  assert.equal(roadmap.modules[1].lessons[0].vipLocked, true);
  assert.equal(roadmap.modules[1].vipLocked, true);
  assert.equal(roadmap.nextLesson, null);
  assert.equal(roadmap.blockedByVip, true);
});

test("roadmap repository returns a complete public course overview without a database", async () => {
  const repository = await import("../lib/course-roadmap-repository.ts").catch(() => null);
  assert.ok(repository, "the course roadmap repository should be available");
  const previous = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const data = await repository.getCourseRoadmapPageData({
      courseSlug: "van-phong-hanh-chinh",
      userId: null,
    });
    assert.equal(data?.course.title, "Văn phòng & hành chính");
    assert.equal(data?.roadmap.modules.length, 5);
    assert.equal(data?.roadmap.totalLessons, 30);
    assert.equal(data?.roadmap.nextLesson?.slug, "chao-hoi-tai-noi-lam-viec");
    assert.equal(data?.viewerHasVip, false);
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous;
  }
});

test("course roadmap marks an opened unfinished lesson for continue learning", async () => {
  const { buildCourseRoadmap } = await import("../lib/course-roadmap.ts");
  const firstLesson = officeLessons[0];
  const roadmap = buildCourseRoadmap({
    courseSlug: "van-phong-hanh-chinh",
    lessons: officeLessons.map((lesson, order) => ({
      ...lesson,
      order,
      moduleTitle: officeModules.find((module) => module.slug === lesson.moduleSlug)?.title ?? "",
      moduleOrder: officeModules.findIndex((module) => module.slug === lesson.moduleSlug),
    })),
    completedLessonSlugs: [],
    openedLessonSlugs: [firstLesson.slug],
    viewerHasVip: true,
  });
  assert.equal(roadmap.nextLesson?.started, true);
});

test("office roadmap stages use distinct module artwork", async () => {
  const visuals = await import("../lib/course-visuals.ts").catch(() => null);
  assert.ok(visuals, "course visuals should be available");

  const stageVisuals = officeModules.map((module) => (
    visuals.getCourseModuleVisual("van-phong-hanh-chinh", module.slug)
  ));

  assert.equal(new Set(stageVisuals.map((visual) => visual.src)).size, officeModules.length);
  assert.ok(stageVisuals.every((visual) => visual.src.startsWith("/assets/courses/office-modules/")));
  assert.ok(stageVisuals.every((visual) => visual.alt.includes("Himi")));
});

test("factory roadmap stages use distinct module artwork", async () => {
  const visuals = await import("../lib/course-visuals.ts").catch(() => null);
  assert.ok(visuals, "course visuals should be available");

  const stageVisuals = factoryModules.map((module) => (
    visuals.getCourseModuleVisual("nha-may-san-xuat", module.slug)
  ));

  assert.equal(new Set(stageVisuals.map((visual) => visual.src)).size, factoryModules.length);
  assert.ok(stageVisuals.every((visual) => visual.src.startsWith("/assets/courses/factory-modules/")));
  assert.ok(stageVisuals.every((visual) => visual.alt.includes("Himi")));
});

test("logistics roadmap stages use distinct module artwork", async () => {
  const visuals = await import("../lib/course-visuals.ts").catch(() => null);
  assert.ok(visuals, "course visuals should be available");

  const stageVisuals = logisticsModules.map((module) => (
    visuals.getCourseModuleVisual("kho-van-logistics", module.slug)
  ));

  assert.equal(new Set(stageVisuals.map((visual) => visual.src)).size, logisticsModules.length);
  assert.ok(stageVisuals.every((visual) => visual.src.startsWith("/assets/courses/logistics-modules/")));
  assert.ok(stageVisuals.every((visual) => visual.alt.includes("Himi")));
});

test("sales roadmap stages use distinct module artwork", async () => {
  const visuals = await import("../lib/course-visuals.ts").catch(() => null);
  assert.ok(visuals, "course visuals should be available");

  const stageVisuals = salesModules.map((module) => (
    visuals.getCourseModuleVisual("ban-hang-cham-soc-khach-hang", module.slug)
  ));

  assert.equal(new Set(stageVisuals.map((visual) => visual.src)).size, salesModules.length);
  assert.ok(stageVisuals.every((visual) => visual.src.startsWith("/assets/courses/sales-modules/")));
  assert.ok(stageVisuals.every((visual) => visual.alt.includes("Himi")));
});

test("restaurant roadmap stages use distinct module artwork", async () => {
  const visuals = await import("../lib/course-visuals.ts").catch(() => null);
  assert.ok(visuals, "course visuals should be available");

  const stageVisuals = restaurantModules.map((module) => (
    visuals.getCourseModuleVisual("nha-hang-dich-vu", module.slug)
  ));

  assert.equal(new Set(stageVisuals.map((visual) => visual.src)).size, restaurantModules.length);
  assert.ok(stageVisuals.every((visual) => visual.src.startsWith("/assets/courses/restaurant-modules/")));
  assert.ok(stageVisuals.every((visual) => visual.alt.includes("Himi")));
});

test("ecommerce roadmap stages use distinct module artwork", async () => {
  const visuals = await import("../lib/course-visuals.ts").catch(() => null);
  assert.ok(visuals, "course visuals should be available");

  const stageVisuals = ecommerceModules.map((module) => (
    visuals.getCourseModuleVisual("thuong-mai-dien-tu", module.slug)
  ));

  assert.equal(new Set(stageVisuals.map((visual) => visual.src)).size, ecommerceModules.length);
  assert.ok(stageVisuals.every((visual) => visual.src.startsWith("/assets/courses/ecommerce-modules/")));
  assert.ok(stageVisuals.every((visual) => visual.alt.includes("Himi")));
});

test("core workplace roadmap stages use distinct module artwork", async () => {
  const visuals = await import("../lib/course-visuals.ts").catch(() => null);
  assert.ok(visuals, "course visuals should be available");

  const stageVisuals = coreWorkplaceModules.map((module) => (
    visuals.getCourseModuleVisual("giao-tiep-cong-so", module.slug)
  ));

  assert.equal(new Set(stageVisuals.map((visual) => visual.src)).size, coreWorkplaceModules.length);
  assert.ok(stageVisuals.every((visual) => visual.src.startsWith("/assets/courses/workplace-modules/")));
  assert.ok(stageVisuals.every((visual) => visual.alt.includes("Himi")));
});

test("high-frequency roadmap stages use distinct module artwork", async () => {
  const visuals = await import("../lib/course-visuals.ts").catch(() => null);
  assert.ok(visuals, "course visuals should be available");

  const stageVisuals = highFrequencyModules.map((module) => (
    visuals.getCourseModuleVisual("tieng-trung-tan-suat-cao", module.slug)
  ));

  assert.equal(new Set(stageVisuals.map((visual) => visual.src)).size, highFrequencyModules.length);
  assert.ok(stageVisuals.every((visual) => visual.src.startsWith("/assets/courses/high-frequency-modules/")));
  assert.ok(stageVisuals.every((visual) => visual.alt.includes("Himi")));
});
