**Design QA — Pronunciation score result**

- Source visual truth: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-d35230ad-a9a9-437c-a554-aa7187c98074.png`
- Implementation: `http://localhost:4173/dev/pronunciation-preview` (development-only preview; production returns 404)
- Browser evidence: Codex in-app Browser tab 1; screenshots captured in-tool at the default desktop viewport and at 390 × 844 CSS px. The browser tool does not expose a filesystem path for captures.
- Source pixels: 857 × 142 px.
- Implementation viewport: default desktop and 390 × 844 CSS px, device scale factor 1.
- State: 66/100, Trung bình, feedback and weak-syllable chips visible.

**Full-view comparison evidence**

- The original score and `/100` overlap a large red circle and compete with the feedback text.
- The revised implementation separates score, rating, feedback and weak sounds into a two-column result card with a consistent reading order.
- At 390 px the two-column hierarchy remains intact, text wraps inside the feedback column, and no horizontal overflow appears.

**Focused region comparison evidence**

- Typography: score uses a dedicated display size; rating and helper labels use smaller optical weights; feedback line height is increased.
- Spacing/layout: score panel has a stable width, the card uses 18 px desktop and 12 px mobile padding, and weak sounds wrap independently.
- Colors/tokens: green remains positive, amber represents “Trung bình”, and red is reserved for weak sounds or a needs-practice result.
- Image quality: no image asset is required in this compact result component; the Award icon comes from the existing icon library.
- Copy/content: existing score, rating, feedback and weak-sound content are preserved.

**Findings**

- No actionable P0/P1/P2 issue remains in the checked desktop and 390 px states.

**Comparison history**

- Initial P1: score typography overlapped the circular background and made the score hard to scan.
- Initial P2: rating, feedback and weak sounds had insufficient hierarchy.
- Fix: replaced the circle with a structured score panel, introduced a semantic rating badge, increased feedback spacing, and converted weak sounds into chips.
- Post-fix evidence: desktop and 390 × 844 browser captures show clear hierarchy without clipping or overflow.

**Implementation Checklist**

- [x] Clear score hierarchy
- [x] Semantic rating colors
- [x] Readable feedback copy
- [x] Weak-sound chips
- [x] Responsive mobile layout
- [x] Accessible text remains available in the DOM

**Follow-up Polish**

- P3: animate the score count only if a later iteration needs stronger celebration feedback.

final result: passed

---

**Design QA — Verify-email brand icon**

- Source visual truth: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-9084af4f-20f3-4f09-9b01-73f844794c34.png`
- Implementation: `http://localhost:4173/verify-email`
- Browser evidence: Codex in-app Browser tab 3; screenshot captured in-tool at the default desktop viewport. The browser tool does not expose a filesystem path for captures.
- Source pixels: 212 × 92 px.
- Implementation viewport: default desktop viewport, device scale factor 1.
- State: verification-email form without a pending verification cookie.

**Full-view comparison evidence**

- The verification card now uses the same head-only penguin brand icon as the other authentication screens while retaining the existing Himi Chinese wordmark.
- The card hierarchy, spacing, mail icon, heading, input, and actions are unchanged.

**Focused region comparison evidence**

- Typography: wordmark size and weight remain consistent with the reference lockup.
- Spacing/layout: the icon and wordmark remain vertically centered without changing the card rhythm.
- Colors/tokens: existing coral Himi wordmark and dark Chinese wordmark are preserved.
- Image quality: the approved transparent repository asset is used directly; no CSS or placeholder icon was introduced.
- Copy/content: no authentication copy changed.

**Findings**

- No actionable P0/P1/P2 mismatch remains in the checked brand region.

**Comparison history**

- Initial P2: the verification page used the generic brand mark instead of the head-only authentication icon.
- Fix: switched the page to the shared `AuthBrandMark` component.
- Post-fix evidence: browser capture shows the head-only penguin icon beside the unchanged Himi Chinese wordmark.

**Implementation Checklist**

- [x] Shared authentication brand icon
- [x] Existing wordmark preserved
- [x] No layout regression
- [x] Approved image asset retained

**Follow-up Polish**

- None required for this scoped change.

final result: passed
