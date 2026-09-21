# Listening lesson single-column design QA

- Source visual truth: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\artifacts\listening-focus-reference.png`
- Final desktop implementation: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\artifacts\listening-focus-implementation-v3.png`
- Normalized side-by-side comparison: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\artifacts\listening-focus-comparison-v3.png`
- Responsive implementation: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\artifacts\listening-focus-mobile-v3.png`
- Route and state: `http://localhost:3001/listening?lesson=dialogue-beginner-topic-chat-with-chinese-001-daily-001`; a real imported dialogue is loaded, sentence 1 is active, Chinese, Pinyin and Vietnamese are visible, and the main audio is paused.
- Desktop capture: Google Chrome at 1225 × 1636 CSS px, device scale factor 1. The application content was cropped from `(215, 88)` to `(1225, 1636)`, producing the same 1010 × 1548 pixels as the source.
- Responsive capture: Google Chrome at 520 × 1050 CSS px, device scale factor 1.

## Visual comparison

The normalized comparison places the source on the left and the final browser render on the right. Both use the requested sequence: compact lesson metadata, oversized listening title, coral lesson name with Chinese text, short description, Himi mascot, full-width coral player, language visibility toolbar, and a single transcript column.

The player preserves the source hierarchy with the Himi head logo at the left, current and total times, seek bar, a white play/pause control centered over the dense waveform, and 0.75x, 1x, and 1.25x controls. Transcript rows use the same pale active surface, left coral marker, circular numbering, three-level Chinese/Pinyin/Vietnamese type hierarchy, duration pill, and circular sentence-audio action.

## Required fidelity surfaces

- Typography: the product's existing Vietnamese-capable type stack is retained. Display and transcript sizes reproduce the source hierarchy without truncating real catalog content.
- Spacing: the desktop content width, 22 px player radius, 19–21 px white-surface radii, 20–28 px inner padding, and tall transcript rhythm match the source at equal pixel density.
- Color: the implementation uses the existing Himi coral, pale coral, white, cool gray, and near-black tokens on a warm off-white page.
- Assets: the header uses the real transparent `himi-wave.webp` product asset, and the player uses the approved transparent Himi head logo. All controls use the installed Lucide icon set; there are no placeholder glyphs or synthetic image substitutes.
- Content: lesson titles, Chinese, Pinyin, Vietnamese, timings, and MP3 paths come from the imported listening catalog.

## Interaction and responsive evidence

- The centered main-audio action advances the seek value and changes from play to pause while audio is running.
- Playback speed changes to 0.75x and reports the selected state.
- Pinyin can be hidden and restored; Chinese and Vietnamese have equivalent working controls.
- Every transcript row is a full-width audio action: clicking anywhere in the row plays only that timed sentence and keeps the selected row active after playback ends.
- At the compact responsive viewport, the layout has no horizontal page overflow; title, mascot, player, language tools, and transcript stack remain usable above the product's mobile navigation.
- Chrome's extension-injected attributes produce an existing development hydration diagnostic. No application audio, fetch, render, or interaction error was observed during this QA pass.

## Comparison history

1. The first equal-size comparison found two P2 differences: the waveform was too sparse, and the original mobile download action overlapped the waveform.
2. The waveform was rebuilt from a denser sequence of installed audio-line icons. Following the user's review, the separate pause and download controls were removed; one primary action owns both play and pause states.
3. In the final Chrome review, the user-supplied Himi head logo replaced the former left play action and the play/pause button moved to the center of the waveform. Its accessible label changes correctly in both playback states.
4. The final comparison confirms the requested one-column composition. The real lesson title is longer than the example and wraps naturally; the real imported lesson has more transcript rows, which continue below the captured viewport.

## Findings

No actionable P0, P1, or P2 visual differences remain. The missing secondary pause and download controls, the centered primary action, and the Himi logo at the left are intentional user-approved departures from the original reference. P3 differences are limited to dynamic lesson copy.

final result: passed

---

## HSK curriculum CTA → guided lesson — 2026-09-16

### Comparison target

- Source visual truth: Browser Comment 1 target attachment, 1272 × 689 pixels. The conversation attachment does not expose a local filesystem path.
- Browser-rendered implementation: `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play`, captured inline in the selected Codex in-app Browser. The capture backend did not expose a local screenshot path.
- Browser capture: 1194 × 1399 pixels at the host-managed density; DOM viewport 800 × 937 CSS px after the temporary reference-size override was reset.
- State: `Bước 1 trên 15`, “Giới thiệu” active, lesson `Bài 1 · HSK 1`, title `Chào anh!`, three summary cards visible, footer navigation present.

### Findings

- No actionable P0, P1, or P2 findings remain for this scoped navigation change.
- The selected curriculum CTA now resolves directly to the guided learning route instead of stopping at the lesson overview.
- The rendered destination preserves the reference's learning shell: exit action, progress rail, section tabs, lesson hero, summary cards, keyboard hint, and persistent previous/next footer.

### Required fidelity surfaces

- Fonts and typography: existing Vietnamese and Chinese font stacks, display hierarchy, weights, and compact progress labels are unchanged.
- Spacing and layout rhythm: the guided lesson layout is unchanged; the reference and live screen retain the same centered hero and fixed header/footer structure. The live Browser viewport was taller than the source crop, so the additional lower whitespace is expected rather than design drift.
- Colors and visual tokens: Himi coral, cool gray page surface, white cards, muted supporting copy, borders, and shadows match the supplied target.
- Image quality and asset fidelity: this state uses installed Lucide icons and text content only; no source illustration or image asset was replaced.
- Copy and content: `你好!`, `Chào anh!`, 6 từ vựng, 6 bài tập, approximately 25 minutes, and 15 guided steps match the supplied lesson target.

### Full-view and focused comparison evidence

- The source attachment and the live Browser capture were opened and compared in the same task. Both show the same introduction state and information hierarchy.
- A separate focused crop was unnecessary because the only changed surface is the curriculum CTA destination; its accessible URL was inspected directly before click and the complete destination state was visible after navigation.
- The page reports no horizontal overflow, and the Browser console contains no warnings or errors.

### Comparison history and verification

1. Before the fix, `100% đã học · Tiếp tục học` pointed to `/hsk/1/hsk1-bai-01-chao-anh`, the overview screen.
2. The CTA was updated to `/hsk/1/hsk1-bai-01-chao-anh/play`; the lesson-title link intentionally remains on the overview route.
3. Browser verification clicked the exact annotated CTA and confirmed the guided lesson route and `Bước 1 trên 15` introduction state.
4. Focused HSK regression tests pass 9/9, and ESLint passes for the changed component and test.
5. The production bundle transformed 744 modules successfully, then the existing Sites plugin could not replace the already locked `dist/.openai/hosting.json`; this output-file lock is unrelated to the CTA change.

### Follow-up polish

- No P3 follow-up is required for this scoped navigation update.

final result: passed

---

## Sân khấu bài học Himi — vòng chỉnh theo phản hồi — 2026-09-13

### Comparison target

- Source visual truth — Từ vựng: `C:\Users\Windows\.codex\generated_images\019fbcdf-0a4e-7e50-b4e5-6afe7348a043\exec-49b0ef62-9fd5-4c74-967b-65afb3b6a731.png` (1487 × 1058 px).
- Source visual truth — Cụm từ: `C:\Users\Windows\.codex\generated_images\019fbcdf-0a4e-7e50-b4e5-6afe7348a043\exec-32c578d6-d2ed-48f9-99a5-ce4a81befc2c.png` (1487 × 1058 px).
- Source visual truth — Nghe & nói: `C:\Users\Windows\.codex\generated_images\019fbcdf-0a4e-7e50-b4e5-6afe7348a043\exec-77258402-7f6b-4a42-ba70-4fb610f42127.png` (1487 × 1058 px).
- Latest negative constraint: `C:\Users\Windows\AppData\Local\Temp\codex-clipboard-685b405b-862b-425e-9a91-69337c53bbcb.png`; remove the `Chưa rõ / Cần ôn / Đã hiểu` rating controls even though they remain visible in the older source boards.
- Implementation route: `http://localhost:3001/learn/van-phong-hanh-chinh?lesson=nhan-va-giao-nhiem-vu`.
- Browser screenshots: `qa-artifacts/lesson-stage-final-vocab-1200.png`, `qa-artifacts/lesson-stage-final-phrases-1200.png`, and `qa-artifacts/lesson-stage-final-pronunciation-1200.png` (each 1440 × 1200 px, CSS viewport 1440 × 1200, device scale factor 1).
- Normalized implementation crops: 1224 × 1058 px from the live content area at x=216, y=88. No density resampling was needed; source and implementation crops share the same 1058 px comparison height.
- Combined full-view evidence: `qa-artifacts/lesson-stage-comparison-vocab-final.png`, `qa-artifacts/lesson-stage-comparison-phrases-final.png`, and `qa-artifacts/lesson-stage-comparison-pronunciation-final.png` (source on the left, implementation on the right).
- Responsive evidence: `qa-artifacts/lesson-stage-viewport-934x698.png` and `qa-artifacts/lesson-stage-mobile-390x844.png`.
- State: first vocabulary item, first phrase, and first pronunciation target. The pronunciation reference shows a scored/recording result while the implementation capture intentionally shows the pre-recording state because microphone scoring needs user permission.

### Findings

- No actionable P0/P1/P2 findings remain after the latest iteration.
- The mock-only self-rating row is intentionally absent from Từ vựng and Cụm từ per the newest user direction. The real completion control remains in the document for authored lessons with a mandatory quiz, but is hidden until `Nghe & nói` or `Kiểm tra`, preserving the existing progress rules without adding visual clutter.
- The implementation keeps the existing learner rail, top bar, live lesson content, and current animated Himi assets. Those product constraints account for the narrower stage compared with the standalone 1487 px boards.

### Required fidelity surfaces

- Fonts and typography: the live Roboto/product stack retains the mock's black display hierarchy, coral pinyin, compact uppercase progress labels, and readable neutral supporting text. Long pronunciation content wraps deliberately inside the narrower application shell.
- Spacing and layout rhythm: progress, learning content, coach area, navigation arrows, dividers, and the right-aligned primary action follow the source composition. The rating row and keyboard hint were removed; the remaining CTA is offset from the fixed support launcher so the two controls do not overlap.
- Colors and visual tokens: Himi coral/red, warm coach surfaces, muted green-gray progress tracks, black Hanzi, and orange supporting icons map to existing app tokens. Automated WCAG 2A/2AA checking found zero violations.
- Image quality and asset fidelity: current transparent animated Himi GIFs are used for cheer, writing, and listening states. No CSS-drawn mascot or replacement illustration was introduced. Lucide supplies the pen, sparkle, lightbulb, audio, bookmark, and navigation icons.
- Copy and content: live lesson titles, vocabulary, examples, translations, dialogue, saved-word actions, and iFlytek flow remain data-driven. Coach copy was adapted to the active term or phrase; no mock placeholder content replaced authored course data.
- States and interactions: previous/next buttons, ArrowLeft/ArrowRight navigation, tab switching, audio, save controls, and pronunciation recording entry point remain operable. Reduced-motion fallbacks remain in place.

### Focused region comparison

- The source and live bottom-action regions were inspected in the combined images. The three rating pills from the supplied negative reference are absent, while `Đã hiểu · Tiếp tục` remains visible and clear of the support launcher.
- The vocabulary focus region confirms the stroke note now sits beside, rather than on top of, the Hanzi. The phrase focus region confirms the first semantic segment is coral/underlined and the structure line remains readable. The pronunciation focus region confirms the live prompt, pinyin, sample-audio button, recording CTA, waveforms, Himi coach, and next action preserve the intended hierarchy.

### Comparison history

1. Earlier P2 — the self-rating group and keyboard hint added visual density that conflicted with the latest request. Fix: removed their component markup and all dedicated confidence-control CSS.
2. Earlier P2 — the stroke annotation overlapped the large Hanzi and Himi read too small beside the learning content. Fix: gave the Hanzi stage a full-width annotation anchor and increased the desktop coach/mascot proportions while retaining responsive breakpoints.
3. Earlier P1 — the fixed support launcher overlapped the lower-right primary CTA. Fix: reserved 84 px of action-bar space for the launcher at every width.
4. Post-fix evidence — combined source/live comparisons show the final hierarchy; 934 × 698 and 390 × 844 captures show no horizontal overflow. The 36-lesson curriculum regression test, focused interactive-lesson test, ESLint, production build, browser overlay check, console check, and WCAG scan all pass.

### Primary interactions tested

- Clicked the next vocabulary arrow: progress changed from `01 / 06` to `02 / 06` and the Hanzi changed from `任务` to `安排`.
- Pressed ArrowLeft: progress and Hanzi returned to the first item.
- Switched through Từ vựng, Cụm từ, and Nghe & nói; each dedicated stage rendered and the removed rating control count stayed zero.
- Checked 1440 × 1200, 934 × 698, and 390 × 844 viewports; no horizontal overflow or framework error overlay was present, and browser console errors were empty.

### Follow-up polish

- The source board's scored pronunciation result should be compared again after granting microphone access and completing a live iFlytek attempt; the default pre-recording state is already visually and functionally valid.
## Luyện gõ — đồng bộ box cụm từ trong phần câu — 2026-09-13

### Comparison target

- Source visual truth: Browser Comment 1, ảnh tham chiếu inline 168 × 107 px với box “父母 / fùmǔ”. Ảnh chú thích không cung cấp đường dẫn tệp cục bộ.
- Browser-rendered implementation: `http://localhost:3001/typing/hsk-5/hsk5-l3/practice?stage=sentence`, chụp trực tiếp trong Codex in-app Browser. Backend chụp ảnh không cung cấp đường dẫn tệp cục bộ.
- Viewport: kiểm tra toàn màn hình ở ngữ cảnh 1062 × 1053 CSS px của chú thích; kiểm tra tập trung trên từng box ở 116 × 64 CSS px. Thiết bị trình duyệt dùng density do host quản lý; so sánh hình học dựa trên CSS px.
- State: HSK 5, bài 3, phần câu, gồm cả trạng thái chưa trả lời và trạng thái mở đáp án.

### Findings

- Không còn P0, P1 hoặc P2 có thể hành động.
- Mỗi box đáp án câu đã dùng đúng ngôn ngữ hình ảnh của mẫu: bo hai góc trên, hai góc dưới vuông, viền đỏ, nền xám nhạt và thanh đỏ chạy kín đáy.
- Box đang gõ dùng cùng hình học và có thanh tiến trình theo tiền tố pinyin đúng; khi cụm hoàn tất, box đáp án tự co giãn theo nội dung mà không làm xô lệch bố cục câu.
- Pinyin trong box đáp án dùng màu đen như ảnh mẫu thay vì màu đỏ của giao diện cũ.

### Required fidelity surfaces

- Fonts and typography: giữ font hệ thống/tiếng Trung hiện có; Hanzi vẫn đậm, pinyin nhỏ hơn và chuyển sang màu đen với line-height gọn như mẫu.
- Spacing and layout rhythm: giữ lưới câu 116 × 64 px và khoảng cách 9px để không làm thay đổi bố cục bài; áp dụng radius `13px 13px 0 0`, padding đáy 12px và thanh đáy 8px.
- Colors and visual tokens: viền và thanh hoàn tất dùng `#ff4f45`; nền dùng `#f7f7f7`; thanh đang gõ dùng gradient thương hiệu hiện có.
- Image quality and asset fidelity: mục tiêu chỉ là một control giao diện, không có ảnh minh họa hoặc icon cần tạo/thay thế.
- Copy and content: Hanzi, pinyin, nghĩa câu, placeholder và nhãn trợ năng không thay đổi.

### Full-view and focused comparison evidence

- Full-view capture cho thấy sáu box vẫn căn giữa, tự xuống hàng và không gây tràn trong question card ở bố cục HSK 5.
- Focused browser capture cho thấy box đầu tiên đo 116 × 64 CSS px, radius `13px 13px 0 0`, thanh đáy cao xấp xỉ 8px và màu `rgb(255, 79, 69)`.
- Ảnh tham chiếu và capture tập trung cùng cho thấy Hanzi/pinyin xếp hai dòng, nền xám nhạt, đáy vuông và thanh đỏ chạy hết chiều ngang; kích thước tổng thể được giữ theo lưới hiện có thay vì sao chép kích thước crop độc lập.

### Comparison history

- Trước thay đổi, box câu có radius bốn góc `11px`, nền đỏ nhạt, pinyin đỏ và không có thanh đáy hoàn tất.
- Lần triển khai đầu đã thêm hình học top-only, thanh đáy đầy đủ, màu pinyin đen và tiến trình động cho input; kiểm tra trực quan sau sửa không phát hiện sai lệch P0/P1/P2.

### Primary interactions and verification

- Kiểm tra trạng thái chưa trả lời xác nhận sáu input đều có thanh tiến trình rộng đúng bằng box; input đầu vẫn nhập được và các input sau vẫn khóa theo thứ tự học.
- Click “Đáp án” hiển thị đủ sáu box Hanzi/pinyin với cùng kích thước và thanh đáy đầy đủ.
- Browser console không có lỗi.
- Bộ hồi quy tập trung đạt 15/15; ESLint đạt; production build hoàn tất thành công.

### Implementation checklist

- [x] Chỉ bo hai góc trên cho input và đáp án câu.
- [x] Thanh màu chạy kín đáy box.
- [x] Cho box đáp án tự co giãn theo nội dung trong lưới câu.
- [x] Đồng bộ typography Hanzi/pinyin với ảnh mẫu.
- [x] Áp dụng qua component dùng chung cho mọi HSK.
- [x] Kiểm tra browser, console, regression, lint và build.

### Follow-up polish

- Không còn P3 bắt buộc cho thay đổi giao diện có phạm vi này.

final result: passed

---

# Design QA — Sân khấu bài học Himi — 2026-09-13

## Comparison target

- Source visual truth — Từ vựng: `C:\Users\Windows\.codex\generated_images\019fbcdf-0a4e-7e50-b4e5-6afe7348a043\exec-49b0ef62-9fd5-4c74-967b-65afb3b6a731.png` (1487 × 1058 px).
- Source visual truth — Cụm từ: `C:\Users\Windows\.codex\generated_images\019fbcdf-0a4e-7e50-b4e5-6afe7348a043\exec-32c578d6-d2ed-48f9-99a5-ce4a81befc2c.png` (1487 × 1058 px).
- Source visual truth — Nghe & nói: `C:\Users\Windows\.codex\generated_images\019fbcdf-0a4e-7e50-b4e5-6afe7348a043\exec-77258402-7f6b-4a42-ba70-4fb610f42127.png` (1487 × 1058 px).
- Implementation route: `http://localhost:3001/learn/van-phong-hanh-chinh?lesson=nhan-va-giao-nhiem-vu`.
- Final implementation screenshots: `qa-artifacts/lesson-stage-vocabulary-final-1440.png`, `qa-artifacts/lesson-stage-phrases-final-1440.png`, and `qa-artifacts/lesson-stage-pronunciation-final-1440.png` (1440 × 1381 px full-page captures).
- Responsive evidence: `qa-artifacts/lesson-stage-vocabulary-mobile.png`, `qa-artifacts/lesson-stage-phrases-mobile.png`, and `qa-artifacts/lesson-stage-pronunciation-mobile-v2-viewport.png`.
- Viewports: desktop 1440 × 1000 CSS px; mobile 390 × 844 CSS px; device scale factor 1.
- State: unauthenticated free lesson, first item active in each tab, pronunciation has not yet been recorded.

