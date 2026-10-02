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

---

# Design QA — Shared client breadcrumb

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-74888cc3-244f-45f4-b602-86a3846dc459.png`
- Implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/design-qa-breadcrumb-mobile.png`
- Normalized comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/design-qa-breadcrumb-comparison.png`
- Route and state: `/writing/1`, anonymous learner, breadcrumb at rest
- Browser viewport: 439 × 900 CSS px, device scale factor 1
- Source pixels: 439 × 91
- Implementation capture pixels: 429 × 879 (content viewport excludes the browser scrollbar gutter)
- Density normalization: the top 429 × 91 implementation region was resized to 439 × 91 for an equal-size comparison

## Full-view comparison evidence

The browser-rendered `/writing/1` page shows the breadcrumb above the page content without overlap, horizontal overflow, duplicate route breadcrumbs, or interference with the fixed mobile navigation. The parent link successfully navigates from `/writing/1` to `/writing`.

## Focused region comparison evidence

The normalized comparison places the 439 × 91 source crop above the implementation crop. A focused comparison was required because the visual target contains only the breadcrumb region. The final implementation matches the source hierarchy: left arrow, bold black parent, muted separator, bold Himi-red current page, white background, and the same compact vertical rhythm.

## Required fidelity surfaces

- Fonts and typography: matched with the existing self-hosted Himi Roboto family at 16px and a strong 760 weight; hierarchy and truncation remain readable on narrow screens.
- Spacing and layout rhythm: mobile top spacing, link/icon gap, separator spacing, and the transition into the following content were tuned against the source crop.
- Colors and visual tokens: parent uses the existing Himi black token, current page uses Himi red, separator uses neutral gray, and the bar uses Himi white.
- Image quality and asset fidelity: the target contains no raster assets. The arrow uses the project’s existing Lucide icon system and renders sharply at device scale factor 1.
- Copy and content: the reference route renders exactly `Các cấp độ / HSK 1`; other learner routes use route-specific Vietnamese parent and current labels.

## Comparison history

1. Initial implementation: the shared structure and colors matched, but the mobile text/icon alignment and whitespace before the following card differed visibly (P2).
2. First correction: increased the mobile vertical whitespace, which moved the following card too far down (P2).
3. Final correction: retained the aligned text baseline while reducing bottom padding and balancing the arrow/text gap. The normalized comparison has no actionable P0/P1/P2 differences.

## Primary interactions and console

- Tested the parent breadcrumb link from `/writing/1` to `/writing`: passed.
- Confirmed the route updates to the correct breadcrumb labels: passed.
- Browser console errors after navigation: none.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

No P3 follow-up is required for the supplied reference state.

final result: passed
<!-- end breadcrumb QA -->

---

# Design QA — HSK circular lesson progress

- Source visual truth: browser-comment reference attachment showing the circular progress box whose visibility must be deferred until lesson completion or explicit close (`C:\Users\DELL\AppData\Local\Temp\codex-clipboard-2cce5153-7731-4b69-ab96-581f789a5d62.png`, 119 × 75 px)
- Implementation screenshot: Codex in-app browser capture of `/courses?view=hsk` at 1249 × 892 CSS px
- State: authenticated HSK 1 curriculum; lesson 4 unopened, open in another tab, then explicitly closed at step 1/26
- Density normalization: source proportions were adapted to a 68 × 68 px live UI control; both references were inspected at device scale factor 1

## Full-view comparison evidence

The rendered curriculum preserves the existing lesson hierarchy and compact circular indicator. An unopened lesson remains “Mở bài” while its lesson screen is open; after the learner clicks `X`, the same row displays its saved circular percentage.

## Focused region comparison evidence

The focused progress control matches the supplied visual language: thin circular track, white center, red completed arc beginning at 12 o'clock, orange remaining arc, and centered percentage. The supplied `0%` reference is intentionally absent before an explicit save event; the verified close action produces the real `4%` value for step 1/26.

## Required fidelity surfaces

- Fonts and typography: centered percentage uses the compact 13 px treatment established for the current 48 px progress ring.
- Spacing and layout rhythm: the 48 px ring fits the existing lesson row and remains optically centered in the former CTA slot.
- Colors and visual tokens: completed progress is Himi red from the 0% origin; the remaining arc is Himi orange, and the progress-bearing lesson row now matches completed rows through the same transparent background over the `#fffdfb` page surface.
- Image quality and asset fidelity: no raster asset is needed for this dynamic data visualization; the ring stays sharp at every progress value and pixel density.
- Copy and content: the visible control contains only the live percentage, matching the minimal reference. Its accessible label retains the continuation action and lesson number.

## Primary interactions and console

- Clicking the circular progress control opens the selected lesson's `/play` experience: passed.
- Live stored progress renders as 57% in the inspected state: passed.
- Browser console errors: none.
- Active and completed lesson row backgrounds both compute to `rgba(0, 0, 0, 0)` over the same `rgb(255, 253, 251)` page surface: passed.
- Opening lesson 4 left its curriculum row at “Mở bài” with no `.hsk-circular-progress`: passed.
- Clicking `X` saved step 1/26 and the curriculum row then rendered one `.hsk-circular-progress` at `4%`: passed.
- Reaching the final guided step persists the completed state; covered by the guided lesson regression test: passed.

## Findings

No actionable P0, P1, or P2 findings remain. The smaller size is an intentional adaptation from the standalone reference image to the existing curriculum row.

## Comparison history

1. Initial state used a filled red rounded rectangle with two lines of CTA copy, which materially differed from the supplied circular reference (P1).
2. Fix: replaced it with a dynamic 68 px circular progress indicator and retained the original lesson navigation behavior.
3. Post-fix browser inspection confirmed the 57% state, alignment, click behavior, and absence of console errors.
4. Annotation correction: reversed the completed-arc color order so the 0% origin is red at the exact top center.
5. Reference correction: replaced the gray remainder with a solid orange remaining arc and kept a visible 2° red origin at 0%. At 57%, browser computed style confirms red from 0°–205.2° and orange from 205.2°–360°, matching the reference's moving two-color boundary.
6. Origin correction: removed the erroneous `-90deg` rotation. CSS conic-gradient's native 0° is already 12 o'clock; browser computed style now confirms red starts at 0° with no rotation.
7. Size correction: reduced the active lesson box from about 130 px to 92 px and the progress ring from 68 px to 48 px. Browser measurement confirms an approximately 30% reduction while keeping the title, metadata, percentage, and full-row navigation readable.
8. Initial multi-lesson behavior created an empty progress record as soon as an unopened lesson link was clicked, causing the `0%` box to appear before the learner explicitly saved or finished (P1).
9. Background correction: changed only `.hsk-lesson-row.is-active` from the peach token to transparent, matching `.hsk-lesson-row.is-completed` and exposing the shared `#fffdfb` page surface while retaining the progress indicator, row sizing, and navigation behavior.
10. Lifecycle correction: removed the open-link write, kept lesson changes in memory, persisted on the `X` close action or final guided step, and ignored legacy empty records. Browser evidence confirms no box while merely open and a `4%` box immediately after explicit close.

