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
