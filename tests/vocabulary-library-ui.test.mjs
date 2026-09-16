import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL("../components/vocabulary-set-library.tsx", import.meta.url);
const studyComponentPath = new URL("../components/vocabulary-set-study.tsx", import.meta.url);
const stylesheetPath = new URL("../app/vocabulary/vocabulary.css", import.meta.url);

test("vocabulary library renders saved learning words and a working study CTA", async () => {
  const component = await readFile(componentPath, "utf8");
  const stylesheet = await readFile(stylesheetPath, "utf8");

  assert.match(component, /THƯ VIỆN CỦA BẠN/);
  assert.match(component, /Từ đã lưu/);
  assert.match(component, /THEO NGUỒN HỌC/);
  assert.match(component, /sourceOptions/);
  assert.match(component, /Những từ bạn đã lưu khi học HSK và Giao tiếp/);
  assert.match(component, /vsets-saved-table/);
  assert.match(component, /word\.hanzi/);
  assert.match(component, /word\.pinyin/);
  assert.match(component, /word\.meaning/);
  assert.match(component, /> Bắt đầu học /);
  assert.match(component, /\/vocabulary\/saved\/study\/vocabulary/);
  assert.match(component, /vsets-search/);
  assert.match(component, /Tìm theo Hán tự, pinyin hoặc nghĩa/);
  assert.doesNotMatch(component, /Bộ có sẵn|builtins/);
  assert.match(component, /aria-controls="vsets-create-form"/);
  assert.match(component, /onClick=\{openCreateForm\}/);
  assert.match(component, /id="vsets-create-form"/);
  assert.match(component, /className="vsets-create-overlay"/);
  assert.match(component, /aria-modal="true"/);
  assert.match(component, /role="dialog"/);
  assert.match(component, /revealCreateForm\(createFormRef\.current\)/);
  assert.match(component, /placeholder="Ví dụ: Từ mới tuần này"/);
  assert.match(component, /placeholder="Bạn muốn học những gì trong bộ này\?"/);
  assert.match(stylesheet, /\.vsets-page \.vsets-start-learning/);
  assert.match(stylesheet, /\.vsets-library-shell/);
  assert.match(stylesheet, /\.vsets-saved-table/);
  assert.match(stylesheet, /\.vsets-create-overlay \{ position: fixed;/);
  assert.match(stylesheet, /\.vsets-create-dialog \{ width: min\(680px, 100%\)/);
  assert.match(stylesheet, /\.vsets-form input:focus-visible, \.vsets-form textarea:focus-visible \{ outline: none;/);
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

test("saved words use horizontal Hanzi and full-width examples on phones", async () => {
  const stylesheet = await readFile(stylesheetPath, "utf8");
  const mobileStart = stylesheet.lastIndexOf("@media (max-width: 680px)");
  const mobileEnd = stylesheet.indexOf("@media (max-width: 410px)", mobileStart);
  const mobile = stylesheet.slice(mobileStart, mobileEnd);

  assert.match(mobile, /grid-template-columns: minmax\(0, 1fr\) auto/);
  assert.match(mobile, /grid-template-areas: "hanzi actions" "reading reading" "example example"/);
  assert.match(mobile, /\.vsets-list-hanzi\s*\{[^}]*width: auto;[^}]*display: block;[^}]*background: transparent;/s);
  assert.match(mobile, /\.vsets-list-reading\s*\{ grid-area: reading;/);
  assert.match(mobile, /\.vsets-list-example\s*\{ grid-area: example;/);
  assert.match(mobile, /\.vsets-list-actions\s*\{[^}]*flex-direction: row;/s);
  assert.match(mobile, /\.vsets-page \.vsets-pronounce, \.vsets-page \.vsets-unsave\s*\{ width: 44px; height: 44px; min-height: 44px;/);
  assert.doesNotMatch(stylesheet, /\.vsets-list-hanzi\s*\{ width: (64|72)px;/);
});