## Follow-up polish

No P3 follow-up is required for the supplied state.

final result: passed
<!-- end HSK circular progress QA -->

---

# Design QA — Industry roadmap lesson states

- Current-state reference: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-0db2f622-c189-4d19-9b8d-2a2761fb3a4a.png` (1186 × 565 px)
- Target-state reference: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-a702f4ad-3e52-4689-baa9-ed64b1844c2b.png` (1419 × 581 px)
- Implementation route: `/courses/van-phong-hanh-chinh`
- Browser verification: desktop at 1269 × 714 CSS px and mobile at 390 × 844 CSS px, device scale factor 1

## Full-view comparison evidence

The industry roadmap keeps its existing module artwork, stage rail, module header, lesson title, and duration structure. The former red rectangular actions have been replaced by the HSK state language: `Mở bài` plus chevron for untouched lessons, a circular percentage ring for saved partial progress, a circle-check plus `Đã hoàn thành` for completed lessons, and a pale-gold crown control for VIP lessons.

## Focused region comparison evidence

The verified first module shows six white lesson rows with right-aligned `Mở bài` states and no red CTA background. Row separators, title hierarchy, minute column, and right alignment remain stable. On mobile, the lesson number/title and duration wrap into the left column while the compact state remains aligned on the right without horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: retained the existing roadmap type scale while adopting the HSK status size, weight, and muted gray treatment.
- Spacing and layout rhythm: increased row height to 64 px and reserved a compact right-side status column; the 48 px progress and VIP controls match HSK proportions.
- Colors and visual tokens: ordinary, completed, and in-progress lesson rows use white; partial progress uses the HSK red/orange conic ring; VIP lessons use the HSK pale-gold surface and crown color.
- Image quality and asset fidelity: module imagery is unchanged; state icons use the existing Lucide set and remain sharp at desktop and mobile sizes.
- Copy and content: status copy now matches HSK exactly: `Mở bài`, `Đã hoàn thành`, a numeric percentage, or an icon-only VIP control with an accessible label.

## Primary interactions and console

- Each ordinary/completed/in-progress row remains a full-row lesson link: passed through server-render assertions.
- Fully VIP modules can be expanded so their lesson-level crown states are visible and actionable: passed through server-render assertions.
- Saved partial progress is passed from `lesson_progress.completion_percent` to the circular indicator: passed at 4% in render tests.
- Desktop route rendering: passed.
- Mobile 390 × 844 rendering with no horizontal overflow: passed.
- Browser console warnings and errors: none.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial industry UI used red `Bắt đầu bài học`, `Tiếp tục học`, and outlined `Học lại` buttons, which materially differed from the HSK state treatment (P1).
2. Replaced those actions with the four HSK-aligned states and connected the ring to persisted percentages.
3. Removed the arbitrary red-highlighted current row so untouched lessons stay on the same white surface as the completed rows.
4. Changed fully VIP modules from a single locked trigger into expandable modules, exposing the requested lesson-level crown states while retaining the upgrade dialog action on each locked lesson.
5. Verified desktop/mobile layouts, link semantics, rendered state copy, targeted tests, lint, and an empty browser error log.

## Follow-up polish

No P3 follow-up is required for the supplied references.

final result: passed
<!-- end industry roadmap lesson states QA -->

---

# Design QA — Listening transcript top spacing

- Source visual truth: Browser Comment 1 marker capture for `/listening`, 1249 × 892 px (the annotation surface did not expose a filesystem path)
- Implementation screenshot: Codex in-app browser capture of `/listening?lesson=dialogue-beginner-topic-chat-with-chinese-001-daily-001`, 1249 × 892 CSS px (the browser surface did not expose a filesystem path)
- Responsive implementation screenshot: Codex in-app browser capture at 390 × 844 CSS px
- Device scale factor: 1; no density normalization required
- State: immersive listening lesson with the first transcript row active and the player fixed at the bottom

## Full-view comparison evidence

The annotated source showed an 84 px empty area between the fixed close/progress bar and the transcript card. After the change, the transcript begins at y=78 while the fixed bar ends at y=70, leaving only the existing 8 px frame separation. The transcript content, active-row treatment, fixed player, and language controls are unchanged.

## Focused region comparison evidence

The focused top region was the only required comparison area. Browser measurements changed `.listening-catalog-detail-page` from `padding-top: 84px` to `0px`; the transcript top consequently moved from y=162 to y=78. At 390 × 844, the mobile top padding is also `0px`, the transcript begins at y=70 below the 56 px bar, and document width remains within the 390 px viewport.

## Required fidelity surfaces

- Fonts and typography: unchanged.
- Spacing and layout rhythm: removed only the annotated desktop/mobile top padding; internal row spacing and the small separation below the fixed progress bar remain intact.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: mascot and existing icons are unchanged.
- Copy and content: transcript text, duration labels, and control labels are unchanged.

## Primary interactions and console

- Direct lesson deep link opens the intended immersive lesson: passed.
- Close control remains present and accessible: passed.
- Desktop transcript/player layout: passed.
- Mobile transcript/player layout with no horizontal overflow: passed.
- Browser console warnings and errors: none.
- Listening catalog regression tests: 7/7 passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial state had 84 px desktop and 62 px mobile top padding, producing the annotated empty band above the transcript (P1).
2. Fix: set the immersive detail page top padding to `0` at both breakpoints while preserving side and bottom padding.
3. Post-fix browser capture and computed measurements confirm the transcript now begins directly below the top bar, with no overlap or horizontal overflow.

## Follow-up polish

No P3 follow-up is required for this scoped annotation.

final result: passed
<!-- end listening transcript top spacing QA -->

---

# Design QA — Compact mobile listening controls

