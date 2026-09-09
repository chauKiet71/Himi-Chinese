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

## 2026-09-08 — Compact branded chat launcher

**Source visual truth**

- Browser Comment 1 marker screenshot of the existing `button.himi-chatbot-launcher` and its additional inline chat-notification icon reference; the browser annotation did not expose a local filesystem path.
- Reference icon pixels: 563 × 641. Existing-page marker screenshot pixels: 922 × 882.
- Intended state: chatbot closed, floating launcher visible at the lower-right edge.

**Implementation evidence**

- Implementation: `http://localhost:3001/courses`, authenticated learner view.
- Implementation screenshot: Codex in-app Browser closed-state capture emitted inline; the capture API did not expose a filesystem path.
- Viewport: 740 × 706 CSS px at device pixel ratio 1.25.
- Rendered launcher: 64 × 64 CSS px; notification dot: 19 × 19 CSS px.
- Density normalization: the source is a standalone raster icon on a white canvas while the implementation is a live UI control. The focused comparison normalizes by the launcher silhouette, icon-to-container ratio, badge placement, corner radius, and color hierarchy rather than canvas dimensions.

**Full-view comparison evidence**

- The previous 190 × 68 mascot-and-copy launcher has been replaced by a compact icon-only control, reducing obstruction of page content and matching the reference's notification-button role.
- The control remains anchored to the existing lower-right widget position and clears the learner navigation behavior already defined for small screens.

**Focused region comparison evidence**

- The live closed-state capture clearly shows the 64 px red rounded-square control, centered white chat glyph, and orange circular badge with a white separation ring at the top-right corner.
- The icon uses the project's installed Lucide library rather than a CSS drawing, text glyph, emoji, traced SVG, or copied watermarked raster.
- Open-state verification confirms that activating the icon hides the launcher and reveals the existing support panel; Escape closes the panel and restores the launcher after its transition.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- The reference's blue and red palette is intentionally remapped to Himi red `#ff4c3b`, orange `#ff8e2d`, and white.
- The badge is a non-numeric notification dot to avoid presenting a false unread count when the application does not currently expose unread-message state.

**Comparison history**

1. Initial P1: the existing launcher was a wide branded box with mascot and two lines of copy, which did not match the requested compact icon form and covered more content.
2. Fix: replaced the launcher contents with `MessageSquareMore`, reduced the control to 64 × 64 px, introduced the orange/white notification dot, and added a visible keyboard-focus ring.
3. Post-fix evidence: the browser capture shows the intended compact silhouette and brand palette; computed dimensions resolve to exactly 64 × 64 px and 19 × 19 px after the close transition.

**Required fidelity surfaces**

- Fonts and typography: no visible launcher text remains; the accessible name `Mở trợ lý Himi` is preserved for assistive technology.
- Spacing and layout rhythm: centered 34 px glyph, 20 px launcher radius, top-right 19 px badge, and existing responsive fixed positioning create the same visual hierarchy as the reference without crowding nearby content.
- Colors and visual tokens: launcher, hover shadow, focus ring, and badge use the current Himi red, orange, white, and black tokens.
- Image quality and asset fidelity: no raster asset was required because the target is a standard chat UI icon; the installed icon library provides a crisp vector at every density. The watermarked reference image was not copied into the product.
- Copy and content: visible promotional copy and mascot were removed only from the closed launcher; the support panel header and conversation content are unchanged.

**Primary interactions tested**

- Activate the icon and open the support panel.
- Confirm the icon becomes hidden while the panel is open.
- Close with Escape and confirm the icon returns after the transition.
- Confirm the composer remains available in the opened panel.
- Confirm no framework error overlay and no broken images.

**Implementation checklist**

- [x] Replace the wide launcher with an icon-only control.
- [x] Use a real icon-library glyph.
- [x] Apply Himi red/orange brand styling.
- [x] Preserve accessible labeling and open/close behavior.
- [x] Preserve responsive placement.

**Follow-up polish**

- P3: connect the badge to a true unread count if the support API later exposes unread-message state.

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

