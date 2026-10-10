import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../app/hsk/[level]/[lesson]/play/page.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source.replace(/^import .*;\r?\n/gm, ""), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, jsxFactory: "element" },
}).outputText;

function pageFor(access) {
  const exports = {};
  const lesson = { id: "lesson-2", levelId: "hsk-2", title: "Bài hai" };
  vm.runInNewContext(compiled, {
    exports,
    element: (type, props) => ({ type, props }),
    HskVipLocked: "locked",
    HskLessonLoader: "loader",
    getCurrentUser: async () => ({ id: "learner" }),
    getHskLessonPageData: async () => ({ lesson, access }),
    redirect: (href) => { throw new Error(`redirect:${href}`); },
    notFound: () => { throw new Error("not found"); },
    HSK_CURRICULUM: [{ id: "hsk-2", topics: [{ lessons: [{ id: "lesson-2" }, { id: "lesson-3", available: true }] }] }],
    getHskLessonHref: (level, id) => `/hsk/${level}/${id}`,
    hskLessonResourceUrl: () => "/resource",
    learningContentScope: () => "viewer",
    createLessonResource: async () => ({ lesson }),
  });
  return exports.default;
}
const params = Promise.resolve({ level: "2", lesson: "lesson-2" });

test("a locked next lesson returns to its HSK level with the upgrade prompt", async () => {
  const page = pageFor({ allowed: false, source: "vip_required" });
  await assert.rejects(page({ params, searchParams: Promise.resolve({ from: "completion" }) }), {
    message: "redirect:/courses?view=hsk&level=hsk-2&upgradeLesson=lesson-2",
  });
});

test("an accessible next lesson still opens normally", async () => {
  const result = await pageFor({ allowed: true, source: "vip" })({ params, searchParams: Promise.resolve({ from: "completion" }) });
  assert.equal(result.type, "loader");
  assert.equal(result.props.nextLessonHref, "/hsk/hsk-2/lesson-3/play");
});

test("directly opening a locked lesson keeps its existing VIP gate", async () => {
  const result = await pageFor({ allowed: false, source: "vip_required" })({ params });
  assert.equal(result.type, "locked");
});
