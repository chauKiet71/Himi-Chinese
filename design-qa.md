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
