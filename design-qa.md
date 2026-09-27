**Design QA — Practice task visible without page scroll**

- Source visual truth path: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-3760450b-c8b1-4af4-a4e5-0a11100e06ff.png`.
- Implementation: `http://localhost:3000/dev/writing-fit-preview`.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Source pixels: 1907 × 874. Implementation viewports: 1907 × 874, 1366 × 768, and 390 × 844 CSS px at device scale factor 1.
- State: HSK 2 lesson 1 writing practice, first character selected, watch-stroke mode.

**Full-view comparison evidence**

- At 1907 × 874, the page scroll height equals the 874 px viewport; the 414 px writing board ends at 700 px and the final navigation ends at 851 px.
- At 1366 × 768, the page scroll height equals the 768 px viewport; the complete workspace ends at 765 px and the character navigation ends at 738 px.
- At 390 × 844, the primary practice card runs from 78 px to 652 px and remains fully above the persistent navigation beginning at 771 px. The optional character library follows below.

**Focused region comparison evidence**

- Fonts and typography: lesson copy retains its original hierarchy; phone metadata is removed from the compact header while the lesson title remains visible.
- Spacing and layout rhythm: desktop header, mode tabs, board margins, feedback, actions, and navigation now share the available viewport height.
- Colors and visual tokens: unchanged.
- Interaction and scrolling: desktop page scroll is removed; long character collections scroll only inside the character library. Listening and video study sessions use the same viewport-fit principle with internal overflow where needed.
- Mobile priority: the practice task is ordered before the optional character library, so no page scroll is required to begin learning.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked desktop, laptop, and phone states.
- Browser console errors checked: none.

**Comparison history**

- P1: the 490 px fixed writing board plus a tall lesson header pushed the controls below the initial viewport. Fix: size the board from `100dvh`, compact the header, and allocate the workspace from the remaining height.
- P1: tablet and phone layouts placed the character library before the exercise. Fix: place the practice card first and keep the library as optional content below.
- P2: character lists could increase the page height on desktop. Fix: constrain the library to the workspace and scroll its grid internally.

**Implementation Checklist**

- [x] Desktop 1907 × 874 has no page scroll
- [x] Laptop 1366 × 768 has no page scroll
- [x] Mobile 390 × 844 shows the complete task before navigation
- [x] Writing library uses internal scrolling
- [x] Listening and video study sessions receive matching viewport-fit constraints
- [x] 19/19 targeted tests pass
- [x] Production build passes

**Follow-up Polish**

- No further visual correction is required for this scoped issue.

final result: passed

---

**Design QA — Visible Himi in compact celebrations**

- Source visual truth path: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-2fd434f8-5e54-4c41-9f35-1843c1e657bc.png`.
- Implementation: `http://localhost:3000/dev/completion-preview`.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Source pixels: 690 × 690. Implementation viewports: 1366 × 640 desktop and 390 × 844 mobile at device scale factor 1.
- State: completed HSK 2 typing session with animated Himi, score, statistics, and actions visible.

**Full-view comparison evidence**

- Short desktop screens now use a 780 × 524 maximum landscape card: Himi and the trophy are fully visible on the left, while all completion information remains visible on the right.
- Mobile keeps the vertical composition and shows Himi's smiling face and raised trophy above the panel while preserving all statistics and actions in one viewport.
- Regular-height desktop retains the original vertical celebration composition.

**Focused region comparison evidence**

- Fonts and typography: compact landscape heading and actions use reduced responsive sizes without changing hierarchy or weight.
- Spacing and layout rhythm: the short-desktop panel occupies the right 52% with a 4% inset; the mascot occupies the left 42% and no longer sits behind the white panel.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: the original animated Himi trophy asset remains proportional, uncropped, and fully visible on short desktop.
- Copy and content: all labels, score, four statistics, and both actions remain available.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked short-desktop and mobile states.
- Browser console errors checked: none.

**Comparison history**

- P1: the compact square card allowed the tall content panel to cover nearly all of Himi on short desktop screens. Fix: introduced a short-height landscape layout with separate mascot and content regions.
- Post-fix evidence: the 1366 × 640 capture shows the complete Himi body and trophy beside the complete panel; the 390 × 844 capture keeps Himi's face and trophy visible above the mobile panel.

**Implementation Checklist**

- [x] Full Himi visible on short desktop
- [x] Himi face and trophy visible on mobile
- [x] Completion content remains within one viewport
- [x] Existing animated assets preserved
- [x] 5/5 targeted tests pass
- [x] Production build passes

**Follow-up Polish**

- No further visual correction is required for this scoped issue.

final result: passed

---

**Design QA — Responsive completion celebrations**

- Source visual truth path: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-047ed358-bc5e-4bc8-a1bf-54c77b920195.png`.
- Implementation: `http://localhost:3000/dev/completion-preview` using the same `GameResultCelebration` component as typing, games, flashcards, writing games, and lesson completion.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Source pixels: 1920 × 880. Implementation viewports: 1440 × 800, 1366 × 640, and 390 × 844 CSS px at device scale factor 1.
- State: completed HSK 2 typing session with score, four statistics, and two actions visible.

