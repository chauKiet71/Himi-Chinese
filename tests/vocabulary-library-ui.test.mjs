import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL("../components/vocabulary-set-library.tsx", import.meta.url);
const studyComponentPath = new URL("../components/vocabulary-set-study.tsx", import.meta.url);
const stylesheetPath = new URL("../app/vocabulary/vocabulary.css", import.meta.url);

test("vocabulary library renders saved learning words and a working study CTA", async () => {
  const component = await readFile(componentPath, "utf8");
  const stylesheet = await readFile(stylesheetPath, "utf8");

  assert.match(component, /> Từ đã lưu <span>/);
  assert.match(component, /Danh sách từ vựng/);
  assert.match(component, /Những từ bạn đã lưu khi học HSK và Giao tiếp/);
  assert.match(component, /vsets-saved-grid/);
  assert.match(component, /word\.hanzi/);
  assert.match(component, /word\.pinyin/);
  assert.match(component, /word\.meaning/);
  assert.match(component, /> Bắt đầu học /);
  assert.match(component, /\/vocabulary\/saved\/study\/vocabulary/);
  assert.match(component, /aria-controls="vsets-create-form"/);
  assert.match(component, /onClick=\{openCreateForm\}/);
  assert.match(component, /id="vsets-create-form"/);
  assert.match(component, /className="vsets-create-overlay"/);
  assert.match(component, /aria-modal="true"/);
  assert.match(component, /role="dialog"/);
  assert.match(component, /revealCreateForm\(createFormRef\.current\)/);
  assert.match(component, /placeholder="Ví dụ: Từ mới tuần này"/);
  assert.match(component, /placeholder="Bạn muốn học những gì trong bộ này\?"/);
  assert.doesNotMatch(component, /vsets-search|Tìm bộ từ vựng/);
  assert.match(stylesheet, /\.vsets-page \.vsets-start-learning/);
  assert.match(stylesheet, /\.vsets-saved-grid/);
  assert.match(stylesheet, /\.vsets-create-overlay \{ position: fixed;/);
  assert.match(stylesheet, /\.vsets-create-dialog \{ width: min\(680px, 100%\)/);
  assert.match(stylesheet, /\.vsets-create-dialog input:focus-visible, \.vsets-create-dialog textarea:focus-visible \{ outline: none;/);
  assert.match(stylesheet, /--vs-primary: var\(--himi-red\)/);
  assert.match(stylesheet, /--vs-accent: var\(--himi-orange\)/);
  assert.match(stylesheet, /background: var\(--vs-primary\)/);
  assert.doesNotMatch(stylesheet, /--vs-green/);
});

test("vocabulary review uses a standalone guided-study interface", async () => {
  const [component, stylesheet] = await Promise.all([
    readFile(studyComponentPath, "utf8"),
    readFile(stylesheetPath, "utf8"),
  ]);

  assert.match(component, /vsets-immersive-session/);
  assert.match(component, /vsets-immersive-toolbar/);
  assert.match(component, /Thoát lượt học/);
  assert.match(component, /vsets-immersive-footer/);
  assert.match(stylesheet, /\.learner-app-shell:has\(\.vsets-immersive-session\) > \.learn-rail/);
  assert.match(stylesheet, /body:has\(\.vsets-immersive-session\) > \.himi-chatbot-widget/);
  assert.match(stylesheet, /\.vsets-immersive-progress/);
});
