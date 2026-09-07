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

---

# Design QA — HSK picker intro contrast follow-up

**Findings**

- No actionable P0, P1, or P2 issue remains in the annotated introduction block.
- The “Luyện chém từ / Chọn khóa HSK để chơi / Từ vựng…” copy now sits on a warm, nearly opaque paper card, so bamboo and foliage no longer compete with the text.
- Title, kicker, and supporting copy use stronger forest/coral contrast while preserving the approved dojo composition, Himi asset, rules panel, course cards, and interactions.

**Implementation Checklist**

- [x] Preserve the existing responsive split-dojo layout and assets.
- [x] Add a dedicated text surface with product-matched border, radius, and shadow.
- [x] Verify the annotated 674 × 534 viewport and a 430 × 932 phone viewport.
- [x] Confirm the desktop split grid remains active at 1440 × 900.
- [x] Confirm no horizontal overflow and pass the production build.

**Evidence**

- Source visual truth: Browser Comment 1 on `http://localhost:3000/games`, targeting `.writing-course-intro` at 674 × 534.
- Implementation captures: Codex in-app browser `browser 1 / tab 1` at 674 × 534 and 430 × 932; both were emitted during this QA pass.
- Annotated viewport measurement: copy surface `391.84 × 195.80px`, `rgba(255, 253, 248, 0.96)` background, and no horizontal overflow.
- Phone measurement: copy surface `240.55 × 257.05px`; Himi remains visible on the right and the page reports no horizontal overflow.
- Desktop measurement: viewport `1440 × 900`, shell columns `504px 936px`; the approved split composition remains intact.
- Production verification: `npm run build` completed successfully.

**Comparison History**

- User-reported P1: the introduction copy visually merged with the bamboo scene, especially where foliage crossed the title and description. Fix: add a warm paper surface and deepen the text colors without altering content or layout hierarchy.
- Post-fix visual review: all three copy levels are immediately readable, the surface feels native to the cream/mint Himi palette, and mascot overlap remains minimal and intentional on phone widths.

final result: passed

## 2026-09-07 — Completed-conversation thank-you copy

**Source visual truth**

- `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-9072b9ff-6820-4de9-889e-c3ab125400f0.png`
- Source pixels: 419 × 160.
- Requested target: preserve the system-message presentation and replace its body with `Cảm ơn anh/chị đã dành thời gian liên hệ!`.

**Implementation evidence**

- Codex in-app browser at `http://localhost:3000/`, 740 × 706 CSS px.
- The completed-state message was rendered with the production assistant-message classes and captured inline through CUA; the capture API did not provide a persistent filesystem path.
- Temporary QA-only markup was removed immediately after capture; the persisted implementation is the service-generated system message.

**Comparison and fidelity**

- Full view: support panel placement, message rail, composer, and surrounding page remain unchanged.
- Focused region: the `Hệ thống` label, bot avatar, bubble color, radius, padding, typography, and wrapping match the existing component; only the requested body copy changed.
- No image assets or color/layout tokens changed.
- The new Vietnamese sentence wraps cleanly inside the existing bubble with no clipping or overflow.
- No actionable P0, P1, or P2 differences remain.

**Comparison history**

1. Initial copy mismatch: completion produced the previous 60-second explanatory sentence.
2. Fix: replaced the service-generated message body with the requested thank-you sentence.
3. Post-fix evidence: the in-app browser renders the requested sentence in the unchanged system bubble.

**Checks**

- [x] Requested text appears in the service response.
- [x] Previous sentence is absent from production source.
- [x] Focused ESLint passes.
- [x] Support test suite passes: 19/19.
- [x] Temporary visual-QA markup removed.

final result: passed

---

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

# Chatbot Widget Design QA

**Source visual truth**

- `C:\Users\DELL\AppData\Local\Temp\codex-clipboard-9431caf7-3c00-4677-8fe0-5e346cbfdeee.png`
- Source pixels: 441 × 658.
- The source was normalized to 390 px wide for the focused comparison.

**Implementation evidence**