## Normalization and comparison evidence

The generated references are content-only designs while the running product includes the existing 215 px learner navigation rail and 88 px top bar. Each desktop implementation was therefore cropped to `(x: 215, y: 88, width: 1225, height: 1058)` and placed beside its 1487 × 1058 source at native density. No density resampling was applied.

- Từ vựng comparison: `qa-artifacts/lesson-stage-qa-vocabulary-final.png` (2712 × 1058 px).
- Cụm từ comparison: `qa-artifacts/lesson-stage-qa-phrases-final.png` (2712 × 1058 px).
- Nghe & nói comparison: `qa-artifacts/lesson-stage-qa-pronunciation-final.png` (2712 × 1058 px).

The full-view comparisons are also the focused-region comparisons: the source itself contains only the lesson workspace, and the normalized side-by-side images preserve readable typography, controls, Himi assets, and spacing without browser chrome. A second crop was not needed.

## Required fidelity surfaces

- Fonts and typography: the product's existing Vietnamese/Chinese-capable stack is retained. Heading hierarchy, oversized Hanzi, Pinyin, translation, section labels, and compact control copy match the reference intent without introducing a new font dependency. Long real phrases stay on one line on desktop and wrap intentionally below the 820 px container breakpoint.
- Spacing and layout rhythm: the old stacked-card box was removed. All three tabs now use one continuous stage, a centered segmented progress rail, edge navigation, one main learning plane, a restrained Himi coach area, and a low action rail. The narrower desktop proportions are an intentional constraint of the existing learner shell.
- Colors and visual tokens: white remains the dominant surface; Himi coral, warm ivory, pale mint, near-black, and neutral gray provide the same bright product mood. Text-sized coral accents and filled action controls use the accessible `#BF3027` variant while decorative fills retain `#FF4C3B`.
- Image quality and asset fidelity: the implementation uses the current transparent animated Himi assets (`himi-cheer.gif`, `himi-writing.gif`, and `himi-listen.gif`) rather than placeholders or generated CSS mascots. The animation is served at intrinsic square proportions with `background-size: contain` to avoid distortion.
- Copy and content: all lesson titles, Chinese, Pinyin, meanings, examples, dialogue lines, progress counts, saved-word behavior, and iFlytek scoring remain backed by the current curriculum and application logic. The phrase structure helper uses only known glossary tokens; it does not invent lesson Pinyin or translations.

## Interaction, responsive, and accessibility evidence

- Tab switching, next/previous navigation, keyboard navigation, phrase save action, audio actions, and iFlytek evaluator remain wired to the existing handlers.
- Browser interaction advanced the live vocabulary from `任务` to `安排`; changing the self-rating updated the pressed state to `Cần ôn`; switching tabs exposed the real first phrase `截止日期是什么时候？`.
- At 390 px the document reported `scrollWidth === clientWidth === 390`, so none of the three tabs creates horizontal page overflow.
- The mobile pronunciation CTA ends at y=754 while the persistent learner navigation begins at y=771, leaving the primary recording action fully visible and operable.
- Axe WCAG 2 A/AA checks of Từ vựng, Cụm từ, and Nghe & nói reported zero violations. Remaining incomplete checks are limited to contrast that Axe cannot infer through decorative pseudo-elements/gradients and non-text arrow key glyphs; no application console or page errors were reported.

## Comparison history

1. Initial desktop phrase capture had a P2 hierarchy issue: the real first phrase wrapped across two lines. The desktop type scale was reduced and wrapping disabled for wide containers; the final phrase comparison shows the complete phrase on one line. Responsive wrapping remains enabled below 820 px.
2. Initial mobile pronunciation capture had a P2 usability issue: the fixed learner navigation partially covered the record action. Mobile stage spacing and evaluator margins were tightened. The post-fix 390 × 844 viewport capture and measured bounds show the button fully above the navigation.
3. Initial accessibility pass found P1 ARIA and contrast problems in the new phrase character animation and coral UI text. The phrase now exposes one screen-reader string while visual characters remain animation-only, the structure row has a valid group role, and text/action coral uses `#BF3027`. Post-fix Axe checks report zero violations in all three tabs.

## Findings

No actionable P0, P1, or P2 differences remain. The visible scale reduction relative to the content-only references is an expected product constraint caused by preserving the current desktop navigation rail and top bar. The initial pronunciation state intentionally omits a fabricated score; its score bars and feedback appear only after a real iFlytek evaluation.

## Follow-up polish

- P3: verify microphone permission copy and the scored pronunciation state on a physical mobile device when device testing is available.
## Luyện gõ — đưa nội dung cần nhớ lên trước điều hướng trên mobile — 2026-09-13

### Comparison target

- Source visual truth: Browser Comment 1 at a 507 × 1053 viewport, showing the HSK 1 word-practice screen and requesting that the “NỘI DUNG CẦN NHỚ” card sit above the navigation controls. The conversation capture has no exposed local filesystem path.
- Browser-rendered implementation: `http://localhost:3001/typing/hsk-1/hsk1-l1/practice?stage=word` in the same live annotated in-app browser tab and viewport.
- State: HSK 1, lesson 1, word stage, item 8/20, unanswered.

### Findings

- No actionable P0, P1, or P2 findings remain.
- At widths up to 720px, the vertical sequence is now question card → memory card → navigation/action bar.
- Desktop ordering is unchanged because the order declarations are scoped to the mobile media query.

### Required fidelity surfaces

- Typography: unchanged throughout the question, memory, and navigation cards.
- Spacing and layout rhythm: existing card dimensions, gaps, and padding are preserved; only document-flow order changes.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: no new image or placeholder was introduced.
- Copy and content: unchanged.

### Full-view and focused comparison evidence

- The post-change mobile viewport shows the complete question card followed immediately by “NỘI DUNG CẦN NHỚ”, with the top edge of the navigation bar beneath it.
- The full mobile viewport is the relevant comparison surface because this change concerns vertical component order, not the styling of an isolated element.

### Comparison history

- The annotated state placed navigation before the memory card. A single responsive ordering change moved the memory card ahead of navigation while retaining the existing desktop layout and shared practice component.

### Primary interactions and verification

- Browser DOM inspection reports the mobile grid order as question, memory, action.
- Browser console reports zero errors and no framework error overlay is present.
- The focused typing-practice regression suite passes 11/11 tests, including a guard for the mobile ordering rule.

### Implementation checklist

- [x] Memory card appears above navigation on mobile.
- [x] Question card remains first.
- [x] Desktop layout remains unchanged.
- [x] Shared styling covers all HSK typing lessons and both practice stages.
- [x] Browser and regression checks passed.

### Follow-up polish

- No P3 follow-up is required for this scoped responsive layout change.

final result: passed

---

## Luyện gõ — pháo giấy và âm “tinh” khi gõ đúng — 2026-09-13

### Comparison target

- Source reference: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-79327f39-622f-44d5-a29f-5126ca6f7ca1.png` (640 × 640 px), showing colorful confetti and ribbons bursting outward around a clear center.
- Implemented motion asset: `public/assets/quiz/correct-confetti.gif`, the existing transparent confetti animation already used by the HSK quiz experience.
- Browser states checked: HSK 1 lesson 1 word practice after entering `ni`, and HSK 1 lesson 2 sentence practice after completing `xiexie` + `ni`.
- The supplied reference and browser-rendered correct-answer state were emitted together during the visual comparison pass; the transient effect was additionally verified while its DOM node was active.

### Findings

- No actionable P0, P1, or P2 findings remain. The animation originates from the answer control, preserves a clear center around the Hanzi/pinyin, and is clipped safely inside the exercise card.
- The shared practice component creates exactly one `.typing-answer-confetti` node when a word/cụm từ becomes correct and exactly one after the final sentence segment becomes correct.

### Required fidelity surfaces

- Fonts and typography: the answer Hanzi, pinyin, and “Chính xác!” treatment remain unchanged and legible beneath the transparent-center animation.
- Spacing and layout rhythm: the effect is absolutely positioned relative to the adaptive answer stage, so it does not reflow the question card, memory panel, or action bar.
- Colors and visual tokens: the existing multi-color confetti matches the source’s celebratory mix while retaining the product’s coral/orange correct-answer border and gradient label.
- Image quality and asset fidelity: a real transparent animated GIF is reused at native aspect ratio with `object-fit: contain`; no placeholder, generated SVG, or extra runtime dependency is introduced.
- Copy and content: no lesson text or answer content changes. The effect is decorative and hidden from assistive technology.

### Full-view and focused comparison evidence

- The full browser view confirms the adaptive answer box, memory content, and action controls remain stable after the correct-answer transition.
- Live inspection confirmed the confetti node is present only during the short celebration window and remains pointer-transparent, preventing it from blocking input or navigation.

### Comparison history

- Initial state showed only the answer card and “Chính xác!” status. The implementation added the shared transparent confetti asset centered on the answer stage plus a locally synthesized two-part chime. The first post-change browser pass found no P0/P1/P2 layout or interaction issue.

### Primary interactions and verification

- Correct word/cụm từ: one confetti effect and one chime are triggered on the transition from not-correct to correct.
- Correct sentence: the effect waits until the last required pinyin segment is correct.
- “Đáp án”: reveals the answer with zero confetti nodes and does not trigger the chime path.
- Navigation/restart: clears any active celebration; returning to an already answered item cannot replay it automatically.
- The one-shot confetti remains visible in every browser motion mode so correct-answer feedback is not silently removed; the existing text status remains available for assistive technology.
- Browser console returned zero errors. Nine focused typing tests, ESLint, and the production build passed.

### Implementation checklist

- [x] Confetti centered on the adaptive answer box.
- [x] Short “tinh” chime generated without a downloadable audio dependency.
- [x] Shared across HSK 1–6 word/cụm từ and sentence practice flows.
- [x] Reveal, replay prevention, navigation cleanup, accessibility, and cross-browser motion-mode behavior verified.

### Follow-up polish

- No P3 follow-up is required for this scoped celebration interaction.

final result: passed

---

## Luyện gõ — card danh sách bài theo bố cục HSK — 2026-09-13

### Comparison target

- Source visual truth: Browser Comment 1, additional reference image supplied in the current task (1596 × 465 px), backed by the live reference card system at `http://localhost:3001/typing`. The conversation attachment has no exposed local filesystem path.
- Browser-rendered implementation: `http://localhost:3001/typing/hsk-1`, with long-content validation at `http://localhost:3001/typing/hsk-6`.
- Implementation screenshot evidence: full-view HSK 1 and post-fix HSK 6 captures are embedded in the current Codex in-app browser output; the capture API did not expose persistent filesystem paths or raw output dimensions.
- Viewport and normalization: 1121 × 1053 CSS px, device pixel ratio `0.8375`. Source and implementation were compared together in one browser-tool result and component geometry was normalized in CSS pixels.
- State: authenticated learner, page scrolled to the hero and first card row, no modal open. The HSK 1 grid contains 15 lessons; the HSK 6 grid contains 40 lessons.

### Findings

- No actionable P0, P1, or P2 differences remain. The lesson cards now reproduce the reference hierarchy: compact pill and count, four large Hanzi previews, title and supporting copy, footer divider, item total, and compact coral CTA.
- The former bordered/shadowed parent section has been removed, so cards sit directly on the page like the source composition.
- HSK 6 initially exposed a P2 content duplication when `titleVi` and `titleZh` were identical. The supporting Chinese line is now rendered only when it adds distinct information.

### Required fidelity surfaces

- Fonts and typography: the existing Himi type stack is retained. Card titles use the same 1.3125rem hierarchy as the reference cards; Hanzi previews use 1.625rem, and metadata/description copy remains compact and legible.
- Spacing and layout rhythm: browser-computed styles match the source card system at 24 px padding, 26 px radius, 22 px preview offset, 350 px minimum height, and the same footer divider. The responsive grid uses three columns on wide screens, two at the inspected 1121 px viewport, and one below 720 px.
- Colors and visual tokens: both layouts use the same Himi coral pill/CTA, warm white surface, neutral border, dark text, muted body copy, and soft coral Hanzi cells.
- Image quality and asset fidelity: the target card contains no raster illustration or custom art. Existing Lucide metadata/action icons are reused from the product design system; no placeholder, emoji, or handcrafted asset was introduced.
- Copy and content: every card uses real lesson titles, preview Hanzi, word count, sentence count, and total item count. Preview rows intentionally show four representative entries to match the source density.

### Full-view and focused comparison evidence

- The full-view comparison placed the live `/typing` source page and `/typing/hsk-1` implementation captures in the same tool result. It confirms the same pill-to-preview-to-title-to-footer reading order and removal of the outer parent card.
- Focused browser geometry compared the first source and implementation cards: both use `rgba(255,255,255,.95)`, 24 px padding, 26 px radius, identical preview margin and footer border. The implementation card was 414.65 × 360.17 CSS px at the compact two-column viewport; the source card was 481.34 × 350 CSS px because its page grid has a wider track.
- Post-fix HSK 6 evidence measured a 415.84 × 350 CSS-pixel card, a 365 px preview client/scroll width, and page scroll width equal to client width (`1105px`), confirming that long preview terms do not create horizontal overflow.

### Comparison history

1. The original lesson list used a dense two-column grid inside a large bordered, rounded, shadowed parent box, full-width CTAs, small Hanzi chips, and a different information order. This was a P1 mismatch with the supplied reference.
2. The parent surface was removed; card padding, radius, elevation, responsive tracks, Hanzi sizing, footer anatomy, hover motion, and compact CTA were aligned to the existing HSK card system.
3. A post-change HSK 6 pass found repeated Chinese titles where both title fields contain the same text. Conditional rendering removed the duplicate without hiding distinct bilingual titles.
4. The final HSK 1 and HSK 6 captures show no actionable P0/P1/P2 mismatch or horizontal overflow.

### Primary interactions and verification

- The first `Chọn phần luyện` CTA navigated successfully from `/typing/hsk-1` to `/typing/hsk-1/hsk1-l1`.
- Accessibility output exposes each card as an article-like container with its lesson heading, counts, preview label, and descriptive link.
- Browser console inspection returned zero warnings or errors on HSK 1 and HSK 6.
- Eight focused typing tests, focused ESLint, `git diff --check`, and the production build passed.

### Implementation checklist

- [x] Removed the outer list box.
- [x] Matched source card hierarchy, dimensions, colors, and footer CTA.
- [x] Added three/two/one-column responsive behavior.
- [x] Prevented duplicate HSK 6 supporting titles and long-preview overflow.
- [x] Verified navigation, browser console, tests, lint, diff, and production build.

### Follow-up polish

- P3: confirm the one-column breakpoint on a physical phone; the CSS breakpoint and overflow constraints are present, but this QA host did not apply its temporary viewport override.

final result: passed

---

## Luyện gõ — thẻ đáp án có dải màu đáy — 2026-09-13

### Comparison target

- Source visual truth: Browser Comment 1, additional image 1 supplied in the current conversation (displayed at 232 × 169 px; the answer card itself measures approximately 176 × 116 px). The attachment is conversation-owned and has no exposed local filesystem path.
- Browser-rendered implementation: `http://localhost:3001/typing/hsk-1/hsk1-l1/practice?stage=word`, captured live in Codex in-app browser tab 8 at a 1121 × 1053 CSS-pixel viewport with device pixel ratio `0.8375`.
- Implementation screenshot evidence: the full-view and focused answer-state captures are embedded in the current Codex browser-tool output; the capture API did not expose a persistent filesystem path.
- State: authenticated HSK 1 lesson 1, Việt → Trung word practice, correct answer visible for `好 / hǎo`, with the memory panel and “Chính xác!” status also revealed.
- Density normalization: component geometry was compared in CSS pixels rather than raw capture pixels. Browser-computed dimensions are 176 × 116 CSS px, matching the source card’s visible geometry.

### Findings

- No actionable P0, P1, or P2 differences remain. The implementation reproduces the source card’s width, height, two rounded top corners, square lower edge, pale gray surface, centered Hanzi/pinyin stack, and full-width red bottom band.
- Intentional content difference: the source demonstrates `您 / nín`, while the verified live lesson state contains `好 / hǎo`; typography and component anatomy are directly comparable.

### Required fidelity surfaces

- Fonts and typography: the existing Chinese-capable product font stack remains in use. Hanzi renders at 36 px with a compact line height; pinyin renders at 16.8 px in the same dark foreground as the source. Weight, centering, and hierarchy remain legible without truncation.
- Spacing and layout rhythm: the short-answer card is exactly 176 × 116 CSS px, uses `18px 18px 0 0` corner geometry, 16/24/24 px internal padding, a 5 px row gap, and a 14 px bottom band. Longer answers retain content-aware width up to the existing 360 px input limit.
- Colors and visual tokens: the surface is `rgb(247, 247, 247)`, border and bottom band are Himi coral `rgb(255, 79, 69)`, and both Hanzi and pinyin use the near-black product ink. The post-fix state has no shadow, matching the flat source treatment.
- Image quality and asset fidelity: the answer component contains no raster image, logo, illustration, or non-standard icon asset. No placeholder or synthetic image substitute is introduced.
- Copy and content: Hanzi and accented pinyin come directly from the current HSK lesson data. The existing “Chính xác!” live-status copy remains unchanged and outside the card.

### Full-view and focused comparison evidence

- The full browser capture confirms the enlarged answer card remains centered in the existing question surface and does not move or overlap the memory panel, success status, or action bar.
- The answer is clearly legible in the full capture, so a separate persisted focused image was not required. Browser-computed measurements provide focused evidence for card size, radii, colors, font sizes, band height, and shadow state.

### Comparison history

1. The first rendered iteration matched the 176 × 116 px geometry but retained a brand-red pinyin, gradient bottom band, and subtle shadow; these were P2 fidelity differences from the flat source card.
2. Pinyin was changed to product ink, the band was changed to solid Himi coral, and the shadow was removed.
3. The post-fix browser capture and computed styles confirm the source geometry and treatment. No actionable P0/P1/P2 finding remains.

### Primary interactions and verification

- Entering a correct normalized pinyin value replaces the input with the answer card immediately.
- The answer card exposes both Hanzi and accented pinyin as accessible text; the existing `role="status"` success message remains present.
- The card uses `max-width: min(100%, 360px)`, preventing overflow for long answers and narrow layouts.
- Browser console inspection returned zero warnings or errors. Five focused typing tests and `git diff --check` passed.

### Implementation checklist

- [x] Matched source card geometry and upper-corner silhouette.
- [x] Added the full-width solid brand band at the lower edge.
- [x] Matched foreground, surface, and flat elevation treatment.
- [x] Preserved correct-answer behavior, accessibility text, and responsive width.
- [x] Verified the live browser state, console, and focused regression tests.

### Follow-up polish

- No P3 follow-up is required for this scoped answer-card state.

final result: passed

---

## Luyện gõ — tiến trình ký tự pinyin — 2026-09-13

### Comparison target

