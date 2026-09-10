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