- Full desktop, launcher: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\artifacts\design-qa\chatbot-implementation-desktop-closed.png`
- Full desktop, open: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\artifacts\design-qa\chatbot-implementation-desktop-open.png`
- Full desktop, conversation: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\artifacts\design-qa\chatbot-implementation-desktop-conversation.png`
- Full mobile, open: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\artifacts\design-qa\chatbot-implementation-mobile-open.png`
- Focused side-by-side comparison: `D:\Code\HiMi\Hanzi-work-lab-nextjs-web-app\artifacts\design-qa\chatbot-reference-implementation-comparison.png`
- Desktop viewport: 1440 × 1000 CSS px at device scale factor 1; panel crop: 390 × 620 px.
- Mobile viewport: 390 × 844 CSS px at device scale factor 1; panel: 366 × 620 px.
- State: launcher closed; panel open with greeting; user message submitted; assistant reply completed; panel closed with Escape.

**Full-view comparison evidence**

- The implementation preserves the source structure: fixed bottom-right launcher, colored header, assistant avatar and bubble, right-aligned user messages, typing/reply state, and fixed composer.
- Desktop placement leaves 24 px from the right and bottom edges. Mobile placement leaves a 10 px visual gap above the 66 px learner navigation, with no overlap.
- The Himi adaptation intentionally replaces the source purple with brand red `#FF4C3B`, adds orange `#FF8E2D` accents, and uses the existing Himi mascot asset.

**Focused region comparison evidence**

- The focused comparison places the normalized source and the exact 390 × 620 implementation panel crop in one image.
- Header hierarchy, message alignment, avatar placement, composer geometry, border radii, and visual density were readable at this scale; no extra focused crops were needed.

**Required fidelity surfaces**

- Fonts and typography: uses the site's Inter variable first, with Arial fallback; weights, Vietnamese diacritics, hierarchy, wrapping, and input text remain legible at desktop and mobile sizes. The local Vinext server reports pre-existing `file://` font load warnings, so QA screenshots use the configured fallback without layout shifts.
- Spacing and layout rhythm: panel, header, message rail, suggestion chips, and composer follow a consistent 8–18 px rhythm. The mobile panel is deliberately taller than the normalized reference to preserve useful conversation space while clearing persistent navigation.
- Colors and visual tokens: all chatbot surfaces map to the current Himi red, orange, black, white, muted, line, soft-red, and soft-orange tokens. Contrast remains clear for header text, user messages, buttons, and disabled states.
- Image quality and asset fidelity: all bot avatars reuse `/assets/brand/himi-mascot-icon.png` through the existing Next Image component. No placeholder, CSS-drawn logo, or custom SVG asset is used.
- Copy and content: English placeholder text from the reference is replaced with concise Vietnamese support copy and HSK-relevant quick questions. Sent messages and canned assistant replies render correctly.

**Findings**

- No actionable P0, P1, or P2 visual differences remain.
- [P3] Local font asset warnings are emitted by the existing Vinext/next-font development runtime. They do not create an error overlay or break the widget and are outside this component change.

**Open Questions**

- The current scope provides realistic local replies and attachment selection UI. Connecting the composer to a production chatbot API, persistence, or file upload service remains a separate backend task.

**Comparison History**

1. Initial pass: found a P2 keyboard-focus issue. Pressing Escape closed the panel, but focus remained on `BODY` because the launcher was still hidden during the immediate focus attempt.
2. Fix: delayed focus restoration until the close transition exposes the launcher.
3. Post-fix evidence: panel visibility is `hidden` and the focused control is `Mở trợ lý Himi`. Open-state autofocus targets `Nhập tin nhắn`.

**Primary interactions tested**

- Open launcher and autofocus composer.
- Enter and submit a Vietnamese HSK question.
- Show assistant response after the thinking state.
- Close with Escape and restore focus to the launcher.
- Render at 390 × 844 without overlapping the learner mobile navigation.
- Checked for framework error overlays: none present.
- Checked browser logs: only the pre-existing local font asset warnings described above.