**Full-view comparison evidence**

- At 1366 × 640 the complete card ends at 626 px and the action row at 580 px; page scroll height equals the 640 px viewport.
- At 1440 × 800 the full illustration, score, four statistics, and both actions remain visible inside one centered card.
- At 390 × 844 the full completion card fits above the persistent mobile navigation without clipping or horizontal overflow.
- Shared celebration sizing now affects game results, flashcards, lesson completion, writing games, and typing; typing-specific oversized minimum heights were removed.

**Focused region comparison evidence**

- Fonts and typography: headline and score use smaller responsive maxima while preserving the same hierarchy and weights.
- Spacing and layout rhythm: panel padding, details spacing, statistic cards, and action heights are compacted; desktop sizing subtracts the application header from the available viewport height.
- Colors and visual tokens: coral actions, warm ivory surfaces, navy copy, and gold score accent are unchanged.
- Image quality and asset fidelity: the existing animated fireworks and Himi trophy assets remain intact and scale proportionally.
- Copy and content: all completion copy, statistics, and actions remain present.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked desktop, short-desktop, and phone states.
- Browser console errors checked: none.

**Comparison history**

- P1: typing forced a 760 px desktop and 720 px mobile minimum height, causing the lower actions to leave the visible frame. Fix: removed those fixed minima and introduced viewport-aware card dimensions.
- P1: the first compact desktop pass still used the full viewport height without subtracting the 88 px application header. Fix: changed shared and typing desktop sizing to `calc(100dvh - 116px)` and the stage to `calc(100dvh - 88px)`.
- P2: panel padding, title, score, and 54 px actions consumed unnecessary vertical space. Fix: tightened the shared typography and spacing tokens while preserving touch targets of at least 44 px on mobile.
- Post-fix evidence: the 1366 × 640 capture shows the full card and actions with no page scroll; the 390 × 844 capture shows the entire mobile result above navigation.

**Implementation Checklist**

- [x] Shared viewport-aware completion card
- [x] Typing completion no longer forces oversized heights
- [x] Desktop 1440 × 800 verified
- [x] Short desktop 1366 × 640 verified
- [x] Mobile 390 × 844 verified
- [x] 13/13 targeted tests pass
- [x] Production build passes

**Follow-up Polish**

- No further visual correction is required for this scoped issue.

final result: passed

---

**Design QA — Compact mobile pronunciation frame**

- Source visual truth path: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-e8f69dc3-ea00-4daa-ace6-31e3f8fafb44.png`.
- Implementation: `http://localhost:3000/dev/pronunciation-preview`.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Source pixels: 347 × 747. Implementation viewports: 390 × 844 and 360 × 800 CSS px at device scale factor 1.
- State: question 01/10 with the longest preview sentence, empty pronunciation result, controls visible.

**Full-view comparison evidence**

- The mobile lesson panel is reduced from 720 px to 520 px, bringing the complete listening/recording task into a substantially smaller area.
- The Himi mascot is removed from the mobile stage, eliminating the large unused mascot zone shown in the source capture.
- The long sentence, pinyin, Vietnamese translation, result row, and complete action dock remain visible at both checked widths.

**Focused region comparison evidence**

- Fonts and typography: adaptive long-sentence sizing remains intact; the checked longest sentence is fully readable at 390 px and 360 px.
- Spacing and layout rhythm: the shared Hanzi slot is tightened from 174 px to 160 px, content top padding is reduced, and the pinyin/translation slots are compacted without collision.
- Colors and visual tokens: the existing coral, orange, ivory, and navy system remains unchanged.
- Image quality and asset fidelity: Himi is intentionally hidden only below the 640 px breakpoint per the user's request; desktop imagery is unchanged.
- Copy and content: no learning text or control label was removed.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked 390 px and 360 px mobile states.
- Browser console errors checked: none.

**Comparison history**

- P1: the 720 px mobile panel occupied nearly the full screen and left a large empty region around Himi. Fix: removed the mobile mascot and reduced the shared panel to 520 px.
- P2: the prior 174 px text slot and generous vertical padding preserved unnecessary whitespace after removing the mascot. Fix: reduced the shared text slot to 160 px and tightened supporting text slots.
- Post-fix evidence: browser measurements report `panelHeight: 520`, `headingHeight: 160`, `mascotDisplay: none`, and no horizontal overflow at 390 px or 360 px.

**Implementation Checklist**

- [x] Compact 520 px mobile lesson frame
- [x] Himi hidden on mobile only
- [x] Long sentence remains fully visible
- [x] No horizontal overflow at 390 px and 360 px
- [x] 8/8 responsive tests pass
- [x] Production build passes

**Follow-up Polish**

- No further visual correction is required for this scoped issue.

final result: passed

---

**Design QA — Unified short and long sentence height**

