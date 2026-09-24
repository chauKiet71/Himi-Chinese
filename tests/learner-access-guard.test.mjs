import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("lesson and game entry pages require an authenticated learner", async () => {
  const guardedPages = [
    "app/games/page.tsx",
    "app/hsk/[level]/[lesson]/page.tsx",
    "app/hsk/[level]/[lesson]/play/page.tsx",
    "app/hsk/[level]/[lesson]/quiz/page.tsx",
    "app/hsk/[level]/[lesson]/flashcard/page.tsx",
    "app/writing/[level]/[lesson]/practice/page.tsx",
    "app/learn/[slug]/page.tsx",
  ];
  const [guard, ...pages] = await Promise.all([
    read("lib/learner-auth.ts"),
    ...guardedPages.map(read),
  ]);

  assert.match(guard, /safeReturnTo\(returnTo, "\/"\)/);
  assert.match(guard, /\/login\?error=required&returnTo=/);
  assert.match(guard, /if \(!user\) redirect\(learnerLoginPath\(returnTo\)\)/);
  for (const [index, page] of pages.entries()) {
    assert.match(page, /requireLearnerUser\(/, `${guardedPages[index]} must enforce the learner session`);
  }
});

test("listening lessons require login while the public catalog stays visible", async () => {
  const [page, catalog, scenarios] = await Promise.all([
    read("app/listening/page.tsx"),
    read("components/listening-catalog-studio.tsx"),
    read("components/work-practice-hub.tsx"),
  ]);

  assert.match(page, /initialLessonId\s*\?\s*await requireLearnerUser\(returnTo\)/);
  assert.match(page, /authenticated=\{Boolean\(user\)\}/);
  assert.match(catalog, /if \(!authenticated\)[\s\S]*?\/login\?error=required&returnTo=/);
  assert.match(catalog, /`\/listening\?lesson=\$\{encodeURIComponent\(summary\.id\)\}`/);
  assert.match(scenarios, /if \(!authenticated\)[\s\S]*?`\/listening\?mode=scenario&scenario=\$\{encodeURIComponent\(selectedScenario\.id\)\}`/);
});

test("game vocabulary APIs reject anonymous requests before returning content", async () => {
  const routes = await Promise.all([
    read("app/api/games/slice/route.ts"),
    read("app/api/games/vocabulary/route.ts"),
  ]);

  for (const route of routes) {
    assert.match(route, /if \(!user\)/);
    assert.match(route, /code: "AUTH_REQUIRED"/);
    assert.match(route, /status: 401/);
    assert.match(route, /"Cache-Control": "private, no-store"/);
    assert.match(route, /getHskLevelLessonAccess\(level, user\.id\)/);
    assert.doesNotMatch(route, /user\?\.id \?\? null/);
  }
});

test("VIP games can use curated vocabulary from lessons still being edited", async () => {
  const repository = await read("lib/hsk-access-repository.ts");

  assert.match(repository, /level\?\.topics\.flatMap\(\(topic\) => topic\.lessons\) \?\? \[\]/);
  assert.doesNotMatch(repository, /flatMap\(\(topic\) => topic\.lessons\)\.filter\(\(lesson\) => lesson\.available\)/);
});