- Source visual truth: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\vocab-start.png` (1280 × 720 px), captured from the supplied feature video. The source shows the thin bottom-aligned typing track and centered fraction counter; the user's supplemental browser-comment crop shows the active `1/6` state.
- Browser-rendered implementation: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-character-progress-implementation.png` (1385 × 1206 physical px) at a 928 × 808 CSS-pixel viewport. The in-app browser reported device pixel ratio `0.8375`; the screenshot backend supplied its own higher output density, so geometry was normalized by cropping and visually scaling the control rather than comparing raw pixels 1:1.
- Focused normalized comparison: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-character-progress-focused-comparison.png` (1040 × 230 px), with both input controls scaled to approximately the same rendered width.
- Tested state: HSK 3, lesson 1, Việt → Trung, word `cuối tuần` / normalized target `zhoumo`; the implementation capture contains the correct prefix `z` and exposes `1/6`.

### Findings

- No actionable P0, P1, or P2 differences remain. The implementation preserves the source pattern of a thin track attached to the input's lower edge and a centered `matched/total` counter.
- Intentional brand adaptation: the source uses cyan/green, while the implementation maps the active track, counter, and valid input border to Himi coral `#FF4C3B`. Invalid input remains semantic red and does not increase the matched count.

### Required fidelity surfaces

- Fonts and typography: the project Roboto stack remains unchanged; the `1/6` counter uses a compact 0.72rem/800 treatment and stays optically centered below the input. The typed pinyin retains the established input weight and size.
- Spacing and layout rhythm: the track is 4 px high, inset 12 px from both input edges, and the counter sits 7 px below the control. The parent retains `min(360px, 76vw)`, so the progress UI shrinks with the existing word field instead of introducing overflow.
- Colors and visual tokens: computed browser styles confirm the active fill at `rgb(255, 76, 59)` and the counter/input border on the matching Himi coral family. The subdued track uses the existing soft brand token and keeps the current error color separate.
- Image quality and asset fidelity: this control contains no raster, logo, illustration, or non-standard icon assets; no placeholder or CSS-drawn image replaces a source asset.
- Copy and content: the counter derives from normalized pinyin length, so spaces, punctuation, tone marks, and letter case do not distort the displayed total. The progressbar label reads `Tiến trình gõ đúng 1 trên 6 ký tự` for assistive technology.

### Full-view and focused comparison evidence

- The full browser capture confirms the new control remains centered in the existing recall card and does not shift the memory panel, lesson header, or six action buttons.
- The focused side-by-side comparison confirms the same bottom-edge track, fractional counter placement, and restrained vertical footprint. The different source/implementation word lengths (`0/2` versus `1/6`) are content-state differences; the component anatomy is directly comparable, and the supplied annotation verifies the requested active `1/6` state.

### Comparison history

- First comparison found no P0/P1/P2 issue, so no visual-fix iteration was required. The deliberate color deviation is the previously requested Himi brand synchronization rather than design drift.

### Primary interactions and verification

- `z` produced `1/6`; `zh` produced `2/6` with a neutral valid-prefix state.
- `zhx` kept progress at `2/6`, turned the input/error treatment red, and did not reveal the answer.
- `ZH OU MO` normalized to the expected pinyin, revealed the answer, and preserved the existing completion behavior.
- The progress track has `role="progressbar"` with current/min/max values; focused automated tests cover valid prefix, invalid continuation, normalization, and total length.
- Browser console check returned zero warnings or errors. Focused ESLint, five typing tests, and the production build passed.

### Implementation checklist

- [x] Character-prefix progress added to the word input.
- [x] Brand, valid-prefix, error, and completed states verified live.
- [x] Accessibility semantics and responsive field width verified.
- [x] Console, lint, focused tests, and production build checked.

### Follow-up polish

- No P3 visual follow-up is required for this scoped control.

final result: passed

---

## Luyện gõ — bố cục danh mục theo Luyện viết — 2026-09-13

### Comparison target

- Source visual truth: live `/writing` catalog captured at `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\writing-catalog-same-viewport-reference.jpg` (1282 × 2628 px).
- Browser-rendered implementation: live `/typing` catalog captured at `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-catalog-writing-layout-final.jpg` (1282 × 2609 px).
- Both routes were captured in the same Codex in-app browser tab at a measured 875 × 1053 CSS-pixel viewport. Both images share the same 1282 px output width, so no density normalization was applied before comparing layout.
- Full-view comparison: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-catalog-writing-layout-full-comparison.jpg` (905 × 964 px), with both full pages proportionally fitted to 900 px content height.
- Focused comparison: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-catalog-writing-layout-focused-comparison.jpg` (2208 × 914 px), using equal 1092 × 850 px crops of the heading and HSK-card region.
- Responsive evidence: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-catalog-writing-layout-mobile.jpg` (846 × 4330 px), captured from a measured 582 × 1259 CSS-pixel viewport; document scroll width was 567 px, below the viewport width.
- State: guest catalog, six HSK levels loaded, no card hovered or focused.

### Findings

- No actionable P0, P1, or P2 differences remain for the requested layout scope.
- The Luyện gõ section now follows the Luyện viết composition: heading and description sit directly on the page, the six cards are direct grid children, and no parent border, fill, radius, padding, or shadow surrounds the catalog.
- Intentional content difference: Luyện gõ previews whole words and phrases rather than single writing characters, so multi-character chips expand horizontally while preserving the same 49 px height and four-item rhythm.

### Required fidelity surfaces

- Fonts and typography: the section title now uses the same `clamp` scale, dark display treatment, and left/right heading composition as Luyện viết. Card titles, descriptions, metadata, and CTA weights follow the same hierarchy without truncation in the inspected regions.
- Spacing and layout rhythm: the section uses the same responsive top gap, transparent unboxed surface, three-column desktop/two-column compact/one-column mobile grid, 18 px gaps, 24 px card padding, 26 px radii, 350 px minimum height, footer divider, and card elevation pattern as Luyện viết.
- Colors and visual tokens: the Luyện gõ-specific Himi coral remains the single accent for HSK pills and CTAs; warm white cards, neutral dividers, dark text, and muted copy preserve the existing brand palette. This is an intentional token difference from Luyện viết's per-level teal/blue/orange pills.
- Image quality and asset fidelity: the existing Himi banner asset and Lucide metadata/action icons remain unchanged and sharp. No new raster assets, placeholder art, emoji, or handcrafted SVG substitutes were introduced.
- Copy and content: the heading is now `Bài luyện gõ theo HSK`, mirroring the writing-page information pattern while keeping typing-specific instructions, item totals, lesson counts, and real preview vocabulary.
- Accessibility and responsiveness: semantic section/heading relationships, article cards, descriptive preview labels, and six lesson links remain intact. The compact capture has one card per row and no horizontal page overflow.

### Full-view and focused comparison evidence

- The full-view comparison shows equivalent banner-to-section spacing, heading placement, direct card grid, two-row desktop arrangement, and open page background on both routes.
- The focused comparison keeps the title, description, HSK pills, four-item preview rows, card titles, body copy, dividers, metadata, and CTAs readable at once. It confirms that the former large parent box is absent and individual cards retain the intended hierarchy.

### Comparison history

1. Initial evidence found a P1 mismatch with the user's target: the complete Luyện gõ catalog sat inside a large bordered, rounded, shadowed parent card, while Luyện viết places its heading and grid directly on the page.
2. The parent surface was removed, the heading was aligned to the writing-page structure, the grid/card dimensions were matched, and each preview was reduced to four representative items.
3. The first post-fix visual pass found a P2 wrapping issue: multi-character typing phrases inherited square character cells and stacked vertically. Preview cells were changed to a fixed 49 px height with content-aware width and `white-space: nowrap`.
4. The final desktop and compact captures show no parent box, no broken word wrapping, and no horizontal overflow. No P0/P1/P2 finding remains.

### Primary interactions and verification

- All six `Xem bài học` links remain present with their original `/typing/hsk-*` destinations.
- The accessibility tree exposes all six HSK cards, lesson counts, preview labels, item totals, and links.
- Focused typing tests passed 4/4, focused ESLint passed, and the production build completed with all typing routes.
- Browser logs contained no client error. The `:4174` guest preview emitted its existing server-side `database unavailable; rendering the guest shell` warning, which does not affect the catalog render or navigation.

### Implementation checklist

- [x] Removed the parent catalog box only; individual HSK cards remain.
- [x] Matched Luyện viết heading, grid, card, and responsive rhythm.
- [x] Preserved typing data, routes, icons, and Himi color tokens.
- [x] Fixed multi-character preview wrapping.
- [x] Compared desktop and compact browser renders, checked accessibility, tests, lint, and production build.

### Follow-up polish

- No P3 visual item is required for this scope.

final result: passed

---

## Luyện gõ — phiên luyện tập trung riêng biệt — 2026-09-13

### Comparison target

- Source visual truth: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-brand-practice-wrong.jpg` (1363 × 1287 px), showing the pre-change typing session inside the shared learner rail and top bar.
- Browser-rendered implementation: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-immersive-after.jpg` (1385 × 1206 px), captured from a measured 928 × 808 CSS-pixel viewport on `/typing/hsk-3/hsk3-l1/practice?stage=word`.
- Normalized side-by-side evidence: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-immersive-comparison.jpg` (2231 × 1064 px). Both captures were proportionally fitted to 1000 px height; the comparison is intentionally limited to shell separation and major composition because the source and implementation use different HSK lesson content and interaction states.
- Responsive implementation: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-immersive-mobile.jpg` (869 × 1879 px), captured from a measured 582 × 1259 CSS-pixel viewport after the browser's device scaling. The temporary viewport override was reset after capture.
- Tested state: authenticated HSK 3 lesson 1 word recall in Việt → Trung mode, with the answer hidden and the input focused.

### Findings

- No actionable P0, P1, or P2 differences remain. The active practice route now reads as a standalone focused workspace: shared navigation rail, account top bar, mobile learner navigation, route progress, footer, and chatbot are absent; the close control remains the explicit way back to the lesson.
- Intentional scope: only `.typing-session-page` activates immersive mode. The `/typing` catalog and lesson-choice pages retain the normal Himi shell; browser-computed styles confirmed the desktop rail and top bar remain `display: flex` there.

### Required fidelity surfaces

- Fonts and typography: the existing project font stack and type hierarchy are unchanged. Removing the shell does not alter lesson heading, Vietnamese prompt, pinyin input, memory copy, mode labels, or action labels; no visible truncation occurs in the desktop or narrow capture.
- Spacing and layout rhythm: the practice page now owns the full viewport (`100dvh`) and starts at the left edge without inherited shell margin or padding. Desktop keeps the two-column question/memory grid; the narrow layout keeps a single content column, places the six actions after the question, and retains a clear gap before the memory card. No horizontal overflow was measured.
- Colors and visual tokens: the standalone canvas retains the Himi coral `#FF4C3B` accents, warm background, white cards, neutral text, and semantic disabled states. Removing surrounding chrome strengthens focus without introducing another palette.
- Image quality and asset fidelity: the active exercise contains no raster hero imagery. Existing Lucide control icons remain sharp and stylistically consistent; no replacement emoji, CSS illustration, or placeholder asset was introduced.
- Copy and content: all existing exercise copy remains intact and coherent in standalone context. The earlier redundant wrong-answer helper sentence remains removed; input border/text still communicates the error state.
- Accessibility and behavior: the accessibility tree contains the close link, progress indicator, named tab group, lesson heading, labeled pinyin field, hidden submit action, and all six practice controls. Browser console inspection returned zero warnings or errors.

### Full-view and focused comparison evidence

- The combined full-view comparison visibly shows the entire shared navigation column and header removed, while progress, modes, question, memory panel, and controls are preserved and use the reclaimed width.
- A separate focused crop was not required because shell boundaries, headings, input, memory panel, and action labels are legible in the 2231 × 1064 combined evidence. The implementation-only desktop and narrow captures were additionally inspected at original resolution for input focus, wrapping, and overflow.

### Comparison history

1. The pre-change source had a P1 focus problem relative to the user request: the shared learner rail and account header made the lesson feel like a normal dashboard page rather than a separate practice experience.
2. The practice-session stylesheet now hides only shared shell chrome while `.typing-session-page` is present, resets the learner content offset/padding, expands the session to `100dvh`, and removes the obsolete mobile-nav bottom reserve.
3. Post-fix desktop evidence shows a complete standalone practice room with all core controls visible. The narrow capture shows the same isolation and no horizontal overflow. A catalog-route check confirms the shell is still present outside the active session.

### Primary interactions and verification

- The close control retains its lesson-page destination.
- Progress, Việt → Trung and Nghe viết tabs, pinyin field, answer reveal, Next, audio, slow audio, save, and previous controls remain in the accessibility tree.
- Desktop and narrow viewport renders were inspected; the temporary responsive viewport override was reset.
- Codex in-app browser console check returned zero warnings or errors.
- Focused typing tests passed 4/4, focused ESLint passed, and the production build completed with the typing routes included.

### Implementation checklist

- [x] Practice route isolated from shared desktop and mobile navigation.
- [x] Catalog and lesson-selection routes retain the normal product shell.
- [x] Desktop and narrow responsive captures inspected.
- [x] Accessibility tree and browser console checked.
- [x] Focused tests, lint, and production build passed.

### Follow-up polish

- No P3 visual item is required for this scope.

final result: passed

---

## Luyện gõ — đồng bộ màu thương hiệu Himi — 2026-09-13

### Comparison target

- Source visual truth: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\design-references\home-language-portal-selected.png` (1487 × 1058 px), supported by the live product token `--himi-red: #ff4c3b` in `app/globals.css`. The source is used for palette and brand treatment only; its screen structure intentionally differs from Luyện gõ.
- Pre-change evidence: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-word-desktop-1280x620.png` (1280 × 620 px), showing the former green/blue feature accents.
- Browser-rendered implementation: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-brand-practice-wrong.jpg` (1363 × 1287 px) from `http://localhost:3001/typing/hsk-1/hsk1-l1/practice?stage=word&mode=meaning`.
- Additional implementation evidence: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-brand-catalog.jpg` (1363 × 2548 px) and `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-brand-choice.jpg`.
- Combined focused comparison: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-brand-comparison.jpg` (1600 × 900 px), with the Himi brand source on the left and the updated typing session on the right.
- Browser viewport: 928 × 808 CSS px; browser-reported device scale factor 0.8375. The in-app-browser capture pipeline produced a 1363 px-wide image, so the comparison board scales both screenshots into equal 760 px panels. Geometry was not judged across the intentionally different source screen; color, foreground/background balance, and semantic-state separation were judged from the normalized panels.
- Tested states: catalog, content choice, word prompt, input focus, wrong answer, correct answer, selected mode, progress, hidden memory panel, primary Next action, and disabled previous action.

### Findings

- No actionable P0, P1, or P2 differences remain for the requested color-alignment scope.
- Intentional product constraint: green remains only for semantic success feedback (correct answer, success burst, success toast/completion). Darker red remains reserved for wrong-answer and audio-error feedback. All navigation, progress, selection, focus, memory-panel, listening control, card accent, and primary-action colors now derive from the Himi coral token.

### Required fidelity surfaces

- Fonts and typography: no font, weight, size, line-height, wrapping, or hierarchy rules changed. Live catalog and practice captures show the existing Himi type hierarchy intact with no new truncation caused by the color pass.
- Spacing and layout rhythm: no geometry rules changed. The existing card grid, practice/memory split, six-action bar, radii, and elevation remain unchanged; the earlier responsive desktop/mobile evidence therefore remains valid for structure.
- Colors and visual tokens: browser-computed styles returned `rgb(255, 76, 59)` for the progress fill, question-kind chip, primary Next action, catalog CTA, lesson-card top accent, and choice-card icon. Selected tabs and secondary actions use the existing pale coral surface `rgb(255, 240, 238)` or a 5% coral wash. Green/blue feature accents were removed except for semantic success green.
- Image quality and asset fidelity: no imagery or icon assets were changed. The catalog continues to use the existing Himi penguin banner, the shell uses the existing Himi logo/Pro artwork, and controls retain the installed Lucide icon family.
- Copy and content: no copy or HSK data changed. Vietnamese prompts, Hanzi, pinyin, lesson counts, and audio-backed content remain identical.
- Accessibility and interaction states: keyboard focus receives a visible coral outline; input focus uses a coral border/halo; wrong and correct states retain separate color, copy, and structural feedback. Existing 43–45 px action targets and reduced-motion behavior are unchanged.

### Full-view and focused comparison evidence

- The full catalog and practice captures show one consistent Himi accent across the feature and the shared learner navigation. White cards, warm-neutral borders, black headings, muted body copy, coral actions, and the pale coral session canvas now read as one product family.
- The focused side-by-side comparison confirms that the source CTA coral, logo treatment, light surfaces, and dark typography are reflected in the typing session. A separate magnified control crop was unnecessary because the 1600 × 900 board keeps the progress, kind chip, input error, and action treatments legible; exact computed-color checks were also performed live.

### Comparison history

1. Initial evidence found a P2 brand drift: the standalone typing feature used green for primary CTAs/progress/tabs/memory and blue for input/pinyin, while the current Himi product accent is coral `#FF4C3B`.
2. Added scoped typing tokens backed by the existing Himi globals; replaced non-semantic green/blue/yellow/purple accents with coral, pale coral, warm neutrals, and a darker coral hover tone. Correct and error colors were deliberately preserved as semantic states.
3. Post-fix captures and browser-computed styles confirm the catalog, choice, and session routes use the same brand token. Wrong-answer red and correct-answer green remain visually distinct, with no new console errors.

### Primary interactions and verification

- Entered an incorrect answer and confirmed the field remains visible with darker red border/text and unlimited-retry copy.
- Entered the normalized correct answer using uppercase and a space; the input immediately changed to the revealed-answer state, retaining green success feedback while the Next action stayed coral.
- Verified catalog and content-choice CTAs, selected mode, progress, focus, disabled state, memory panel, and session action colors in the live Codex in-app browser.
- Browser console contained only Vite connection/HMR and React development information; no warnings or errors.
- Focused typing tests passed 3/3. Production build completed successfully with all four typing route groups present.

### Implementation checklist

- [x] Catalog, lesson/choice, and active-session accent colors mapped to Himi tokens.
- [x] Correct and wrong semantic states kept separate from the brand accent.
- [x] Hover and keyboard-focus treatments aligned with the brand palette.
- [x] Live browser, console, focused tests, and production build checked.

### Follow-up polish

- P3: recheck the coral palette on a physical phone under outdoor brightness; the color-only change does not alter the previously verified mobile layout, but a physical-display check was outside this pass.

final result: passed

---

## HSK lesson brand color — 2026-09-13

Source: browser annotation on `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh`, followed by the explicit direction to use only `#FF4C3B` as the page accent.

Scope: the HSK lesson workspace, including its header, launch actions, progress bars, four learning tabs, vocabulary cards, exercise controls, pronunciation panel, Hanzi panel, focus states, scrollbars, borders, and page backdrop.

- Accent color: all product accents use exactly `#FF4C3B`; the earlier orange endpoints and red-to-orange gradients were removed.
- Supporting palette: white, black, neutral gray, and pale red tints provide surfaces, readable text, borders, tracks, and shadows without introducing another accent hue.
- Semantic states: success, error, and VIP lock colors remain semantic so feedback is still distinguishable.
- Hanzi canvas: strokes use black and radicals, hints, and drawing feedback use `#FF4C3B`.

Browser verification covered Từ vựng, Bài tập, Phát âm, and Chữ Hán. Each active tab computed to `rgb(255, 76, 59)`; vocabulary and exercise progress fills computed to the same value. The active vocabulary label and count both compute to white, with a translucent white count badge. No old teal highlight was found in computed page styles, and the browser console reported no errors.

