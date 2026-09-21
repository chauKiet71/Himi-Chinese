import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("learning journeys respond to the usable learner content width", async () => {
  const [layout, responsiveCss] = await Promise.all([
    read("app/layout.tsx"),
    read("app/learning-journey-responsive.css"),
  ]);

  assert.match(layout, /import "\.\/learning-journey-responsive\.css";/);
  assert.match(responsiveCss, /container-name:\s*learner-content/);
  assert.match(responsiveCss, /@container learner-content \(max-width: 1020px\)/);
  assert.match(responsiveCss, /@container learner-content \(max-width: 820px\)/);
  assert.match(responsiveCss, /@container learner-content \(max-width: 680px\)/);
  assert.match(responsiveCss, /@container learner-content \(max-width: 420px\)/);
  assert.match(responsiveCss, /@container learner-content \(max-width: 360px\)/);
  assert.match(responsiveCss, /@media \(min-width: 721px\) and \(max-height: 760px\)/);
  assert.match(responsiveCss, /@media \(max-width: 900px\) and \(max-height: 520px\) and \(orientation: landscape\)/);
  assert.match(responsiveCss, /\.course-roadmap-layout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(responsiveCss, /\.pronunciation-practice-layout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(responsiveCss, /\.challenge-options\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
});

test("lesson routes expose a scoped shell and mobile-safe navigation", async () => {
  const [page, loading, responsiveCss] = await Promise.all([
    read("app/learn/[slug]/page.tsx"),
    read("app/learn/[slug]/loading.tsx"),
    read("app/learning-journey-responsive.css"),
  ]);

  assert.match(page, /className="section-shell lesson-responsive-shell"/);
  assert.match(loading, /className="section-shell lesson-responsive-shell"/);
  assert.match(page, /<nav aria-label="Điều hướng bài học" className="lesson-breadcrumb">/);
  assert.match(page, /aria-current="page"/);
  assert.match(responsiveCss, /env\(safe-area-inset-bottom\)/);
  assert.match(responsiveCss, /@media \(pointer: coarse\)/);
  assert.match(responsiveCss, /min-height:\s*44px/);
  assert.match(responsiveCss, /overflow-wrap:\s*anywhere/);
  assert.match(responsiveCss, /prefers-reduced-motion:\s*reduce/);
});