---

## 2026-09-08 — Branded support conversation redesign


**Comparison Target**

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-6f7d35a8-2960-441d-ba58-aa5af5d82d03.png`
- Source dimensions: 356 × 281 px.
- Implementation: `http://localhost:3001/courses`, chatbot open with an authenticated conversation.
- Implementation screenshot: Codex in-app Browser capture from the open localhost tab (inline browser evidence; no filesystem path exposed by the capture API).
- Browser viewport: 740 × 706 CSS px at device pixel ratio 1.25; chatbot panel: 388 × 618 CSS px.
- State: light theme, existing conversation with user and system messages, composer visible.
- Normalization: the source is a cropped message-area style reference rather than a full application viewport. Comparison therefore uses the chatbot message region and evaluates relative alignment, bubble proportions, spacing, palette, and hierarchy rather than absolute page coordinates.

**Full-view Comparison Evidence**

- The implementation preserves the reference's primary composition: compact user pills aligned right and a wider support card aligned left with a circular identity mark.
- The pale source surface is translated to Himi's warm cream background; the blue-purple source accent is intentionally remapped to the product's red/coral and orange brand colors.
- The chatbot header and composer remain product-owned framing around the recreated message treatment.

**Focused Region Comparison Evidence**

- The message region was inspected at readable scale in the live browser. Short content (`alooo`) and longer content (`Tôi bị lỗi đăng nhập`) both render horizontally inside compact right-aligned pills.
- System responses render in wide cream cards with the Himi mascot offset to the left, matching the source avatar-plus-card relationship.
- Attachment styling was checked in code and uses a white inset media card inside the message bubble; no placeholder or recreated brand asset is used.

**Findings**

- No remaining P0, P1, or P2 visual mismatch.
- The centered live support status above the messages differs from the cropped reference but is an intentional functional element and does not compete with the conversation hierarchy.
- Sender labels are retained as a small product-specific affordance; their size and contrast keep them subordinate to message content.

**Comparison History**

- Iteration 1 — P2: very short user messages inherited a nested `fit-content` layout and could become too narrow. Fix: made the user row auto-width and its bubble/content `max-content` within a 78% responsive cap. Post-fix evidence: the live browser capture shows both short and long user messages with natural horizontal wrapping and no vertical-letter stack.
- Iteration 2 — passed: live capture shows branded message hierarchy, stable composer placement, no broken images, no framework error overlay, and no toolbar regression.

**Required Fidelity Surfaces**

- Fonts and typography: existing Inter family retained; message text uses 12.5 px/1.55 for readability, compact 9.5 px sender labels, and no clipping or unintended vertical wrapping.
- Spacing and layout rhythm: 18 px message rhythm, 9 px avatar gap, compact user padding, wider support-card padding, rounded corners, and restrained elevation reproduce the source density within the narrower product panel.
- Colors and visual tokens: Himi red `#ff4c3b`, orange `#ff8e2d`, black, warm cream, and locally scoped neutral tokens replace the source blue-purple palette while preserving contrast and semantic separation.
- Image quality and asset fidelity: the existing production Himi mascot asset is used for support avatars. Attachment images remain real uploaded assets and are shown uncropped inside a white media card.
- Copy and content: conversation content is unchanged; only presentation changed.

**Primary Interactions Tested**

- Open chatbot from the launcher.
- Existing conversation renders and scrolls.
- Composer, attachment button, and send control remain visible.
- No Next/Vite error overlay; zero broken images in the rendered page.

**Implementation Checklist**

- [x] Right-align compact branded user pills.
- [x] Left-align wide Himi response cards with mascot identity.
- [x] Style uploaded images as inset media cards.
- [x] Preserve responsive width caps and readable wrapping.
- [x] Preserve existing conversation and composer behavior.

**Follow-up Polish**

- P3: consider adding timestamps only if support operations require them; omitting them keeps the visual closer to the supplied reference.

final result: passed

---

# Design QA — Himi support widget