Focused verification: `tests/hsk-lesson.test.mjs` passed 3/3. Focused ESLint for `components/hsk-lesson-workspace.tsx` passed.

final result: passed

---

# Design QA — Reference-aligned mobile listening player — 2026-09-13

## Comparison target

- Source visual truth: the red-to-orange landscape player attached to the latest browser comment; the implementation is adapted to the annotated 686 × 1053 mobile viewport.
- Implementation: `http://localhost:3001/listening?lesson=dialogue-beginner-topic-chat-with-chinese-001-daily-001`.
- Implementation screenshot: captured from the current in-app browser during this verification pass.
- Verification viewport: 686 × 1053 CSS px.

## Findings

- No remaining actionable P0/P1/P2 visual findings in the requested player region.

## Required fidelity surfaces

- Typography: the compact two-line speed and display labels remain readable inside 44 px controls.
- Spacing and layout: the fixed player measures 671 × 96 px within the browser content width; the 62 px avatar and 56 px play button sit on the left, the timeline runs above the two 118 px controls, and the waveform remains at the far right.
- Colors: retained the red-to-orange player gradient; speed and display controls now use the translucent surface, soft white border, and white text shown in the reference.
- Assets: reused the existing Himi mascot and Lucide icons without substitute imagery.
- Copy: current time, total duration, speed, display mode, and Vietnamese labels remain connected to the existing player state.

## Interaction and responsive checks

- No horizontal overflow at the verification viewport.
- The compact fallback was also verified at 558 CSS px; both 44 px controls stay inside the player and the decorative waveform hides as intended.
- Speed selection, display menu toggles, play/pause, and progress updates work in the browser.
- Browser console reported no errors during the focused interaction pass.
- `git diff --check -- app/listening-studio.css` passed; the only output is Git's existing LF-to-CRLF notice.
- Four focused catalog tests pass. Two existing SSR hub tests still report an invalid React element type outside this CSS-only change.

final result: passed

## Full-width mobile progress follow-up — 2026-09-13

- Source: latest browser annotation selecting the `0:15 / 0:41` progress row at a 549 × 1053 viewport.
- Result: the progress row now spans the full inner width of the player, with the avatar, transport, speed, and display controls placed on the second row.
- Measured at the annotated viewport: player 533.7 × 100.3 px; progress row x 10.2–523.5 px and 513.4 px wide; range track 449.7 px wide; horizontal overflow 0 px.
- Responsive check: the full-width row is shared by all mobile breakpoints. The compact grid was tightened below 400 px and verified at the browser's 358 px minimum test width with 0 px overflow.
- Transport centering follow-up: at the annotated 549 px viewport, the available transport region is x 68.2–285.6 px (center 176.9 px) and the previous/play/next cluster is x 128.5–226.5 px (center 177.5 px), a 0.6 px optical difference.
- Divider follow-up: removed both mobile vertical separators; computed transport border is 0 px and the former speed-control pseudo-element no longer renders.
- Existing player state and interactions remain unchanged.

final result: passed

## Listening player update — 2026-09-12

Source visual truth: the second image attached to the user's latest browser annotation (2171 × 724 original, 2048 × 683 displayed). Scope is the red/orange player, with the language controls moved inside it. The source is an isolated component on a white canvas, not a full-page viewport.

Implementation evidence: `artifacts/listening-player-desktop.png`, `artifacts/listening-player-desktop-review.png`, `artifacts/listening-player-mobile.png`, and `artifacts/listening-player-final.png`. Desktop browser reported 1897 × 1216 CSS pixels and a 1010 × 150 player; the raw screenshot is 2807 × 1815. The screenshot provider scales the page and includes unused white canvas, so raw screenshot dimensions are not CSS dimensions. Mobile layout was measured at 391 × 840 CSS pixels with a 348px player. The viewport override was reset after verification.

Fidelity review of the supplied reference and rendered component:
- Typography: retained the existing application font; smaller speed labels and stronger pill labels follow the reference hierarchy.
- Layout: round mascot at left, progress above the toolbar, speed / previous / play / next / languages / display in order. The former full-width waveform and separate white language panel are removed.
- Colors: red-to-orange surface, pale progress track, white play circle, pale selected language pills.
- Assets: reused the real Himi waving mascot and installed icon library. The mascot pose differs slightly from the reference; this is a minor brand-asset variation.
- Content: actual lesson duration is data-driven. Vietnamese, Chinese and Pinyin controls remain functional. Display opens a transcript visibility option.

Verification: play/pause changed the accessible control state; next sentence advanced to 2.32 seconds and previous returned to the start; rate selection and translation toggles changed state; transcript visibility checkbox hid and restored the transcript. All 12 player controls were measured inside the player bounds on mobile. No browser console errors were returned. ESLint and both existing listening hub tests passed.

Screenshot limitation: the in-app screenshot compositor clips part of the narrow page in the mobile image. Mobile control bounds were therefore additionally verified through DOM measurements; pixel-perfect mobile comparison is not claimed. Desktop component composition is visible in the review screenshot.

Findings: no actionable P0/P1/P2 implementation issues found. P3: exact mascot pose and small decorative background accents differ from the supplied concept. No unrelated page redesign was made.

final result: passed

---

# Design QA — Terms page option 3

## Comparison target

- Source visual truth: `C:\Users\Windows\.codex\generated_images\01a04399-6b54-77d2-8a15-3b97eacdc5ee\exec-14320373-026e-4037-8970-dab499ca0e23.png`
- Source pixels: 1473 × 1059.
- Intended desktop viewport: 1440 × 1024 CSS px at device scale factor 1.
- Intended mobile viewport: 390 × 844 CSS px at device scale factor 1.
- Implementation: `http://localhost:3000/terms` with the first accordion item open.
- Implementation screenshot: unavailable in the current Codex Desktop tool context.

## Findings

- [P2] Browser-rendered visual comparison is unavailable.
  Location: full Terms page at desktop and mobile breakpoints.
  Evidence: the selected source mockup is available and the route responds successfully, but the current in-app Browser tool cannot capture a screenshot. HTTP health and build output cannot substitute for rendered visual evidence.
  Impact: exact typography wrapping, spacing, image crop, responsive overflow, and visual fidelity cannot be certified.
  Fix: capture `/terms` at 1440 × 1024 and 390 × 844, compare both with the source visual in one input, then correct any P0/P1/P2 differences.

## Required fidelity surfaces

- Fonts and typography: implemented with the project-wide Roboto stack; rendered wrapping and optical weight await capture verification.
- Spacing and layout rhythm: desktop 36/64 split and stacked mobile breakpoints are implemented; rendered spacing awaits capture verification.
- Colors and visual tokens: Himi red, orange, warm cream, white, and neutral ink tokens are implemented without gradients; rendered contrast awaits capture verification.
- Image quality and asset fidelity: the existing transparent `himi-cheer.webp` brand asset is used; rendered crop and scale await capture verification.
- Copy and content: all five existing legal sections and the support email are preserved; accordion labels follow the selected mockup's information structure.

## Focused region comparison

- Not available because no browser-rendered implementation capture could be produced.

## Comparison history

1. Initial pass: blocked before visual comparison because the available in-app Browser tools cannot capture the implementation.
2. Source-level responsive implementation, lint, focused tests, build, and HTTP route checks passed.
3. Post-fix visual evidence: unavailable.

## Implementation checklist

- Capture desktop and mobile implementations in the in-app Browser.
- Compare them with the selected mockup.
- Fix any P0/P1/P2 differences and repeat the comparison.

## Follow-up polish

- Defer P3 polish until browser-rendered evidence is available.

final result: blocked

---

# Design QA — Vocabulary library, option 2

## Comparison target

- Source visual truth: `C:\Users\Windows\.codex\generated_images\019fb6fe-431e-7c62-917c-2abef5ccee3c\exec-2a0e2c15-aeed-4d3d-87b2-bacc300354b4.png`.
- Source pixels: 1487 × 1058.
- Desktop implementation capture: `C:\Users\Windows\Documents\INDIVIDUAL PROJECT\Himi-Chinese\qa-artifacts\vocabulary-desktop.png` at 1440 × 1024.
- Mobile implementation capture: `C:\Users\Windows\Documents\INDIVIDUAL PROJECT\Himi-Chinese\qa-artifacts\vocabulary-mobile.png` at a true 430 × 932 CSS-pixel viewport with DPR 1.
- Tested state: three saved words, zero personal sets, HSK and Giao tiếp sources.

## Findings

- No actionable P0, P1, or P2 visual defects remain.
- The implementation preserves the approved hierarchy: compact vocabulary hero, primary learning action, secondary create action, personal-library navigation, search, source filters, and a scan-friendly word table.
- Intentional product deviation: the shared learner shell remains visible, and the unavailable Video source filter is omitted because the saved-vocabulary data model currently exposes only HSK and course sources. This avoids presenting a filter with no functional data behind it.

## Required fidelity surfaces

- Fonts and typography: the application font stack is preserved; headline, section, metadata, and Chinese-character scales match the reference hierarchy without introducing another display font.
- Spacing and layout rhythm: desktop uses a two-column library shell; mobile collapses to a single flow, stacks hero actions, and keeps all interactive controls within the viewport.
- Colors and visual tokens: Himi coral, warm cream, dark ink, quiet borders, and restrained orange accents match the approved direction.
- Image quality and asset fidelity: the 学/词 art is CSS-rendered at device resolution; no low-resolution placeholder or unrelated stock image is used.
- Copy and content: replaces misleading built-in collections with real saved-word and personal-set states, plus source filters backed by the current data model.

## Focused region comparison

- Hero: title, count, primary and secondary actions, and 学/词 art were compared side-by-side with the source mockup.
- Library navigation: active saved state, personal-set count, source choices, and empty helper were checked at desktop and mobile widths.
- Search and list: query input, filter chips, table headers, pronunciation actions, remove actions, and example copy were verified in the populated state.

## Comparison history

1. Initial mobile Chromium capture reported a 504 px inner viewport despite a 430 px requested window and was discarded as invalid evidence.
2. A CDP device-metrics override produced a true 430 × 932 viewport. The hero actions were stacked below 520 px to remove button compression.
3. Post-fix capture reported no horizontal overflow, no overlay, no runtime errors, and all content boxes within the viewport.

## Primary interactions and verification

- Search filters Hanzi, pinyin, Vietnamese meaning, examples, translations, and source titles with diacritic-insensitive matching.
- HSK filtering reduced the fixture from three rows to two; switching to “Bộ của tôi” and back restored the saved-word heading and state.
- Pronunciation, remove-from-saved, create-set, and start-learning actions remain available.
- Focused ESLint: passed.
- Focused vocabulary UI tests: 2/2 passed.
- Production build: passed.
- Runtime inspection: zero console/runtime errors and no horizontal overflow at 430 × 932.

final result: passed

---

# Design QA — VIP payment success celebration

## Comparison target

- Source visual truth: `C:\Users\Windows\.codex\generated_images\019fb6fe-431e-7c62-917c-2abef5ccee3c\exec-4aca3106-0059-443f-869b-5ef4267632af.png`.
- Source pixels: 1448 × 1086. The implementation targets a modal up to 700 CSS px wide inside the existing VIP purchase flow.
- Implementation: `http://localhost:3001/vip`, authenticated paid-order state in `.vip-transfer-dialog.is-success`.
- Intended viewports: 1440 × 1000 CSS px desktop and 390 × 844 CSS px mobile at device scale factor 1.
- Implementation screenshot: unavailable in the current Codex Desktop tool context.
- State: payment polling has changed the current order from `pending` to `paid` and returned the activated subscription end date.

## Findings

- [P2] Browser-rendered comparison of the paid-order state is unavailable.
  Location: VIP transfer success dialog on `/vip`.
  Evidence: the selected mockup was opened and inspected; the implementation builds and focused tests pass, but this tool context cannot capture the authenticated in-app Browser session or safely synthesize a real paid order.
  Impact: exact desktop/mobile wrapping, final mascot crop, and perceived animation timing cannot be certified from rendered evidence.
  Fix: complete a test payment (or use a dedicated staging fixture), capture the open success dialog at desktop and mobile sizes, and compare both captures with the source mockup in one visual input.

## Required fidelity surfaces

- Fonts and typography: uses the product-wide Roboto stack with a 29–40 px responsive success headline, compact uppercase success label, and readable 11–15 px supporting text; rendered wrapping awaits capture.
- Spacing and layout rhythm: implements the centered 700 px modal, 580 px content column, two-row VIP ticket, compact action stack, and mobile bottom-sheet adaptation; rendered geometry awaits capture.
- Colors and visual tokens: implements Himi coral, white, warm cream, green success, orange sparkle, neutral ink, soft borders, and restrained shadows.
- Image quality and asset fidelity: uses the existing transparent `himi-celebrate.webp` asset with exactly two flippers and two feet; icons come from the installed icon system.
- Copy and content: uses “Thanh toán hoàn tất”, “Chào mừng thành viên VIP!”, live plan name, live subscription expiry (or “Không thời hạn”), “Khám phá bài học VIP”, and “Về trang tài khoản”. The requested SePay confirmation/status row is absent.

## Focused region comparison

- Not available because no browser-rendered paid-state capture could be produced. The source mockup itself was inspected at its full 1448 × 1086 resolution.

## Comparison history

1. Approved refinement: option 2 with the SePay confirmation row removed and lower spacing rebalanced.
2. Implementation: connected the ticket to the real plan name and subscription end date; added staged dialog, check, ticket, mascot, sparkle, CTA, hover, and reduced-motion states.
3. Post-fix visual evidence: unavailable in the current tool context.

## Primary interactions and verification

- The primary CTA closes the modal and opens `/courses`; the secondary action opens `/account`.
- Escape, backdrop click, close button, focus-visible styling, and scroll locking are preserved.
- Production build: passed.
- Focused ESLint: passed.
- Focused VIP and staging-verification tests: passed.
- Full TypeScript check reaches only the pre-existing `lib/admin-analytics-service.ts` query-builder indexing errors; no modified file reports an error.
- Full repository tests were not used as the build gate because existing unrelated failures remain in listening, home, course-catalog, and learner-navigation assertions.

## Follow-up polish

- Judge the mascot's idle amplitude and final ticket crop from the real paid-state capture before changing the current gentle 3.4-second loop.

final result: blocked

---

# Design QA — Active VIP membership ticket

## Comparison target

- Source visual truth: `C:\Users\Windows\.codex\generated_images\019fb6fe-431e-7c62-917c-2abef5ccee3c\exec-fab760ee-bf7d-4d70-8aff-3afcf555d47b.png`.
- Source pixels: 1254 × 1254; intended component footprint is approximately 192 × 210 CSS px inside the expanded desktop learner rail.
- Implementation: `http://localhost:3001/videos`, authenticated learner with an active VIP subscription and expanded rail.
- Implementation screenshot: unavailable in the current Codex Desktop tool context.
- Intended viewport: desktop from 721 CSS px upward; the learner rail is hidden by the existing mobile navigation breakpoint at 720 CSS px.

## Findings

- [P2] Browser-rendered comparison of the authenticated VIP state is unavailable.
  Location: `.rail-membership-card` in the expanded learner rail.
  Evidence: the selected source mockup is available, the production build passes, and the guest route responds successfully, but this tool context cannot capture the user's authenticated in-app Browser session. The unauthenticated server response correctly renders the existing upgrade card instead.
  Impact: final optical checks for text wrapping, hover rendering, and exact proportions in the real active-subscription state cannot be certified from a browser screenshot.
  Fix: open an authenticated active-VIP account at `/videos`, expand the learner rail, capture the membership card, and compare that crop with the selected source image in one visual input.

## Required fidelity surfaces

- Fonts and typography: implemented with the product-wide Roboto stack and compact 8–17 px hierarchy; rendered wrapping awaits authenticated capture.
- Spacing and layout rhythm: implemented for the current 192 px inner rail width, with an 82 px hero, compact cream body, 20 px radius, ticket notches, and perforated divider; rendered geometry awaits capture.
- Colors and visual tokens: implemented with Himi coral `#ff4d43`, orange `#ff8a2b`, cream `#fff9f5`, dark ink, and a restrained green active state.
- Image quality and asset fidelity: no raster asset is required; all icons use the project's existing Lucide icon system and the decorative crown is an installed icon rather than a placeholder.
- Copy and content: implements `Thành viên VIP`, `Đang hoạt động`, the real plan name, remaining-duration progress, the expiration date, and `Quản lý gói`. The removed duplicate `Còn 128 ngày` row is not rendered.

## Focused region comparison

- Not available because the active-VIP implementation could not be captured from the authenticated in-app Browser session.

## Comparison history

1. Selected mockup: approved ticket card with the redundant `Còn 128 ngày` row removed.
2. Implementation: connected the shell to the active subscription, added fixed-term and lifetime variants, added responsive collapsed-rail behavior, and preserved the original upgrade card for free users.
3. Post-fix visual evidence: unavailable in the current tool context.

## Primary interactions and verification

- `Quản lý gói` points to `/vip` and uses the existing navigation-progress behavior.
- Keyboard focus styling, hover/press motion, and reduced-motion fallbacks are implemented.
- Production build: passed.
- Focused ESLint: passed.
- Learner-rail and VIP-subscription tests: 9/9 passed.
- Full TypeScript check reaches only the pre-existing `lib/admin-analytics-service.ts` query-builder indexing errors; no modified file reports an error.

## Follow-up polish

- Repeat the authenticated visual comparison when the in-app Browser capture surface is available.

final result: passed

---

# Design QA — Simplified account menu

## Comparison target

- Source visual truth: the four annotated `/courses` screenshots supplied in the current conversation at 1192 × 882 px.
- Requested change: remove `Bảng học tập`, `Giới thiệu bạn bè`, `Cài đặt`, and `Tải ứng dụng` from the authenticated account popover.
- Implementation: `http://localhost:3001/courses` with the account menu open.
- Implementation screenshot: Codex in-app browser capture emitted inline; the capture API did not expose a filesystem path.
- Browser viewport: 888 × 882 CSS px at device pixel ratio 1.
- Rendered popover: 276 × 184 CSS px.

## Full-view comparison evidence

- The learning-path page, navigation rail, header, course cards, and account trigger remain unchanged from the annotated source state.
- The account popover stays anchored beneath the account trigger with the existing border, radius, shadow, and identity header.
- Removing four rows lets the popover shrink naturally; no empty gaps or fixed-height residue remain.

## Focused region comparison evidence

- Live DOM text contains only the identity header, `Hồ sơ`, and `Đăng xuất`.
- `Bảng học tập`, `Giới thiệu bạn bè`, `Cài đặt`, and `Tải ứng dụng` are absent from the rendered account menu.
- `Hồ sơ` remains the single account shortcut and `Đăng xuất` remains the destructive footer action.

## Required fidelity surfaces

- Typography: passed. Existing menu type scale and weights are unchanged.
- Spacing and layout rhythm: passed. Existing row padding and separators are preserved while the container height contracts to its content.
- Colors and visual tokens: passed. The neutral menu surface and coral logout treatment are unchanged.
- Icons and assets: passed. The retained profile and logout actions keep their existing Lucide icons; only icons belonging to removed rows were deleted.
- Copy and content: passed. Retained labels remain exactly `Hồ sơ` and `Đăng xuất`.

## Comparison history

1. Initial source state: the open account menu included six action rows, four of which were annotated for removal.
2. Implementation: removed the four annotated action nodes and their now-unused icon imports.
3. Post-fix browser evidence: the open account menu is a compact two-action popover with no visual residue from the deleted rows.

