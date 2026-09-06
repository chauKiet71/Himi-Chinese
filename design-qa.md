**Findings**

- No actionable P0, P1, or P2 differences remain.
- The selected Pro card now uses the requested `#ff4c3b` family across its tinted surface, border, shadow, crown icon, emphasized `Pro` label, and primary action.
- Typography and spacing are unchanged from the annotated source, preserving the existing hierarchy and compact rail layout.
- The red-tinted card background keeps the dark body copy readable; crown and action text remain white on the saturated brand surface.
- No image or asset substitutions were made. The existing Lucide crown, sparkle, and arrow icons remain intact.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Scope the change to `.rail-pro-card` and its existing child accents.
- [x] Use the existing `--himi-red` token, whose value is `#ff4c3b`.
- [x] Preserve hover, focus, active, link, and collapsed-rail behavior.
- [x] Verify the rendered result in the Codex in-app browser.
- [x] Check browser console warnings/errors.
- [x] Add and run a regression test for the Pro card palette.

**Follow-up Polish**

- None required for this scoped color update.

**Evidence**

- Source visual truth path: Browser Comment 1 attached marker screenshot, target `aside#learner-navigation-rail > a.rail-pro-card:nth-of-type(2)`.
- Implementation screenshot path: Codex in-app browser `browser 1 / tab 2`, full-page capture emitted during verification.
- Route: `http://localhost:3000/learn/van-phong-hanh-chinh?lesson=nhan-va-giao-nhiem-vu`.
- Viewport: 1496 x 1053 CSS pixels; browser device scale factor 0.8375.
- Source pixels: 1254 x 882 attached marker screenshot; implementation capture used the live viewport and full-page renderer at the same browser zoom.
- State: authenticated lesson page, expanded learner rail, Pro card visible at the bottom of the rail.
- Full-view comparison evidence: the live full-page capture preserves the source layout while changing only the selected Pro card from orange to the requested red family.
- Focused comparison evidence: computed rendered styles report crown and action backgrounds as `rgb(255, 76, 59)` and the `Pro` label as `rgb(255, 76, 59)`; card background and border are red-tinted mixes of the same token.
- Primary interactions tested: page reload/HMR rendering, card presence, existing link semantics, and responsive rail positioning.
- Console errors checked: no warnings or errors were reported.

**Comparison History**

- Initial P2: the selected card used the orange brand token, conflicting with the requested `#ff4c3b` tone.
- Fix: remapped the card surface, border, shadow, hover state, crown, title emphasis, and action to `--himi-red`.
- Post-fix evidence: live computed styles resolve the primary accents to exact `rgb(255, 76, 59)`, and the browser capture shows the intended red-tinted card without layout drift.

final result: passed

# Account Topbar Avatar Fill — Browser Comment 1

**Findings**

- No actionable P0, P1, or P2 differences remain for the annotated topbar avatar.
- The image state now fills the complete circular frame and is center-cropped; the initials fallback keeps its existing appearance.
- The topbar also receives the newly saved avatar immediately after upload instead of waiting for a page reload.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Scope the visual change to the avatar inside `.user-chip`.
- [x] Make the rendered image exactly match the frame width and height.
- [x] Preserve the circular crop and initials fallback.
- [x] Synchronize the topbar when an upload completes.
- [x] Verify the live `/account` page in the Codex in-app browser.
- [x] Add and run focused regression coverage.

**Follow-up Polish**

- None required.

**Evidence**

- Source visual truth path: Browser Comment 1 attached marker screenshot, target `div.topbar-actions > div.account-menu-anchor > button.user-chip > span`.
- Implementation evidence: Codex in-app browser `browser 1 / tab 1`; full-page baseline capture and a temporary local image-state render inspected during verification. The temporary preview used the existing `/assets/brand/himi-mascot-icon.png` asset and was removed before handoff; no account data was changed.
- Route: `http://localhost:3000/account`.
- Viewport: 1496 × 1053 CSS pixels at device scale factor 0.8375.
- Source pixels: 1254 × 882; implementation browser capture used the same active viewport and density.
- State: authenticated user “Gia Huy”; source and final browser state use the initials fallback, with a temporary image state used only to verify the requested full-box behavior.
- Full-view comparison evidence: the final `/account` view preserves the source header, topbar spacing, user name, and 42px circular chip without layout drift.
- Focused comparison evidence: the rendered image and frame both measured 41.996 × 41.996 CSS pixels; computed styles reported `object-fit: cover`, centered positioning, `border-radius: 50%`, and `overflow: hidden`.
- Required fidelity surfaces: typography and copy are unchanged; spacing remains a 42px circular frame; fallback color tokens remain unchanged; the uploaded image uses its real source asset with centered cover cropping; no placeholder or code-drawn asset was introduced.
- Primary interactions tested: page reload, authenticated account-chip presence, initials fallback, image-state rendering, and immediate update event wiring.
- Console errors checked: no avatar-related browser errors were observed.