**Implementation Checklist**

- [x] Brand-aligned launcher and panel.
- [x] Open, close, Escape, and focus states.
- [x] Message submission, thinking, and response states.
- [x] Quick prompts and attachment selection.
- [x] Desktop and mobile responsive positioning.
- [x] Reduced-motion behavior.
- [x] Production build and targeted lint.

**Follow-up Polish**

- Resolve the project's Vinext development font URL warnings if exact Inter rendering is required in local QA captures.

final result: passed
## 2026-09-07 — Telegram support widget

- Giữ launcher góc phải, mascot và màu thương hiệu; mở rộng form tên/email, composer ảnh, selector hội thoại, status và message bubbles.
- Desktop 1366×900 và mobile 390×844 trên localhost:3000/terms; lượt chụp mobile cuối dùng server QA localhost:4175/terms. Mobile panel x=12, width=366, bottom=760; không tràn viewport hay chạm bottom navigation.
- Browser fixture chỉ ghi trong bộ nhớ tab, không gọi API support/Telegram thật. Đã kiểm tra gửi đúng một request, phản hồi ADMIN qua polling, COMPLETED ẩn tin theo completedAt, giữ fixture history và gửi tiếp mở lại OPEN.
- Ảnh: artifacts/design-qa/support-telegram-desktop-form.png; artifacts/design-qa/support-telegram-mobile-conversation.png.
- Sửa trong quá trình QA: input type=text để nhận đúng CSS, composer ba cột sau khi bỏ nút lời chào giả, grid panel bốn hàng khi có toolbar, xóa báo mất kết nối sau recovery; avatar tin nhắn dùng icon bot vector để tránh lỗi ảnh nhỏ, mascot ở header/launcher giữ nguyên.
- Kết quả UI: passed trên phạm vi fixture; kết quả tích hợp live Telegram: pending configuration/E2E. Không dùng ảnh QA để chứng minh Telegram thật đã nhận tin.

---

## 2026-09-07 — Support user bubble width regression

**Source visual truth**

- Browser Comment 1 marker screenshot; the annotation system did not expose a local source path.
- Viewport: 740 × 706 CSS px.
- State: support panel open; the short user message `alo` collapsed into a one-character-per-line column at the right edge.

**Implementation evidence**

- Codex in-app browser, `http://localhost:3000/`, at the same narrow desktop viewport.
- Inline CUA screenshot captured after CSS HMR. CUA displayed the screenshot inline but did not persist a filesystem path.
- A temporary DOM-equivalent user message rendered the production classes for visual inspection and was removed before handoff; no API, database, or Telegram data was changed.

**Comparison and fidelity**

- Full view: panel position, message alignment, spacing, and composer layout remain unchanged.
- Focused region: the red user bubble now has a 72 px minimum width; `Bạn` and `alo` render horizontally instead of one character per line.
- `width: fit-content` keeps short bubbles compact, while `max-width: 100%` preserves wrapping for longer messages.
- Typography, copy, colors, radius, and existing assets are unchanged.
- No actionable P0, P1, or P2 visual differences remain.

**Comparison history**

1. Initial P1: the shared `max-width: calc(100% - 44px)` interacted with the avatar-free user row's shrink-to-fit sizing and collapsed short content to its minimum width.
2. Fix: gave user bubbles explicit intrinsic sizing, a 72 px floor, and a container-safe maximum.
3. Post-fix: `Bạn` and `alo` render on normal horizontal lines at the original right alignment; the temporary QA markup was removed.

**Checks**

- [x] Short user message remains readable.
- [x] Long-message wrapping remains bounded by the message row.
- [x] Production TSX restored after visual QA.
- [x] Focused lint passes.

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

---

# Design QA — HSK course picker option 2

**Findings**

