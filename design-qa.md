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

**Design QA — Home hero CTA hover motion**

- Source visual truth: browser annotations on the “Bắt đầu học ngay” and “Xem lộ trình” controls at `http://localhost:3001/`.
- Implementation: `http://localhost:3001/`.
- Browser evidence: both CTA elements are present, their updated transition rules are applied, and the console contains no errors.

**Focused interaction evidence**

- Standard pointer mode uses a 480 ms spring-like easing for lift, scale, shadow, arrow travel, and the Play circle.
- The primary arrow travels independently while the button lifts and scales subtly.
- The secondary action gains a translucent surface and soft shadow while its Play circle lifts, scales, and rotates slightly.
- Reduced-motion mode retains smooth 220 ms color and shadow feedback while removing spatial movement.
- Keyboard focus and pressed states remain explicit.

**Findings**

- No actionable P0/P1/P2 issue remains for the two annotated CTA hover states.

**Implementation Checklist**

- [x] Smooth primary CTA motion
- [x] Smooth secondary CTA motion
- [x] Independent icon feedback
- [x] Reduced-motion-safe fallback
- [x] Focus and active states retained

final result: passed

---

**Design QA — New-password paper scene**

- Source visual truth: paper scene from `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-09665614-0584-4427-ad1d-c12bb4298433.png` with new-password form content from `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-00798181-0265-4a04-970b-64b3aa8005b5.png`.
- Implementation: `http://localhost:3001/reset-password?preview=password` (development-only visual state; production still requires a valid reset token).
- Browser evidence: Codex in-app Browser desktop capture; no console errors.

**Full-view comparison evidence**

- The reset-password page now shares the cream paper, satchel, penguin, decorative accents, external wordmark, and home action from the verification scene.
- Only the paper content changes to the account-security label, new-password heading, explanatory copy, two password fields, and primary reset action.
- The form stays above the paper fold and does not overlap the mascot or satchel.

**Focused region comparison evidence**

- The coral key icon and uppercase security label reproduce the hierarchy of the form reference.
- Both password controls have equal 50 px desktop height, rounded borders, and an explicit coral focus state.
- The existing token validation, field constraints, error handling, and reset endpoint remain unchanged.
- Mobile rules reuse the established paper-scene coordinate system with compact field heights.

**Findings**

- No actionable P0/P1/P2 visual or interaction issue remains in the checked reset-password state.

**Implementation Checklist**

- [x] Existing paper scene reused
- [x] New-password form preserved
- [x] Security hierarchy matches the reference
- [x] Reset-token behavior retained
- [x] Responsive compact state included
- [x] Browser console free of errors

**Follow-up Polish**

- None required for this scoped change.

final result: passed

---

**Design QA — Email verification paper scene**

- Source visual truth: registration scene `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-178a213c-4cb0-4780-87ce-a3980bb2a9e0.png` with verification form content from `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-ee32bb30-fc19-45e6-9e93-820f615b12f6.png`.
- Implementation: `http://localhost:3001/verify-email?preview=code` (development-only visual state; production still requires the pending-verification cookie).
- Browser evidence: Codex in-app Browser desktop capture; no console errors.

**Full-view comparison evidence**

- The verification experience now uses the same cream paper, satchel, penguin, floating decorations, external Himi wordmark, and home action as the registration screen.
- The paper contains only the verification workflow: heading, six-digit code, expiry guidance, resend, change-email, and login actions.
- The form remains centered inside the paper and does not overlap the mascot or satchel.

**Focused region comparison evidence**

- The code field uses centered, widely spaced tabular digits and retains automatic submission after the sixth digit.
- Coral is used for the mail icon and primary resend action; secondary actions remain restrained and consistent with the registration scene.
- Existing token verification, resend, change-email, error, and fallback email-entry states are preserved.
- Responsive rules reuse the established registration paper-scene coordinate system.

**Findings**

- No actionable P0/P1/P2 visual or interaction issue remains in the checked verification state.

**Implementation Checklist**

- [x] Registration paper scene reused
- [x] Six-digit verification form preserved
- [x] Resend and change-email actions preserved
- [x] Home and login navigation retained
- [x] Development-only code-state preview
- [x] Browser console free of errors

**Follow-up Polish**

- None required for this scoped change.

final result: passed

---

**Design QA — Listening transport controls**

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-15d42411-1c27-426a-8149-5d5b122de939.png`
- Implementation: `http://localhost:3001/listening`
- Browser evidence: Codex in-app Browser, existing listening lesson at the desktop viewport.
- Required adaptation: preserve the reference hierarchy and proportions while retaining the site's coral-red and white palette.

**Full-view comparison evidence**

- The transport remains inside the existing red player bar and does not overlap the speed, timeline, or language controls.
- The center play action is now visually dominant, with balanced previous and next controls on either side.
- Existing audio behavior, labels, disabled states, and responsive toolbar structure are unchanged.

**Focused region comparison evidence**

- Measured browser result: transport 200 × 72 px; side buttons 38 × 52 px; center play button 50 × 50 px.
- The previous/next icons render at 34 px and the play/pause icon at 28 px, preserving a clear hierarchy at the requested compact size.
- The white circular play surface and coral icon retain the current Himi palette instead of copying the reference's black theme.
- Hover, keyboard focus, disabled opacity, and compact mobile variants remain explicit.

**Findings**

- No actionable P0/P1/P2 mismatch remains in the checked desktop state.

**Comparison history**

- Initial P2: all three controls were compressed into a small cluster, so the center play action lacked the scale and spacing shown by the reference.
- Fix: expanded the control group, set the circular play button to the requested 50 px, strengthened the side icons, increased spacing, and added restrained interaction states.
- Post-fix evidence: the live browser capture shows the requested large-center, balanced-side layout without toolbar collisions.

**Implementation Checklist**

- [x] Large circular primary play control
- [x] Balanced previous/next controls
- [x] Existing coral-red and white theme retained
- [x] Hover and keyboard focus states
- [x] Responsive compact variants
- [x] No audio logic changes

**Follow-up Polish**

- None required for this scoped change.

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