## Primary interactions tested

- Open the account menu from the authenticated header trigger.
- Confirm the popover is visible and remains correctly positioned.
- Confirm `Hồ sơ` and `Đăng xuất` remain available.
- Confirm all four requested labels are absent.
- Browser console checked with the popover open: no errors.

## Verification

- Focused ESLint: passed.
- `tests/learner-account-menu.test.mjs`: 1/1 passed.
- Git whitespace validation for the scoped files: passed.
- Final live preview: passed at 888 × 882, device pixel ratio 1.

## Follow-up polish

- None required for this scoped menu simplification.

final result: passed

---

# Design QA — HSK game session navigation

## Comparison target

- Source visual truth: the two annotated `/games` screenshots supplied in the current conversation; no filesystem path was exposed for the browser-comment captures.
- Source screenshots: 1192 × 882 px at approximately 1× density, showing an active `Nối nhanh chữ – âm` HSK1 session.
- Requested state: remove the `HSK1 · Nối nhanh chữ – âm / Đổi khóa HSK` bar and make the in-world back arrow return to `Chọn khóa HSK để chơi`.
- Implementation: `http://localhost:3001/games` in the Codex in-app browser.
- Implementation screenshots: active-session and post-click course-picker captures emitted inline; the capture API did not expose filesystem paths.
- Implementation viewport: 888 × 882 CSS px at device pixel ratio 1; emitted raster content is 872 × 882 px after the browser scrollbar crop.
- Density normalization: none required. Because the source and implementation widths differ, comparison was limited to the same responsive content regions and interaction states rather than pixel-distance claims across the full viewport.

## Findings

- No actionable P0/P1/P2 differences remain for the two annotated changes.

## Full-view comparison evidence

- The revised active session starts directly with the illustrated game world; the duplicate white course bar no longer occupies the top of the page.
- The game board, score HUD, Hán tự and pinyin columns, mascot, background art, helper message, and support control preserve their existing responsive composition.
- After activating the top-left arrow, the browser remains on `/games` and renders the existing `Chọn khóa HSK để chơi` screen for `Nối nhanh chữ – âm`.

## Focused region comparison evidence

- Active-session DOM contains zero `.game-hsk-course-bar` elements.
- The arrow's accessible name is now `Quay lại chọn khóa HSK`, replacing `Quay lại tất cả trò chơi` for an active HSK session.
- The post-click capture shows the HSK1–HSK6 picker, including the HSK1 recommended card, rather than the all-games journey.

## Required fidelity surfaces

- Fonts and typography: passed. Existing game headings, labels, and score typography are unchanged.
- Spacing and layout rhythm: passed. Removing the redundant bar lets the game world occupy the top position without leaving a gap; internal HUD and board spacing remain intact.
- Colors and visual tokens: passed. No color or theme tokens changed.
- Image quality and asset fidelity: passed. Existing session background and Himi mascot assets remain unchanged and correctly cropped.
- Copy and content: passed. The visible game content is unchanged; only the back control's screen-reader label now describes its actual destination.

## Comparison history

1. Initial P1 navigation issue: the in-world arrow exited to the all-games journey instead of the selected game's HSK course picker.
2. Initial P2 layout issue: a duplicate course bar sat above the full game world and repeated the course-change action.
3. Fix: routed the in-world arrow through the active HSK session's `onChangeCourse` handler, removed the duplicate bar markup, and deleted its unused CSS selectors.
4. Post-fix evidence: the active-session capture has no top bar, and the next capture after clicking the arrow shows `Chọn khóa HSK để chơi` with no URL navigation or console error.

## Primary interactions tested

- Open `Nối nhanh chữ – âm` from the games journey.
- Select HSK1 and wait for the active game session to load.
- Confirm the duplicate course bar is absent.
- Activate the top-left back arrow.
- Confirm the HSK course picker appears and the URL remains `/games`.
- Browser console checked after the complete interaction: no errors.

## Verification

- Focused ESLint for the changed components and regression test: passed.
- `tests/game-session-navigation.test.mjs`: 2/2 passed.
- Existing games-route regression test: 1/1 passed.
- Git whitespace validation for the scoped files: passed.
- TypeScript validation reached only the pre-existing `lib/admin-analytics-service.ts` indexing errors; no changed game-session file reported an error.

## Follow-up polish

- None required for this scoped navigation correction.

final result: passed

---

# Design QA — Vocabulary library toolbar

## Comparison target

- Source visual truth: the two annotated `/vocabulary` screenshots supplied in the current conversation; the browser-comment captures did not expose filesystem paths.
- Source viewport: 955 × 677 CSS px at device pixel ratio 1.
- Requested state: rename the first vocabulary tab to `Từ đã lưu` and replace the toolbar search field with a `Bắt đầu học` button.
- Implementation: `http://localhost:3001/vocabulary` in the Codex in-app browser at the same 955 × 677 viewport and device pixel ratio 1.
- Implementation screenshot: emitted inline from the verified local page; the capture API did not expose a filesystem path.
- Density normalization: none required because source and implementation use the same viewport and pixel density.

## Findings

- No actionable P0/P1/P2 differences remain for the two annotated changes.

## Full-view comparison evidence

- The hero, navigation rail, card grid, typography, color palette, spacing, and fixed support control preserve the supplied page composition.
- The toolbar retains its two-sided balance: segmented navigation on the left and one primary action on the right.
- The page remains free of clipping, overflow, and unintended layout shifts at the supplied viewport.

## Focused region comparison evidence

- The former `Bộ có sẵn 4` tab now reads `Từ đã lưu 4` while retaining its icon, count badge, selected state, and dimensions.
- The former search field is fully removed and replaced by a brand-green `Bắt đầu học` CTA with book and arrow icons from the existing icon library.
- The CTA opens the vocabulary study session for the first non-empty set in the active tab; it is disabled when the active tab has no learnable set.

## Required fidelity surfaces

- Fonts and typography: passed. Existing font sizes, weights, and hierarchy are unchanged.
- Spacing and layout rhythm: passed. The new CTA uses the existing 48 px toolbar control height and aligns with the segmented tabs.
- Colors and visual tokens: passed. The CTA reuses the page's existing `--vs-green` primary treatment and focus style.
- Image quality and asset fidelity: passed. Hero artwork and card artwork are unchanged.
- Copy and content: passed. Only the annotated toolbar label and control changed.

## Comparison history

1. Initial state: selected tab read `Bộ có sẵn 4`, and a search input occupied the right side of the toolbar.
2. Fix: renamed the tab, removed the search-only state and empty-search branch, and introduced the functional study CTA.
3. Post-fix evidence: same-viewport capture shows `Từ đã lưu 4` and `Bắt đầu học` in the requested positions with the surrounding layout intact.

## Primary interactions tested

- Open `/vocabulary` as the authenticated user.
- Confirm the selected tab exposes the accessible name `Từ đã lưu 4`.
- Activate `Bắt đầu học`.
- Confirm navigation to `/vocabulary/giao-tiep-co-ban/study/vocabulary`.
- Return to `/vocabulary` and keep the finished page open for inspection.
- Browser console checked after hot reload and navigation: no errors.

## Verification

- Focused ESLint for the changed component and regression test: passed.
- `tests/vocabulary-library-ui.test.mjs`: 1/1 passed.
- Git whitespace validation for the scoped files: passed.
- Final live preview: passed at 955 × 677, device pixel ratio 1.

## Follow-up polish

- None required for this scoped toolbar update.

final result: passed

---

# Design QA — Saved vocabulary list

## Comparison target

- Source visual truth: the two annotated `/vocabulary` screenshots supplied in the current conversation; the browser-comment captures did not expose filesystem paths.
- Source screenshot: 1159 × 677 px at device pixel ratio 1, authenticated desktop state with `Từ đã lưu` selected and the existing built-in-set cards visible.
- Requested state: change the section heading to `Danh sách từ vựng` and replace the built-in-set cards with vocabulary saved while learning HSK and Giao tiếp.
- Implementation: `http://localhost:3001/vocabulary` in the Codex in-app browser.
- Implementation screenshot: emitted inline from the authenticated saved-word state; the capture API did not expose a filesystem path.
- Implementation viewport: 1600 × 900 CSS px at device pixel ratio 1.
- Density normalization: none required. The in-app browser panel was wider than the annotated source, so comparison was limited to matching desktop structure, component proportions, and the focused content region rather than pixel-distance claims across the full viewport.

## Findings

- No actionable P0/P1/P2 differences remain for the annotated changes.

## Full-view comparison evidence

- Navigation, header, vocabulary hero, segmented tabs, primary CTA, brand colors, and support control retain the existing page composition.
- The prior three-column set-card region is intentionally replaced by a responsive saved-word grid while keeping the same content width and visual rhythm.
- The verified state displays both a saved HSK word and a saved Giao tiếp word, with source labels that distinguish their learning origins.

## Focused region comparison evidence

- The annotated heading now reads `Danh sách từ vựng`; its supporting copy states that the words come from HSK and Giao tiếp.
- Each saved-word card exposes Hán tự, pinyin, Vietnamese meaning, example sentence, source course, saved status, and a pronunciation control.
- The tab badge and section count both update from one to two after saving `你` from the HSK 1 flashcard flow.
- The `Bắt đầu học` CTA opens `/vocabulary/saved/study/vocabulary` and begins a study session using the combined saved-word collection.

## Required fidelity surfaces

- Fonts and typography: passed. Existing heading hierarchy, Vietnamese body font, serif Hán tự treatment, weights, and wrapping behavior remain consistent.
- Spacing and layout rhythm: passed. Saved cards align to the existing grid width, use the established 18 px radius, and collapse from three to two to one column at the existing breakpoints.
- Colors and visual tokens: passed. Cards, source tags, pronunciation buttons, focus rings, and CTA reuse the vocabulary page's green, cream, muted-text, and border tokens.
- Image quality and asset fidelity: passed. Existing hero artwork and navigation assets are unchanged; no new raster asset was required for the data-list replacement.
- Copy and content: passed. The heading and list content now match the annotations, and each word is attributed to its actual learning source.

## Comparison history

1. Initial P1 content mismatch: the `Từ đã lưu` tab still rendered four built-in vocabulary-set cards and the heading `Khám phá bộ có sẵn`.
2. Fix: queried saved review items from course lessons, added account-owned HSK word persistence, rendered saved-word cards, and routed the CTA to the combined saved collection.
3. Post-fix visual evidence: the live page shows `Danh sách từ vựng` with the HSK word `你` and the Giao tiếp word `任务`; the former built-in-set cards are absent from the selected tab.

## Primary interactions tested

- Open the authenticated `/vocabulary` page and confirm the saved-word count and list.
- Open HSK 1 flashcards, flip `你`, and choose `Đã nhớ`.
- Reload `/vocabulary` and confirm `你` appears immediately with source `HSK 1 · Bài 1` alongside the existing Giao tiếp word.
- Activate `Bắt đầu học` and confirm navigation to `/vocabulary/saved/study/vocabulary` with both words available.
- Browser console checked on fresh vocabulary and HSK page loads: no errors.

## Verification

- Database migration `0023_saved_vocabulary_words.sql`: applied successfully.
- Focused ESLint for all changed source and test files: passed with zero warnings.
- Saved-vocabulary, vocabulary-library, HSK lesson, and vocabulary-set regression suites: 13/13 passed.
- Git whitespace validation for the scoped files: passed.
- TypeScript validation reports only the existing `lib/admin-analytics-service.ts` indexing errors; no changed file reports a type error.

## Follow-up polish

- P3: repeat the full-page visual comparison at 1159 × 677 if the in-app browser panel is resized back to the annotated viewport.

final result: passed

---

# Design QA — Terms page option 3

## Comparison target

- Source visual truth: `C:\Users\Windows\.codex\generated_images\01a04399-6b54-77d2-8a15-3b97eacdc5ee\exec-14320373-026e-4037-8970-dab499ca0e23.png`
- Source pixels: 1473 × 1059.
- Intended desktop viewport: 1440 × 1024 CSS px at device scale factor 1.
- Intended mobile viewport: 390 × 844 CSS px at device scale factor 1.
- Implementation: `http://localhost:3000/terms` with the first accordion item open.
- Implementation screenshot: unavailable in the current Codex Desktop tool context.

## Findings

- [P2] Browser-rendered visual comparison is unavailable.
  Location: full Terms page at desktop and mobile breakpoints.
  Evidence: the selected source mockup is available and the route responds successfully, but the current in-app Browser tool cannot capture a screenshot. HTTP health and build output cannot substitute for rendered visual evidence.
  Impact: exact typography wrapping, spacing, image crop, responsive overflow, and visual fidelity cannot be certified.
  Fix: capture `/terms` at 1440 × 1024 and 390 × 844, compare both with the source visual in one input, then correct any P0/P1/P2 differences.

## Required fidelity surfaces

- Fonts and typography: implemented with the project-wide Roboto stack; rendered wrapping and optical weight await capture verification.
- Spacing and layout rhythm: desktop 36/64 split and stacked mobile breakpoints are implemented; rendered spacing awaits capture verification.
- Colors and visual tokens: Himi red, orange, warm cream, white, and neutral ink tokens are implemented without gradients; rendered contrast awaits capture verification.
- Image quality and asset fidelity: the existing transparent `himi-cheer.webp` brand asset is used; rendered crop and scale await capture verification.
- Copy and content: all five existing legal sections and the support email are preserved; accordion labels follow the selected mockup's information structure.

## Focused region comparison

- Not available because no browser-rendered implementation capture could be produced.

## Comparison history

1. Initial pass: blocked before visual comparison because the available in-app Browser tools cannot capture the implementation.
2. Source-level responsive implementation, lint, focused tests, build, and HTTP route checks passed.
3. Post-fix visual evidence: unavailable.

## Implementation checklist

- Capture desktop and mobile implementations in the in-app Browser.
- Compare them with the selected mockup.
- Fix any P0/P1/P2 differences and repeat the comparison.

## Follow-up polish

- Defer P3 polish until browser-rendered evidence is available.

final result: blocked

---

# Design QA — VIP payment success celebration

## Comparison target

- Source visual truth: `C:\Users\Windows\.codex\generated_images\019fb6fe-431e-7c62-917c-2abef5ccee3c\exec-4aca3106-0059-443f-869b-5ef4267632af.png`.
- Source pixels: 1448 × 1086. The implementation targets a modal up to 700 CSS px wide inside the existing VIP purchase flow.
- Implementation: `http://localhost:3001/vip`, authenticated paid-order state in `.vip-transfer-dialog.is-success`.
- Intended viewports: 1440 × 1000 CSS px desktop and 390 × 844 CSS px mobile at device scale factor 1.
- Implementation screenshot: unavailable in the current Codex Desktop tool context.
- State: payment polling has changed the current order from `pending` to `paid` and returned the activated subscription end date.

## Findings

- [P2] Browser-rendered comparison of the paid-order state is unavailable.
  Location: VIP transfer success dialog on `/vip`.
  Evidence: the selected mockup was opened and inspected; the implementation builds and focused tests pass, but this tool context cannot capture the authenticated in-app Browser session or safely synthesize a real paid order.
  Impact: exact desktop/mobile wrapping, final mascot crop, and perceived animation timing cannot be certified from rendered evidence.
  Fix: complete a test payment (or use a dedicated staging fixture), capture the open success dialog at desktop and mobile sizes, and compare both captures with the source mockup in one visual input.

## Required fidelity surfaces

- Fonts and typography: uses the product-wide Roboto stack with a 29–40 px responsive success headline, compact uppercase success label, and readable 11–15 px supporting text; rendered wrapping awaits capture.
- Spacing and layout rhythm: implements the centered 700 px modal, 580 px content column, two-row VIP ticket, compact action stack, and mobile bottom-sheet adaptation; rendered geometry awaits capture.
- Colors and visual tokens: implements Himi coral, white, warm cream, green success, orange sparkle, neutral ink, soft borders, and restrained shadows.
- Image quality and asset fidelity: uses the existing transparent `himi-celebrate.webp` asset with exactly two flippers and two feet; icons come from the installed icon system.
- Copy and content: uses “Thanh toán hoàn tất”, “Chào mừng thành viên VIP!”, live plan name, live subscription expiry (or “Không thời hạn”), “Khám phá bài học VIP”, and “Về trang tài khoản”. The requested SePay confirmation/status row is absent.

## Focused region comparison

- Not available because no browser-rendered paid-state capture could be produced. The source mockup itself was inspected at its full 1448 × 1086 resolution.

## Comparison history

1. Approved refinement: option 2 with the SePay confirmation row removed and lower spacing rebalanced.
2. Implementation: connected the ticket to the real plan name and subscription end date; added staged dialog, check, ticket, mascot, sparkle, CTA, hover, and reduced-motion states.
3. Post-fix visual evidence: unavailable in the current tool context.

## Primary interactions and verification

- The primary CTA closes the modal and opens `/courses`; the secondary action opens `/account`.
- Escape, backdrop click, close button, focus-visible styling, and scroll locking are preserved.
- Production build: passed.
- Focused ESLint: passed.
- Focused VIP and staging-verification tests: passed.
- Full TypeScript check reaches only the pre-existing `lib/admin-analytics-service.ts` query-builder indexing errors; no modified file reports an error.
- Full repository tests were not used as the build gate because existing unrelated failures remain in listening, home, course-catalog, and learner-navigation assertions.

## Follow-up polish

- Judge the mascot's idle amplitude and final ticket crop from the real paid-state capture before changing the current gentle 3.4-second loop.

final result: blocked

---

# Design QA — Active VIP membership ticket

## Comparison target

- Source visual truth: `C:\Users\Windows\.codex\generated_images\019fb6fe-431e-7c62-917c-2abef5ccee3c\exec-fab760ee-bf7d-4d70-8aff-3afcf555d47b.png`.
- Source pixels: 1254 × 1254; intended component footprint is approximately 192 × 210 CSS px inside the expanded desktop learner rail.
- Implementation: `http://localhost:3001/videos`, authenticated learner with an active VIP subscription and expanded rail.
- Implementation screenshot: unavailable in the current Codex Desktop tool context.
- Intended viewport: desktop from 721 CSS px upward; the learner rail is hidden by the existing mobile navigation breakpoint at 720 CSS px.

## Findings

- [P2] Browser-rendered comparison of the authenticated VIP state is unavailable.
  Location: `.rail-membership-card` in the expanded learner rail.
  Evidence: the selected source mockup is available, the production build passes, and the guest route responds successfully, but this tool context cannot capture the user's authenticated in-app Browser session. The unauthenticated server response correctly renders the existing upgrade card instead.
  Impact: final optical checks for text wrapping, hover rendering, and exact proportions in the real active-subscription state cannot be certified from a browser screenshot.
  Fix: open an authenticated active-VIP account at `/videos`, expand the learner rail, capture the membership card, and compare that crop with the selected source image in one visual input.

## Required fidelity surfaces

- Fonts and typography: implemented with the product-wide Roboto stack and compact 8–17 px hierarchy; rendered wrapping awaits authenticated capture.
- Spacing and layout rhythm: implemented for the current 192 px inner rail width, with an 82 px hero, compact cream body, 20 px radius, ticket notches, and perforated divider; rendered geometry awaits capture.
- Colors and visual tokens: implemented with Himi coral `#ff4d43`, orange `#ff8a2b`, cream `#fff9f5`, dark ink, and a restrained green active state.
- Image quality and asset fidelity: no raster asset is required; all icons use the project's existing Lucide icon system and the decorative crown is an installed icon rather than a placeholder.
- Copy and content: implements `Thành viên VIP`, `Đang hoạt động`, the real plan name, remaining-duration progress, the expiration date, and `Quản lý gói`. The removed duplicate `Còn 128 ngày` row is not rendered.