- No actionable P0, P1, or P2 issue remains in the selected HSK course picker.
- The desktop composition follows the chosen split-dojo mockup: Himi, title, rules, and exit action stay in the left scene while the six HSK choices use a two-column grid on the right.
- HSK 1 is visibly prioritized with the coral border, recommendation badge, and primary action; HSK 2–6 retain equal visual weight and clear selection affordances.
- Responsive behavior preserves the same hierarchy rather than shrinking the desktop frame: tablet uses a compact hero plus two-column level grid, while phones use one full-width level card per row.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Recreate selected option 2 using the existing Himi slicing asset and bamboo-garden raster scene.
- [x] Preserve the existing HSK loading, error, course selection, and return-to-picker behavior.
- [x] Keep all primary touch targets at least 42px and provide visible focus styles.
- [x] Verify 1440 × 1024, 768 × 1024, 430 × 932, and 320 × 568 responsive states.
- [x] Test HSK 1 selection and the “Đổi khóa HSK” return path.
- [x] Check the rendered browser console and framework overlay.

**Follow-up Polish**

- P3: the production bamboo landscape is more detailed than the softer abstract background in the ImageGen mockup. This is intentional because it reuses the approved project-bound game scene and keeps the new screen visually connected to the actual slicing game.

**Evidence**

- Source visual truth path: `C:/Users/Windows/.codex/generated_images/01a04399-6b54-77d2-8a15-3b97eacdc5ee/exec-b291b811-ff03-4759-b38a-8c520c160458.png`.
- Implementation screenshot: Codex in-app browser `browser 1 / tab 1`; desktop, tablet, 430px phone, 320px phone, and scrolled phone captures were emitted during this QA pass. The browser surface did not expose a filesystem screenshot path.
- Route: `http://localhost:3000/games`, with the “Luyện chém từ” course picker open.
- Source pixels: 1487 × 1058. Primary implementation comparison: 1440 × 1024 CSS pixels at device scale factor 1; phone comparisons: 430 × 932 and 320 × 568 CSS pixels at device scale factor 1.
- State: course picker idle; interaction checks also covered HSK 1 loading/entry and returning from the active game.
- Full-view comparison evidence: the source and rendered captures were reviewed in the same task context at matched desktop aspect ratios. Left/right proportions, title hierarchy, mascot placement, six-card ordering, HSK 1 emphasis, cream/mint/coral palette, radii, and shadows follow the selected direction.
- Focused comparison evidence: browser layout measurements at 1440px showed a 504px introduction panel and 936px picker panel; the six cards render as two 396px columns. At 430px the introduction becomes a 420px banner and all six 392px cards form one column with no horizontal overflow.
- Required fidelity surfaces: Roboto renders all Vietnamese copy; spacing follows the 12/18/24/32px product rhythm; colors map to forest, mint, cream, and Himi coral tokens; the transparent `himi-v2-slice.webp` asset remains sharp and correctly cropped; all HSK descriptions and action copy match the existing course data.
- Primary interactions tested: open the course picker, choose HSK 1, load the slicing session, return via “Đổi khóa HSK,” and scroll through HSK 2–6 on mobile.
- Console errors checked: no warnings or errors were reported in the final browser run.

**Comparison History**

- Initial P2 risk: the old selector used a generic centered 3 × 2 grid and did not preserve the visual story or CTA hierarchy of option 2. Fix: introduced the split hero/picker composition and a featured HSK 1 card.
- Initial P2 responsive risk: directly shrinking the desktop split would leave narrow cards and an oversized hero on phones. Fix: stack the hero at 920px, keep two columns for tablet, and switch to one column at 700px with compact card/action sizing.
- Post-fix evidence: DOM measurements report equal viewport/document widths at 320px and 430px, six unique course buttons, and no clipped text or controls; the real course-selection round trip succeeds.

final result: passed

---

# Design QA — Reduce framing in HSK picker intro

**Findings**

- No actionable P0, P1, or P2 issue remains in the scoped intro treatment.
- The extra rounded paper card introduced in the previous iteration has been removed. Kicker, title, and description now sit directly on the illustrated scene, restoring a more editorial and less component-heavy composition.
- Readability remains strong because the bamboo garden crop now places its quiet cream field behind the copy instead of placing dense bamboo over it.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Remove background, border, radius, shadow, and padding from `.writing-course-copy`.
- [x] Reposition the existing bamboo garden background at desktop and stacked breakpoints.
- [x] Preserve Himi, copy, rules strip, HSK cards, routes, and interactions.
- [x] Verify laptop and phone breakpoints without horizontal overflow.
- [x] Pass the production build and browser-console check.