- Source visual truth: the pronunciation mock-up and issue captures already supplied in this task, with the user's follow-up requirement that short sentences use the long sentence's vertical slot.
- Implementation: `http://localhost:3000/dev/pronunciation-preview`.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Implementation viewports: 390 × 844 mobile and 1440 × 800 desktop at device scale factor 1.
- States compared: question 01/10 (`今天我们一起确认会议时间和需要准备的资料。`) and question 02/10 (`好的，以后有问题可以找我。`).

**Full-view comparison evidence**

- Mobile long and short states now both use a 174 px Hanzi region inside an unchanged 720 px lesson panel.
- The result row remains at the same measured vertical position (`609.2 px`) in both mobile states.
- Desktop already used a shared 138 px Hanzi region and 540 px panel at the checked short-height viewport, so no desktop sizing override was required.

**Focused region comparison evidence**

- Fonts and typography: sentence length still controls font size, not container height. Short copy remains visually prominent while long copy scales down to fit.
- Spacing and layout rhythm: the Hanzi, pinyin, translation, result, mascot, and action dock no longer move when switching between the checked short and long mobile sentences.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: the existing Himi WebP remains unchanged and clear of the text slot.
- Copy and content: unchanged; only the mobile Hanzi slot height was unified.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked long/short desktop and mobile states.
- Browser console errors checked: none.

**Comparison history**

- P2: short mobile sentences used a 142 px Hanzi slot while very-long sentences used 174 px, causing the following content to shift between questions. Fix: made 174 px the shared mobile default and kept font-size adaptation independent.
- Post-fix evidence: browser measurements report identical `headingHeight: 174`, `panelHeight: 720`, and `statusTop: 609.2` for both checked mobile states.

**Implementation Checklist**

- [x] Shared short/long mobile sentence height
- [x] Short sentences keep their larger font size
- [x] Desktop stable height preserved
- [x] 8/8 responsive tests pass
- [x] Production build passes

**Follow-up Polish**

- No further visual correction is required for this scoped issue.

final result: passed

---

**Design QA — Adaptive typography for long pronunciation sentences**

- Source visual truth path: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-931d3d71-2a39-4ac0-862a-40749dd89814.png`.
- Implementation: `http://localhost:3000/dev/pronunciation-preview`.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Source pixels: approximately 1607 × 742. Implementation viewports: 1440 × 800 desktop and 390 × 844 mobile at device scale factor 1.
- State: longest preview sentence at question 01/10, empty result, playback controls visible.

**Full-view comparison evidence**

- The long Chinese sentence is fully visible on desktop and phone; it no longer pushes pinyin or Vietnamese copy out of the reading area.
- Desktop keeps the sample on one readable line. Mobile wraps it into four complete lines without clipping.
- The adaptive treatment is data-driven for all current and future lesson sentences rather than being hard-coded to the preview sample.

**Focused region comparison evidence**

- Fonts and typography: normal sentences keep the original large display size. Long, very-long, and extra-long Hanzi tiers reduce progressively at 13, 19, and 27 Han characters.
- Readability floor: the smallest extra-long tier remains 29 px on regular desktop, 27 px on a short-height laptop, and 19 px on narrow mobile; pinyin and Vietnamese copy receive smaller proportional adjustments so the hierarchy remains clear.
- Spacing and layout rhythm: longer mobile sentences receive 174 px or 188 px heading slots, while normal questions retain the compact default slot.
- Colors, controls, mascot placement, result row, and interaction behavior are unchanged.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked 1440 × 800 and 390 × 844 long-sentence states.
- Browser console errors checked: none.

**Comparison history**

- P1: a single display size made long Hanzi dominate the fixed-height stage and clip the following lines. Fix: added four typography tiers derived from the actual Han-character count.
- P2: the first very-long threshold did not classify the 20-character preview sentence on mobile. Fix: corrected the threshold from 21 to 19 characters and rechecked the full sentence.
- P2 safeguard: sentences of 27 or more Han characters now use a dedicated extra-long tier instead of continuing to scale unpredictably.

**Implementation Checklist**

- [x] Long sentences shrink automatically
- [x] Normal sentences retain the large display size
- [x] Readable minimum font sizes preserved
- [x] Desktop and mobile verified
- [x] 8/8 responsive tests pass
- [x] Production build passes

**Follow-up Polish**

- No further visual correction is required for this scoped issue.

final result: passed

---

**Design QA — Long pronunciation sentence correction**

- Source visual truth path: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-fe3483be-8ac8-4f4a-8546-985a7fda34be.png` with focused references `codex-clipboard-00d285f5-cfd8-4e91-96d8-dc0974cfd126.png` and `codex-clipboard-d5f3db99-2ec4-425f-b7c7-cb8655ce0b0a.png`.
- Implementation: `http://localhost:3000/dev/pronunciation-preview`.
- Implementation screenshot path: Codex in-app Browser capture in this task; the browser capture API does not expose a filesystem path.
- Source pixels: 1799 × 855 for the full issue capture. Implementation viewports: 1440 × 900 desktop and 390 × 844 mobile at device scale factor 1.
- State: longest pronunciation sentence at question 01/10, empty result, playback controls visible.

