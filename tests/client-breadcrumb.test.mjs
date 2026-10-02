import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getClientBreadcrumb } from "../lib/client-breadcrumb.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("client breadcrumb matches the requested HSK level navigation", () => {
  assert.deepEqual(getClientBreadcrumb("/writing/1"), {
    parentHref: "/writing",
    parentLabel: "Các cấp độ",
    currentLabel: "HSK 1",
  });
  assert.deepEqual(getClientBreadcrumb("/typing/hsk-3"), {
    parentHref: "/typing",
    parentLabel: "Các cấp độ",
    currentLabel: "HSK 3",
  });
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
  assert.deepEqual(getClientBreadcrumb("/courses", "hsk"), {
    parentHref: "/",
    parentLabel: "Học tập",
    currentLabel: "Các cấp độ HSK",
  });
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
  assert.equal(getClientBreadcrumb("/dev/completion-preview"), null);
});

test("standalone client pages keep the shared navigation while admin remains separate", () => {
  assert.deepEqual(getClientBreadcrumb("/login"), {
    parentHref: "/",
    parentLabel: "Học tập",
    currentLabel: "Đăng nhập",
  });
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
  assert.match(styles, /\.learner-app-shell :is\(\.writing-breadcrumbs, \.typing-breadcrumbs, \.hsk-learning-breadcrumb/);
});