**Required Fidelity Surfaces**

- Typography: Roboto hierarchy, weights, line heights, and Vietnamese copy remain unchanged.
- Spacing: removing inner card padding shortens the intro block without altering the section grid or rules strip.
- Colors: existing forest/coral text tokens remain readable on the source cream background.
- Image quality: the approved bamboo garden and Himi raster assets remain unchanged; only their responsive crop is adjusted.
- Copy: all existing labels and HSK descriptions are preserved verbatim.

**Evidence**

- Source visual truth: the live pre-fix `/games` capture at 674 × 534 showing the newly added rounded paper card, together with the user's instruction to reduce visible framing.
- Implementation capture: Codex in-app browser `browser 1 / tab 1` at 674 × 534 after reopening the HSK picker; a 430 × 932 phone capture was also emitted.
- Desktop measurement: viewport `1440 × 900`, shell columns `504px 936px`, transparent copy surface, zero border, zero shadow, zero padding, and no horizontal overflow.
- Phone measurement: viewport `430 × 932`, document width `420px`, transparent copy surface, zero border/shadow/padding, and no horizontal overflow.
- State: HSK picker idle with HSK 1 featured.
- Full-view comparison: the before/after captures show one fewer framed surface above the fold while preserving the approved split-dojo hierarchy.
- Focused comparison was not needed because the complete intro region and all frame boundaries are legible in the full-view captures.
- Production verification: `npm run build` completed successfully; the existing bundle-size advisory remains non-blocking.

**Comparison History**

- Earlier P1: copy merged into bamboo foliage. First fix added a rounded paper card, which solved contrast but introduced excessive framing.
- User-reported P2: the added card made the screen feel box-heavy and AI-generated. Final fix removes that card and shifts the existing background crop so the copy occupies the quiet cream field.
- Post-fix visual evidence: at 674px the title and description remain distinct while the hero reads as one continuous scene; at 430px the composition stays compact and overflow-free.

final result: passed

---

# Design QA — Remove HSK picker supporting description

**Findings**

- No actionable P0, P1, or P2 issue remains in the annotated copy area.
- The selected supporting sentence has been removed from the component, not merely hidden at one breakpoint, so desktop and mobile now share the same simplified hierarchy.
- The resulting space improves separation between the title and Himi without changing the illustration, facts strip, HSK cards, or navigation.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Remove the annotated paragraph from `writing-slice-game.tsx`.
- [x] Remove its unused desktop and mobile CSS rules.
- [x] Confirm the sentence is absent from the rendered DOM.
- [x] Verify the 1440 × 900 and 430 × 932 states without horizontal overflow.
- [x] Pass targeted ESLint and the production build.

**Required Fidelity Surfaces**

- Typography: the kicker and display heading retain their existing Roboto hierarchy and wrapping.
- Spacing: the copy block contracts naturally; no artificial spacer replaces the removed paragraph.
- Colors: forest heading and coral kicker tokens are unchanged.
- Image quality: the existing Himi and bamboo garden raster assets remain untouched and correctly cropped.
- Copy: only the user-selected supporting sentence is removed; all course labels and descriptions remain intact.

**Evidence**

- Source visual truth: Browser Comment 1 marker screenshot at 1440 × 900, targeting `.writing-course-copy > p` on `http://localhost:3000/games`.
- Implementation capture: Codex in-app browser `browser 1 / tab 1`, HSK picker idle at 1440 × 900 after the scoped removal; a 430 × 932 responsive capture was also emitted.
- DOM verification: `.writing-course-copy p` count is `0` and the removed sentence is absent from `document.body.innerText`.
- Phone measurement: viewport `430 × 932`; title ends at `198.8px`, Himi remains visible on the right, and no horizontal overflow is present.
- Full-view comparison: the post-fix desktop capture preserves the split-dojo layout while removing exactly the blue-marked line.
- Focused comparison was not needed because the selected paragraph and resulting whitespace are clearly visible in the full desktop capture.
- Primary interaction checked: reopening the HSK picker from “Tiếp tục chơi” still works.
- Production verification: `npx eslint components/writing-slice-game.tsx` and `npm run build` both completed successfully.

