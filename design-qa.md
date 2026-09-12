# Design QA — HSK vocabulary learning screen

## Comparison target

- Source visual truth: `C:\Users\DELL\Downloads\stitch_vocabulary_learning_ui_redesign\screen.png`
- Source pixels: 1600 × 1308 at 96 DPI (1× reference density)
- Implementation: `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play`, vocabulary item 01/6 (`你`), pinyin visible, playback speed 1×
- Implementation screenshots: browser-rendered inline captures from the Codex in-app browser. The browser exposed the captures inline but did not expose a filesystem path. Evidence was captured as a 1600 CSS px top region and a 1600 CSS px lower region covering the complete viewport.
- CSS viewport: 1600 × 1308
- Browser device pixel ratio: 0.8. Browser capture output was resampled by the in-app capture surface; layout comparison therefore used normalized CSS geometry plus the rendered captures instead of raw-pixel difference scoring.

## Full-view comparison evidence

The reference and implementation were opened and inspected at the same vocabulary state. The final implementation matches the source's primary frame:

- Header: 1600 × 152 px.
- Progress track: x 340, y 39, width 660, height 8 px (reference is approximately x 340, y 38, width 659, height 8 px).
- Main content: x 120, width 1360 px.
- Card grid: x 120, y 493, width 1360, height 684 px.
- Meaning card: 660 × 238 px at x 120, y 493.
- Example card: 660 × 414 px at x 120, y 763.
- Structure card: 660 × 684 px at x 820, y 493.
- Footer: 1600 × 89 px, fixed at the bottom.

The visible hierarchy, red-orange accent, cool gray background, soft white cards, large centered Hanzi, two-column card composition, and fixed navigation footer all match the visual target. The support launcher was removed from this focused lesson screen because it overlapped the target's primary CTA and does not appear in the reference.

## Focused region comparison evidence

- Header controls: progress, step count, pinyin control, and playback speed are aligned to the same horizontal zones as the reference. Final pinyin x is 1313 px and speed-group x is 1389 px.
- Hero: `你`, pronunciation control, pinyin, word class, and vocabulary counter use the same centered stack and scale relationship.
- Meaning/example column: card heights, internal dividers, contextual explanation, example audio, translation, and phrase chips match the reference structure and copy.
- Character structure column: two radical cards, memory callout, true Hanzi Writer stroke progression, writing CTA, HSK level, and readiness status match the intended composition.
- Footer: previous/next controls and centered Enter-key hint match the reference. The Enter key advances to the next vocabulary step.

## Required fidelity surfaces

- Fonts and typography: passed. Roboto remains the product UI font; Songti/Microsoft YaHei fallbacks provide the correct Chinese display contrast. Sizes, weights, line heights, and wrapping were checked at the reference viewport.
- Spacing and layout rhythm: passed. Major section coordinates and card dimensions match the reference within 0–4 CSS px, with no clipped persistent controls.
- Colors and visual tokens: passed. The page now uses a red-orange primary accent, slate ink, cool muted labels, pale gray-blue surfaces, and subtle red supporting states.
- Image quality and asset fidelity: passed. There are no missing raster assets in the reference. Icons come from the project's existing icon library, and the stroke-order strip uses actual Hanzi Writer data instead of placeholder glyph art.
- Copy and content: passed. The first vocabulary item includes the target meaning, usage explanation, radical names, memory aid, contextual example, and common phrases.

## Comparison history

1. Initial state — blocked by P1/P2 mismatches: narrow 830 px vocabulary canvas, green visual system, single-row information cards, missing context/collocations/stroke order, and support launcher overlapping the footer.
2. First implementation — remaining P2s: card grid began 9 px too high, pinyin/speed controls were distributed too widely, and the support launcher still overlapped the primary action. Fixes: moved the grid to y 493, switched the toolbar to fixed/max-content tracks, and hid the launcher on guided lesson pages.
3. Final pass — no actionable P0/P1/P2 differences remained. Post-fix browser captures and CSS geometry show the target composition at 1600 × 1308.

## Primary interactions tested

- Vocabulary stage navigation
- Pinyin hide/show toggle
- Enter key advances to the next word
- “Xem hoạt họa nét” opens the writing stage
- Previous/next controls remain enabled appropriately
- Browser console errors/warnings checked: none

## Verification

- ESLint for `components/hsk-guided-lesson.tsx`: passed
- Guided lesson and HSK lesson tests: 8/8 passed
- `npm run build`: client modules compiled successfully, then the Sites close-bundle step hit an existing Windows file lock on `dist/.openai/hosting.json` (`EPERM`). This is an environment/output lock and not a UI or runtime defect; the active local page remained functional.

## Follow-up polish

- P3: a final font rasterization comparison can be repeated at devicePixelRatio 1 if the in-app browser later exposes a 1× capture surface.