- Source visual truth: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-e82a0855-d3f1-4072-ae60-2ef5a0a5f216.png` (363 × 51 px)
- Implementation screenshot: Codex in-app browser capture of `/listening?lesson=dialogue-beginner-topic-chat-with-chinese-001-daily-001` at 390 × 844 CSS px (the browser surface did not expose a filesystem path)
- Device scale factor: 1; no density normalization required
- State: immersive listening lesson with the fixed player visible at the bottom

## Full-view comparison evidence

The four requested mobile controls remain in the same order and alignment as the supplied crop: mascot, play control, speed selector, and display selector. Only their visual boxes and contained icon/type scale were reduced; the transcript, progress bar, previous/next controls, and player behavior remain unchanged.

## Focused region comparison evidence

At the 390 px breakpoint, browser measurements changed the four controls from approximately 42 × 42, 46 × 46, 84 × 44, and 88 × 44 px to 27 × 27, 30 × 30, 54.6 × 29, and 57.2 × 29 px. These values apply the requested 0.65 scale factor, including an explicit minimum-height override on the play button so it remains circular rather than inheriting the previous 44 px touch-box height.

## Required fidelity surfaces

- Fonts and typography: speed/display labels and values scale with their boxes and remain legible without clipping.
- Spacing and layout rhythm: the original grid order and bottom-player alignment are preserved; no horizontal overflow is introduced.
- Colors and visual tokens: the coral gradient, white outlines, and white play surface are unchanged.
- Image quality and asset fidelity: the existing mascot and Lucide controls are reused and remain sharp.
- Copy and content: control labels and current values remain unchanged.

## Primary interactions and console

- Direct lesson deep link opens the intended immersive lesson: passed.
- Player width remains 380 px inside the 390 px viewport; document width remains 380 px: passed.
- Speed selector and display selector remain present and enabled: passed.
- Browser console warnings and errors: none.
- Listening catalog regression tests: 8/8 passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial mobile controls matched the source crop at approximately 42 px, 46 px, 84 × 44 px, and 88 × 44 px.
2. Applied a uniform 0.65 scale to the visual boxes and their internal icon/type spacing at mobile breakpoints.
3. Browser measurement exposed an inherited 44 px minimum height on the play control; the override was corrected to 30 px, restoring the intended circular geometry.
4. Post-fix capture confirms the final sizes and no horizontal overflow.

## Follow-up polish

No P3 follow-up is required for this scoped mobile change.

final result: passed
<!-- end compact mobile listening controls QA -->

---

# Design QA — Roadmap progress after opening a lesson

- Current-state source: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-07dc02f0-39ac-43ce-be41-54a58125905b.png` (1117 × 382 px)
- Progress-state source: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-2cce5153-7731-4b69-ab96-581f789a5d62.png` (119 × 75 px)
- Implementation screenshot: Codex in-app browser capture of `/courses/van-phong-hanh-chinh` at 1280 × 720 CSS px (the browser surface did not expose a filesystem path)
- Device scale factor: 1; no density normalization required
- State: authenticated learner opened lesson 01, exited with browser back, and returned to the expanded first roadmap module

## Full-view comparison evidence

Before opening a lesson, the roadmap row ends with `Mở bài` and a chevron as shown in the current-state source. After lesson 01 is opened and the learner returns, only that row changes to the HSK-style circular `0%` progress indicator; the module header, artwork, remaining rows, durations, and overall roadmap layout remain unchanged.

## Focused region comparison evidence

The rendered progress control measures approximately 50 × 50 px at the desktop viewport and uses the existing orange ring, small red start marker, white center, and orange `0%` label from the progress-state reference. The first row remains 64 px high and the ring is vertically centered at the right edge without changing the surrounding layout.

## Required fidelity surfaces

- Fonts and typography: the percentage retains the existing roadmap progress size, weight, and centered alignment.
- Spacing and layout rhythm: the row height and duration column remain unchanged; the progress ring occupies the established right-side status slot.
- Colors and visual tokens: the existing red/orange conic progress treatment and white center are reused exactly.
- Image quality and asset fidelity: module artwork and mascot imagery are unchanged.
- Copy and content: an untouched lesson still reads `Mở bài`; the opened unfinished lesson now reads `0%` through its visible label and accessible name.

## Primary interactions and console

- Click lesson 01 from the roadmap: passed.
- Immediate opened-state request on lesson mount: passed.
- Exit with browser back and reload roadmap state from persistence: passed.
- First lesson changes from `Mở bài` to `0% đã học`; untouched lessons remain `Mở bài`: passed.
- Browser console warnings and errors: none.
- Targeted roadmap regression tests: 16/16 passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial implementation persisted a `0%` opened record but rendered progress only when the value was greater than zero, leaving the row at `Mở bài` (P1 behavioral mismatch).
2. The opened-state request also waited 600 ms, allowing a very quick exit to miss persistence (P2 reliability issue).
3. Updated the row state to treat any opened, incomplete lesson as in progress and removed the delayed request.
4. Post-fix browser flow confirms lesson 01 returns as a visible `0%` progress ring while every untouched lesson remains unchanged.

## Follow-up polish

No P3 follow-up is required for this scoped behavior.

final result: passed
<!-- end roadmap opened lesson progress QA -->

---

# Design QA — Remove HSK lesson introduction stage

- Source visual truth: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-9fff0e81-de3c-4d59-8c40-745d27445ece.png` (1314 × 877 px)
- Implementation screenshot: Codex in-app browser capture of `/hsk/1/hsk1-bai-03-co-ten-gi/play` at 1280 × 720 CSS px (the browser surface did not expose a filesystem path)
- Additional implementation state: `/hsk/3/hsk3-tb-lesson-01/play` at 1280 × 720 CSS px
- Device scale factor: 1; no density normalization required
- State: newly opened guided HSK lesson at its first learning step

## Full-view comparison evidence

The source shows the guided lesson chrome with five navigation stages, including `Giới thiệu`. In the revised implementation the same header, progress rail, lesson canvas, and footer remain, while the navigation begins directly at `Từ vựng`. The initial content is now the first vocabulary card instead of the removed introduction screen.

## Focused region comparison evidence

The header now contains exactly four stages: `Từ vựng`, `Luyện viết`, `Luyện tập`, and `Hoàn thành`. On HSK 1 lesson 03 the first state is `1 / 29`; on HSK 3 lesson 01 it is `1 / 33`. `Giới thiệu` is absent from both visible copy and the accessibility tree. The previous/next controls continue to move between the revised step indices.

## Required fidelity surfaces