**Comparison History**

- User-reported P2: the supporting sentence added visual noise below the large title. Fix: delete the paragraph from the shared component and remove its dead responsive CSS.
- Post-fix evidence: the desktop capture shows the title flowing directly into the Himi composition; the phone DOM check confirms the same removal with no overflow.

final result: passed

---

# Design QA — Game-name label typography correction

**Findings**

- No actionable P0, P1, or P2 issue remains in the game-name labels.
- Game names are retained on both the custom “Luyện chém từ” selector and the shared selectors used by the other six games.
- The labels now use the same Roboto family, `760` weight, and compact negative tracking as “Chọn khóa HSK để chơi”; their smaller size and coral/forest color preserve hierarchy.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Restore “Luyện chém từ” in title case instead of the previous all-caps treatment.
- [x] Restore the dynamic game title in `HskGameSession` for all other games.
- [x] Pass the selected game title through `GameCenter` again.
- [x] Unify label and heading font family, weight, and tracking.
- [x] Verify desktop and 430px phone states without horizontal overflow.
- [x] Pass targeted ESLint and the production build.

**Required Fidelity Surfaces**

- Typography: label and heading resolve to the same Roboto stack, `760` weight, and `-0.035em` tracking; label size remains intentionally subordinate.
- Spacing: the label adds a compact pre-heading cue without restoring the removed supporting paragraph or a new frame.
- Colors: the split selector keeps Himi coral for the game label, while shared selectors use the existing forest text token.
- Image quality: Himi and bamboo garden assets remain unchanged.
- Copy: all seven game names come from their existing catalog titles; “Luyện chém từ” uses natural title case.

**Evidence**

- Source visual truth: Browser Comment 1 at 1440 × 900 targeting `.writing-course-kicker`, followed by the user's correction to retain names and match the heading font.
- Implementation captures: Codex in-app browser `browser 1 / tab 1`; split selector desktop capture, shared “Ghép cặp siêu tốc” selector capture, and 430 × 932 split-selector capture were emitted during this QA pass.
- Split selector measurement: label and heading both resolve to `Roboto, sans-serif, Roboto, Arial, sans-serif`, weight `760`; no horizontal overflow.
- Shared selector measurement: “Ghép cặp siêu tốc” and “Chọn khóa HSK để chơi” both resolve to the same Roboto stack and weight `760`; no horizontal overflow.
- Phone measurement: viewport `430 × 932`; label renders at `15px`, heading at `40.888px`, both weight `760`, with no horizontal overflow.
- State: HSK picker idle with HSK 1 featured; shared picker idle after entering “Ghép cặp siêu tốc.”
- Full-view comparison: the restored title-case label reads as part of the same typographic system while remaining clearly secondary to the course-selection heading.
- Focused comparison: computed font-family, weight, and letter-spacing were checked directly for both label and heading in the split and shared selector implementations.
- Primary interactions checked: enter the slice picker, return to the game map, enter the memory-game picker, and verify the shared title path.
- Production verification: targeted ESLint and `npm run build` completed successfully; the existing bundle-size advisory remains non-blocking.

**Comparison History**

- Initial P2: the all-caps, widely tracked “LUYỆN CHÉM TỪ” label felt typographically disconnected from the heading.
- Interim interpretation removed the repeated labels across selectors. The user clarified that the labels should remain.
- Final fix restores every label in title case and aligns its family, weight, and tracking with the heading while preserving a smaller size for hierarchy.
- Post-fix evidence: desktop, shared-selector, and phone captures show consistent typography with no wrapping or overflow regression.

final result: passed