final result: passed

---

# Design QA — Vocabulary brand palette

## Comparison target

- Source visual truth: the annotated `/vocabulary` screenshot supplied in the current conversation together with the repository's official Himi identity tokens in `lib/brand.ts`; the browser-comment capture did not expose a filesystem path.
- Source screenshot: 1159 × 677 px at device pixel ratio 1, authenticated desktop state with the vocabulary overview visible.
- Requested state: preserve the page structure and saved-vocabulary behavior while replacing the green/olive visual language with Himi red `#FF4C3B`, orange `#FF8E2D`, black, white, and their soft tints.
- Implementation: `http://localhost:3001/vocabulary` in the Codex in-app browser.
- Implementation screenshot: emitted inline from the authenticated `Từ đã lưu` state; the capture API did not expose a filesystem path.
- Implementation viewport: 1600 × 900 CSS px at device pixel ratio 1.
- Density normalization: none required. The available in-app browser viewport was wider than the annotated source, so the full-view comparison was limited to responsive structure, proportions, hierarchy, and palette rather than exact cross-viewport pixel distances.

## Findings

- No actionable P0/P1/P2 differences remain for the brand-palette request.

## Full-view comparison evidence

- The rail, top bar, hero, segmented tabs, primary CTA, saved-word grid, and support control retain their original desktop composition and hierarchy.
- The former green/olive hero and actions now use a restrained pale-coral canvas with Himi-red primary controls and Himi-orange supporting accents.
- White card surfaces and black/muted copy keep the page readable; brand color is concentrated on actions, selected states, Hán tự emphasis, and small status accents rather than saturating the whole page.
- No clipping, overlap, horizontal overflow, or unintended layout shift is visible in the rendered implementation.

## Focused region comparison evidence

- Hero: eyebrow, border, artwork characters, CTA, and shadow now derive from `--himi-red` and `--himi-orange`, while the supplied spacing and two-column structure are unchanged.
- Toolbar: selected tab, count chips, and `Bắt đầu học` now share the same Himi brand hierarchy as the active navigation item.
- Saved-word cards: Hán tự, pronunciation controls, pinyin accents, borders, hover elevation, and saved badges use the shared page tokens consistently.
- A separate crop was not needed because the 1600 × 900 capture keeps hero controls and saved-card typography legible at native density.

## Required fidelity surfaces

- Fonts and typography: passed. Roboto, serif Hán tự, weights, line heights, wrapping, and heading hierarchy are unchanged.
- Spacing and layout rhythm: passed. Existing content width, 24 px hero radius, toolbar spacing, card grid, 18 px card radii, and responsive breakpoints are preserved.
- Colors and visual tokens: passed. The page now maps primary, accent, surface, border, muted copy, focus halo, and soft backgrounds to the official Himi tokens; the former `--vs-green` token and old green/olive literals were removed.
- Image quality and asset fidelity: passed. Existing wordmark, mascot, icons, and hero character treatment remain sharp and unchanged in scale; no new raster or placeholder asset was introduced.
- Copy and content: passed. All existing vocabulary labels, saved-word data, source attribution, and calls to action are unchanged.

## Comparison history

1. Initial P1 brand mismatch: the vocabulary content used a green/olive primary palette that conflicted with the red/orange navigation and official Himi identity layer.
2. Fix: introduced local semantic tokens backed by `--himi-red`, `--himi-orange`, `--himi-black`, `--himi-white`, `--himi-muted`, and `--himi-line`; applied them across overview, detail, empty, form, and study states.
3. Post-fix evidence: the live authenticated page shows a pale-coral hero, red primary actions, warm orange secondary accents, neutral readable cards, and no remaining old vocabulary green token.

## Primary interactions tested

- Open `/vocabulary` as the authenticated user.
- Switch to `Bộ của tôi` and confirm its selected state and `Bộ từ vựng của tôi` heading.
- Return to `Từ đã lưu` and confirm its selected state and `Danh sách từ vựng` heading.
- Confirm `Bắt đầu học` still targets `/vocabulary/saved/study/vocabulary`.
- Open the `Tạo bộ từ vựng` form and close it with `Hủy`.
- Confirm no runtime error overlay appears after reload or interaction.

## Verification

- `tests/vocabulary-library-ui.test.mjs`: 1/1 passed, including assertions for the Himi red/orange token mapping and removal of `--vs-green`.
- Focused ESLint for `components/vocabulary-set-library.tsx` and `app/vocabulary/page.tsx`: passed with zero warnings.
- Legacy green/olive vocabulary palette scan: passed with no matches.
- Browser-rendered authenticated preview: passed at 1600 × 900, device pixel ratio 1.

## Follow-up polish

- P3: repeat the full-page comparison at 1159 × 677 if the in-app browser panel is resized to the exact annotated viewport.

final result: passed

---