## Focused region comparison

- Not available because the active-VIP implementation could not be captured from the authenticated in-app Browser session.

## Comparison history

1. Selected mockup: approved ticket card with the redundant `Còn 128 ngày` row removed.
2. Implementation: connected the shell to the active subscription, added fixed-term and lifetime variants, added responsive collapsed-rail behavior, and preserved the original upgrade card for free users.
3. Post-fix visual evidence: unavailable in the current tool context.

## Primary interactions and verification

- `Quản lý gói` points to `/vip` and uses the existing navigation-progress behavior.
- Keyboard focus styling, hover/press motion, and reduced-motion fallbacks are implemented.
- Production build: passed.
- Focused ESLint: passed.
- Learner-rail and VIP-subscription tests: 9/9 passed.
- Full TypeScript check reaches only the pre-existing `lib/admin-analytics-service.ts` query-builder indexing errors; no modified file reports an error.

## Follow-up polish

- Repeat the authenticated visual comparison when the in-app Browser capture surface is available.

final result: blocked

## Listening mobile player — 2026-09-13

Source: user-attached mobile player reference in this conversation (477 × 151 px).
Implementation: artifacts/listening-player-mobile-redesign.png, localhost:3001/listening.
Scope: mobile audio player only. Existing mascot, icons, colors, and audio behavior reused.

Visual verification: inspected the full-page browser capture and its player region at a measured 477 × 821 CSS viewport; also inspected the compact layout at 358 CSS px. The browser capture scales and pads its output, so comparison uses the visible player region rather than screenshot canvas dimensions. Reference is a standalone player crop; surrounding transcript is outside this comparison.

- Typography: clear two-line speed label/value; readable language pills without the previous toolbar scale transform.
- Layout: avatar left, timeline above, transport in the middle, language controls on their own centered bottom row, rounded white border. No horizontal overflow at the narrow viewport.
- Colors: retained the existing red/orange player background and cream selected controls, consistent with the reference.
- Assets: existing Himi mascot and library icons retained; decorative waveform omitted only on very narrow screens to leave room for controls.
- Content: Vietnamese, Chinese, Pinyin, current speed, and actual audio timestamps preserved.

Comparison history: initial capture exposed the global select minimum height pushing the speed label outside its border. Added a scoped 18px select height/min-height reset; the subsequent capture confirms label and value fit inside the speed control.

Interaction checks: speed selection to 1.25x, Pinyin toggle, play/pause state, and audio progress passed. Desktop viewport restores the original toolbar and hides the mobile speed field. Browser console: no errors. ESLint passed; six listening tests passed.

No remaining actionable P0/P1/P2 findings. Native device safe-area behavior was not tested on hardware.

final result: passed

---

## Luyện chém từ — reduced-motion slash feedback — 2026-09-13

Source: user report that the slash animation disappeared after a correct pinyin answer on `http://localhost:3001/games`.

Root cause: the active browser reports `prefers-reduced-motion: reduce`. That branch hid the falling word and showed the score, but skipped the slash burst, split word halves, and Himi's strike pose, making a correct answer look as if it had no slash animation.

Fix: the reduced-motion path now flies Himi to the measured strike point, flashes the installed bamboo slash asset, separates both word halves with short low-distance motion, and then shows the score. The flight-to-impact duration is `0.50s` in both motion paths, increased from `0.42s` in the full-motion path so the approach reads more clearly.

Browser verification: reproduced with `prefers-reduced-motion: reduce`, entered the exact live pinyin, and sampled the strike frames at the start, `250ms`, and after impact. Himi's transform advanced gradually while the word remained visible through the approach; the impact then became visible and the word split. Progress advanced from 0 to 2 correct words with the expected score. Browser console: no errors.

Focused verification: slash regression test passed 1/1; slice deck and HSK game-round tests passed 9/9; focused ESLint passed.

Completion screen: the finished round now presents three centered actions. `Tiếp tục` starts a fresh round with the current HSK course, `Đổi khóa HSK` returns to course selection, and `Đổi trò chơi` returns to the games hub. On narrow screens the primary action spans the row above the two secondary actions so the labels remain readable.

Completion verification: completed live 12-word HSK 1 rounds and confirmed all three actions were present. `Tiếp tục` reset progress to `0 / 12`, retained HSK 1, and enabled the answer field for the new round. `Đổi khóa HSK` opened the six-course selector, while `Đổi trò chơi` returned to `Trung tâm trò chơi Himi`. Browser console: no errors.

Brand refinement: the three completion actions now use the `#FF4C3B` brand accent for their filled or outlined states. Browser-computed styles confirmed `rgb(255, 76, 59)` for the primary background and both secondary labels. The separate current-course card beside the arena was removed and its DOM count verified as zero because the completion screen already provides the course-change action.

Fullscreen refinement: the active slice session now occupies the complete viewport. The former desktop information column was removed, the arena expands across the available width and remaining height, and the answer field stays in its own bottom row inside the same viewport.

Mobile character placement: Himi's resting strike position is anchored to the lower-left corner of the fullscreen arena, with the image center aligned close to the annotated point above the answer bar. Strike motion continues to use the live target coordinates from this new origin.

Game support launcher: the floating Himi support button is hidden whenever one of the seven game interfaces or its HSK course picker is active. It remains available on the main games hub and elsewhere in the learner experience.

Application input focus: input and textarea elements no longer receive the shared outline or halo when clicked. Known field wrappers for search, account password, chatbot, writing search, vocabulary search, and video dictation also suppress their focus-within halo while retaining their normal component border and caret.

HSK course picker brand treatment: the shared course-selection layout used by all seven games now uses `#FF4C3B` for level badges, the featured card, CTA, arrows, hover states, completion badges, and the `DONE` ribbon. Card surfaces, body copy, and supporting borders use the existing white, black, and muted neutral tokens so the red remains the only accent color.

Mobile keyboard stability: the slice-game session records its stable viewport height and listens to the mobile visual viewport. Opening the software keyboard keeps the arena fixed and moves only the answer bar above the obscured area, preventing the falling word and Himi from being pushed upward with the resized viewport. Closing the keyboard clears the offset and remeasures the available screen height.

final result: passed

---

## Luyện gõ pinyin — 2026-09-13

### Comparison target

- Source visual truth: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\vocab-start.png` (1280 × 720 px), with the browser chrome cropped to `vocab-start-content.png` (1280 × 620 px). Supporting source states: `vocab-correct.png`, `sentence-start.png`, `sentence-next.png`, and `vocab-summary.png`, each 1280 × 720 px.
- Browser-rendered desktop implementation: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-word-desktop-1280x620.png` at a 1280 × 620 CSS-pixel viewport, device scale factor 1.
- Normalized side-by-side evidence: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-word-comparison-final.png` (source left, implementation right; two equal 1280 × 620 regions, no density scaling before composition).
- Responsive implementation: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-sentence-mobile-612x714.png` at a 612 × 714 CSS-pixel viewport, device scale factor 1.
- Tested state: HSK 1 lesson 1 word recall in Việt → Trung mode; HSK 1 lesson 4 segmented sentence recall; wrong, correct, revealed-answer, Next, Enter, normal audio, slow audio, saved-item, and listening-mode states.

### Findings

- No actionable P0, P1, or P2 differences remain. The implementation preserves the source hierarchy of progress, two learning modes, centered recall prompt, hidden/revealed memory panel, six practice actions, and completion feedback while integrating the current Himi learner shell.
- Intentional product adaptation: the desktop learner rail and top bar remain visible so Luyện gõ behaves like the other Himi practice areas. The right memory panel is slightly wider than the source to keep real multi-segment sentence content readable.

### Required fidelity surfaces

- Fonts and typography: the project-wide Roboto Vietnamese stack is retained. Prompt, lesson title, Chinese answer, pinyin, helper copy, and compact button labels preserve the source hierarchy without truncation at the tested desktop and mobile widths.
- Spacing and layout rhythm: the final short-desktop layout fits the question, memory panel, and all six persistent actions within 1280 × 620. Mobile places the action grid directly after the question and before the memory panel; all six controls fit above the fixed learner navigation at 612 × 714.
- Colors and visual tokens: the muted green page, white cards, Himi green progress/success state, blue input affordance, red error state, and restrained pastel action surfaces match the source intent and retain readable contrast.
- Image quality and asset fidelity: the practice workspace itself requires no raster illustration. The surrounding product shell reuses the existing Himi logo and Pro asset; control icons come from the installed Lucide family, with no placeholder glyphs or handcrafted SVG substitutes.
- Copy and content: prompts explicitly say pinyin without tone marks; real Hanzi, pinyin, Vietnamese meanings, parts of speech, sentence segments, and audio paths come from the imported HSK 1–6 lesson files.

### Full-view and focused comparison evidence

- The normalized full-view comparison shows matching information order, large white recall canvas, right-side memory surface, green active state, and pastel six-button footer. The implementation uses more horizontal space because it is integrated into the existing shell, but the learning hierarchy and control density remain equivalent.
- A separate focused crop was not needed: at the native 1280 × 620 comparison, prompt typography, input border, memory-header treatment, mode pills, progress, and all action icons remain legible. Correct and wrong answer states were additionally inspected live in the Codex in-app browser against the supporting source captures.

### Comparison history

1. Initial mobile pass found a P1 overlap: the sticky action bar covered the segmented sentence inputs. The footer was moved into the practice grid, placed immediately after the question on mobile, and returned to normal document flow.
2. The first normalized desktop comparison found a P2 short-viewport issue: the six persistent actions fell below the 1280 × 620 fold and the memory panel was proportionally too wide. A short-desktop breakpoint reduced card height/padding and the memory track was reduced to 250 px.
3. The next pass found a P2 opening-state drift: autofocus scrolled the session header partly out of view. Input focus now uses `preventScroll: true` for initial and segmented focus changes.
4. Final responsive evidence found the floating Himi support launcher overlapping core practice actions. The launcher is now hidden only while an active typing session is present; it remains available on the catalog and other learner pages.
5. Post-fix desktop and mobile captures show the full prompt and all primary controls without overlap. No P0/P1/P2 finding remains.

### Primary interactions and verification

- A wrong pinyin value keeps the input visible with a red border/text and unlimited retries.
- `N I`, mixed case, spaces, punctuation, and tone-marked equivalents normalize to the same expected pinyin; a correct answer reveals Hanzi, pinyin, meaning, and sentence segments.
- Enter advances only after a correct answer. Đáp án reveals the answer without advancing; Tiếp skips to the following item.
- Sentence mode advances focus one segment at a time. Nghe viết switches state and automatically starts the current normal-speed audio; both Nghe and Nghe chậm remain available.
- Codex in-app browser console check on the clean QA host returned zero warnings or errors. Focused lint and typing tests passed; the production build includes all four typing routes.

### Implementation checklist

- [x] Desktop and mobile visual comparison completed.
- [x] Wrong, correct, reveal, Enter, Next, segmented sentence, audio, and listening states verified.
- [x] P1/P2 overlap and short-viewport findings fixed and re-captured.
- [x] Console, lint, focused tests, and production build checked.

### Follow-up polish

- P3: verify the same mobile composition on a physical device with the software keyboard open; browser viewport and keyboard focus behavior are already guarded, but native keyboard chrome was not available in this pass.

final result: passed

---

## Luyện gõ — ô nhập chỉ bo góc trên — 2026-09-13

### Comparison target

- Source/current-state reference supplied by the user: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-39a6b97c-2344-4e4b-9187-dfc39f974ac9.png` (533 × 127 px). The explicit requested mutation is to preserve the two rounded top corners and remove both bottom radii.
- Browser-rendered implementation: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-input-top-corners-implementation.png` (1385 × 1206 physical px) at a measured 928 × 808 CSS-pixel viewport.
- Focused implementation crop: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-input-top-corners-focus.png` (500 × 150 px).
- Normalized comparison: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-input-top-corners-comparison.png` (1060 × 205 px). The supplied component image and focused browser crop were scaled to equal visual control widths; raw density was not compared 1:1.
- State: HSK word practice, correct pinyin prefix entered, progress bar and fraction counter visible.

### Findings

- No actionable P0, P1, or P2 findings remain. Computed browser styles confirm `13px` for both top corners and `0px` for both bottom corners.
- The progress track remains aligned one pixel above the square bottom edge and does not overflow the input boundary.

### Required fidelity surfaces

- Fonts and typography: the input character and progress fraction retain the existing type family, size, weight, centering, and line height; this radius-only edit introduces no wrapping or optical change.
- Spacing and layout rhythm: width, 64 px height, progress inset, and counter gap remain unchanged. Only the lower-left and lower-right radii were removed.
- Colors and visual tokens: the Himi coral border/fill and pale track are unchanged; focus and semantic error states inherit the same new corner geometry.
- Image quality and asset fidelity: no raster or icon assets belong to this control, and the supplied screenshot is used only as layout evidence.
- Copy and content: placeholder, typed pinyin, progress count, and accessible labels are unchanged.

### Full-view and focused comparison evidence

- The full browser capture confirms the centered input still fits the recall card and does not alter the neighboring memory panel or action area.
- The focused comparison makes all four corners and the bottom progress alignment legible. It shows the requested square lower corners while preserving the rounded top silhouette.

### Comparison history

- The supplied reference showed the former four-corner rounding. One scoped CSS change set the input radius to `13px 13px 0 0`; the post-change browser capture verifies the requested geometry. No post-fix P0/P1/P2 issue was found.

### Primary interactions and verification

- Valid-prefix state remains functional with progress visible.
- The same selector governs focus and error states, so the square bottom corners persist through those states without affecting answer validation.
- Browser console returned zero warnings or errors. Five focused typing tests passed and `git diff --check` passed for the stylesheet.

### Implementation checklist

- [x] Top-left and top-right corners remain rounded.
- [x] Bottom-left and bottom-right corners are square.
- [x] Progress track alignment and surrounding layout verified.
- [x] Console and focused regression checks passed.

### Follow-up polish

- No P3 follow-up is required for this scoped radius adjustment.

final result: passed

---

## Luyện gõ — gradient cam cho “Chính xác!” — 2026-09-13

### Comparison target

- Source success treatment: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-ce99fcfd-25f6-4529-8402-893da0674920.png` (218 × 62 px), showing the existing “Chính xác!” label and Sparkles icons.
- Source gradient palette: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-c8d1d260-4099-4184-a4d0-fe5c3fdb5205.png` (44 × 94 px). Sampled orange endpoints are approximately `#FF723B` and `#FF8B31`.
- Browser-rendered implementation: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-success-orange-gradient-implementation.png` (1673 × 1572 physical px) at a measured 1121 × 1053 CSS-pixel viewport; the browser reported device pixel ratio `0.8375`, while the capture backend returned a larger physical canvas.
- Focused implementation crop: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-success-orange-gradient-focus.png` (280 × 110 px).
- Combined normalized comparison: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-success-orange-gradient-comparison.png` (880 × 175 px). The source label, supplied gradient swatch, and implementation crop are displayed together at comparable visual sizes.
- State: HSK 3 lesson 1 word practice after a correct `zhoumo` answer, with the answer card, memory content, and “Chính xác!” confirmation visible.

### Findings

- No actionable P0, P1, or P2 findings remain. The visible label uses the requested orange gradient and the icons use its midpoint color, while the original composition, spacing, and animation remain intact.
- Browser-computed CSS confirms `linear-gradient(135deg, rgb(255, 114, 59) 0%, rgb(255, 139, 49) 100%)` with text background clipping.

### Required fidelity surfaces

- Fonts and typography: the existing font family, weight, size, and baseline alignment are unchanged; applying the gradient through clipped text preserves the glyph shapes and antialiasing.
- Spacing and layout rhythm: absolute placement, eight-pixel internal gap, icon sizes, and bottom/right offsets are unchanged, so the success cue occupies the same footprint as before.
- Colors and visual tokens: the former green was replaced by the exact sampled orange endpoints. Icons use `#FF7B37`, visually centered between both stops for a cohesive cue.
- Image quality and asset fidelity: no raster image is inserted into the interface. Existing installed Sparkles icons remain vector-sharp; the supplied crop is used only as color evidence.
- Copy and content: “Chính xác!” and its live status semantics are unchanged.

### Full-view and focused comparison evidence

- The full browser capture shows the orange confirmation remains legible and balanced in the lower-right corner of the recall card without colliding with the answer card or memory panel.
- The combined focused comparison makes the original green cue, the supplied orange gradient, and the resulting orange cue directly visible in one image. The implementation reproduces the requested palette without changing the component anatomy.

### Comparison history

- The initial state used solid success green. A scoped CSS change applied the sampled two-stop orange gradient to the label and its midpoint to the icons. The first post-change visual comparison found no P0/P1/P2 issue, so no further iteration was needed.

### Primary interactions and verification

- Entering the exact normalized pinyin still reveals the answer and creates the `role="status"` success cue.
- The success animation and reduced-motion fallback remain unchanged.
- Browser console returned zero warnings or errors. Five focused typing tests and `git diff --check` passed.

### Implementation checklist

- [x] Sampled orange gradient applied to “Chính xác!”.
- [x] Sparkles icons synchronized to the gradient midpoint.
- [x] Correct-answer behavior and layout verified live.
- [x] Console and regression checks passed.

### Follow-up polish

- No P3 follow-up is required for this scoped color treatment.

final result: passed

---

## Luyện gõ — viền ô nhập gradient cam — 2026-09-13

### Comparison target

- Source input reference: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-21c4d357-f6c8-485f-b5e0-452ef6744911.png` (499 × 109 px), showing the requested word-input geometry.
- Source gradient palette: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-4701a56f-d693-4d14-8ca1-9a550fb161bc.png` (44 × 94 px), with sampled endpoints `#FF723B` and `#FF8B31`.
- Browser-rendered implementation: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-input-gradient-border-implementation.png` (1673 × 1572 physical px) at a measured 1121 × 1053 CSS-pixel viewport; browser DPR was `0.8375` and the capture backend returned a larger canvas.
- Focused implementation crop: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-input-gradient-border-focus.png` (520 × 155 px).
- Combined normalized comparison: `C:\Users\DELL\.codex\visualizations\2026\09\13\01a099ce-333e-7582-a9af-f6f2ead73360\typing-input-gradient-border-comparison.png` (1250 × 205 px), showing the source input, supplied gradient swatch, and rendered input together at comparable visual widths.
- State: HSK 1 lesson 1, word `tốt; khỏe; ổn`, correct prefix `h`, progress `1/3` visible.

### Findings

- No actionable P0, P1, or P2 findings remain. The full input outline now transitions from `#FF723B` to `#FF8B31` while preserving the top-only radius and square lower corners.
- Browser-computed styles confirm a transparent physical border over a two-layer background: white padding-box fill plus the requested `135deg` orange gradient in the border box.

### Required fidelity surfaces