**Full-view comparison evidence**

- Desktop now renders the complete two-line Hanzi sentence without clipping its upper strokes.
- The coaching copy and decorative sentence beside Himi are removed completely.
- Himi is reduced and anchored to the lower-left visual margin, clear of the learning text, result row, and control labels.
- Mobile retains the same outer height when moving from the longest sentence to question 02/10.

**Focused region comparison evidence**

- Fonts and typography: the desktop Hanzi region is 162 px high (138 px on short-height desktop), preserving two full lines and the existing optical weight.
- Spacing and layout rhythm: removing the unused coach copy closes the mobile top gap; the result and action dock remain in fixed lower slots.
- Colors and visual tokens: existing coral, orange, ivory, and navy tokens are unchanged.
- Image quality and asset fidelity: the repository Himi WebP remains sharp and is scaled proportionally without cropping or replacement.
- Copy and content: only the two user-requested coaching lines and the overlapping decorative line were removed; sentence, pinyin, translation, result, navigation, playback, speed, and recording copy remain intact.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked long desktop sentence, long mobile sentence, or shorter mobile sentence.
- Browser console errors checked: none.

**Comparison history**

- P1: the long Hanzi sentence overflowed a 110 px desktop heading slot and clipped its upper line. Fix: raised the desktop heading slot to 162 px and rebalanced top padding.
- P2: Himi and its decorative sentence visually overlapped. Fix: removed the decorative sentence, reduced desktop mascot width to a 190 px maximum, and retained a separate lower-left anchor.
- P2: “Đọc trọn câu / Giữ nhịp đều” added noise without helping the task. Fix: removed the element and its pronunciation-specific styling.
- Post-fix evidence: browser captures at 1440 × 900 and 390 × 844 show complete text, clear mascot separation, and no unused coaching copy.

**Implementation Checklist**

- [x] Complete long Hanzi display
- [x] Himi no longer covers copy
- [x] Coaching block removed
- [x] Stable long/short sentence frame
- [x] Desktop and mobile verified
- [x] 8/8 responsive tests pass
- [x] Production build passes

**Follow-up Polish**

- No further visual correction is required for this scoped issue.

final result: passed

---

**Design QA — Immersive pronunciation stage (selected mock-up 3)**

- Source visual truth path: `D:/CodexData/.codex/generated_images/01a0a47d-22a9-7820-b2ee-099b79373a6c/exec-669ac2c3-b184-4f26-99f0-e3a35487bc08.png`.
- Implementation: `http://localhost:3000/dev/pronunciation-preview` (development-only preview; production returns 404).
- Implementation screenshot path: Codex in-app Browser tab 2, captured inline in this task; the browser capture API does not expose a filesystem path.
- Source pixels: 1536 × 1024. Implementation captures: 1440 × 900 desktop, 390 × 844 mobile, and 360 × 800 narrow mobile at device scale factor 1.
- Density normalization: source presentation board and browser captures were compared by matching the app-owned desktop and phone content regions rather than the mock-up's surrounding presentation canvas/device bezel.
- State: question 02/10 using `好的，以后有问题可以找我。`, empty result, playback controls visible, speed menu tested open/closed.

**Full-view comparison evidence**

- Desktop reproduces the mock-up's single immersive warm learning canvas, centered sentence hierarchy, edge navigation, integrated coaching note, Himi illustration, inline result divider, and unified bottom control dock.
- Mobile removes the former side rail, keeps the learning hierarchy in one stable 720 px stage, moves Himi above the result divider, and retains the complete three-part control dock without horizontal clipping.
- The original repeated card-inside-card treatment is removed; only the stage and unified action dock retain intentional surfaces.

**Focused region comparison evidence**

- Fonts and typography: dark navy Hanzi remains the focal point; orange pinyin and strong Vietnamese translation preserve the reference hierarchy. The selected desktop sentence stays on one line; mobile wraps within a stable-height region.
- Spacing and layout rhythm: progress, sentence, translation, result, mascot, and action dock occupy stable slots. The 360 px capture keeps both navigation controls and all actions visible.
- Colors and visual tokens: coral primary action/progress, orange coaching/pinyin, warm ivory canvas, and dark ink text match the selected direction. The speed menu's active state was changed from green to coral.
- Image quality and asset fidelity: existing repository assets `/assets/mascot/himi-v2/himi-listen.webp` and `/assets/backgrounds/lesson-coach-office.png` are used directly, with no CSS-drawn replacement.
- Copy and content: question count, Hanzi, pinyin, Vietnamese translation, listening, speed, recording, result, coaching, navigation, and completion behavior remain available.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked desktop, 390 px, and 360 px states.
- Primary interactions tested: next question updates progress/content; speed menu opens and exposes its choices; listen and record controls remain enabled. Recording was not started because browser microphone permission is outside visual QA.
- Browser console errors checked: none.

**Comparison history**