- Fonts and typography: the remaining labels, counts, active weight, and percentage text retain their existing typography.
- Spacing and layout rhythm: removing one navigation item lets the remaining four retain the established spacing; header and footer heights are unchanged.
- Colors and visual tokens: the active coral treatment and muted inactive states are unchanged.
- Image quality and asset fidelity: vocabulary glyphs, Hanzi stroke imagery, and icons remain unchanged.
- Copy and content: only `Giới thiệu` and its introduction content were removed; all learning-stage copy remains intact.

## Primary interactions and console

- Fresh HSK 1 lesson opens directly on vocabulary: passed.
- HSK 3 representative lesson opens directly on vocabulary: passed.
- Next advances from step 1 to step 2; selecting `Từ vựng` returns to step 1: passed.
- Coverage check verifies the four-stage navigation across all 146 available HSK 1–6 lessons: passed.
- Legacy saved step indices migrate down by one without moving users forward unexpectedly: passed.
- Browser console warnings and errors: none.
- Targeted HSK regression suite after updates: 16/16 passed.
- ESLint and diff whitespace validation: passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial implementation included `Giới thiệu` as the first step and navigation item across guided HSK lessons (P1 against the requested flow).
2. Removed the introduction step, label, content component, navigation icon mapping, and one step from every curriculum total.
3. Added a guided-flow version migration so progress saved under the previous indexing scheme resumes on the same learning content.
4. Post-fix browser captures and curriculum-wide tests confirm the lesson begins at vocabulary and the remaining controls retain their layout and behavior.

## Follow-up polish

No P3 follow-up is required for this scoped removal.

final result: passed
<!-- end remove HSK introduction QA -->

---

# Design QA — HSK lesson viewport fit

- Source visual truth paths:
  - `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-e7d374a6-2eed-482b-b7ff-a31791aea8cd.png` (1151 × 839 px, writing state)
  - `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-ec0de2c2-cd70-404f-acf4-7c4abf7d72a3.png` (1159 × 817 px, vocabulary state)
- Implementation screenshot: Codex in-app browser capture of `http://localhost:3001/hsk/1/hsk1-bai-03-co-ten-gi/play` at the matching 1151 × 839 and 1159 × 817 CSS viewports (the browser surface did not expose a filesystem path)
- Additional compact-height captures: the same route at 1366 × 768 and 1280 × 720 CSS px
- Device scale factor: 1; no density normalization required
- State: lesson 03, first vocabulary item and unlocked writing item

## Full-view comparison evidence

The source states lose the lower edge of the vocabulary/structure cards behind the persistent footer and leave the writing composition vulnerable to the same overlap. In the revised implementation the lesson frame is a three-row viewport grid (header, flexible main area, footer). At 1159 × 817 the document is exactly 817 px tall, the vocabulary grid ends at 752.34 px, and the footer begins at 759.16 px. At 1151 × 839 the writing layout ends at 652.03 px and the footer begins at 781.14 px. No page scrollbar is present in either matched state.

At the compact 1366 × 768 viewport the adaptive scale changes to 0.61. The vocabulary content ends at 701.73 px and the footer starts at 713.72 px, so every card remains visible without scrolling or footer overlap.

At the default 1280 × 720 in-app browser viewport the adaptive scale is 0.57. The vocabulary content ends at 655.30 px and the footer starts at 669.28 px; document and viewport heights are both exactly 720 px.

## Focused region comparison evidence

The lower edges of the left example card, right structure card, writing canvas card, and character summary card were inspected against the footer boundary. Each retains its border radius and shadow, with a visible background gap before the footer. The writing character picker, canvas, status copy, and replay control remain inside the main region.

## Required fidelity surfaces

- Fonts and typography: existing families, weights, sizes, line heights, and Chinese glyph rendering are unchanged; compact-height behavior scales the complete interface proportionally.
- Spacing and layout rhythm: the original two-column composition is retained; only excess vocabulary top spacing and the former fixed-footer overlap were removed.
- Colors and visual tokens: coral active states, white cards, pale canvas, borders, and shadows remain unchanged.
- Image quality and asset fidelity: Hanzi Writer canvases and stroke-order canvases remain live, sharp rendered assets; no placeholder or replacement asset was introduced.
- Copy and content: all vocabulary, meaning, example, structure, writing, progress, and navigation copy remains present.

## Primary interactions and console

- Vocabulary navigation renders step 1 and all cards above the footer: passed.
- Writing navigation renders the picker, canvas, side card, and footer in one viewport: passed.
- Next advances from `1 / 29` to `2 / 29`; Previous returns to `1 / 29`: passed.
- Browser console warnings and errors: none.
- Targeted guided-lesson regression tests: 7/7 passed.
- ESLint and diff whitespace validation: passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial implementation used a fixed footer together with a 130 px main-area bottom pad and large minimum card heights, producing a P1 viewport-overlap defect in the vocabulary state.
2. Moved the desktop footer into the lesson grid, constrained the shell to one dynamic viewport, and reduced only the excess vocabulary vertical gap.
3. The first compact-height pass at 1366 × 768 left the vocabulary grid 5.36 px below the footer boundary (P2).
4. Adjusted the compact-height scale from 0.62 to 0.61. The post-fix capture leaves an 11.98 px gap and keeps the document height equal to the viewport.
5. The shorter 1280 × 720 verification exposed a remaining 3 px overlap at scale 0.58 (P2); reducing only that height tier to 0.57 produces a 13.98 px gap in the final capture.

## Follow-up polish

No P3 follow-up is required for the supplied desktop states.

final result: passed
<!-- end HSK lesson viewport fit QA -->

---

# Design QA — Remove HSK vocabulary description

- Source visual truth: browser annotation capture for `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play` at 1249 × 892 CSS px; selected target was `.hsk-guided-meaning-card > p` (the annotation surface did not expose a filesystem path)
- Implementation screenshot: Codex in-app browser capture of the same route and 1249 × 892 CSS viewport (the browser surface did not expose a filesystem path)
- Device scale factor: 1; no density normalization required
- State: HSK 1 lesson 01, first and second vocabulary steps

## Full-view comparison evidence

The source state contains a secondary description paragraph directly below the main meaning inside the left `Nghĩa của từ` card. The revised state removes only that paragraph. The main meaning, frequency label, example card, radicals, mnemonic, stroke-order strip, header, and footer remain in their existing positions and styles. The document remains exactly one viewport tall at 892 px.

## Focused region comparison evidence

The annotated sentence `Dùng để chỉ ngôi thứ hai số ít...` is absent from both the visual capture and accessibility tree. The DOM contains zero `.hsk-guided-meaning-card > p` elements on vocabulary steps 1 and 2, confirming that the change is component-wide rather than tied only to the first word.