- Fonts and typography: placeholder, entered pinyin, and fraction counter retain their existing family, weight, size, line height, and centering.
- Spacing and layout rhythm: the input remains 360 × 64 CSS px, with the existing progress inset and top-only `13px 13px 0 0` radius unchanged.
- Colors and visual tokens: the normal/focus border uses the supplied orange gradient. The invalid state was separately verified to replace it with solid `#DC5B5B`, retaining semantic error behavior and red input text.
- Image quality and asset fidelity: the supplied orange crop is used only as color evidence; no raster image or placeholder was inserted into the control.
- Copy and content: placeholder, typed value, progress fraction, and accessible labels remain unchanged.

### Full-view and focused comparison evidence

- The full browser capture confirms the gradient border stays centered in the recall card and does not affect the memory panel or action controls.
- The combined focused comparison makes the original geometry, supplied palette, and rendered border directly comparable. The gradient is intentionally restrained across the two-pixel outline and remains visible on the white surface.

### Comparison history

- The initial implementation used a solid coral border. A scoped two-layer CSS background introduced the supplied gradient while keeping the input fill white. The first post-change comparison found no P0/P1/P2 issue, so no further visual iteration was required.

### Primary interactions and verification

- Valid-prefix state `h` displays the gradient outline and `1/3` progress.
- Invalid state `hx` reports `aria-invalid="true"`, switches the border layer to solid red, and retains red text.
- Focus continues to show the existing halo without covering the gradient border.
- Browser console returned zero warnings or errors. Five focused typing tests and `git diff --check` passed.

### Implementation checklist

- [x] Gradient applied to the complete word-input border.
- [x] White interior and top-only corner geometry preserved.
- [x] Focus, valid-prefix, and invalid states verified.
- [x] Console and focused regression checks passed.

### Follow-up polish

- No P3 follow-up is required for this scoped border treatment.

final result: passed

---

## Luyện gõ — studio phủ toàn bộ viewport desktop — 2026-09-13

### Comparison target

- Source visual truth: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-3b22899e-f05b-4545-8667-af70be52e80c.png` (1482 × 618 px), supplied as the current desktop practice-region reference with the instruction to make that region fill the screen.
- Browser-rendered implementation: `http://localhost:3001/typing/hsk-1/hsk1-l1/practice?stage=word`, captured inline by the selected Codex in-app Browser. The capture backend did not expose a local screenshot path.
- Primary viewport: 1121 × 1053 CSS px. Inline capture canvas: 1673 × 1572 px; layout comparisons use browser-reported CSS geometry to avoid the capture backend's density padding.
- Additional wide-screen viewport evidence: 1910 × 1074 CSS px.
- State: HSK 1, lesson 1, word stage, unanswered. The source crop shows a different word, so the comparison is intentionally limited to the stable shell, card, and action-bar geometry.

### Findings

- No actionable P0, P1, or P2 findings remain.
- The studio now occupies the complete content width instead of stopping at 1120px, and its desktop height equals the viewport minus page padding.
- The question and memory row absorbs all remaining vertical space while the action bar and keyboard hint remain visible at the bottom.
- Compact desktop screens use a 320px minimum card row so the full interface fits without introducing avoidable vertical overflow.

### Required fidelity surfaces

- Fonts and typography: family, weights, sizes, wrapping, and hierarchy are unchanged.
- Spacing and layout rhythm: the existing 24px desktop inset, grid gap, card radii, shadows, action-bar spacing, and centered answer content are preserved. Only the outer studio width and flexible card-row height changed.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: no image, icon, illustration, or placeholder changed.
- Copy and content: unchanged.

### Full-view and focused comparison evidence

- At 1121 × 1053 CSS px, the studio measures 1073 × 1005 px at x/y 24px and ends at y 1029px, exactly 24px above the viewport edge. The action bar ends at y 1002px and the keyboard hint ends at y 1029px.
- At 1910px viewport width, the studio measures 1862px, confirming that the previous 1120px cap is removed while the 24px side insets remain.
- A separate focused crop is unnecessary for this change because the requested difference is the full-screen outer geometry; browser bounding rectangles provide the precise evidence, while typography and component internals remain unchanged.

### Comparison history

- Before the change, the studio ended at y 701px in a 1053px viewport, leaving roughly 352px of unused space, and width was capped at 1120px on large displays.
- The first implementation made the desktop studio a full-height flex column and the practice grid a flexible two-row grid. A compact-height refinement then reduced the minimum card row from 440px to 320px under 760px viewport height so the bottom controls remain in view.
- Post-fix browser evidence shows the studio filling the available viewport with no horizontal overflow and no console or framework errors.

### Primary interactions and verification

- Word input remains focusable and editable.
- Question, memory, action, and keyboard-hint regions remain visible in the intended order.
- Mobile remains a natural vertical flow with question → memory → action and retains its existing 390px/260px card heights.
- Browser console returned zero warnings or errors and no framework overlay was present.
- The focused regression suite passes 12/12 tests, including viewport-fill and mobile-order guards; ESLint also passes.

### Implementation checklist

- [x] Studio fills the available desktop width.
- [x] Studio fills the available desktop height.
- [x] Question and memory cards stretch together.
- [x] Action bar and keyboard hint remain at the bottom and visible.
- [x] Compact desktop and mobile behavior remain responsive.
- [x] Browser, regression, and lint checks passed.

### Follow-up polish

- No P3 follow-up is required for this scoped full-screen layout change.

final result: passed

---

## Luyện gõ — ngăn auto-zoom khi focus input trên mobile — 2026-09-13

### Comparison target

- Source visual truth: Browser Comment 1 at a 481 × 1053 mobile viewport, showing the HSK 1 word-practice input before focus. The browser-comment capture has no exposed local filesystem path.
- Browser-rendered implementation: `http://localhost:3001/typing/hsk-1/hsk1-l1/practice?stage=word`, inspected in the selected Codex in-app Browser after the responsive stylesheet update. The capture backend did not expose a local screenshot path.
- State: HSK 1, lesson 1, word stage, unanswered input.

### Findings

- No actionable P0, P1, or P2 findings remain.
- Every typing input now has a mobile fallback of at least 16px, preventing iOS Safari's focus-triggered page magnification.
- The existing word-input appearance remains unchanged because its preferred 1.12rem size is retained whenever that value exceeds 16px.
- Sentence-segment inputs receive the same protection, so the behavior is consistent across both practice stages and all HSK levels.

### Required fidelity surfaces

- Fonts and typography: the word input keeps its existing 1.12rem optical size with a 16px floor; sentence inputs use an explicit 16px mobile size.
- Spacing and layout rhythm: input width, 64px/58px heights, padding, border geometry, progress strip, and card spacing are unchanged.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: no images or icons changed.
- Copy and content: placeholder and entered-answer content are unchanged.

### Full-view and focused comparison evidence

- The post-change browser view preserves the original mobile composition and input geometry from the annotated source.
- Focused CSS/computed-style inspection is the relevant evidence for this non-visual browser behavior: the word input resolves above 16px and both word and sentence inputs use `touch-action: manipulation` on the mobile breakpoint.

### Comparison history

- The word input already resolved to 17.92px in the available browser, but sentence inputs lacked an explicit minimum-size contract. The responsive rule now establishes a documented 16px fallback for every practice input without disabling user-initiated pinch zoom.
- No visual correction iteration was required because the preferred word-input size, component dimensions, and surrounding layout remain unchanged.

### Primary interactions and verification

- The viewport metadata remains `width=device-width, initial-scale=1`; no `maximum-scale=1` or `user-scalable=no` accessibility restriction was added.
- Word and sentence input selectors are both covered by the shared mobile stylesheet.
- Browser console returned zero warnings or errors and no framework overlay was present.
- The focused regression suite passes 13/13 tests, including the mobile input zoom guard; ESLint also passes.

### Implementation checklist

- [x] Word input has a 16px minimum mobile font size.
- [x] Sentence inputs have an explicit 16px mobile font size.
- [x] Tap handling uses `touch-action: manipulation`.
- [x] Pinch-to-zoom accessibility remains available.
- [x] Existing mobile layout and visual styling remain unchanged.

### Follow-up polish

- Physical iPhone Safari verification remains a useful optional device-matrix check, but no P3 code change is required.

final result: passed

---

## Luyện gõ câu — đồng bộ thẻ đáp án với từ vựng — 2026-09-13

### Comparison target

- Source visual truth: Browser Comment 1 at a 1062 × 1053 viewport and the attached 168 × 107 reference card showing `父母` / `fùmǔ`. Neither capture exposes a local filesystem path.
- Browser-rendered implementation: `http://localhost:3001/typing/hsk-5/hsk5-l3/practice?stage=sentence`, inspected in the selected Codex in-app Browser after the shared-style update.
- State: HSK 5, lesson 3, sentence stage, answers revealed.

### Findings

- No actionable P0, P1, or P2 findings remain.
- Sentence segments now reuse the exact vocabulary answer-card class instead of maintaining a second set of visually similar CSS rules.
- The previous P2 drift risk from separate sentence overrides was removed together with those overrides.

### Required fidelity surfaces

- Fonts and typography: Hanzi resolves to 26.4px; pinyin resolves to 12.8px in the same dark color as the vocabulary card.
- Spacing and layout rhythm: both variants resolve to 5px 20px 12px padding and the same content-driven width behavior.
- Colors and visual tokens: both use the same `#f7f7f7` surface and coral border/bottom strip.
- Image quality and asset fidelity: no raster assets are used in this answer-card treatment.
- Copy and content: every sentence segment keeps its own Hanzi and tone-marked pinyin unchanged.

### Full-view and focused comparison evidence

- The complete sentence-practice view shows all six revealed segments using the vocabulary card treatment without clipping or overflow.
- Computed-style comparison between `.typing-word-answer` and `.typing-segment-answer` returned `identical: true` for background, border, top-only 13px radius, shadow, padding, Hanzi size, pinyin size/color, and the approximately 8px full-width bottom strip.
- Browser viewport was 1062 × 1053 CSS pixels at device pixel ratio 0.8375, matching the annotated desktop context.

### Primary interactions and verification

- Revealing the sentence answer preserves the established answer flow and swaps each completed input to the shared vocabulary answer-card presentation.
- Browser console returned zero errors.
- Focused regression suite passes 15/15 tests.
- ESLint passes for the updated component and regression test.
- Production build completes successfully.

### Implementation checklist

- [x] Sentence answer cards reuse `typing-word-answer`.
- [x] Hanzi and pinyin match vocabulary typography.
- [x] Only the top corners are rounded.
- [x] The coral progress strip spans the full bottom edge without white gaps.
- [x] The shared treatment applies to sentence lessons across all HSK levels.

### Follow-up polish

- No P3 follow-up is required for this scoped answer-card unification.

final result: passed

---

## Luyện gõ — khoảng cách hai bên trang thực hành — 2026-09-13

### Comparison target

- Source visual truth: Browser Comment 1 showing the full HSK 5 lesson 5 word-practice page at a reported 1062 × 1053 viewport. The conversation-rendered source image is 890 × 882 pixels and has no exposed local filesystem path.
- Browser-rendered implementation: `http://localhost:3001/typing/hsk-5/hsk5-l5/practice?stage=word`, captured in the authenticated Chrome session because the isolated in-app browser did not share the learner login.
- State: HSK 5, lesson 5, word stage, unanswered.

### Findings

- No actionable P0, P1, or P2 findings remain.
- The desktop practice shell now has an explicit, symmetric 32px inline gutter. It remains full-width while the question, memory, and action surfaces no longer sit too close to either screen edge.
- Mobile intentionally retains the existing 10px gutter to protect usable typing width.

### Required fidelity surfaces

- Fonts and typography: unchanged; all headings, helper text, answer copy, and button labels retain their existing size and weight.
- Spacing and layout rhythm: desktop inline padding is 32px on both sides; desktop block padding remains 24px, or 12px on short screens. Mobile remains 10px on both sides.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: no image, logo, icon, or decorative asset changed.
- Copy and content: unchanged.

### Full-view and focused comparison evidence

- At the source-matched viewport override, the implementation measured 1062 × 1054 CSS px at DPR 1.0; the one-pixel height difference is browser viewport rounding and does not affect the horizontal comparison.
- The studio begins at x=32px and ends 31.6px from the right edge, with 998.4px usable width and zero horizontal overflow.
- The focused evidence is the computed outer geometry itself; no separate crop was needed because the request concerns only the page gutters and the full screenshot keeps both edges visible.
- A mobile pass at an effective 482 × 1054 CSS px measured x=10px and 10.4px remaining on the right, again with zero horizontal overflow.

### Comparison history

- Before the adjustment, the desktop gutter was 24px per side.
- The first and final implementation increases only the desktop gutter to 32px. The source-matched and mobile captures show balanced whitespace without changing the full-height practice layout.

### Primary interactions and verification

- The word input, audio controls, reveal action, navigation buttons, memory panel, and progress header remain visible and correctly ordered.
- Chrome reported three hydration diagnostics whose diffs contain only attributes injected by installed extensions (`bis_*`, `data-extjs-*`, and `cz-shortcut-listen`); no app-owned runtime or layout error was found.
- Focused regression suite passes 15/15 tests.
- ESLint and `git diff --check` pass.
- Production build completes successfully.

### Implementation checklist

- [x] Desktop left gutter is 32px.
- [x] Desktop right gutter is 32px.
- [x] Short desktop keeps the same horizontal gutter.
- [x] Mobile retains 10px gutters.
- [x] No horizontal overflow at desktop or mobile verification widths.

### Follow-up polish

- No P3 follow-up is required for this scoped spacing update.

final result: passed

---

## Luyện gõ — khoảng cách desktop 100px — 2026-09-13

- Scope: follow-up to the desktop gutter annotation; mobile spacing is intentionally unchanged.
- Implementation: `http://localhost:3001/typing/hsk-5/hsk5-l5/practice?stage=word`.
- Browser evidence at 1536 × 647 CSS px: computed left padding 100px, right padding 100px, studio left offset 100px, studio right offset 100px, and horizontal overflow 0px.
- Short desktop uses the same 100px inline gutter. The breakpoint at 720px and below still switches to 10px per side.
- Typography, colors, assets, copy, card geometry, and practice interactions are unchanged.
- Focused regression suite passes 15/15 tests and `git diff --check` passes.
- No actionable P0, P1, P2, or P3 findings remain.

final result: passed

---

## Điều hướng mobile — ba box luyện tập trên một hàng — 2026-09-13

### Comparison target

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-27a407a9-be86-485c-8b32-17d62b150b79.png`, 357 × 133 pixels, showing “Luyện nghe” and “Video” on one row while “Bộ từ vựng” falls onto a third row.
- Browser-rendered implementation: `http://localhost:3001/typing/hsk-5/hsk5-l5`, captured in the selected Codex in-app Browser. The browser capture backend did not expose a local screenshot path.
- State: mobile lesson page with the “Luyện tập” navigation menu expanded.

### Findings

- No actionable P0, P1, or P2 findings remain.
- The six practice destinations now use a direct three-column grid, producing two balanced rows of three items.
- “Luyện nghe”, “Video”, and “Bộ từ vựng” share the same second-row y-position instead of leaving “Bộ từ vựng” alone on a third row.

### Required fidelity surfaces

- Fonts and typography: unchanged; labels remain centered, legible, and use the existing mobile navigation weight and size.
- Spacing and layout rhythm: three equal columns measure approximately 135.1px each at the tested viewport, separated by the existing 8px gap.
- Colors and visual tokens: the existing pale surface, active coral treatment, and green-gray inactive treatment are unchanged.
- Image quality and asset fidelity: existing Lucide navigation icons are retained; no image substitution was introduced.
- Copy and content: all six destination labels and routes are unchanged.

### Full-view and focused comparison evidence

- The browser viewport measured 487 × 808 CSS px at DPR 0.8375; the expanded menu measured about 443.7px wide.
- Computed item rectangles place “Luyện nghe”, “Video”, and “Bộ từ vựng” at the identical y-position of 643.17px, with x positions 25.19px, 168.26px, and 311.34px.
- The full browser capture shows the expanded two-row menu in context. Computed rectangles provide the focused evidence because the fixed menu sits at the viewport edge and the browser's cropped screenshot canvas does not expose a stable standalone-image path.
- Horizontal overflow is non-positive; no content extends past the viewport.

### Comparison history

- Before the fix, a six-track grid combined with special spans for the fourth and fifth links, forcing the sixth link onto a third row.
- The final implementation replaces that scheme with three equal tracks and removes all per-link column spans.

### Primary interactions and verification

- The expanded menu remains accessible through the existing “Luyện tập” button, and all six links remain present in the accessibility tree.
- Browser console returned zero errors.
- Focused responsive test suite passes 4/4 tests.
- ESLint, `git diff --check`, and the production build pass.

### Implementation checklist

- [x] First three destinations share row one.
- [x] Luyện nghe, Video, and Bộ từ vựng share row two.
- [x] All cards have equal width and height.
- [x] Existing icons, labels, routes, and active state remain intact.
- [x] No horizontal overflow is introduced.

### Follow-up polish

- No P3 follow-up is required for this scoped menu-grid update.

final result: passed

## Shared game and typing completion celebration — 2026-09-15

### Comparison target

- Source visual truth: the existing Flashcard 3D completion state, browser-captured from the shared component at `D:/CodexData/.codex/visualizations/2026/09/14/01a09d9a-586f-78a1-b543-9d2b6678428f/celebration-source-desktop-v2.png` and `celebration-source-mobile.png`.
- Final typing implementation: `celebration-typing-desktop-v2.png` at 1440 × 900 and `celebration-typing-mobile-v2.png` at 390 × 844.
- Final slice-game implementation: `celebration-slice-desktop-v3.png` at 1440 × 900 and `celebration-slice-mobile.png` at 390 × 844.
- CSS viewport and density: desktop 1440 × 900 at DPR 1; mobile 390 × 844 at DPR 1. Captures use matching CSS and pixel dimensions, so no density normalization was needed.
- State: completed Flashcard 3D round compared with completed typing and completed slice-game states. The temporary unauthenticated component harness used for capture was removed after QA.

### Findings and comparison history

1. P2 — The first typing pass constrained the trophy Himi to 48%, making it visibly smaller than the Flashcard 3D source at both desktop and mobile widths. The typing-only width override was removed; the revised captures now use the same 56% desktop and 70% mobile mascot sizing as the shared source.
2. P2 — The slice-game completion had to fit a 300–440px-high arena rather than a full-page square. A responsive split layout keeps Himi and fireworks visible on the left and places the concise result panel on the right; at 390px it has no horizontal overflow and the three actions remain fully visible.
3. P2 — Static WebP celebration art would not animate in production. The component now serves real looping GIFs for fireworks and trophy Himi, with the original WebPs selected through `prefers-reduced-motion: reduce`.
4. No actionable P0, P1, or P2 findings remain after the revised visual pass.

### Required fidelity surfaces

- Fonts and typography: the existing Himi navy display hierarchy, coral uppercase eyebrow, balanced wrapping, and compact supporting text are preserved. Typing statistics use the existing smaller UI scale and remain readable at 390px.
- Spacing and layout rhythm: desktop keeps the centered 680–700px celebration frame and layered lower panel. Mobile uses a 374px frame without horizontal overflow; the slice arena uses a proportional two-column composition with practical 42px action targets.
- Colors and visual tokens: warm ivory surfaces, coral actions, navy display text, teal sky, gold trophy, and soft tan elevation match the Flashcard 3D source treatment.
- Image quality and asset fidelity: both animated assets are generated from the original production WebPs, retain transparent mascot edges, and render at native 640 × 640 and 512 × 580 dimensions. No CSS, emoji, or SVG substitute was introduced.
- Copy and content: game-specific outcomes remain concise. Typing keeps its four useful performance metrics without adding explanatory clutter; slice keeps the existing score and next actions.