- Pass 1 P1: the selected desktop sentence wrapped its final character onto a second line, unlike the source. Fix: widened the stable typographic stage from 820 px to 980 px while retaining the two-line limit for genuinely long content.
- Pass 1 P2: the mobile mascot overlapped the empty-result row. Fix: raised the mascot from 100 px to 158 px above the stage bottom.
- Pass 1 P2: speed-menu feedback used the previous green accent. Fix: mapped hover, focus, and selected states to the coral pronunciation tokens.
- Post-fix evidence: the 1440 × 900 capture shows the sample sentence on one line; 390 × 844 and 360 × 800 captures show separated mascot/result areas and a complete action dock.

**Implementation Checklist**

- [x] One continuous learning canvas
- [x] Unified action dock
- [x] Stable sentence area for long and short content
- [x] Desktop and mobile Himi placement
- [x] Responsive 390 px and 360 px layouts
- [x] Existing pronunciation behavior preserved
- [x] Build passes
- [x] Console free of errors

**Follow-up Polish**

- P3: the mock-up's surrounding branded presentation-board header and phone bezel were intentionally not implemented because they are not app-owned interface content.

final result: passed

---

**Design QA — Stable listening and speaking frame**

- Source visual truth: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-d5e2c5b3-8866-49eb-a461-1bc7ba939d14.png` and `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-8e286026-fe03-4557-9bcb-86de405bca0b.png`.
- Implementation: `http://localhost:3000/dev/pronunciation-preview` (development-only preview; production returns 404).
- Browser-rendered implementation evidence: Codex in-app Browser tab 1, captured inline at 1440 × 800 and 390 × 844 CSS px. The browser tool does not expose a filesystem path for captures.
- Density normalization: CSS viewport and capture use device scale factor 1; the source desktop references were reviewed at original density and compared by the same visible component region.
- State: longest available sentence, pinyin and Vietnamese visible; unscored result state; navigation and playback controls visible.

**Full-view comparison evidence**

- Desktop keeps the study panel and Himi rail at an identical 510 px height on the compact 1440 × 800 viewport.
- Mobile keeps the learning card at 702 px for both long and short sentences, with no horizontal overflow (`scrollWidth = 390` at a 390 px viewport).
- The completion row reserves the same vertical slot on every question, so question 10 no longer changes the outer frame.

**Focused region comparison evidence**

- Typography: long Hanzi fits within a dedicated 182 px mobile region; pinyin and Vietnamese use stable readable slots without truncating the checked sentence.
- Spacing/layout: heading, translation, controls, result and completion each reserve space; navigation arrows remain available on both sides.
- Colors/tokens: existing Himi red, orange, warm surface and neutral result colors are preserved.
- Image quality: the existing Himi listening asset and office background are unchanged and retain their intended crop.
- Copy/content: Hanzi, pinyin, Vietnamese translation and all action labels remain unchanged and available in the DOM.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked desktop and 390 × 844 mobile states.
- Browser console errors checked: none.

**Comparison history**

- Initial P1: sentence length and the last-question completion row changed the total card height between questions.
- Initial P2: mobile text regions could either stretch the screen or clip long learning content.
- Fix: introduced fixed stage/text slots, reserved the completion row on all questions, adapted mobile typography and allowed bounded internal overflow only beyond the verified longest sentence.
- Post-fix evidence: long mobile sentence reports Hanzi `150/150`, pinyin `54/54`, translation `80/80`, panel `702`, and page `scrollWidth 390/390`; desktop panel and heading report `510` and `108` px respectively.

**Implementation Checklist**

- [x] Stable desktop frame
- [x] Stable question-to-question height
- [x] Stable final-question completion slot
- [x] Complete long-sentence display on mobile
- [x] No horizontal overflow at 390 px
- [x] Existing interactions and accessible content preserved
- [x] Console free of errors

**Follow-up Polish**

- P3: consider a subtle scroll fade only if future editorial content exceeds the current verified maximum sentence length.

final result: passed

---

**Design QA — Pronunciation score result**
# Design QA — HSK guided lesson text scale

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-2b9e109a-0ff3-4c82-b6a9-2a9592d00177.png`, `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-d11f170f-8159-45d1-adf8-f04050ffbac5.png`, and `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-f5ac29a5-0da1-474a-a3bd-e85d10ad2b81.png`
- Implementation: `http://localhost:4174/hsk/1/hsk1-bai-01-chao-anh/play`
- Source pixels: 296 × 105, 190 × 68, and 320 × 92
- Implementation viewport: 672 × 720 CSS px, browser screenshot captured at the same visible viewport
- State: authenticated HSK 1 guided lesson, vocabulary step 2/15
- Density normalization: CSS font sizes were multiplied directly by 1.3; visual comparison used the rendered browser viewport.

## Findings

- No actionable P0/P1/P2 mismatch remains for the requested 30% text increase.
- Radical/component card: Hanzi 34px → 44.2px; title 14px → 18.2px; pronunciation 12px → 15.6px.
- Footer progress box: step 11px → 14.3px; instruction 10px → 13px; keyboard label 9px → 11.7px.
- Common-collocation box: label and chip copy 12px → 15.6px.
- The enlarged collocation chips wrap naturally, the fixed footer remains readable, and the lesson retains normal vertical scrolling without horizontal overflow in the inspected state.

