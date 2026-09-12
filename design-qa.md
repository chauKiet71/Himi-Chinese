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