## Required fidelity surfaces

- Fonts and typography: typography for the meaning heading, labels, examples, and Chinese content is unchanged.
- Spacing and layout rhythm: card dimensions, two-column alignment, border radii, and footer clearance are preserved; only the annotated paragraph is removed.
- Colors and visual tokens: white cards, coral accents, muted labels, borders, and shadows are unchanged.
- Image quality and asset fidelity: Hanzi Writer and stroke-order canvases remain unchanged and sharp.
- Copy and content: only the vocabulary description paragraph is removed; all requested learning content remains present.

## Primary interactions and console

- Vocabulary step 1 contains no description paragraph: passed.
- Next opens vocabulary step 2, which also contains no description paragraph: passed.
- Previous returns to step 1: passed.
- Browser console warnings and errors: none.
- Targeted guided-lesson regression tests: 7/7 passed.
- ESLint and diff whitespace validation: passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial implementation rendered the annotated description paragraph below every vocabulary meaning (P1 against the requested content removal).
2. Removed the paragraph from the shared vocabulary component and deleted its now-unused responsive styles.
3. Post-fix browser captures and two consecutive vocabulary states confirm the paragraph is absent while surrounding content and one-screen layout remain intact.

## Follow-up polish

No P3 follow-up is required for this scoped annotation.

final result: passed
<!-- end remove HSK vocabulary description QA -->

---

# Design QA — Remove HSK character-structure card

- Source visual truth: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-6316e83c-f99a-40c1-bfeb-fe44d157d3c4.png` (452 × 466 px focused crop)
- Implementation screenshot: Codex in-app browser capture of `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play` at 1249 × 892 CSS px (the browser surface did not expose a filesystem path)
- Device scale factor: 1; no density normalization required
- State: HSK 1 lesson 01, vocabulary steps 1 and 2

## Full-view comparison evidence

The source crop identifies the complete right-side `Bộ thủ & cấu tạo Hán tự` card, including radicals, mnemonic, stroke order, readiness footer, and HSK level marker. The revised full lesson view contains none of that card. The retained meaning and example cards form one centered 660 px column at the same visual width they had before removal. Header, word hero, navigation, and footer remain unchanged, and document height equals the 892 px viewport.

## Focused region comparison evidence

The rendered DOM contains zero `.hsk-guided-structure-card` elements on vocabulary steps 1 and 2. The former right-column region is empty, while the centered learning column measures 428.98 rendered pixels wide and ends at 747.13 px, safely above the footer at 834.14 px.

## Required fidelity surfaces

- Fonts and typography: all retained vocabulary, example, pinyin, and navigation typography is unchanged.
- Spacing and layout rhythm: the surviving cards keep their original width, internal padding, radii, gap, and shadow; the column is centered rather than stretched across the removed region.
- Colors and visual tokens: the page background, white cards, coral accents, borders, and shadows remain unchanged.
- Image quality and asset fidelity: the removed stroke-order canvases are no longer loaded; remaining live Hanzi and icons retain their original rendering.
- Copy and content: the complete structure-card content is removed; meaning, example, collocations, audio, and progress copy remain present.

## Primary interactions and console

- Vocabulary step 1 contains no character-structure card: passed.
- Next opens vocabulary step 2, which also contains no character-structure card: passed.
- Previous returns to step 1: passed.
- One-screen viewport behavior at 1249 × 892: passed.
- Browser console warnings and errors: none.
- Targeted guided-lesson regression tests: 7/7 passed.
- ESLint and diff whitespace validation: passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial implementation rendered the full structure card beside every vocabulary item (P1 against the requested removal).
2. Removed the shared structure-card markup and its vocabulary-only Hanzi Writer loader, icon, state, and unused CSS.
3. Converted the vocabulary content grid to one centered column with the existing 660 px design width.
4. Post-fix browser captures and two consecutive vocabulary steps confirm the card is absent without stretching, scrolling, or console errors.

## Follow-up polish

No P3 follow-up is required for this scoped removal.

final result: passed
<!-- end remove HSK character-structure card QA -->

---

# Design QA — Reduce roadmap lesson progress ring

- Source visual truth: browser annotation capture of `http://localhost:3001/courses/van-phong-hanh-chinh` at 1249 × 892 CSS px (the browser surface did not expose a filesystem path)
- Implementation screenshot: Codex in-app browser capture of the same URL and viewport after reload (the browser surface did not expose a filesystem path)
- Device scale factor: 1; no density normalization required
- State: first roadmap stage expanded, lesson 01 opened with `0% đã học`

## Full-view comparison evidence

The original progress ring measured 48 × 48 px. The revised ring measures 34 × 34 px, the nearest whole-pixel rendering to a 30% reduction. The lesson row remains 64 px tall, and the ring remains vertically centered at the right edge without shifting the duration or lesson title.

## Focused region comparison evidence

The progress label scales from 13 px to 9 px and the inner ring inset scales from 4 px to 3 px. The accessible label remains `0% đã học`, so the visual reduction does not remove progress meaning from assistive technology.

## Required fidelity surfaces

- Fonts and typography: progress percentage text is proportionally reduced; surrounding lesson typography is unchanged.
- Spacing and layout rhythm: row height, title/duration alignment, right gutter, and stage-card spacing are unchanged.
- Colors and visual tokens: orange progress arc, pale track, and white center remain unchanged.
- Image quality and asset fidelity: no image assets are affected.
- Copy and content: lesson copy, duration, progress value, and accessible progress label are unchanged.

## Primary interactions and console

- Expanded stage and opened-lesson state: passed.
- Progress ring rendered at 34 × 34 px after reload: passed.
- Lesson row remained 64 px tall and aligned: passed.
- Browser console warnings and errors: none.
- Targeted roadmap UI tests: 2/2 passed.
- ESLint validation: passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial annotated state rendered the progress ring at 48 × 48 px.
2. Reduced the shared ring diameter, inner inset, and percentage type proportionally.
3. Post-fix measurement confirms a crisp 34 × 34 px ring with the surrounding lesson row unchanged.

## Follow-up polish

No P3 follow-up is required for this scoped size adjustment.

final result: passed
<!-- end reduce roadmap lesson progress ring QA -->

---

# Design QA — HSK lesson completion celebration