# Design QA — Faster correct-answer celebration

## Comparison target

- Source visual truth: `C:\Users\DELL\Downloads\3576f1df24e20af5bc43777b9a5ddc98.gif`.
- Source and implementation asset timing: 800 × 600 px, 280 frames, 25 fps, 11.2 seconds at the original 1× playback speed.
- Implementation: `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/quiz`, question 1/2 immediately after selecting the correct answer.
- Implementation screenshot: Codex in-app browser capture emitted inline; the capture API did not expose a filesystem path.
- Browser viewport: 1600 × 900 CSS px at device pixel ratio 1.

## Full-view comparison evidence

- The half-speed asset was replaced with the original-speed transparent GIF, making the falling pieces travel through the card more quickly while preserving the supplied artwork.
- The celebration now runs and fades over 2.4 seconds instead of 4.2 seconds. The final 30% provides a short eased fade rather than an abrupt cut.
- Card geometry, answer feedback, toolbar, and all brand colors remain unchanged.

## Focused region comparison evidence

- The live capture shows dense multicolor confetti already distributed across and just outside the card immediately after the correct answer is selected.
- The source's 25 fps frame cadence is preserved for smooth motion; the transparent background and `pointer-events: none` behavior remain intact.
- The overlay unmounts after the shortened timeout, and `TIẾP` remains available without waiting for the animation.

## Primary interactions tested

- Select the correct answer and confirm the faster celebration appears.
- Confirm the overlay disappears after the 2.4-second timeout.
- Activate `TIẾP` and advance to the VIP question state.
- Reload the route and confirm the quiz resets cleanly.
- Browser error and warning logs: none.

## Verification

- GIF metadata: 800 × 600, 280 frames, 25 fps.
- Focused ESLint: passed.
- `tests/hsk-lesson.test.mjs`: 3/3 passed.
- Final live preview: passed at 1600 × 900, device pixel ratio 1.

final result: passed

---

# Design QA — Immersive HSK quiz

## Comparison target

- Source visual truth: user-attached Quiz reference in Browser Comment 1; the annotation surface did not expose a filesystem path.
- Source pixels: 1000 × 748.
- Implementation: `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/quiz`, question 1/2, correct-answer feedback visible, pinyin enabled, playback speed 1.25×.
- Implementation screenshot: Codex in-app browser capture emitted inline; the capture API did not expose a filesystem path.
- Browser viewport: 925 × 882 CSS px at device pixel ratio 1.
- Normalization: the user reference and live render were compared together in the same working context. The browser viewport is tool-owned and could not be resized to 1000 × 748, so fixed component geometry and proportional alignment were compared directly.

## Full-view comparison evidence

- The quiz now replaces learner navigation, topbar, mobile navigation, route progress, and chatbot with a focused full-width learning surface.
- Reference card: approximately x 106, y 153, width 720, height 565 px. Implementation card: x 103, y 152, width 720, height 565 px.
- Reference toolbar progress begins near x 125 at y 31. Implementation progress begins at x 129 at y 35, with the same rounded track, counter, pinyin control, and three-speed group.
- The white card, cool gray page, 27 px radius, restrained shadow, two-column answer grid, semantic green feedback strip, and coral-red next action preserve the reference hierarchy while using Himi's existing brand accent.

## Focused comparison evidence

- Correct state: the chosen answer uses a green border and mint surface; unchosen answers remain visible but muted; the feedback row contains a circular check, `Chính xác!`, and a pill-shaped `TIẾP` action with a dark lower edge.
- Question state: 2 × 2 answer layout, 88 px controls, rounded 24 px borders, centered prompt, and uppercase instruction match the reference density.
- Header state: `Thoát`, progress, `1 / 2`, pinyin, and 0.75×/1×/1.25× controls remain on one line at desktop width. The 1.25× choice is active as shown in the reference.
- Content uses the real HSK lesson exercise data. The lesson's second question remains a real VIP lock for signed-out learners, matching the existing access policy rather than exposing protected content.

## Required fidelity surfaces

- Fonts and typography: passed. Existing product typography is retained; Chinese prompts use the installed CJK fallback stack; Vietnamese diacritics and answer wrapping remain legible.
- Spacing and layout rhythm: passed. Card placement and size match the reference within 0–4 CSS px after viewport normalization; controls have consistent 11–24 px rhythm and no clipping.
- Colors and visual tokens: passed. Himi coral-red drives progress, active controls, focus, and the primary CTA; green is reserved for correct-answer semantics.
- Image quality and asset fidelity: passed. The reference contains no raster artwork. Standard controls reuse the project's installed Lucide icon system, with no placeholder or handcrafted icon assets.
- Copy and content: passed. The immersive shell follows the reference labels while displaying the repository's real HSK question count, exercise content, and VIP state.

## Comparison history