## Required fidelity surfaces

- Fonts and typography: exact 1.3 scale applied to all text visible in the three supplied references; font families and weights are unchanged.
- Spacing and layout rhythm: box padding and grid geometry are unchanged; enlarged copy remains contained and wraps where appropriate.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: no image assets were changed; existing Hanzi stroke artwork remains unchanged.
- Copy and content: unchanged.

## Full-view comparison evidence

Browser inspection covered the introductory footer, vocabulary example/collocation area, and structure section at the target mobile-width viewport. The enlarged text is visibly present without overlap with the fixed navigation footer.

## Focused region comparison evidence

The focused collocation/footer capture shows 15.6px chips and 14.3px/13px progress copy fitting cleanly. The structure-card region remains within its card grid; its exact computed sizes are defined by the corresponding selectors in `app/hsk-guided-lesson.css`.

## Comparison history

1. Initial finding: all three referenced UI areas used 9–34px typography and were too small.
2. Fix: multiplied each relevant font size by 1.3, including the 1080px radical-title override.
3. Post-fix evidence: inspected the live HSK lesson at step 2/15; no clipping or overlap was found in the visible regions.

## Verification

- Route loaded successfully in the in-app browser.
- Vocabulary navigation and fixed lesson footer remained functional.
- ESLint completed successfully.

## Follow-up polish

- None required for the requested scope.

final result: passed

---

# Design QA — Mobile support launcher position

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-26cf276f-da9e-4a5c-81db-83c9e513ee2d.png`.
- Source pixels: 277 × 105 px.
- Implementation screenshot: Codex in-app Browser capture of `http://localhost:4173/` (tab 1, inline capture from this task).
- CSS viewport and implementation pixels: 390 × 844 at device scale 1.
- State: authenticated mobile homepage, welcome offer dismissed, bottom navigation and closed support launcher visible.
- Density normalization: the source is a cropped/downscaled mobile reference; comparison focused on the launcher-to-navigation relationship rather than full-page content.

## Findings

- No actionable P0/P1/P2 mismatch remains for the requested launcher placement.
- The launcher now sits immediately above the bottom navigation instead of being displaced high above the homepage controls.
- Browser measurements show the 58 × 58 px launcher ending at y=762 and the navigation beginning at y=771.2, leaving a 9.2 px visual gap that matches the reference composition.

## Required fidelity surfaces

- Fonts and typography: unchanged; the request affects positioning only.
- Spacing and layout rhythm: launcher bottom offset is now 82 px plus the device safe-area inset, consistent with the 72.8 px mobile navigation and a roughly 9 px gap.
- Colors and visual tokens: unchanged; existing Himi red, orange badge, white ring, and elevation are preserved.
- Image quality and asset fidelity: no raster assets were added or modified; the existing icon-library chat mark remains sharp.
- Copy and content: unchanged.

## Full-view comparison evidence

The 390 × 844 browser capture shows the launcher anchored at the lower-right corner directly above the five-item mobile navigation, matching the supplied reference's visual relationship.

## Focused region comparison evidence

The bottom-right region was inspected at native browser scale. Measured rectangles confirm a 9.2 px gap between launcher and navigation and a 9.6 px right inset, with no overlap of persistent controls.

## Comparison history

1. Initial implementation used a homepage-only 224 px bottom offset, placing the launcher substantially too high.
2. Fix: aligned the homepage launcher with the standard mobile offset of 82 px plus the safe-area inset.
3. Post-fix browser evidence at 390 × 844 shows the requested lower-right placement with no navigation overlap.

## Verification

- Browser-rendered mobile homepage inspected at 390 × 844.
- Welcome offer dismissal tested so the persistent controls could be inspected unobstructed.
- Browser console reported no errors.
- Existing automated test suite passed.

## Follow-up polish

- None required for the requested scope.

final result: passed

---

# Design QA — Homepage supplied background artwork

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-4cdef440-862b-470c-9d89-5734c98685fd.png`.
- Source pixels: 1536 × 1024 px.
- Implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/artifacts/design-qa/homepage-background.png`.
- Combined comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/artifacts/design-qa/homepage-background-comparison.png`.
- Implementation route: `http://localhost:3000/`.
- Implementation pixels and CSS viewport: 1280 × 720 px at device scale 1.
- State: authenticated learner homepage with desktop navigation rail expanded.
- Density normalization: the 3:2 source and the rendered hero were scaled proportionally into one 1536 × 512 comparison canvas; the implementation retains its surrounding navigation chrome so integration can be judged.

## Findings

- No actionable P0/P1/P2 mismatch remains for the requested scope.
- The supplied artwork is rendered directly as the homepage hero without crop, redraw, text replacement, or asset approximation.
- The desktop navigation rail intentionally reduces the available hero width; the complete 3:2 artwork remains visible and its embedded CTA is backed by a real accessible link.

## Required fidelity surfaces

