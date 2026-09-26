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