- Source visual truth: additional completion-card image attached to Browser Comment 1 (722 × 703 px; the attachment surface did not expose a filesystem path)
- Implementation screenshot: Codex in-app browser capture of `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play` at 1249 × 892 CSS px (the browser surface did not expose a filesystem path)
- Generated image asset: `public/assets/hsk/hsk-completion-trophy.png` (transparent PNG)
- Device scale factor: 1
- State: HSK 1 lesson 01, final `Hoàn thành` step, 6 vocabulary items, 6 exercises, and 6 writing items

## Full-view comparison evidence

The former sparse completion screen is replaced by a centered white celebration card over a dimmed lesson surface. The implementation follows the supplied composition: close control, large orange trophy, completion badge, split-color completion heading, lesson summary, three statistic cards, and two bottom actions. At the default desktop viewport the card measures 663 × 533 rendered pixels and remains fully visible without document scrolling.

## Focused region comparison evidence

The generated trophy preserves the reference's glossy orange-gold cup, white star, two handles, and coral base. The completion badge measures 123.6 × 30.5 rendered pixels, stays on one line, and uses the reference's pale-red pill treatment. The three statistics use distinct Lucide book, target, and pen icons with red values, while the outlined and filled actions retain the source hierarchy.

## Required fidelity surfaces

- Fonts and typography: the dark/red split heading, uppercase badge, muted lesson summary, red statistic values, and compact labels match the reference hierarchy.
- Spacing and layout rhythm: the trophy, badge, heading, stats, and actions form the same centered vertical sequence; the card has a large radius and elevated shadow.
- Colors and visual tokens: warm white card, coral-red accents, pale-red icon surfaces, and dim neutral backdrop align with the supplied palette.
- Image quality and asset fidelity: a dedicated transparent 3D trophy asset is used; it is not approximated with CSS or text glyphs.
- Copy and content: lesson number/title and all three live counts remain data-driven; close, course-list, and next-lesson actions remain functional.

## Primary interactions and console

- Final navigation tab opens the completion card: passed.
- Close control and `Danh sách bài học` link to the HSK course list: passed by link inspection.
- `Bài tiếp theo` retains the real next-lesson route: passed by link inspection.
- Desktop document and viewport are both 1249 × 892 with the card fully visible: passed.
- Mobile 390 × 844 has no horizontal overflow: passed.
- Browser console warnings and errors: none.
- Targeted guided-lesson tests: 8/8 passed.
- ESLint validation: passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial implementation displayed a small trophy icon and statistics directly on the page, without the supplied modal card, dedicated trophy artwork, prominent action hierarchy, or dimmed backdrop (P1).
2. Replaced the shared completion view with the full celebration card and generated a matching transparent 3D trophy asset.
3. First browser capture showed the completion badge wrapping to two lines (P2).
4. Added explicit intrinsic width and nowrap behavior; the post-fix badge renders at 123.6 px wide on one line with the intended pale-red treatment.
5. Final desktop and mobile captures confirm the card is fully visible, responsive, and free of horizontal overflow.

## Follow-up polish

No P3 follow-up is required for this scoped replacement.

final result: passed
<!-- end HSK lesson completion celebration QA -->

---

# Design QA — Completion after final HSK practice

- Source visual truth: user annotation targeting the active `Luyện tập 6` navigation pill (`C:\Users\DELL\AppData\Local\Temp\codex-clipboard-8ecfe8d9-15aa-4044-be3d-1b7492397679.png`)
- Implementation screenshot: Codex in-app browser capture of `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play` at 1249 × 892 CSS px (the browser surface did not expose a filesystem path)
- State: HSK 1 lesson 01, final practice question before and after the last `Tiếp tục` action

## Full-view and focused evidence

Before the final action, the last question renders at `13 / 13`, the `Luyện tập 6` pill remains active, no completion card is present, and the footer still exposes `Tiếp tục`. After clicking that same button once, the completion card replaces the practice content, the `Luyện tập 6` pill remains active, the footer is hidden, and there is no separate `Hoàn thành` navigation pill.

## Required fidelity surfaces

- Typography, colors, image quality, and completion-card copy are unchanged from the previously approved celebration card.
- Navigation spacing improves because the redundant completion pill is removed.
- The lesson now contains 13 learning steps rather than a synthetic fourteenth completion step.
- Completion is persisted only after advancing beyond the final practice question.

## Primary interactions and console

- Enter `Luyện tập` at question 1/6: passed.
- Advance to question 6/6 without showing the completion card early: passed.
- Click final `Tiếp tục` and show the completion card: passed.
- Keep `Luyện tập 6` active and remove the separate completion tab: passed.
- Hide the lesson footer while the completion card is open: passed.
- Browser console warnings and errors: none.
- Targeted HSK tests: 11/11 passed.
- ESLint and diff whitespace validation: passed.

## Findings and comparison history

1. Previous flow modeled completion as a separate navigation step, exposing a redundant `Hoàn thành` pill and allowing direct access before finishing practice (P1).
2. Removed the synthetic completion step and opened the existing celebration card only when navigation advances beyond the final practice item.
3. Browser verification confirms the requested before/after behavior with no remaining P0, P1, or P2 findings.

final result: passed
<!-- end completion after final HSK practice QA -->

---

# Design QA — Remove HSK completion backdrop

- Source visual truth: user attachment `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-a2265556-f01c-4bc5-9bb3-7ae15b61a1e0.png` identifying the gray area behind the completion card
- Implementation screenshot: Codex in-app browser capture of `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play` at 1249 × 892 CSS px (the browser surface did not expose a filesystem path)
- State: completion card open after the final practice action

## Comparison evidence

The gray backdrop has been removed. Browser-computed style confirms the completion main area is fully transparent (`rgba(0, 0, 0, 0)`), exposing the normal pale lesson background, while the card remains warm white (`rgb(255, 253, 252)`). The card content, shadow, spacing, active `Luyện tập` state, and navigation actions are unchanged.

## Verification

- Transparent completion-area background: passed.
- White completion card and shadow retained: passed.
- Browser console warnings and errors: none.
- Targeted guided-lesson tests: 8/8 passed.
- ESLint and diff whitespace validation: passed.
- No actionable P0, P1, or P2 findings remain.

final result: passed
<!-- end remove HSK completion backdrop QA -->

---

# Design QA — HSK vocabulary card redesign