- Fonts and typography: all display typography comes from the supplied raster, preserving the exact letterforms, weights, wrapping, and hierarchy.
- Spacing and layout rhythm: the artwork preserves its native 3:2 aspect ratio and fills the available homepage content width without distortion.
- Colors and visual tokens: the original warm white, Himi red, orange, charcoal, and cream palette is preserved pixel-for-pixel.
- Image quality and asset fidelity: the original 1536 × 1024 PNG is used directly with `object-fit: contain`; no visible crop, halo, or substitute illustration was introduced.
- Copy and content: all embedded marketing copy remains unchanged; the CTA has the accessible name “Bắt đầu học ngay”.

## Full-view comparison evidence

The combined comparison places the source on the left and the browser-rendered homepage on the right. The complete composition, subjects, logo, decorative posters, feature icons, CTA, and lower steps remain visible in the implementation.

## Focused region comparison evidence

No extra crop was required because the full source artwork remains legible in the 1280 × 720 implementation capture. The CTA region was additionally validated through the browser accessibility tree and navigation test.

## Comparison history

1. Initial implementation pass replaced the legacy layered hero with the exact supplied background artwork and retained a transparent semantic link over the embedded CTA.
2. First combined comparison found no actionable P0/P1/P2 visual drift; no corrective visual iteration was required.

## Verification

- Browser rendering confirmed the entire background is visible without cropping or distortion.
- Clicking “Bắt đầu học ngay” navigated to `/courses?view=hsk`.
- Browser console reported no errors during the interaction check.
- `git diff --check` passed for the edited source files.
- Production build transformed all 752 modules successfully; the pre-existing Windows lock on `dist/.openai/hosting.json` affected only the final Sites cleanup hook.

## Follow-up polish

- P3: at narrower desktop content widths, text embedded in the raster naturally becomes smaller. A future responsive art-directed mobile image could improve small-screen readability without changing this desktop implementation.

final result: passed

---

# Design QA — compact HSK VIP lesson row

- Source visual truth: user-supplied compact VIP lesson-row reference attached to Browser Comment 1 (568 × 109 px).
- Implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/artifacts/design-qa/hsk-vip-lesson-row.png`.
- Implementation route: `http://localhost:3001/courses?view=hsk`.
- Implementation viewport: 826 × 702 CSS px at device scale 1.
- State: authenticated HSK 1 curriculum, topic 1 expanded, lesson 4 VIP-locked.

## Findings

- No actionable P0/P1/P2 mismatch remains for the requested compact VIP treatment.
- The previous full-width “Quyền truy cập / VIP” bar has been removed.
- Lesson title and metadata now use muted locked-state colors on a warm cream row, with one compact crown action aligned at the right edge.

## Required fidelity surfaces

- Fonts and typography: existing curriculum type scale is preserved; locked copy uses the lighter hierarchy shown in the reference.
- Spacing and layout rhythm: the VIP lesson returns to a compact single-row composition with a right-aligned 48px action.
- Colors and visual tokens: warm cream surface, subdued gray copy, soft gold crown, and low-contrast border match the reference direction.
- Image quality and asset fidelity: no raster imagery is required for this row; the crown uses the project's existing icon library.
- Copy and content: lesson title and vocabulary/dialogue/duration metadata remain unchanged; redundant VIP access copy is removed.

## Comparison history

1. Initial implementation displayed a large second-row VIP access bar, making the locked lesson much taller than the reference.
2. Fix: reduced the VIP affordance to a crown-only button and restyled the locked article as a compact cream row.
3. First browser pass exposed a responsive grid override placing the crown below the metadata.
4. Fix: pinned the crown action to grid column 2, row 1, aligned to the right.
5. Final browser capture shows the intended single-row layout; clicking the crown opens the shared Himi VIP dialog.

## Verification

- Browser-rendered desktop/tablet state captured at 826 × 702.
- Crown button remains keyboard-accessible with an explicit label.
- Clicking the crown opened the correct upgrade dialog for Bài 4.
- Build transformed all 752 modules successfully; only the pre-existing Windows lock on `dist/.openai/hosting.json` affected the final Sites cleanup hook.

## Follow-up polish

- None required for the requested scope.

final result: passed

---

# Design QA — HSK locked-writing VIP dialog

- Source visual truth: user-supplied VIP modal reference attached to Browser Comment 1 (714 × 508 px).
- Implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/artifacts/design-qa/hsk-vip-upgrade-dialog.png`.
- Implementation route: `http://localhost:3001/hsk/1/hsk1-bai-03-co-ten-gi/play`.
- Implementation pixels: 825 × 702 px; desktop browser viewport at device scale 1.
- State: HSK 1 guided lesson, writing step, modal opened from locked character 12/12.
- Density normalization: both references were inspected at their native density; comparison focused on the modal content region rather than the differently sized surrounding page.

## Findings

- No actionable P0/P1/P2 mismatch remains for the requested interaction and visual direction.
- The implementation preserves the reference's two-column composition, prominent Himi mascot, red VIP heading, three benefit rows, close control, softened white surface, dimmed/blurred backdrop, and red-to-orange primary CTA.
- The existing official Himi VIP mascot asset is used rather than recreating or approximating the illustration.

