import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("industry roadmap lessons use the immersive guided lesson interface", async () => {
  const [page, component, loading, css] = await Promise.all([
    read("app/learn/[slug]/page.tsx"),
    read("components/industry-guided-lesson.tsx"),
    read("app/learn/[slug]/loading.tsx"),
    read("app/lesson-stage.css"),
  ]);

  assert.match(page, /<IndustryGuidedLesson/);
  assert.match(component, /Từ vựng/);
  assert.match(component, /Cụm từ/);
  assert.match(component, /Nghe & Nói/);
  assert.match(component, /Nghe mẫu/);
  assert.doesNotMatch(component, /Nghe phát âm chuẩn/);
  assert.match(component, /industry-phrase-surface/);
  assert.match(component, /industry-phrase-structure/);
  assert.match(component, /industry-pronunciation-dock/);
  assert.doesNotMatch(component, /industry-pronunciation-tabs/);
  assert.doesNotMatch(component, /Các hoạt động luyện tập/);
  assert.match(component, /<PronunciationEvaluator/);
  assert.match(component, /<PronunciationEvaluator compact[\s\S]*playToggleSound/);
  assert.match(component, /Điểm phát âm/);
  assert.doesNotMatch(component, /Nhấn để đọc/);
  assert.match(component, /pronunciationResult \? " has-result" : " is-pending"/);
  assert.match(component, /pronunciationResult \? <div className="industry-pronunciation-score"/);
  assert.match(component, /pronunciationResult && recordingUrls\[currentPhrase\.id\] \? <button/);
  assert.match(component, /onClick=\{playUserRecording\}/);
  assert.match(component, /onRecordingStart=\{stopAudio\}/);
  assert.match(component, /URL\.createObjectURL\(recording\.blob\)/);
  assert.match(component, /URL\.revokeObjectURL\(previousUrl\)/);
  assert.match(component, /Phát lại bản ghi âm của bạn/);
  assert.match(component, /playingRecordingId === currentPhrase\.id \? "Đang phát" : "Nghe lại"/);
  assert.doesNotMatch(component, /industry-speed-control/);
  assert.match(component, /result\?\.characterFeedback\[hanziIndex\+\+\] \?\? "unscored"/);
  assert.match(component, /industry-listening-character is-\$\{state\}/);
  assert.match(component, /href=\{closeHref\}/);
  assert.match(component, /Bước \{currentStep\} \/ \{totalSteps\}/);
  assert.doesNotMatch(component, /industry-stage-arrow/);
  assert.match(component, /industry-guided-header-inner/);
  assert.match(component, /industry-guided-stage-inner/);
  assert.match(component, /industry-guided-footer-inner/);
  assert.match(component, /src="\/assets\/hsk\/hsk-completion-trophy\.png"/);
  assert.match(component, /industry-complete-stats/);
  assert.match(component, /từ vựng/);
  assert.match(component, /bài tập/);
  assert.match(component, /từ luyện viết/);
  assert.doesNotMatch(component, /<div className="industry-complete-trophy" aria-hidden="true">🏆<\/div>/);
  assert.match(loading, /LessonLoadingIndicator/);
  assert.doesNotMatch(loading, /skeleton-block/);
  assert.match(css, /:has\(\.industry-guided-lesson\) \.learn-rail/);
  assert.match(css, /height: 100dvh/);
  assert.match(css, /\.industry-guided-header-inner[\s\S]*width: min\(840px, calc\(100% - 48px\)\)/);
  assert.match(css, /\.industry-guided-stage-inner[\s\S]*width: min\(840px, calc\(100% - 48px\)\)/);
  assert.match(css, /\.industry-guided-footer-inner[\s\S]*width: min\(840px, calc\(100% - 48px\)\)/);
  assert.match(css, /\.industry-guided-tabs button[\s\S]*color: #71809a/);
  assert.match(css, /\.industry-guided-tabs button[\s\S]*font-size: 12px[\s\S]*font-weight: 690/);
  assert.match(css, /\.industry-guided-tabs button\.active[\s\S]*background: #ff4f3d/);
  assert.match(css, /\.industry-guided-tabs button\.active[\s\S]*box-shadow: 0 5px 12px rgba\(255, 79, 61, \.18\)/);
  assert.match(css, /\.industry-listening-character\.is-unscored \{ color: #171717;/);
  assert.match(css, /\.industry-listening-character\.is-correct \{ color: #138a68;/);
  assert.match(css, /\.industry-listening-character\.is-incorrect \{ color: #e54848;/);
  assert.match(css, /\.industry-pronunciation-dock\.is-pending[\s\S]*width: 100%[\s\S]*border-color: transparent[\s\S]*background: transparent[\s\S]*box-shadow: none/);
  assert.match(css, /\.industry-pronunciation-dock\.is-pending \.industry-pronunciation-control[\s\S]*grid-column: 2/);
  assert.match(css, /\.industry-pronunciation-dock[\s\S]*grid-template-columns: repeat\(3, 1fr\)/);
  assert.match(css, /\.industry-pronunciation-control \.pronunciation-record \{[\s\S]*gap: 0/);
  assert.match(css, /\.industry-pronunciation-control \.pronunciation-record \{[\s\S]*width: 88\.4px[\s\S]*height: 88\.4px/);
  assert.match(css, /\.industry-pronunciation-control \.pronunciation-record svg \{ width: 36\.4px; height: 36\.4px/);
  assert.doesNotMatch(css, /\.industry-pronunciation-score \{[^}]*border-right/);
  assert.match(css, /body:has\(\.industry-guided-lesson\) \.himi-chatbot-widget/);
  assert.match(css, /\.industry-guided-complete \{[^}]*grid-template-rows: minmax\(0, 1fr\)[^}]*place-items: center[^}]*min-height: 100dvh/);
  assert.match(css, /\.industry-complete-card \{[^}]*width: min\(664px, 100%\)/);
  assert.match(css, /\.industry-complete-stats \{[^}]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.industry-complete-stats > div \{[^}]*grid-template-columns: 46px max-content minmax\(0, 1fr\)/);
  assert.match(css, /\.industry-complete-stats dt \{ display: contents;/);
  assert.doesNotMatch(css, /\.industry-complete-stats dd \{[^}]*margin: -28px/);
  assert.match(css, /\.lesson-speed-options button\[aria-pressed="true"\]\s*\{[^}]*background: var\(--himi-red, #ff4f3d\)/);
  assert.doesNotMatch(css, /\.lesson-speed-options button\[aria-pressed="true"\]\s*\{[^}]*background: #08796d/);
});
