import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getClientBreadcrumb } from "../lib/client-breadcrumb.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("client breadcrumb matches the requested HSK level navigation", () => {
  assert.equal(getClientBreadcrumb("/writing/1"), null);
  assert.equal(getClientBreadcrumb("/typing/hsk-3"), null);
  assert.equal(getClientBreadcrumb("/typing/hsk-3/hsk3-l1"), null);
  assert.deepEqual(getClientBreadcrumb("/writing/hsk-2/hsk2-bai-01-du-lich-bac-kinh/practice"), {
    parentHref: "/writing/hsk-2",
    parentLabel: "HSK 2",
    currentLabel: "Giáo trình - Bài 01",
  });
  assert.deepEqual(getClientBreadcrumb("/writing/hsk-5/hsk5-workbook-lesson-03/practice"), {
    parentHref: "/writing/hsk-5",
    parentLabel: "HSK 5",
    currentLabel: "Sách bài tập - Bài 03",
  });
});

test("client breadcrumb keeps useful parents across learner routes", () => {
  assert.equal(getClientBreadcrumb("/courses"), null);
  assert.equal(getClientBreadcrumb("/courses/van-phong-hanh-chinh"), null);
  assert.deepEqual(getClientBreadcrumb("/hsk/2/hsk2-bai-01/play"), {
    parentHref: "/hsk/2/hsk2-bai-01",
    parentLabel: "Bài học",
    currentLabel: "Học theo hướng dẫn",
  });
  assert.deepEqual(getClientBreadcrumb("/vocabulary/my-set/study/flashcard"), {
    parentHref: "/vocabulary/my-set",
    parentLabel: "Bộ từ vựng",
    currentLabel: "Học flashcard",
  });
});

test("home and developer-only previews do not render a redundant breadcrumb", () => {
  assert.equal(getClientBreadcrumb("/"), null);
  assert.equal(getClientBreadcrumb("/games"), null);
  assert.equal(getClientBreadcrumb("/typing"), null);
  assert.equal(getClientBreadcrumb("/vip"), null);
  assert.equal(getClientBreadcrumb("/vocabulary"), null);
  assert.equal(getClientBreadcrumb("/writing"), null);
  assert.equal(getClientBreadcrumb("/dev/completion-preview"), null);
});

test("VIP page starts directly with account status and pricing", async () => {
  const page = await read("app/vip/page.tsx");

  assert.match(page, /<h1 className="sr-only">Himi Chinese VIP<\/h1>/);
  assert.doesNotMatch(page, /HimiSectionBanner|vip-page-header|Học liền mạch/);
});

test("standalone client pages keep the shared navigation while admin remains separate", () => {
  assert.equal(getClientBreadcrumb("/login"), null);
  assert.equal(getClientBreadcrumb("/register"), null);
  assert.equal(getClientBreadcrumb("/forgot-password"), null);
  assert.deepEqual(getClientBreadcrumb("/privacy"), {
    parentHref: "/",
    parentLabel: "Học tập",
    currentLabel: "Chính sách bảo mật",
  });
});

test("the learner shell renders one shared accessible breadcrumb", async () => {
  const [shell, component, styles] = await Promise.all([
    read("components/learner-app-shell.tsx"),
    read("components/client-breadcrumb.tsx"),
    read("app/learner-navigation.css"),
  ]);

  assert.match(shell, /<ClientBreadcrumb \/>/);
  assert.match(shell, /pathname\.startsWith\("\/admin"\)[\s\S]*\? null[\s\S]*: <ClientBreadcrumb \/>/);
  assert.match(component, /aria-label="Điều hướng trang"/);
  assert.match(component, /aria-current="page"/);
  assert.match(styles, /\.client-breadcrumb-current[\s\S]*var\(--himi-red/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.client-breadcrumb-bar,[\s\S]*display:\s*none;/);
  assert.match(styles, /\.learner-app-shell :is\(\.hsk-learning-breadcrumb/);
  assert.doesNotMatch(styles, /\.learner-app-shell :is\([^}]*(?:\.typing-breadcrumbs|\.writing-breadcrumbs)/);
});