1. Initial implementation: matched the 720 × 565 card and header geometry; selected-answer text inherited global disabled opacity and appeared too faint.
2. Fix: scoped disabled opacity to 1 while retaining explicit muted colors for unselected answers.
3. Final pass: no actionable P0, P1, or P2 visual differences remain in the reference state.

## Primary interactions tested

- Click the selected `Quiz` link from the HSK lesson page and confirm navigation to the immersive route.
- Choose the correct answer and display feedback.
- Advance to the next question.
- Preserve the question-level VIP lock without exposing hidden content.
- Finish the session, show the score, and restart.
- Toggle-ready pinyin and selectable speech-speed controls render with correct pressed states.
- Browser logs checked: no application errors; only the pre-existing reduced-motion development warning was present.

## Verification

- Focused ESLint for the new Quiz component, route, and regression test: passed.
- `tests/hsk-lesson.test.mjs`: 3/3 passed.
- TypeScript check reached only pre-existing errors in `lib/admin-analytics-service.ts`; no Quiz errors were reported.
- Production build transformed 655 modules successfully, then the existing Sites close-bundle step hit a Windows `EPERM` lock on `dist/.openai/hosting.json`.

## Follow-up polish

- P3: repeat the raster comparison at the exact 1000 × 748 source viewport if the in-app browser later exposes viewport resizing. The current fixed geometry already matches the reference closely.

final result: passed

---

# Design QA — Correct-answer celebration GIF

## Comparison target

- Source visual truth: `C:\Users\DELL\Downloads\3576f1df24e20af5bc43777b9a5ddc98.gif`.
- Source asset: 800 × 600 px, 280 frames, 25 fps, 11.2-second looping GIF.
- Implementation: `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/quiz`, question 1/2 immediately after selecting the correct answer.
- Implementation screenshot: Codex in-app browser capture emitted inline; the capture API did not expose a filesystem path.
- Browser viewport: 1600 × 900 CSS px at device pixel ratio 1.
- Rendered celebration region: 800 × 600 CSS px centered over the 720 × 565 quiz card, matching the source asset's native aspect ratio and pixel dimensions.

## Full-view comparison evidence

- The celebration uses the exact user-supplied confetti artwork, positioned over the answer card while leaving the focused quiz shell, toolbar, progress, and page background unchanged.
- The overlay extends approximately 40 px beyond each horizontal card edge, matching the reference GIF's edge-burst composition without changing card geometry.
- The green correct answer and feedback bar remain visible beneath the transparent confetti. The red `TIẾP` action stays legible and clickable.

## Focused region comparison evidence

- The live capture shows red, yellow, green, blue, purple, and orange confetti pieces falling across and just outside the card.
- The processed GIF preserves all 280 source frames and the original 800 × 600 canvas. Only the opaque white background was removed; playback was slowed to keep the celebration readable in context.
- The overlay has `pointer-events: none`, so the primary action advances immediately even while confetti is visible.
- The celebration mounts only for a correct answer, unmounts after 4.2 seconds, and is cleared immediately on Next or restart. Wrong answers do not trigger it.

## Required fidelity surfaces

- Fonts and typography: passed. No text styling or layout changed; all quiz labels remain readable during the effect.
- Spacing and layout rhythm: passed. The fixed 800 × 600 overlay is centered on the card and does not cause reflow, overflow, or control movement.
- Colors and visual tokens: passed. Source confetti colors are preserved and complement the existing Himi coral CTA and semantic green success state.
- Image quality and asset fidelity: passed. The implementation uses the exact supplied GIF rather than a CSS, SVG, emoji, or generated approximation. Background removal avoids a white rectangle covering the interface.
- Copy and content: passed. The question, answer choices, `Chính xác!`, and `TIẾP` remain unchanged.

## Comparison history

1. Initial P1: the supplied GIF's opaque white canvas covered the complete quiz card and hid the question, answers, feedback, and CTA.
2. Fix: converted near-white background pixels to transparency while preserving the full animation and native dimensions; slowed frame timing for better visibility and limited the mounted effect to 4.2 seconds.
3. Post-fix browser evidence: the confetti is visibly composited over the correct-answer state, underlying content remains readable, and `TIẾP` advances successfully while the effect is active.

## Primary interactions tested

- Select the correct answer and trigger the celebration.
- Confirm the GIF does not appear before selection.
- Confirm question content remains visible beneath the transparent pixels.
- Activate `TIẾP` while the effect is present and advance to question 2.
- Confirm the celebration is removed on navigation.
- Browser logs checked after restarting the local preview: no errors or warnings.

## Verification

- Focused ESLint: passed.
- `tests/hsk-lesson.test.mjs`: 3/3 passed.
- Final live preview: passed at 1600 × 900, device pixel ratio 1.

## Follow-up polish

- None required for this scoped celebration effect.

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