- Date: 2026-09-10
- Source visual truth: `C:\Users\Windows\.codex\generated_images\019fb6fe-431e-7c62-917c-2abef5ccee3c\exec-f9024eee-c1eb-4253-9e0c-6d89e2d1ad9c.png`
- Browser-rendered implementation: `C:\Users\Windows\Documents\INDIVIDUAL PROJECT\Himi-Chinese\tmp\himi-support-production-full.jpg`
- Focused widget capture: `C:\Users\Windows\Documents\INDIVIDUAL PROJECT\Himi-Chinese\tmp\himi-support-production-widget.png`
- Route: `http://localhost:3010/`
- State: authenticated learner, support panel open, real conversation loaded, composer empty

## Capture normalization

- Source pixels: 943 × 1668. The ideation brief defined a natural component target of approximately 430 × 760 CSS px.
- Browser viewport: 934 × 698 CSS px at device pixel ratio 1.25.
- Rendered panel: 420 × 650 CSS px. The height is intentionally clamped by the available viewport; the unconstrained desktop maximum remains 720 px.
- The production screenshot fills the 934 × 698 browser canvas. The focused widget crop was extracted directly at 420 × 650 pixels for a 1:1 CSS-size comparison.

## Full-view comparison evidence

The source visual and the production screenshot were opened together in one comparison input. The implementation preserves the selected direction: solid coral header, warm off-white body, circular Himi presence marker, compact online/response status, left/right message hierarchy, quiet timestamps, round attachment control, and circular send action. The production capture uses the learner's real support history rather than the mock conversation, so message count and wrapping differ intentionally.

## Focused region comparison evidence

The source visual and direct 420 × 650 widget crop were opened together in one comparison input. Header height, 24 px panel radius, 46 px brand avatar, 44 px collapse/send controls, solid user bubbles, warm staff bubbles, sender labels, timestamps, and bottom composer all follow the selected visual system. Text remains readable at the smaller height without clipping persistent controls.

## Required fidelity surfaces

- Fonts and typography: existing Inter product font retained; Vietnamese diacritics render correctly; title, metadata, message, timestamp, and placeholder weights remain clearly separated.
- Spacing and layout rhythm: consistent 16–20 px interior spacing; message groups retain breathing room; the composer remains pinned without covering conversation content.
- Colors and visual tokens: existing Himi coral, orange, charcoal, warm white, and green presence colors are reused; no new gradient was introduced.
- Image quality and assets: the existing Himi brand asset is reused for header and staff avatars; no placeholder, emoji, CSS illustration, or handcrafted SVG replaces it.
- Copy and content: human-support wording is preserved, response expectation is concise, and real conversation content is not replaced by mock data.

## Comparison history

- Earlier P2: the global input focus style produced a rectangular coral ring inside the rounded composer, which visibly diverged from the selected mock.
- Fix: the chat input now explicitly clears inherited outline and box-shadow while the outer composer shell owns the accessible focus treatment.
- Post-fix evidence: `tmp/himi-support-production-full.jpg` and `tmp/himi-support-production-widget.png` show one clean rounded focus surface with no inner rectangle.

## Interaction and runtime checks

- Opened the widget from the launcher and closed it with Escape.
- Confirmed focus returns to the launcher after closing.
- Reopened the panel and confirmed the draft remains intact.
- Confirmed entering text enables the send action, then cleared the test draft without submitting.
- Verified production support endpoints returned 200 responses and browser console inspection showed no errors.
- Computed transitions use 180–220 ms durations with `cubic-bezier(.22, 1, .36, 1)` for transform motion. Active states compress gently and `prefers-reduced-motion` reduces animation to 1 ms.
- Responsive rules remain in place for widths at 720 px, 390 px, and short mobile heights, including safe-area and bottom-navigation clearance.

## Findings

No actionable P0, P1, or P2 differences remain. The shorter captured panel height is expected responsive behavior for the 698 px-tall browser viewport, not a layout defect.

## Follow-up polish

- P3: a future visual-only pass could tune bubble density against longer production conversations, but no change is needed for this handoff.

final result: passed