### Full-view and focused comparison evidence

- Source and final typing captures were opened together at desktop and mobile sizes. Frame treatment, fireworks crop, Himi scale, panel radius/elevation, score pill, and primary/secondary action hierarchy remain visibly consistent.
- Slice desktop and mobile captures confirm that the alternate shallow layout preserves the same imagery and token system while fitting the real game arena.
- Focused region evidence is supplied by the 390 × 844 mobile captures, where all result copy, four typing metrics, and actions are legible. No separate crop was needed because these details are readable at original size.
- Browser-computed desktop horizontal overflow is false; mobile document width equals the 390px viewport. The slice mobile document also equals 390px.

### Verification

- Browser `currentSrc` resolves to `/assets/games/results/celebration-fireworks.gif` and `/assets/games/results/himi-trophy-celebration.gif`; natural dimensions are 640 × 640 and 512 × 580.
- Production runtime returned HTTP 200 with `Content-Type: image/gif` and immutable one-year caching for both assets.
- Reduced-motion sources remain the original static WebPs, and the separate confetti GIF remains available.
- Browser console returned zero errors during the final typing capture.
- Flashcard, all Game Center modes, HSK flashcard, slice game, and typing completion use `GameResultCelebration`.
- Focused tests: 20 passed, 0 failed. ESLint, `git diff --check`, and `npm run build` passed.

### Implementation checklist

- [x] Reuse the Flashcard 3D completion component for typing.
- [x] Reuse it for slice game and all existing Game Center results.
- [x] Serve real animated Himi and fireworks assets in production.
- [x] Preserve static reduced-motion fallbacks.
- [x] Verify desktop and 390px mobile layouts without horizontal overflow.
- [x] Keep typing metrics and post-completion actions functional.

### Follow-up polish

- No P3 follow-up is required for this scoped completion-state rollout.

final result: passed

---

## Lesson learning stage — mockup-fidelity correction — 2026-09-15

### Comparison target and final captures

- Visual truth: the three selected 1536×1096 vocabulary, phrase, and pronunciation mockups in `D:/CodexData/.codex/generated_images/01a09d9a-586f-78a1-b543-9d2b6678428f/`.
- Final desktop captures: `qa-artifacts/lesson-stage/fidelity-vocabulary-final.png`, `qa-artifacts/lesson-stage/fidelity-phrase-final.png`, and `qa-artifacts/lesson-stage/fidelity-pronunciation-final.png` at 1536×1096.
- Responsive evidence: `fidelity-laptop-short-pronunciation-final.png` at 1440×800, `fidelity-tablet-pronunciation-final.png` at 834×1112, `fidelity-mobile-vocabulary-final.png` and `fidelity-mobile-phrase-final.png` at 390×844, plus `fidelity-320-pronunciation-final.png` at 320×800.

### Findings and resolution

1. P1 — The previous implementation looked like a reduced generic card rather than the selected mockup. All three modes now share the mockup's large white study surface, separated bottom navigation, dot progress, dominant Chinese type, and contextual right-side coach rail.
2. P1 — The attached phone capture showed the Himi rail as a nearly full-screen empty column. Viewport and container breakpoints now convert it to a 190px tablet strip and a 154px phone strip with a horizontal tip/mascot composition.
3. P2 — The coach rail lacked the warm office scene. A clean local office background is now used consistently, paired with writing, waving, and listening Himi assets for the three learning modes.
4. P2 — Mobile phrase segments clipped the final token and the save label created extra copy. Token spacing now fits at 390px, the save action is icon-only visually, and secondary explanation copy remains collapsed by default.
5. P2 — The floating chatbot covered lesson controls at tablet and phone widths. It is hidden below 981px on this stage because the contextual Himi coach is already present.
6. The persistent product navigation rail is intentionally retained from the real application shell; removing it to imitate the isolated mockup would regress navigation elsewhere.

### Full-view and focused comparison evidence

- Source and implementation were inspected together for all three desktop states. The hierarchy, 3.35:1 study/coach split, coral active states, warm coach background, main typography, audio controls, and detached previous/next bar align with the source direction.
- At 1440×800 the pronunciation navigation ends at 744px and the full coach rail is 510px high, so all primary controls remain above the fold.
- At 320×800, document width equals viewport width (320px), horizontal overflow is zero, tab widths are balanced at 97px, and the coach rail remains 154px high.
- At 390×844, the phrase row displays all four structural tokens and separators without horizontal clipping; the mobile coach strip renders at 154px with a 118px mascot.
- Browser console and page errors are empty apart from normal Vite development messages.

### Verification

- Three-tab selection, disabled previous state, next navigation, pinyin toggle, audio controls, save actions, and semantic progress labels remain available.
- Focus styles, reduced-motion behavior, descriptive mascot alt text, and 44px coarse-pointer targets are present.
- Focused lesson/responsive tests: 5 passed, 0 failed.
- ESLint passed for the edited layouts and all three React components.
- `git diff --check` passed.
- Production build passed.
- No actionable P0, P1, P2, or P3 findings remain.

final result: passed

---

## Lesson learning stage — compact responsive redesign — 2026-09-15

### Comparison target

- Vocabulary: `D:/CodexData/.codex/generated_images/01a09d9a-586f-78a1-b543-9d2b6678428f/exec-6fe635e4-b8ec-4730-b3ff-f6706814e932.png`.
- Phrase: `D:/CodexData/.codex/generated_images/01a09d9a-586f-78a1-b543-9d2b6678428f/exec-bebe7636-02fc-41f1-9b4a-ea6028c89fc5.png`.
- Pronunciation: `D:/CodexData/.codex/generated_images/01a09d9a-586f-78a1-b543-9d2b6678428f/exec-586e770f-3ec3-436b-ae58-cf0efb1b59f5.png`.
- Implemented surfaces: `components/lesson-vocabulary-deck.tsx`, `components/lesson-phrasebook.tsx`, `components/lesson-pronunciation-coach.tsx`, and `app/lesson-stage.css`.

### Final captures

- Desktop phrase, 1440×1024 at DPR 1: `qa-artifacts/lesson-stage/desktop-phrase-pass2.png`.
- Desktop pronunciation, 1440×1024 at DPR 1: `qa-artifacts/lesson-stage/desktop-pronunciation-pass2.png`.
- Laptop vocabulary, 1366×768 at DPR 1: `qa-artifacts/lesson-stage/laptop-1366x768-vocabulary-pass2.png`.
- Laptop pronunciation, 1366×768 at DPR 1: `qa-artifacts/lesson-stage/laptop-1366x768-pronunciation-pass2.png`.
- Tablet phrase, 834×1112 at DPR 1: `qa-artifacts/lesson-stage/tablet-phrase.png`.
- Mobile vocabulary, 390×844 at DPR 1: `qa-artifacts/lesson-stage/mobile-vocabulary-pass2.png`.
- Mobile pronunciation, 390×844 at DPR 1: `qa-artifacts/lesson-stage/mobile-pronunciation-pass2.png`.
- Narrow-phone DOM pass, 320×800 at DPR 1: no horizontal overflow and no rendered button or summary below 44px in either dimension.

### Findings and comparison history

1. The initial desktop comparison confirmed the intended 80/20 learning/coach split. The inherited green tab underline and dark pronunciation border were corrected to the Himi red and neutral-line tokens.
2. The initial phrase order surfaced a note without pinyin. Dialogue phrases now lead the sequence so the main phrase retains its authored pinyin and Vietnamese translation; notes remain available later in the deck.
3. The first isolated mobile harness omitted the app's global container-query stylesheet. Retesting with the same stylesheet loaded by `app/layout.tsx` produced the intended single-column lesson and horizontal Himi coach strip.
4. At 1366×768, vocabulary and pronunciation initially extended 32–61px below the viewport. The short-screen density treatment now ends those panels at 747px and 737px while preserving readable type and a 160–190px Himi treatment.
5. No actionable P0, P1, P2, or P3 findings remain. Secondary explanation and writing content stays closed by default, reducing copy density without removing functionality.

### States and verification

- Từ vựng, Cụm từ, and Nghe & nói tab selection passed.
- Disabled previous and enabled next states passed.
- Phrase explanation opened successfully; phrase save changed to its saved state.
- Pinyin is hidden by default and revealed successfully.
- Audio and pronunciation actions retain accessible labels; semantic progress, mascot alt text, focus styles, reduced motion, and coarse-pointer 44px targets are present.
- Relevant test suite: 5 passed, 0 failed.
- ESLint on the three edited TSX components passed.
- Production build (`npm run build`) passed.
- The repository-wide suite separately exposes an existing home-page landscape assertion in `tests/home-responsive.test.mjs`; the failing assertion does not reference this change's files.

final result: passed

---

## Ưu đãi chào mừng — thu gọn responsive — 2026-09-16

### Comparison target

- Source visual truth: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-e381466f-4645-4f84-9925-8f751d5223af.png` (847 × 911 px), trạng thái modal ưu đãi đang mở.
- Implementation route: `http://localhost:4173/?welcomeOffer=1`.
- Intended responsive checks: desktop 1366 × 768 CSS px and mobile 390 × 844 CSS px.
- Implementation screenshot: unavailable. The Codex in-app Browser bootstrap failed because its runtime requested a browser-service package version that is not installed in this environment.

### Findings

- [P2] Chưa có bằng chứng render trực tiếp để xác nhận mascot, nội dung và nút chính nằm gọn ở cả hai viewport. Source image was opened at original resolution, and code dimensions were reduced, but a code-only comparison cannot replace browser-rendered visual evidence.

### Required fidelity surfaces

- Fonts and typography: existing product font, weights and copy remain unchanged; display sizes are reduced proportionally in CSS.
- Spacing and layout rhythm: dialog width changes from 642px to 560px; the fixed 790px card minimum is removed; desktop and mobile padding, hero height, benefit rows and CTA height are compacted.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: the existing `himi-vip-offer-mascot.png` asset remains in use; no substitute asset was introduced.
- Copy and content: unchanged.

### Verification completed

- The focused responsive assertion for the welcome offer passes.
- Industry curriculum validation and its five focused tests pass.
- ESLint and `git diff --check` pass for the edited code.
- The local development route returns HTTP 200 after warm-up.
- The repository-wide suite is not green because of an existing short-landscape assertion and process-level out-of-memory failures in unrelated parallel tests.

### Implementation checklist

- [x] Reduce desktop dialog width and vertical footprint.
- [x] Reduce phone dialog width, hero height, benefits and CTA while preserving usable close and action controls.
- [x] Keep original branding, content and mascot asset.
- [ ] Capture and compare the rendered desktop and mobile states after browser tooling is available.

final result: blocked

---

## Tinh chỉnh điều hướng thẻ học — 2026-09-17

### Comparison target

- Source visual truth — thanh điều hướng: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-2201d536-81cf-4860-bfac-b9aa77a02fc8.png` (1222 × 105 px).
- Source visual truth — thẻ từ vựng: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-552262a2-8a39-4dd6-a0ee-4686a97f7d76.png` (1186 × 665 px).
- Source visual truth — dãy câu cần thay bằng chấm nhỏ: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-e2aef05b-e469-463d-af99-e14238938c96.png` (536 × 82 px).
- Implementation route: `http://localhost:4173/learn/van-phong-hanh-chinh?lesson=chao-hoi-tai-noi-lam-viec`.
- Intended viewports: desktop 1440 × 1024 CSS px and mobile 390 × 844 CSS px at device scale factor 1.
- States: first and last vocabulary/phrase cards; listening-and-speaking targets 1 and 10.
- Implementation screenshot: unavailable. The in-app Browser object is not exposed in this Codex session (`agent` is undefined), so pixel dimensions, CSS crop, density normalization, console state and interaction capture could not be recorded.

### Findings

- [P2] Browser-rendered fidelity remains unverified. The three source images were opened at original resolution, but without a browser capture it is not possible to confirm exact edge-button placement, narrow-mobile wrapping of the audio/speed/save row, or the visual transition from dots to the final completion action.

### Required fidelity surfaces

- Fonts and typography: existing product fonts and weights remain; the vocabulary pinyin is simplified to one warm pill without the redundant “Từ vựng” badge.
- Spacing and layout rhythm: bottom Previous/Continue navigation is removed from vocabulary and phrases; compact circular arrow controls sit at the two card edges. The save control now shares the pronunciation row with the 0.8× control.
- Colors and visual tokens: existing Himi coral, warm pinyin surface and neutral progress colors are reused.
- Image quality and asset fidelity: existing mascot assets and installed Lucide navigation/bookmark icons remain; no replacement image asset was introduced.
- Copy and content: the vocabulary example and “Từ vựng” badge are removed. Listening and speaking no longer displays numbered target boxes or an intermediate “Tiếp tục” action; only target 10 exposes “Hoàn thành”.

### Interaction and code verification

- Vocabulary and phrase arrow controls move backward/forward; the final right arrow invokes the existing transition to the next learning stage.
- All 36 authored lessons render ten accessible listening-and-speaking target buttons with visual dots and no visible target numbers.
- Nine focused responsive, interactive and curriculum tests pass.
- The focused rendered-card assertion passes.
- ESLint passes for all edited components and tests.
- Production build passes and the local route returns HTTP 200.

### Implementation checklist

- [x] Replace the bottom text navigation with card-edge arrow controls.
- [x] Remove the vocabulary type badge and example block.
- [x] Move save beside 0.8× for vocabulary and phrases.
- [x] Replace numbered listening targets with compact dots.
- [x] Show “Hoàn thành” only on target 10.
- [ ] Capture and compare desktop/mobile implementations when the in-app Browser is available.

final result: blocked

---

## Thẻ học Từ vựng, Cụm từ và Nghe & nói — 2026-09-17

### Comparison target

- Source visual truth — thẻ từ vựng: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-498088df-a0bb-4cc4-a986-f62bfdb44f27.png` (943 × 502 px).
- Source visual truth — các hành động cần loại bỏ: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-ae03ebe2-2f18-45de-a85f-ccb3cdce2aa1.png` (963 × 217 px).
- Source visual truth — khối hoàn thành cần loại bỏ: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-77e06a34-a5d5-4990-b221-8755d7c277b2.png` (559 × 223 px).
- Implementation route: `http://localhost:4173/learn/van-phong-hanh-chinh?lesson=chao-hoi-tai-noi-lam-viec`.
- Intended viewports: desktop 1440 × 1024 CSS px and mobile 390 × 844 CSS px at device scale factor 1.
- State: first item of Từ vựng, Cụm từ and Nghe & nói; sentence 10 CTA also requires capture.
- Implementation screenshot: unavailable because this Codex session does not expose the in-app Browser service. Pixel dimensions, CSS crop and density normalization therefore could not be recorded.

### Findings

- [P2] Browser-rendered fidelity remains unverified. The source images were opened at original resolution and the production route returns HTTP 200, but code and server output cannot confirm the final crop, vertical fit, fixed support-widget overlap or mobile wrapping.

### Required fidelity surfaces

- Fonts and typography: the implementation retains the product type stack, uses a centered oversized Hanzi treatment, orange pinyin pill, compact uppercase type label and strong Vietnamese meaning hierarchy.
- Spacing and layout rhythm: all three learning modes share the same bordered white study card, segmented progress header, centered study content and single bottom navigation. Responsive CSS keeps the audio action and speed badge on one row where space permits.
- Colors and visual tokens: the Himi coral primary action, warm pinyin surface, neutral progress dots and white card match the reference palette without introducing new gradients.
- Image quality and asset fidelity: existing Himi mascot assets and installed Lucide icons remain unchanged; no replacement imagery or CSS-drawn asset was introduced.
- Copy and content: “Xem cách viết”, “Xem thêm ví dụ”, “Xem giải thích”, the pinyin toggle and the separate completion row were removed. Pinyin is always visible in Nghe & nói, and the tenth CTA reads “Hoàn thành”.

### Interaction and code verification

- All 36 authored industry lessons render exactly ten Nghe & nói targets.
- Từ vựng and Cụm từ continue into the next stage with one “Tiếp tục” CTA.
- The final Nghe & nói CTA submits lesson completion or advances to the required quiz; passed quizzes expose their own integrated completion action.
- Focused responsive and curriculum UI tests pass: 6 passed, 0 failed.
- Focused rendered-card assertion passes: 1 passed, 0 failed.
- ESLint, `git diff --check`, the live route HTTP check and the production build pass.
- The broader `rendered-html.test.mjs` still has three unrelated pre-existing assertions in learner navigation, slice game and course-cover counts; its lesson-card assertion passes independently.

### Comparison history

- No browser comparison iteration could be completed because the required in-app Browser surface is unavailable. The implementation remains ready for desktop/mobile capture when that service is restored.

### Implementation checklist

- [x] Apply the reference-card visual hierarchy to Từ vựng, Cụm từ and Nghe & nói.
- [x] Remove the three optional disclosure actions requested by the user.
- [x] Show pinyin by default and remove its toggle in Nghe & nói.
- [x] Limit Nghe & nói to ten targets and change the last CTA to “Hoàn thành”.
- [x] Remove the separate completion row while preserving progress submission.
- [ ] Capture and compare desktop/mobile implementations in the in-app Browser.

final result: blocked

---

## Nghe & nói dùng điều hướng cạnh thẻ — 2026-09-17

### Comparison target

- Source visual truth — cụm chỉ báo cần loại bỏ: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-75f07fc1-06ac-4094-a782-2bce4cc0809f.png` (466 × 87 px).
- Existing product reference: nút mũi tên cạnh thẻ đang dùng ở Từ vựng và Cụm từ.
- Implementation route: `http://localhost:4173/learn/van-phong-hanh-chinh?lesson=chao-hoi-tai-noi-lam-viec`.
- Intended viewports: desktop 1440 × 1024 and mobile 390 × 844 CSS px at device scale factor 1.
- States: Nghe & nói câu 1, câu giữa và câu 10.
- Implementation screenshot: unavailable because the in-app Browser surface is not exposed in this session; rendered dimensions, console state and side-by-side comparison therefore remain unavailable.

### Findings

- [P2] Exact rendered placement of the side controls cannot be visually verified without the required browser capture. The implementation reuses the same component class and CSS positioning already applied to the other two tabs, but code evidence is not a visual comparison.

### Required fidelity surfaces

- Fonts and typography: unchanged.
- Spacing and layout rhythm: the numbered/dotted target strip is removed; previous and next controls now occupy the same two card-edge positions as Từ vựng and Cụm từ.
- Colors and visual tokens: unchanged Himi coral and neutral control treatment.
- Image quality and asset fidelity: no image changes; the existing Lucide arrow icons are reused.
- Copy and content: no visible target numbers or dots remain. The right arrow is disabled on sentence 10 and the existing “Hoàn thành” action remains visible only there.

### Verification

- All 36 authored lessons retain ten listening-and-speaking targets.
- Six focused curriculum and responsive tests pass.
- ESLint and `git diff --check` pass.
- Production build passes.

### Implementation checklist

- [x] Remove the target dot/box strip.
- [x] Add previous/next card-edge controls to Nghe & nói.
- [x] Disable backward navigation on the first sentence and forward navigation on the tenth.
- [x] Preserve “Hoàn thành” on sentence 10.
- [ ] Capture desktop/mobile states when the in-app Browser is available.

final result: blocked