**Comparison History**

- Initial P2: the small topbar avatar relied on a generic image rule and the server refresh path, so full-frame sizing and immediate visual replacement were not explicit.
- Fix: added a dedicated image class with 100% width/height, centered cover cropping, inherited circular radius, transparent image-state background, and an upload-complete event consumed by the learner shell.
- Post-fix evidence: the temporary live image state exactly matched the 42px frame in both dimensions and retained the circular mask; focused lint and all three avatar tests passed.

final result: passed

---

# Design QA — Auth paper-in-satchel scene

## Result

**Passed.** No open P0, P1, or P2 visual defects remain in the implemented auth scene.

## Fidelity target

- User-selected mockup: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-81a31099-050d-434a-9756-cc3fd077a2db.png`
- Normalized comparison: `.codex-artifacts/auth-paper-qa/comparison-auth-620x823.png`
- Focused paper/bag seam comparison: `.codex-artifacts/auth-paper-qa/comparison-paper-bag-join.png`

The full-screen comparison uses matching 620 × 823 viewports for each source panel and implementation render. The focused crop checks the exact paper-to-satchel overlap that motivated the change.

## Screens reviewed

- `/login`
- `/register`
- `/forgot-password`

Responsive renders were checked at 320 × 568, 360 × 800, 390 × 844, 430 × 932, 620 × 823, 844 × 390 landscape, and 1440 × 900.

## Visual checks

- The paper and satchel now come from one project-bound raster scene, so their geometry cannot drift independently.
- The satchel rim consistently overlaps the lower paper edge on portrait mobile, short mobile, landscape mobile, and desktop.
- Live form controls remain inside the paper's usable area on all three routes.
- Registration fields and footer no longer spill over the satchel front on desktop.
- Narrow phones have no horizontal overflow; short phones use intentional vertical scrolling while preserving touch-target sizes.
- Reduced-motion renders use the same final composition without entrance animation.

## Interaction and runtime checks

- Email fields accept input and expose a visible focus state.
- Submit buttons remain enabled and retain the correct label for each route.
- Login, register, forgot-password, and home links resolve to the expected local routes.
- Motion and reduced-motion captures completed with no page runtime errors or console errors.

## Issues found and resolved during QA

- **P2 — fixed:** generic mobile body padding produced an extra 68 px scroll tail on auth pages.
- **P2 — fixed:** 721–900 px landscape could combine the portrait artwork with a landscape stage.
- **P2 — fixed:** the desktop registration form extended into the satchel area.
- **P2 — fixed:** portrait headings initially overlapped the mint tape.

## Verification

- `npx eslint components/auth-card.tsx` — passed.
- `npm run build` — passed.
- The broader repository test/lint runs still include unrelated pre-existing failures from legacy page assertions and generated Chrome-profile files; no auth-scene runtime or targeted lint failure was observed.

---

# Design QA — Account membership wallet mobile UI

**Findings**

- No actionable P0, P1, or P2 differences remain in the implemented Free, active VIP, or password-sheet states.
- The membership state is now immediately legible: Free uses an ivory/coral outlined card, active VIP uses the saturated coral wallet, and pending approval uses a separate amber treatment and cancel action.
- Email verification remains green and independent from membership status in every state.
- The production Himi v2 transparent mascot replaces the opaque-background concept asset. Its rendering style is slightly more dimensional than the generated mock, but it is the approved project asset and avoids the white raster box found in the first implementation pass.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Preserve the desktop profile-first account layout.
- [x] Implement responsive Free, pending, and VIP wallet states from existing subscription/request data.
- [x] Keep the existing avatar upload, VIP link, request cancellation, password change, logout, and mobile navigation behavior working.
- [x] Implement the password editor as a keyboard-accessible native dialog with Escape/backdrop/close-button dismissal.
- [x] Keep 44px-or-larger primary touch targets and reduced-motion fallbacks.
- [x] Verify the 390 × 844 mobile viewport, primary interactions, framework overlay, console, and page errors.

**Follow-up Polish**

- The generated reference includes mock-only security rows for two-factor authentication, device management, and account deletion. They were intentionally not added as dead controls because those product capabilities do not exist in the current account backend.
- The existing six-item learner bottom navigation remains visible even though ImageGen omitted it; retaining the app shell avoids a navigation regression.

**Evidence**

- VIP source visual truth: `C:/Users/Windows/.codex/generated_images/01a04399-6b54-77d2-8a15-3b97eacdc5ee/exec-fd2fc274-82d3-407a-85ac-80609ce015f8.png`.
- Free source visual truth: `C:/Users/Windows/.codex/generated_images/01a04399-6b54-77d2-8a15-3b97eacdc5ee/exec-5e6578c8-0242-4041-9ad1-46b6e8567db1.png`.
- Free implementation screenshot: `.codex-artifacts/account-wallet-qa/free-390x844.png`.
- VIP implementation screenshot: `.codex-artifacts/account-wallet-qa/vip-390x844.png`.
- Password-sheet implementation screenshot: `.codex-artifacts/account-wallet-qa/vip-password-sheet-390x844.png`.
- Viewport: 390 × 844 CSS pixels at device scale factor 1.
- Source pixels: 852 × 1832 for each generated concept; implementation pixels: 390 × 844. Sources were width-normalized to 390 px for comparison, producing an approximately 839 px concept viewport.
- States: Free/closed, active VIP/closed, and active VIP/password sheet open.
- Full-view comparison evidence: the source/implementation pairs were opened in one comparison input after the final spacing pass. Header hierarchy, wallet width, status color, identity block, account facts, security grouping, and CTA prominence align at the normalized mobile size.
- Focused comparison evidence: the final password-sheet capture was compared against the open-sheet VIP source. The implementation intentionally uses 48px form controls, so its sheet begins slightly higher than the generated concept while preserving the same handle, close affordance, field order, CTA, and cancel action.
- Required fidelity surfaces: Inter/Roboto project typography retains the source hierarchy; card spacing follows the 8/12/16px rhythm; coral, ivory, amber, and verification-green tokens map to semantic states; the transparent Himi v2 asset is sharp and correctly cropped; Vietnamese labels and dates match the underlying account data.
- Primary interactions tested: open password sheet, reveal current-password input, close with Escape, backdrop scroll lock/unlock, VIP/Free links, and existing bottom navigation semantics.
- Browser checks: meaningful content rendered, no Vinext/Vite/Next error overlay, no page errors, and no console errors beyond normal Vite connection/React DevTools development messages.

**Comparison History**

- Initial P1: the original `himi-mascot-master.png` had an opaque white background that covered wallet copy and the CTA. Fix: replaced it with the existing transparent `himi-v2/himi-wave.webp` production asset and corrected stacking.
- Initial P2: responsive account padding produced a double gutter and pushed the card too far below the mock header. Fix: reset page padding for the redesigned route, use a 54px mobile header, and keep a single 16px card gutter.
- Initial P2: the Free badge overlapped “Gói miễn phí,” and benefit copy collided with the CTA. Fix: separated badge positioning, reserved copy width, and increased only the Free card's content height.
- Initial P2: the active VIP mascot/card and password sheet were oversized relative to the selected mock. Fix: reduced the VIP card and mascot, moved the illustration upward/right, hid redundant visible field labels while retaining accessible labels, and compacted the sheet without dropping below touch-target guidance.
- Post-fix evidence: final Free and VIP captures show no clipped labels, overlapping artwork, hidden CTA, horizontal overflow, or inaccessible modal controls at 390 × 844.

final result: passed

---

# Design QA — Responsive account structure aligned to laptop

**Findings**

- No open P0, P1, or P2 visual defects remain.
- The responsive information order now matches the approved laptop structure: profile hero, membership band, account facts, then security actions.
- Free, pending approval, and active VIP remain visibly distinct without changing the underlying subscription/request logic.
- No horizontal overflow was detected at 360, 390, 768, 1024, or 1440 CSS pixels.

**Evidence**

- Laptop visual truth: `C:/Users/Windows/Downloads/Codex Image Sep 6, 2026, 09_54_34 PM.png` and `C:/Users/Windows/Downloads/Codex Image Sep 6, 2026, 09_54_53 PM.png`.
- Final desktop render: `.codex-artifacts/account-wallet-qa/responsive-vip-1440x900.png`.
- Final tablet renders: `.codex-artifacts/account-wallet-qa/responsive-vip-1024x900.png` and `.codex-artifacts/account-wallet-qa/responsive-vip-768x1024.png`.
- Final mobile renders: `.codex-artifacts/account-wallet-qa/responsive-vip-390x844.png`, `.codex-artifacts/account-wallet-qa/responsive-free-390x844.png`, `.codex-artifacts/account-wallet-qa/responsive-pending-390x844.png`, and `.codex-artifacts/account-wallet-qa/responsive-free-360x800.png`.
- Focused interaction render: `.codex-artifacts/account-wallet-qa/responsive-password-sheet-390x844.png`.
- Viewports: 360 × 800, 390 × 844, 768 × 1024, 1024 × 900, and 1440 × 900 CSS pixels at device scale factor 1.
- States: Free/closed, pending/closed, active VIP/closed, and active VIP/password sheet open.
- Full-view comparison evidence: both laptop references and all final implementation renders were opened in one comparison input after the last responsive pass. Profile hierarchy, separate membership placement, fact-table order, security grouping, and coral/ivory status treatments remain consistent while adapting to each viewport.
- Focused comparison evidence: the mobile membership band stays a standalone section beneath the profile card, and the password dialog keeps its handle, title, three fields, primary action, cancel action, backdrop, and bottom-sheet behavior.
- Required fidelity surfaces: the project typography and Vietnamese copy are preserved; spacing follows the existing 8/12/16px rhythm; coral, blush, ivory, amber, and verification-green tokens map to their semantic states; the production Himi mascot remains sharp and correctly cropped.

**Interactions and runtime**

- The password dialog opens from the security row, locks background scrolling, closes with Escape, and releases the scroll lock.
- The final browser run showed no page errors or framework error overlay. Console output contained only normal Vite connection and React DevTools development messages.
- Targeted account regression coverage verifies that profile precedes membership, membership precedes account facts, all three membership states remain present, and the 721–1024px breakpoint is retained.

**Comparison History**

- Initial P1: the decorative desktop mascot overlapped the name, email, and CTA at 768px. Fix: hide that decoration only at the constrained 721–840px tablet range and preserve the real mascot on mobile.
- Initial P2: the active VIP badge had low contrast against the pale coral membership band. Fix: apply an explicit coral-on-blush badge treatment.
- Initial P2: the avatar edit button obscured part of the initials on narrow mobile. Fix: offset the control just outside the avatar edge while keeping its touch target accessible.
- Post-fix evidence: the final 768px render has clean text/CTA separation; the 390px Free, pending, and VIP renders have readable badges and unobstructed initials; all tested widths have matching document and viewport widths.

final result: passed

---

# Design QA — Saturated VIP mobile ticket

**Findings**

- No open P0, P1, or P2 issue remains in the scoped active-VIP mobile ticket.
- The ticket now has the source's saturated coral/orange surface, subtle wave texture, single-card profile and membership composition, large cropped mascot, white type, internal divider, expiry block, and elevated white CTA.
- Free and pending approval keep their existing pale semantic cards, so only an active subscriber receives the premium orange treatment.

**Evidence**

- Source visual truth: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-2afffd5b-d856-4b1b-b366-83e6d8605040.png`, with the VIP ticket region as the scoped target.
- Previous implementation evidence: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-920cf0c4-2352-4eb6-be8d-6e37d4314f5e.png`.
- Final closed implementation: `.codex-artifacts/account-wallet-qa/vip-ticket-390x844.png`.
- Final open-sheet implementation: `.codex-artifacts/account-wallet-qa/vip-ticket-password-sheet-390x844.png`.
- Narrow implementation: `.codex-artifacts/account-wallet-qa/vip-ticket-360x800.png`.
- Focused comparison images: `.codex-artifacts/account-wallet-qa/vip-ticket-source-card-focus.png` and `.codex-artifacts/account-wallet-qa/vip-ticket-implementation-card-focus.png`.
- Viewports: 390 × 844 and 360 × 800 CSS pixels at device scale factor 1.
- Source pixels: 853 × 1844, normalized to 390 × 844 for the full-view comparison. Implementation pixels: 390 × 844. The focused source and implementation crops are both 390 × 260.
- State: active VIP, closed and password-sheet-open.
- Full-view comparison evidence: the normalized source and final implementation were opened together after the last color/position pass. The final card measures 350 × 228 CSS pixels at x=20, y=57, matching the normalized source's approximately 348 × 228 ticket and 21px side gutters. The surrounding account sections retain the established application structure without horizontal overflow.
- Focused comparison evidence: the two ticket crops were opened together at equal pixel size. Avatar and name anchors, VIP title/status, expiry block, mascot emphasis/crop, divider, CTA placement, radius, shadow, and warm left-to-right color balance now follow the selected visual.
- Required fidelity surfaces: typography uses the project's existing family with the source's stronger white hierarchy; spacing matches the normalized ticket dimensions and anchor points; the new generated 20KB WebP supplies the coral/orange wave texture; the existing production Himi asset remains sharp and intentionally cropped; Vietnamese profile, status, expiry, and CTA copy match the account data.

**Interactions and runtime**

- The VIP CTA remains a working `/vip` link and the avatar editor retains its original uploader control.
- The password sheet still opens and closes correctly after the card merge.
- Browser checks at 360px and 390px showed matching document/client widths, no page errors, no framework overlay, and no console errors beyond normal Vite/React development messages.

**Comparison History**

- Initial P1: the mobile active-VIP state was split into a white profile card and a pale outlined membership card, so it did not read as the selected premium orange ticket. Fix: visually merge the two existing semantic sections on mobile and apply a generated raster ticket surface.
- Initial P2: the first merged pass measured 358 × 242 and used a yellow-heavy right edge; it was visibly larger and brighter than the normalized source. Fix: resize to 350 × 228 at 390px, move the top to y=57, shift the background crop toward coral/orange, and align the divider, expiry, CTA, and mascot crop.
- Post-fix evidence: the final focused comparison has matching ticket proportion and placement, readable white hierarchy, a stronger coral/orange balance, and no overlap or overflow at 360px or 390px.

final result: passed

---

# Design QA — Desktop account option 1

**Findings**

- No open P0, P1, or P2 visual defects remain.
- The active-VIP desktop state now follows the selected premium membership-gallery direction: a profile-first hero, a wide saturated ticket, and clean account/security rows.
- The desktop treatment is scoped to active VIP at 1025px and above. Free and pending states are unchanged, while tablet and mobile retain the previously approved responsive structure.
- No horizontal overflow was detected at 1025, 1100, or 1440 CSS pixels; the previously approved 390px mobile ticket also remains overflow-free.

**Evidence**

- Selected source visual truth: `C:/Users/Windows/.codex/generated_images/01a04399-6b54-77d2-8a15-3b97eacdc5ee/exec-ea589f5d-cd5b-4baa-81ee-ff18eb1955dc.png`.
- Source normalized to the comparison viewport: `.codex-artifacts/account-wallet-qa/desktop-option1-source-normalized-1440x1024.png`.
- Final desktop renders: `.codex-artifacts/account-wallet-qa/desktop-option1-1440x1024.png`, `.codex-artifacts/account-wallet-qa/desktop-option1-1100x900.png`, and `.codex-artifacts/account-wallet-qa/desktop-option1-1025x900.png`.
- Mobile regression render: `.codex-artifacts/account-wallet-qa/desktop-option1-mobile-regression-390x844.png`.
- Focused equal-size comparison: `.codex-artifacts/account-wallet-qa/desktop-option1-source-hero-focus.png` and `.codex-artifacts/account-wallet-qa/desktop-option1-implementation-hero-focus.png`.
- Source pixels: 1487 × 1058, normalized to 1440 × 1024. Main implementation comparison: 1440 × 1024 CSS pixels at device scale factor 1.
- State: active VIP with the password dialog closed; interaction QA also covered the open dialog.
- Full-view comparison evidence: the normalized source and implementation were opened in one comparison input. The profile, mascot, 140px membership ticket, information rows, and security rows follow the same hierarchy and vertical anchors while preserving the production application shell.
- Focused comparison evidence: equal-size hero/ticket crops were opened together. Avatar scale, name and verification alignment, mascot emphasis, coral-to-orange textured surface, plan/days/expiry columns, and elevated white CTA align with the chosen direction.
- Required fidelity surfaces: project typography preserves the source hierarchy; hero and ticket spacing use the established responsive container; coral, orange, ivory, and verification-green tokens map to semantic states; the production Himi WebP and generated 20KB ticket texture stay sharp; Vietnamese plan, status, expiry, and CTA copy is driven by the existing account data.

**Interactions and runtime**

- The membership CTA remains a working `/vip` link.
- The existing avatar uploader remains intact.
- The password dialog opens from the security row and closes with Escape.
- Browser checks reported no page errors or framework overlay. Console output contained only normal Vite connection, React DevTools, and CSS hot-reload messages.

**Comparison History**

- Initial P1: the five-column desktop ticket clipped its CTA near 1100px. Fix: introduced a compact 1025–1279px grid and typography treatment; post-fix the CTA remains fully inside the ticket at 1025px and 1100px.
- Initial P2: the mascot competed with identity content at the 1025px desktop edge. Fix: reduced only the mascot at 1025–1079px while retaining the full-size composition on wider screens.
- P3 residual: the concept's decorative side notches and faint beige backdrop circles were not recreated as CSS illustration. The production version keeps the established asset language and all core hierarchy, dimensions, contrast, and interaction fidelity.
- Post-fix evidence: final captures show a complete CTA, separated content/mascot regions, equal viewport/document widths, and an unchanged 350 × 228 mobile VIP ticket at 390px.

final result: passed

---

# Design QA — Desktop VIP ticket fidelity follow-up

**Findings**

- [P1 fixed in code, awaiting rendered confirmation] The previous desktop ticket allocated too much width to the plan block, pushing the remaining-days and expiry groups too far right compared with the selected reference.
- [P2 fixed in code, awaiting rendered confirmation] The previous ticket omitted the calendar icons and source-derived side notches, and its crown medallion and CTA were undersized.
- Typography, copy, coral/orange texture, and white foreground hierarchy remain aligned with the selected source. The revised CSS increases the ticket to 150px, restores the measured column rhythm, and preserves the existing compact desktop and mobile breakpoints.

**Evidence**

- Source visual truth: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-55cd498e-034b-42eb-80fb-a24134693c75.png` and `C:/Users/Windows/.codex/generated_images/01a04399-6b54-77d2-8a15-3b97eacdc5ee/exec-ea589f5d-cd5b-4baa-81ee-ff18eb1955dc.png`.
- Previous implementation screenshot: `.codex-artifacts/account-wallet-qa/desktop-option1-1440x1024.png`.
- User-reported notch defect: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-b437b699-aa84-4bed-a4bd-af407129d993.png`.
- Clarifying target crop: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-a8eb5562-f3f9-452c-9805-c2d9e3a92600.png`.
- Transparent-asset composite check: `.codex-artifacts/account-wallet-qa/notch-clean-texture-composite.png`.
- Source pixels: 503 × 70 for the focused supplied crop and 1487 × 1058 for the full selected concept. Previous implementation pixels: 1440 × 1024 at device scale factor 1.
- State: active VIP, desktop, dialog closed.
- Full-view and focused comparison evidence: the focused source crop, full source, and previous implementation were opened together. The comparison exposed the plan-column drift, missing metadata icons, missing notch assets, and smaller medallion/CTA.
- Image fidelity: the new left/right notch rasters are cropped from the actual selected high-resolution source; no CSS-drawn replacement was introduced.

