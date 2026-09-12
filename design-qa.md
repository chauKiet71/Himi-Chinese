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

final result: blocked