## Required fidelity surfaces

- Fonts and typography: strong two-line hierarchy is preserved; body benefits remain compact and readable at the rendered viewport.
- Spacing and layout rhythm: balanced mascot/content columns, 30px modal radius, consistent benefit-row spacing, and a full-width CTA match the reference proportions.
- Colors and visual tokens: Himi red, orange, black, white, and soft warm surfaces replace the older green/gold modal treatment.
- Image quality and asset fidelity: the official transparent Himi VIP raster is sharp and correctly scaled without cropping the face, book, or feet.
- Copy and content: the reference title, three benefit themes, and “Nâng cấp ngay” CTA are represented directly.

## Full-view comparison evidence

The source and browser-rendered state were inspected together in the same task. The modal reads as the same premium upgrade pattern while remaining consistent with the product's existing Himi mascot asset.

## Focused region comparison evidence

The modal itself is fully readable in the captured 825 × 702 screenshot, so an additional crop was not required. Close, benefit rows, mascot, and CTA are all visible at once.

## Comparison history

1. Initial implementation used the existing compact lock dialog and did not open from the locked writing character.
2. Fix: connected locked-character clicks to `VipUpgradeDialog` and rebuilt the sheet around the supplied two-column VIP reference.
3. Post-fix evidence: clicked “Chữ 12 yêu cầu VIP” in the live in-app browser; the modal opened, exposed the expected accessible content, and closed successfully with Escape.

## Verification

- Locked character click opens the modal without changing the selected writing character.
- Escape closes the modal and returns focus to the locked character control.
- CTA resolves to `/vip`.
- Production build transformed all 752 modules successfully; the existing Windows file lock on `dist/.openai/hosting.json` still affects only the final Sites cleanup hook.

## Follow-up polish

- P3: the official reusable mascot holds a VIP book rather than the laptop shown in the reference; this is an intentional brand-asset substitution.

final result: passed

---

# Design QA — Homepage mobile hero

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-72e1379a-6ad3-472d-868e-5d787b56b8a0.png`.
- Source pixels: 887 × 1774 px.
- Implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/artifacts/design-qa/homepage-mobile-390x844.png`.
- Combined comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/artifacts/design-qa/homepage-mobile-comparison.png`.
- CSS viewport and implementation pixels: 390 × 844 at device scale 1.
- State: authenticated homepage at the mobile breakpoint, standard bottom navigation visible, default CTA state.
- Density normalization: source scaled proportionally to 422 × 844 and placed beside the 390 × 844 browser capture. The implementation's narrower viewport intentionally crops roughly 16 px from each horizontal edge through `object-fit: cover`.

## Findings

- No actionable P0/P1/P2 mismatch remains.
- The mobile composition, typography, people, mascot, architecture, warm palette, and CTA position track the supplied source. The small horizontal crop is expected from the real viewport ratio and does not remove meaningful content.

## Required fidelity surfaces

- Fonts and typography: all display typography is preserved in the supplied raster; the semantic CTA uses the existing Himi UI font with matching uppercase weight and scale.
- Spacing and layout rhythm: the 1:2 artwork fills the 390 × 844 viewport; the CTA begins at 84.2% of viewport height, matching the reference placement.
- Colors and visual tokens: original image colors are unchanged; the interactive CTA uses Himi red and orange tokens with white text.
- Image quality and asset fidelity: the exact 887 × 1774 user-supplied PNG is used; no illustration or logo was recreated.
- Copy and content: mobile hero copy is unchanged and the CTA reads “Bắt đầu học ngay”.

## Full-view comparison evidence

The combined comparison shows the normalized source on the left and browser implementation on the right. Major visual anchors and vertical proportions align, with only the expected narrow horizontal crop.

## Focused region comparison evidence

An additional crop was unnecessary because the combined 844 px-tall comparison keeps the logo, headings, subjects, and CTA readable together. Browser metrics separately confirmed the CTA at 230 × 48 px and the page at exactly one viewport height.

## Comparison history

1. Desktop-only artwork previously remained active at the mobile breakpoint and app navigation occupied viewport space.
2. Fix: added the exact portrait artwork as a mobile-only source and aligned the live CTA over the reference CTA.
3. Follow-up fix: restored the standard bottom mobile navigation and verified a 12 px gap between the CTA and navigation surface.
4. Post-fix comparison found no remaining P0/P1/P2 visual differences.

## Verification

- Mobile image visible and desktop image hidden at 390 × 844.
- Top bar hidden and standard bottom mobile navigation displayed on the homepage mobile breakpoint.
- Document scroll height equals viewport height: 844 px, with no vertical scrolling.
- CTA remains a semantic link to `/courses?view=hsk`.
- Browser console reported no errors.

## Follow-up polish

- P3: devices substantially narrower than the 1:2 source will crop a little more from the horizontal edges; the focal content remains within the safe center region.

final result: passed
