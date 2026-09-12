import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createServer } from "vite";

test("VIP access admin loads only the selected hierarchy level", async (t) => {
  const server = await createServer({
    appType: "custom",
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "admin-access-performance"),
    configFile: false,
    resolve: { alias: { "@": process.cwd() } },
    root: process.cwd(),
    server: { hmr: false, middlewareMode: true },
  });
  t.after(() => server.close());

  const { buildAdminHskAccessView } = await server.ssrLoadModule("/lib/admin-content-access-view.ts");
  const root = await buildAdminHskAccessView();
  assert.equal(root.targets.length, root.levels.length);
  assert.ok(root.targets.length < 10);
  assert.equal(root.lessonEntries.length, 0);

  const level = await buildAdminHskAccessView("hsk-1");
  assert.equal(level.targets.length, level.lessonEntries.length + 1);
  assert.ok(level.targets.length < 50);

  const invalidLesson = await buildAdminHskAccessView("hsk-1", "unknown-lesson");
  assert.equal(invalidLesson.lessonEntries.length, level.lessonEntries.length);
  assert.equal(invalidLesson.targets.length, level.targets.length);

  const lesson = await buildAdminHskAccessView("hsk-1", level.lessonEntries[0].id);
  assert.equal(
    lesson.targets.length,
    2 + lesson.vocabulary.length + lesson.writing.length + lesson.questions.length,
  );
  assert.ok(lesson.targets.length < 100);
});