- Source visual truth: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-1fa55888-5d60-4fa7-b268-27da50dbe3fe.png` (1437 × 1127 px)
- Implementation screenshot: Codex in-app browser capture of `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play` at 1249 × 892 CSS px (the browser surface did not expose a filesystem path)
- Device scale factor: 1; comparison normalized by composition because the source excludes the persistent lesson header/footer
- State: HSK 1 lesson 01, vocabulary item 01/06 (`你`)

## Full-view comparison evidence

The implementation follows the source hierarchy: centered new-word badge; large character, pinyin, and audio card on the left; meaning, frequency, word class, and save controls on the right; then a full-width contextual-example card with audio and common collocations. At 1249 × 892, the rendered grid is 845 × 584 px and fits between the existing lesson header and footer without document scrolling or horizontal overflow.

## Focused region comparison evidence

The top cards share a 279.5 px rendered height, with widths of 316.4 px and 510.4 px, preserving the reference's narrow/wide ratio. The example card spans the complete 845 px grid width. The Hanzi remains selectable live text, while BookOpen, Flame, MessageCircle, Lightbulb, Bookmark, and Volume icons come from the application's established icon library and remain sharp at all densities.

## Required fidelity surfaces

- Fonts and typography: large serif Hanzi, coral pinyin, dark display meaning, and compact supporting labels reproduce the reference hierarchy while retaining the app's existing font stack.
- Spacing and layout rhythm: two-column top composition, equal card heights, 28 px logical gap, full-width lower card, rounded corners, and restrained shadows match the source structure.
- Colors and visual tokens: white cards, pale coral meaning surface, coral action accents, muted blue-gray secondary text, and pale collocation pills align with the source palette.
- Image quality and asset fidelity: the reference contains no raster imagery; all visible symbols are rendered with the existing vector icon library rather than placeholder assets or CSS drawings.
- Copy and content: all lesson-driven Hanzi, pinyin, meaning, word class, example, translation, frequency, collocations, and save state remain dynamic.

## Primary interactions and console

- Word pronunciation control retained: passed by rendered control inspection.
- Example pronunciation control retained: passed by rendered control inspection.
- Account-aware save-word control retained: passed by rendered control and regression test.
- Next moves from `你` to `好`; Previous returns to `你`: passed.
- Desktop document equals the 892 px viewport height with no scrolling: passed.
- Mobile 390 × 844 uses one 356 px grid column and has no horizontal overflow: passed.
- Browser console warnings and errors: none.
- Targeted guided-lesson tests: 8/8 passed.
- ESLint validation: passed.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Previous vocabulary UI placed the Hanzi in a floating hero and stacked meaning/example cards in a narrow centered column, materially differing from the supplied two-column card composition (P1).
2. Rebuilt the shared vocabulary component as a responsive card grid and moved all existing controls into their source-matched regions.
3. Initial hot-reload capture retained stale title styling; a full browser reload confirmed the intended title-case labels, icon-only tinted surfaces, and final spacing.
4. Desktop and mobile post-fix captures confirm one-screen desktop fit, one-column mobile reflow, no horizontal overflow, and stable next/previous navigation.

## Follow-up polish

No P3 follow-up is required for this scoped redesign.

final result: passed
<!-- end HSK vocabulary card redesign QA -->

---

# Design QA — Hide HSK completion header

- Source visual truth: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-8113a4ff-fcf0-492c-bebf-79be657767d7.png`
- Implementation screenshot: Codex in-app browser capture of `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play` at 1249 × 892 CSS px
- State: completion form shown after the final practice question

## Verification evidence

- The guided-lesson header and footer remain visible during normal lesson steps.
- After the final **Tiếp tục** action, the completion form opens without the lesson header or footer.
- The completion main region starts at y=0 and fills the 892 px viewport height.
- Document dimensions match the viewport (1249 × 892), with no horizontal or vertical scrolling.
- The completion card retains its own close control and both navigation actions.
- Browser console warnings and errors: none.
- Targeted guided-lesson tests: 8/8 passed.
- ESLint validation: passed.

No actionable P0, P1, or P2 findings remain.

final result: passed
<!-- end hide HSK completion header QA -->

---

# Design QA — HSK quick-practice redesign

- Source visual truth: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-ea99f010-6dc0-4de6-83aa-b9bfae61523c.png` (979 × 432 px)
- Implementation screenshot: Codex in-app browser capture of `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play` (the browser surface did not expose a filesystem path)
- Viewport: 998 × 892 CSS px at device pixel ratio 1; additional responsive capture at 390 × 844 CSS px
- Density normalization: source and implementation both reviewed at 1×; comparison used the source's content-only crop against the implementation's 604.5 × 341.97 px practice section because the source omits the persistent lesson header and footer
- State: HSK practice, “Chọn nghĩa đúng”, unselected four-answer state; selected/correct response checked separately

## Full-view comparison evidence

The final implementation reproduces the centered source hierarchy: coral quick-practice capsule, bold instruction, large Hanzi with adjacent circular audio control, pinyin below, and a 604.5 px-wide two-column answer grid. The practice section is vertically centered between the existing lesson header and footer. The document remains exactly 998 × 892 px, so no document scrolling or clipped persistent controls are introduced.

## Focused region comparison evidence

The answer grid measures 604.5 × 120.88 px, closely matching the source's approximately 602 × 125 px grid. Each card retains a pale A–D badge, white surface, subtle blue-gray border, rounded corners, and dark answer copy. Hanzi, pinyin, heading, audio control, and letter badges were visually readable at the captured density, so no additional zoomed crop was needed.

## Required fidelity surfaces

- Fonts and typography: instruction weight/size, large Chinese display text, compact muted pinyin, and answer text hierarchy match the supplied composition using the application's existing font stacks.
- Spacing and layout rhythm: centered stack, 2 × 2 desktop grid, card gaps, radii, shadows, and approximately 600 px answer width align with the source; mobile reflows cleanly to one column.
- Colors and visual tokens: pale neutral canvas, coral capsule/audio accents, white cards, blue-gray borders, and muted badges map to the source palette while retaining existing correct/wrong semantic colors.
- Image quality and asset fidelity: the source contains no raster illustration or product imagery; the audio symbol uses the project's established Lucide icon and remains sharp at both tested sizes.
- Copy and content: lesson-driven instruction, Hanzi, pinyin, pronunciation label, options, and feedback remain dynamic; pinyin is now normalized onto both generated and source-backed exercises.

## Primary interactions and console

- Pronunciation button invokes the existing HSK audio path: passed.
- Selecting the correct option disables the choices, highlights the correct answer, shows the check icon, and displays success feedback: passed.
- Mobile 390 × 844 switches the four cards to one column without horizontal overflow: passed.
- Browser console warnings and errors after pronunciation and answer selection: none.
- Targeted guided-lesson tests: 8/8 passed.
- ESLint validation: passed.

## Findings and comparison history

1. Initial implementation retained the old outer white card, omitted an audio control beside the Hanzi, and used a smaller dense answer grid (P1).
2. Removed the normal practice outer card, introduced the source-matched centered hierarchy, added the pronunciation control, and resized the grid/cards to the reference proportions.
3. First browser capture exposed missing pinyin on source-backed exercises and unstable A/C badge rendering (P2).
4. Normalized each exercise with the vocabulary pinyin/speak text and introduced dedicated letter/answer classes. Post-fix desktop and mobile captures show pinyin plus all A–D badges, with no remaining P0, P1, or P2 findings.

## Follow-up polish

No P3 follow-up is required for this scoped redesign.

final result: passed
<!-- end HSK quick-practice redesign QA -->

---

# Design QA — Increase HSK section navigation by 30%

- Source visual truth: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-95f6042c-f7e5-458b-8e95-819ae513b51d.png` (332 × 43 px), supplied as the pre-change navigation reference
- Target specification: enlarge the navigation controls by 30% while preserving their existing visual language
- Implementation screenshot: Codex in-app browser capture of `http://localhost:3001/hsk/1/hsk1-bai-01-chao-anh/play` (the browser surface did not expose a filesystem path)
- Viewports: 998 × 892 CSS px desktop and 390 × 844 CSS px mobile, device pixel ratio 1
- Density normalization: desktop lesson zoom is 0.65; implementation measurements are reported in logical CSS pixels before zoom
- State: first vocabulary step with “Từ vựng” active; practice state with “Luyện tập” active was also inspected