**Comparison History**

- Previous P1: first divider appeared near 48% of the ticket instead of the reference's roughly 36%. Fix: replace the flexible plan-heavy grid with measured columns and proportional compact tracks.
- Previous P2: remaining-days and expiry blocks lacked their source calendar icons. Fix: add the existing icon-library calendar mark to both metadata groups.
- Previous P2: the desktop frame lacked the reference's side cut-outs. Fix: add source-derived raster notch overlays and increase ticket/medallion/CTA proportions.
- User-reported P2: the first notch crop included source pixels from outside the card, creating a pale vertical strip along the left edge. Fix: recrop both notch rasters from inside the source card boundary and reduce the displayed overlay from 34px to 30px; the replacement assets contain no exterior strip.
- Final clarification: the selected mockup does require the white semicircular cut-outs; the defect was the rectangular red patch surrounding the earlier raster. Fix: replace both patches with source-derived alpha PNGs, leaving only the off-white semicircles opaque. A composite against the production texture shows no rectangular seam.
- Post-fix visual evidence is blocked until the local page is recaptured in a browser. The currently exposed Codex browser control can open the route but cannot capture or inspect it, and direct Playwright use requires user approval under the Product Design browser policy.

**Implementation Checklist**

- [x] Correct ticket proportions and measured column placement.
- [x] Add date icons and seamless transparent side cut-outs matching the mockup.
- [x] Retain compact desktop and mobile breakpoints.
- [x] Pass targeted lint, regression test, and production build.
- [ ] Capture and compare the revised browser render at matching viewport/state.

final result: blocked