## Full-view comparison evidence

The desktop section navigation keeps the same order, coral active state, gray inactive state, icon treatment, rounded-pill shape, and count badge. The requested 30% increase is applied proportionally: control height 38 → 50 px, horizontal padding 14 → 18 px, label size 14 → 18 px, icon size 17 → 22 px, active badge 20 → 26 px, and inter-control gap 18 → 23 px.

At the rendered 0.65 lesson scale, the active control measures 32.5 px high and remains fully visible inside the header. The 998 × 892 document still matches the viewport with no horizontal or vertical page overflow.

## Focused region comparison evidence

The enlarged “Từ vựng” active pill measures approximately 109.8 × 32.5 rendered pixels after lesson zoom. The icon, label, and `6` badge remain vertically centered, with no clipping, wrapping, or collision. The same rules apply to “Luyện viết” and “Luyện tập”.

## Required fidelity surfaces

- Fonts and typography: label and badge sizes increase proportionally, preserving existing weight, line height, and single-line labels.
- Spacing and layout rhythm: height, padding, gap, icon, and badge dimensions follow a consistent 1.3× scale; alignment remains centered.
- Colors and visual tokens: existing coral active fill, white active content, and blue-gray inactive content remain unchanged.
- Image quality and asset fidelity: the controls use the application's existing Lucide icons; no raster assets or replacement drawings are introduced.
- Copy and content: section names and counts remain unchanged and dynamic.

## Responsive and interaction verification

- Desktop active and inactive controls render at the increased scale: passed.
- Existing section navigation remains clickable and retains active-state switching: passed by unchanged component behavior and rendered controls.
- Mobile 390 × 844 retains the compact override, keeping all three controls on one row without horizontal overflow: passed.
- Browser console warnings and errors: none.
- Targeted guided-lesson tests: 8/8 passed.
- ESLint and diff whitespace validation: passed.

## Findings and comparison history

1. Baseline controls were visually smaller than requested (P2).
2. Applied a proportional 30% increase to the complete desktop control system rather than enlarging only the text.
3. Post-fix desktop capture confirms the larger controls remain balanced; post-fix mobile capture confirms the compact breakpoint prevents overflow. No actionable P0, P1, or P2 findings remain.

## Follow-up polish

No P3 follow-up is required for this scoped size adjustment.

final result: passed
<!-- end increase HSK section navigation QA -->

---

# Design QA — Auto-fit HSK vocabulary Hanzi

- Source visual truth: `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-8b79d8af-046b-4415-be0e-86d1eaac4068.png` (956 × 636 px) and focused card reference `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-2da29c9e-f673-4d3c-9f80-56621e6979db.png` (325 × 318 px).
- Implementation: `http://localhost:3001/hsk/1/hsk1-bai-02-cam-on-anh/play`.
- Implementation screenshot: Chrome browser capture in this task; the browser capture API does not expose a filesystem path.
- Verified viewport: 2560 × 1150 CSS px at device pixel ratio 0.75, with the app's responsive lesson scale active.
- State: vocabulary item 03/04, `不客气`.

## Full-view comparison evidence

The vocabulary screen retains the supplied two-column card composition, coral pinyin, centered audio control, meaning panel, and full-width context card. The three-character term now remains entirely inside the left card on one line instead of overflowing toward the meaning card.

## Focused region comparison evidence

The left card measured 316.42 CSS px wide. Its usable glyph container measured 269.58 px; the auto-fit routine reduced the Hanzi from the 205 px maximum to 136 px. The final text bounds measured 267.81 px and stayed inside the card (`fits: true`). The computed `white-space` is `nowrap`.

## Required fidelity surfaces

- Fonts and typography: the existing Songti/STSong/SimSun stack, weight, line height, and character spacing are preserved; only the font size adapts when needed.
- Spacing and layout rhythm: the character remains centered and the surrounding pinyin dividers, audio button, and card padding remain unchanged.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: no raster imagery is involved; the existing vector audio icon is unchanged.
- Copy and content: Hanzi, pinyin, meaning, example, and collocation content remain lesson-driven and unchanged.

## Interaction, responsiveness, and console

- Moving from a one-character term to `不客气` recalculates the font size: passed.
- Resizing is observed through `ResizeObserver`, so the fit is recalculated when the card width changes: passed by implementation inspection and live desktop measurement.
- Browser console warnings and errors: none.
- ESLint validation: passed.
- Targeted tests reached four passing assertions before the repository's existing test WebSocket port conflict interrupted the runner.

## Findings and comparison history

1. Initial fit logic measured the element's clipped bounding box, so it retained the maximum font size and allowed the natural text width to exceed the card (P1).
2. Constrained the glyph grid item with `min-width: 0` and changed measurement to `scrollWidth`, which captures the full natural text width before scaling.
3. Post-fix browser measurement reports a 136 px font, 267.81 px rendered text inside a 269.58 px container, with no wrapping or overflow. No actionable P0, P1, or P2 findings remain.

final result: passed
<!-- end auto-fit HSK vocabulary Hanzi QA -->
