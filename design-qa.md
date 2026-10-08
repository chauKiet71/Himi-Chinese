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

# Design QA — Thanh HUD trò chơi chém từ (2026-10-06)

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-ae8e7073-f305-49b5-a910-2ae7a4e677cb.png` (1424 × 86 px), thể hiện trạng thái HUD trước khi làm đẹp.
- Implementation: `http://localhost:3001/games`.
- Implementation screenshot path: ảnh chụp trực tiếp trong Codex in-app Browser ở lượt này; API chụp trình duyệt không cung cấp đường dẫn tệp cục bộ.
- Desktop evidence: viewport 1560 × 1189 CSS px, vùng HUD được kiểm tra ở 1560 × 115 px.
- Responsive evidence: viewport override 390 × 844, trình duyệt báo content viewport 520 × 1125 CSS px theo mật độ hiển thị của thiết bị; vùng HUD được kiểm tra ở 520 × 135 px.
- State: trò chơi đang tạm dừng, lượt 1, ba tim, điểm và số từ đã chém đều bằng 0.

## Full-view comparison evidence

- Ảnh nguồn và bản triển khai sau chỉnh sửa được mở trong cùng một lượt QA. Nội dung, thứ tự và chức năng của HUD được giữ nguyên; thay đổi chỉ làm rõ nhóm điều khiển, lượt chơi, số tim và thống kê.
- Desktop dùng ba cụm cân bằng: hai nút 46px bên trái, pill lượt chơi nằm đúng tâm tuyệt đối, và cụm tim + thống kê ở bên phải. Kiểm tra hình học xác nhận không có phần tử HUD nào chồng lấn.
- Mobile giữ nút quay lại/tạm dừng trên cùng, thống kê ở góc phải và chuyển tim xuống một hàng nhỏ bên dưới; ảnh chụp xác nhận không tràn ngang hoặc che nội dung mục tiêu.

## Focused region comparison evidence

- Fonts and typography: giữ nguyên font dự án; nhãn 8–10px vẫn đọc được, số thống kê dùng màu đỏ thương hiệu để tăng thứ bậc, pill `LƯỢT 1` có tracking và trọng lượng đồng nhất.
- Spacing and layout rhythm: back/pause cùng kích thước và radius; lượt chơi căn chính xác tại 50%; tim cách cụm thống kê 8px; hai chỉ số dùng một capsule phân đoạn thay vì hai hộp rời.
- Colors and visual tokens: dùng `--himi-white`, `--himi-red`, `--himi-red-soft`, `--himi-line` và nền kính mờ 88%, nhất quán với giao diện Himi hiện có.
- Image quality and asset fidelity: hình nền tre và toàn bộ asset trò chơi được giữ nguyên; không thêm placeholder, CSS art hoặc raster asset mới.
- Copy and content: `LƯỢT`, `ĐÃ CHÉM`, `ĐIỂM` và trạng thái ba tim được giữ nguyên; aria-label của các điều khiển không đổi.

## Findings and comparison history

1. Baseline P2: pill lượt chơi lệch khỏi tâm vì grid có padding trái/phải không cân, còn tim và hai thẻ thống kê trông như các phần tử rời rạc.
2. Fix: chuyển topline sang lớp HUD tuyệt đối, căn lượt chơi bằng `left: 50%` + `translate`, gom hai thống kê thành capsule phân đoạn và cho các điều khiển dùng cùng surface/radius/shadow.
3. Responsive P2: nếu giữ vị trí desktop, tim có thể cạnh tranh không gian với thống kê trên màn hình hẹp.
4. Fix: ở mobile, tim chuyển xuống dưới cụm thống kê, trong khi hai nút trái vẫn giữ vùng chạm 44px.
5. Post-fix evidence: desktop không có overlap; mobile không có overlap/tràn ngang; browser console không có warning/error.

## Verification

- Focused slice-game test: passed.
- `git diff --check`: passed.
- Desktop and responsive browser captures: passed.
- Browser console warnings/errors: none.
- Primary controls and their accessible names remain present.

Không còn P0, P1 hoặc P2 có thể hành động trong phạm vi thanh HUD này.

final result: passed

# Design QA — Form hoàn thành bài học ngành nghề

- Source visual truth: ảnh tham chiếu người dùng đính kèm trong Browser Comment 1 (ảnh 732 × 582 px; tệp nguồn không được trình duyệt cung cấp đường dẫn cục bộ), thể hiện modal hoàn thành nền trắng với cúp vàng, ba ô thống kê và hai hành động.
- Implementation URL: `http://localhost:3001/learn/nha-may-san-xuat?lesson=xac-nhan-quy-trinh-van-hanh`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the screenshot API did not expose a filesystem path.
- Desktop implementation capture: viewport 1545 × 901 CSS px; completion card 664 × 500.5 CSS px at x=440.8, y=200.4.
- Responsive implementation capture: viewport reported as 520 × 1125 CSS px after the mobile override; completion card 492.5 × 635.5 CSS px at x=14, y=244.9.
- State: authenticated, completed lesson `Xác nhận quy trình vận hành` with the next lesson available.

## Evidence and required fidelity surfaces

- Full-view comparison: the completion experience now uses the supplied centered modal composition rather than the former compact card near the top edge.
- Centering: measured card center deltas are exactly `0px` horizontally and `0px` vertically at both desktop and responsive captures.
- Visual hierarchy: the production golden trophy asset leads the card, followed by the coral completion pill, black/coral title, supporting copy, three outlined stat cards and the two navigation actions.
- Fonts and typography: existing project typography is preserved; the title uses a responsive 34–42px desktop scale and a 29–36px mobile scale with the requested coral emphasis.
- Spacing and layout rhythm: desktop uses a 664px modal, three equal 192.6px statistic columns and a 1:1.45 action split; mobile stacks statistics and actions while keeping the entire form centered.
- Colors and visual tokens: the established Himi coral tokens are reused for emphasis, outlines and the primary button; the page background is a cool `rgb(243, 246, 249)` and the modal remains warm white.
- Image quality and asset fidelity: reused the real transparent `public/assets/hsk/hsk-completion-trophy.png` asset; no emoji trophy, placeholder or generated substitute remains.
- Copy and content: the lesson title and counts are data-driven (`6` vocabulary items, `4` phrase exercises and `6` writing targets for this lesson); existing close, lesson-list and next-lesson destinations remain intact.

## Findings and comparison history

- Initial P1: the inherited three-row guided-lesson grid placed the completion card in the first 74px row, clipping most of the card above the desktop viewport.
- Fix: completion mode now explicitly replaces the lesson grid with one full-height row, producing exact two-axis centering.
- Responsive P1: the mobile guided-lesson breakpoint reintroduced the three-row grid and clipped the top half of the modal.
- Fix: the completion-specific one-row grid is repeated in the mobile breakpoint; the final responsive capture is fully visible and centered.
- Initial P2: the prior completion UI used an emoji trophy and omitted the reference metrics.
- Fix: replaced it with the production trophy asset and added three accessible, data-backed stat cards using the project's Lucide icons.

## Verification

- Source and implementation compared in one visual evidence pass: passed.
- Desktop center measurement: passed (`0px`, `0px`).
- Responsive center measurement: passed (`0px`, `0px`).
- Horizontal overflow: none at desktop or responsive viewport.
- Browser console warnings/errors: none.
- Focused industry guided-lesson UI test: passed.
- Scoped ESLint, TypeScript check and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped completion-form change.

final result: passed

---

# Design QA — Khung full-width cho trang Bộ từ vựng

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-ea46f56f-e475-4854-83b6-2d1c7752205a.png` (1340 × 717 px), dùng làm chuẩn tỷ lệ khung full-width của trang Luyện gõ.
- Supporting current-state path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-cbdba661-36d7-4310-b430-3daad9c610a1.png` (1340 × 706 px).
- Implementation URL: `http://localhost:3001/vocabulary`.
- Implementation screenshot path: Codex in-app Browser capture trong lượt này; API chụp của trình duyệt không cung cấp đường dẫn tệp.
- Viewport và chuẩn hóa: nguồn 1340 × 717 px; bản triển khai được kiểm tra tại 1339 × 720 CSS px trong cùng trạng thái desktop. Một lượt responsive bổ sung được kiểm tra ở 506 px CSS width. Mật độ hiển thị được chuẩn hóa bằng kích thước CSS và geometry DOM.
- State: tài khoản VIP đã đăng nhập, tab `Từ đã lưu`, bộ lọc `Tất cả`, một từ đã lưu.

## Full-view comparison evidence

- Ảnh chuẩn và bản triển khai được hiển thị trong cùng một lượt so sánh. Khung Bộ từ vựng hiện trải hết vùng nội dung còn lại sau sidebar, với khoảng đệm 20px hai bên giống nguyên tắc `min(1480px, calc(100% - 40px))` của trang Luyện gõ.
- Hero, thư viện bên trái, vùng tìm kiếm/bộ lọc và bảng từ giữ nguyên tỷ lệ nội bộ, màu sắc, bo góc và hành vi; chỉ giới hạn khung desktop được nới rộng.
- Ở mobile, trang vẫn dùng padding `18px 13px 96px`, không có tràn ngang và header/bottom navigation giữ nguyên.

## Focused region comparison evidence

- Không cần crop chi tiết riêng vì yêu cầu chỉ liên quan tới chiều rộng khung ngoài; full-view cùng kích thước đã thể hiện rõ hai mép khung, sidebar và toàn bộ vùng nội dung.
- DOM desktop xác nhận `max-width: none`, `padding-left: 0px`; khung sử dụng toàn bộ vùng khả dụng sau gutter.
- DOM mobile xác nhận `overflowX: false` và padding mobile cũ vẫn hoạt động.

## Required fidelity surfaces

- Fonts and typography: không thay đổi family, weight, size, line-height, wrapping hoặc hierarchy.
- Spacing and layout rhythm: khung desktop đổi sang chuẩn rộng 1480px/20px gutter; khoảng cách nội bộ, grid track, radius và vertical rhythm được giữ nguyên.
- Colors and visual tokens: không thay đổi token màu, opacity, border hoặc shadow.
- Image quality and asset fidelity: artwork `学 / 词` hiện có được giữ nguyên kích thước/cách hiển thị; không thêm placeholder hay tài sản thay thế.
- Copy and content: toàn bộ nội dung tiếng Việt, Hán tự, số lượng và nhãn thao tác được giữ nguyên.

## Findings and comparison history

1. Baseline P2: trang Bộ từ vựng bị giới hạn bởi `max-width: 1320px` và 32px padding nội bộ, tạo lề desktop lớn hơn đáng kể so với trang Luyện gõ.
2. Fix: thêm modifier `vsets-library-page` cho riêng trang thư viện và áp dụng khung `min(1480px, calc(100% - 40px))` ở desktop; không tác động trang chi tiết hoặc phiên học.
3. Post-fix evidence: full-view 1339 × 720 cho thấy khung phủ toàn bộ vùng sau sidebar với gutter đều; mobile không tràn ngang; bộ lọc HSK/Tất cả hoạt động; browser console không có warning/error.

## Verification

- Source và implementation được đối chiếu trong cùng một browser evidence pass: passed.
- Desktop full-width: passed.
- Mobile responsive và horizontal overflow: passed.
- Filter interaction: passed.
- Browser console errors: none.
- Targeted tests: 9 passed.
- Scoped ESLint và `git diff --check`: passed.

Không còn P0, P1 hoặc P2 có thể hành động cho thay đổi full-width này.

final result: passed

# Design QA — Box đổi ảnh đại diện trên trang Tài khoản mobile

- Source visual truth: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/account-avatar-before.png` (823 × 1585 physical px), captured from the annotated `/account` state before the CSS refinement.
- Implementation: `http://localhost:3001/account`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/account-avatar-after.png` (823 × 1585 physical px).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/account-avatar-comparison.png` (1172 × 235 px; before and after card crops at identical scale).
- Viewport: 628 × 1189 CSS px; capture density approximately 1.31.
- State: signed-in VIP account, mobile layout, avatar loaded, uploader idle.

## Full-view comparison evidence

- Profile card dimensions, text hierarchy, mascot, membership details and CTA remain unchanged.
- The avatar retains its existing size and position, so the compact header composition and the space reserved for the member name are preserved.
- The revised edit affordance stays fully inside the card and no horizontal overflow or content collision is introduced.

## Focused region comparison evidence

- The combined crop shows the previous coral-on-coral edit button on the left and the revised white button with coral icon on the right.
- The avatar now has a clearer white ring and softer depth; the edit action is visually separated from both the image and the orange-red ticket background.
- Button placement remains anchored to the avatar's lower-right corner while moving closer to the image boundary, reducing interference with the member name.

## Required fidelity surfaces

- Fonts and typography: no text styles changed; name, verification badge and membership copy retain their established hierarchy.
- Spacing and layout rhythm: avatar size and grid tracks remain stable; only the edit control grows to 34 px and shifts to a cleaner corner position.
- Colors and visual tokens: white surface, Himi coral icon and warm shadow reuse the account card palette.
- Image quality and asset fidelity: the original uploaded avatar remains untouched and continues to use cover cropping; the existing Lucide `PenLine` icon remains sharp at 16 px.
- Copy and content: accessible label `Chọn ảnh đại diện mới`, title and uploader status behavior are unchanged.

## Interaction and console verification

- The edit button is visible and discoverable by its accessible role/name in the rendered browser.
- Existing upload validation, Cloudinary completion and avatar synchronization tests pass.
- Browser console errors: none.
- Account avatar tests, account layout test, ESLint and `git diff --check` pass.

## Findings and comparison history

1. Baseline P2: the 29 px coral button blended into the orange-red card, sat close to the member name and had a weak visual boundary against the avatar.
2. Fix: changed the control to a 34 px white surface with coral icon, a dual subtle shadow, stronger avatar ring, focus-within feedback and pressed state; constrained the change to mobile account layouts.
3. Post-fix evidence: the combined focused comparison shows stronger separation and a clearer tap affordance without shifting surrounding layout.

No actionable P0, P1, or P2 findings remain for this scoped avatar-control update.

final result: passed

# Design QA — Thu nhỏ box tính năng trang chủ 30%

- Source visual truth: giao diện box tính năng trước thay đổi tại `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-feature-boxes-page.png`, kết hợp yêu cầu người dùng giảm kích thước 30%.
- Implementation: `http://localhost:3001/`.
- Desktop screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-feature-boxes-compact-desktop.png` (2013 × 1523 physical px).
- Mobile screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-feature-boxes-compact-mobile.png` (675 × 1500 physical px).
- Normalized before/after comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-feature-boxes-compact-comparison.png` (2012 × 761 px).
- Viewport and normalization: desktop was inspected with the same in-app Browser viewport before and after; both 2013 × 1523 captures were downsampled equally to 1006 × 761 and placed side by side. Mobile was inspected at the 390 × 844 responsive override using the browser's display density.
- State: authenticated learner homepage, default feature-card state.

## Full-view comparison evidence

- Desktop card aspect ratio changed from `1.28` to `1.82`; at the measured 298.23 px card width, height is now 163.85 px instead of approximately 232.99 px, a 29.7% reduction.
- Mobile card aspect ratio changed from `1.65` to `2.36`, preserving the same approximately 30% height reduction while keeping full-width stacked cards.
- All four cards remain aligned in one row on desktop; their order, links, palette, artwork, and surrounding homepage layout are unchanged.

## Focused region comparison evidence

- A separate focused crop was unnecessary because the normalized before/after comparison keeps the entire feature row readable at equal scale and clearly exposes the changed height, title scale, padding, radius, and artwork scale.
- Measured desktop title typography is 22.10 px, 24.31 px line height, weight 900; artwork remains fully visible inside every card.
- Mobile inspection shows all four cards stacked without horizontal document overflow; browser console errors are empty.

## Required fidelity surfaces

- Fonts and typography: title scale was reduced with the cards while retaining weight, hierarchy, color, and Vietnamese copy.
- Spacing and layout rhythm: padding, radius, title size, card height, and artwork footprint were reduced proportionally; grid gaps and section spacing remain stable.
- Colors and visual tokens: the rose, blue, apricot, and lilac brand surfaces and matching title colors are unchanged.
- Image quality and asset fidelity: the original transparent 3D PNG assets are reused and remain sharp at the smaller rendered size; no new placeholders or code-drawn artwork were introduced.
- Copy and content: all four labels and their destination links remain unchanged.

## Findings and comparison history

1. Baseline P2: the feature cards occupied more vertical space than requested.
2. Fix: increased card aspect ratios to reduce height by approximately 30%, then proportionally reduced padding, radius, title sizing, and responsive mobile dimensions.
3. Post-fix evidence: desktop measurement confirms a 29.7% reduction; mobile cards preserve the same proportion, no horizontal overflow is present, scoped homepage tests and ESLint pass, and the browser console has no errors.

No actionable P0, P1, or P2 findings remain for this scoped sizing change.

final result: passed

---

# Design QA — Thiết kế lại trang chủ Himi

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-5dfbb4f3-2bae-47fe-92dd-0ef2c52d3afb.png` (1141 × 857 px).
- Implementation: `http://localhost:3001/`.
- Desktop screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-redesign-desktop.png`.
- Mobile screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-redesign-mobile.png`.
- Normalized side-by-side comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-redesign-comparison.png`.
- Viewports: desktop 1143 × 857 CSS px and mobile 390 × 844 CSS px. The in-app browser captures at device display density; the comparison image normalizes the desktop capture back to the source dimensions.

## Full-view comparison evidence

- The implementation preserves the reference hierarchy: warm rounded hero, left-aligned greeting/headline/CTA, large Himi mascot, four feature cards, six popular-topic cards, and three recent lessons.
- Existing Himi 3D artwork and the warm orange Chinese studio background replace generic placeholders while retaining the website's coral/orange brand palette.
- Desktop keeps the four feature cards on one line at the reference width; mobile becomes a touch-friendly single-column feature flow and a two/three-column topic grid without horizontal overflow.

## Required fidelity surfaces

- Typography: Roboto Vietnamese remains the project display family; headings use compact heavy weights and the red `Himi Chinese!` line matches the reference emphasis.
- Spacing and layout rhythm: the hero, section gaps, card radii, feature-card height, topic density, and recent-lesson rows follow the source proportions within the existing learner shell.
- Colors and visual tokens: coral CTA, warm cream hero, pastel pink/blue/apricot/lilac feature cards, muted secondary copy, and subtle warm shadows match the reference direction.
- Asset fidelity: the hero uses `source-studio-arches.png` plus `himi-wave.webp`; feature cards use the existing high-resolution Himi game artwork. Images remain sharp at desktop and mobile densities.
- Interaction: the hero CTA, feature cards, topic cards, recent lessons, and section links are semantic links with visible focus states. The CTA was clicked in-browser and opened the intended HSK lesson, then returned successfully.

## Findings and comparison history

1. Baseline P1: the previous homepage was a single full-viewport campaign image and did not expose the learning features, popular topics, or recent lesson progress shown in the reference.
2. Fix: replaced the campaign-only composition with a responsive learning dashboard while retaining the existing navigation shell, VIP welcome offer, real routes, and Himi brand assets.
3. First desktop pass P2: the fixed top bar overlapped the greeting at the top of the hero. Fix: restored 82 px desktop content clearance and zeroed it only for the mobile navigation layout.
4. First reference-size capture P2: lazily loaded feature artwork had not finished decoding in the immediate screenshot. Verification after image completion confirmed all four assets loaded at full intrinsic resolution.
5. Post-fix evidence: desktop and mobile visual checks passed, the CTA route smoke test passed, browser console errors are empty, ESLint passed, and the five scoped homepage tests passed.

No actionable P0, P1, or P2 findings remain for the homepage redesign.

final result: passed

---

# Design QA — Responsive card styling for writing practice

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-6ebaf425-4292-4f7e-9316-6d539e7d5e96.png` (757 × 449 px).
- Implementation: `http://localhost:3001/writing/hsk-1/hsk1-bai-01-chao-anh/practice`.
- Implementation capture: Codex in-app Browser capture from this task; the capture API does not expose a filesystem path.
- Verified CSS viewports: 1600 × 1200, 766 × 1189, and 390 px mobile.

## Comparison evidence

- The workspace uses a pale blue-gray page canvas and two white, 28 px rounded cards with subtle gray borders and restrained shadows, matching the reference surface treatment.
- Header, character strip, two-card workspace, and footer now share the exact same centered 840 px container (`left: 380`, `right: 1220` at the verified wide viewport).
- Desktop/tablet retains an approximately 2.85:1 practice-to-information ratio. The mode selector and square writing board use viewport-aware clamps instead of fixed dimensions.
- The board grid is reduced to the reference's horizontal and vertical guides; diagonal decoration and the floating mode badge are absent in this lesson presentation.
- Below 620 px the cards stack, retain practical controls, and produce zero horizontal overflow.
- Dynamic Hanzi, pinyin, Vietnamese meaning, stroke metadata, pronunciation control, lesson navigation, and HanziWriter behavior remain unchanged.
- Browser console warnings/errors: none. Targeted writing-route test, ESLint, and diff whitespace checks: passed.

## Findings and comparison history

1. P2: the first pass used a 390 px board and 330 px segmented control at a 766 px viewport, making the practice card denser than the reference. Fixed with responsive clamps capped at 340 px and 280 px.
2. P2: a 760 px stacking breakpoint changed the reference-width layout to one column too early. Lowered the phone breakpoint to 620 px.
3. P1: the workspace used a wider 980 px cap than the surrounding 840 px lesson container, allowing the two-card group to appear outside the shared alignment frame. Reduced the workspace cap to 840 px.
4. Post-fix desktop, tablet-edge, and phone checks show no actionable P0, P1, or P2 mismatch.

final result: passed

---

# Design QA — Container bài học chủ đề Văn phòng

- Source visual truth paths: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-e9fcae2a-c9e4-4a46-84fd-2c432a0709bd.png` (trạng thái ban đầu, 1021 × 693 px) và `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-3853fb0f-d0d3-4872-9e7e-d8b78bcec577.png` (bố cục container mục tiêu, 1024 × 691 px).
- Implementation: `http://localhost:3001/learn/van-phong-hanh-chinh?lesson=chao-hoi-tai-noi-lam-viec`.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Viewport and normalization: desktop was inspected at 1024 × 690 CSS px with a 1365 × 920 px browser capture and compared against the 1024 × 691 px target by CSS geometry. A second desktop capture at 1706 × 960 CSS px / 2275 × 1280 px confirmed the 840 px max-width. Mobile was inspected at 390 × 800 CSS px. Browser capture density was 4/3 physical pixels per CSS pixel.
- State: `Từ vựng`, bước 1/14, từ `同事`; `Cụm từ` and `Nghe & Nói` were also exercised.

## Full-view comparison evidence

- At 1024 px CSS width, header, stage, and footer content share the same 840 px centered frame from x=92 to x=932, closely matching the target's centered content frame around x=95 to x=929.
- The full-width white page background, section separators, lesson card hierarchy, and bottom navigation chrome remain intact; only the content alignment frame changed.
- No horizontal overflow was present at either desktop or 390 px mobile widths.

## Focused region comparison evidence

- Header: close control, progress rail, and all three lesson tabs now sit inside the same centered frame.
- Stage: vocabulary, phrase, listening/pronunciation content, and the phrase navigation arrows resolve within the centered frame.
- Footer: previous button, step counter, keyboard hint, and next button align to the same frame instead of the viewport edges.
- Loading state uses the same three inner wrappers, preventing layout shift while the lesson is fetched.

## Required fidelity surfaces

- Fonts and typography: existing families, weights, sizes, hierarchy, and Vietnamese/Chinese copy are unchanged on desktop; the mobile Hanzi size was reduced only enough to keep two-character words on one line.
- Spacing and layout rhythm: the requested 840 px centered container is shared consistently across header, stage, and footer; mobile uses proportional 14 px side gutters.
- Colors and visual tokens: existing coral, navy, gray, and warm-white tokens are unchanged.
- Image quality and asset fidelity: this screen contains no raster imagery; existing icon-library glyphs remain unchanged and sharp.
- Copy and content: labels, vocabulary content, progress text, and interaction copy are unchanged.

## Findings and comparison history

1. Baseline P1: the office lesson header, tabs, stage, and footer were aligned to the full viewport instead of the centered frame shown in the target.
2. Fix: added shared 840 px inner containers for header, stage, footer, and loading state while preserving full-width background layers.
3. First responsive pass P2: at 390 px width, the two-character Hanzi wrapped vertically inside the vocabulary card.
4. Fix: adjusted the mobile Hanzi scale and enforced a single line; the post-fix capture shows `同事` on one row with no page overflow.
5. Post-fix evidence: desktop frame measurements are identical across all three regions, `Cụm từ` and `Nghe & Nói` interactions preserve the frame, browser console errors are empty, and the targeted UI test plus ESLint and diff checks pass.

No actionable P0, P1, or P2 findings remain for the requested container change.

final result: passed

---

# Design QA — Container bài học luyện viết

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-2ba386bf-8ead-40f4-9db5-1fc176c2c39c.png`; baseline issue path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-1d1c77b1-834c-4c26-a468-0cee16885493.png`.
- Implementation: `http://localhost:3001/writing/hsk-1/hsk1-bai-01-chao-anh/practice`.
- Implementation screenshot path: Codex in-app Browser capture in this task; the browser capture API does not expose a filesystem path.
- Viewport and normalization: source is 1028 × 694 px at 1×. Implementation was rendered at 1028 × 694 CSS px and captured at 1370 × 925 px (effective 1.333× browser density); layout bounds were compared in CSS pixels to normalize density.
- State: first character `你`, `Xem nét`, step 1 / 13.

## Full-view comparison evidence

- The reference keeps its lesson chrome on a centered axis with about 95 px side margins. The revised writing lesson now gives the header, character strip, two-column workspace, and footer inner area the same centered 840 px container.
- Browser measurements at the matched CSS viewport report `left: 94`, `right: 934`, and `width: 840` for all four regions, with document `scrollWidth` equal to `clientWidth`.
- The white header/footer backgrounds still span the viewport while their controls align to the container, matching the reference composition.

## Focused region comparison evidence

- Header: close control and progress bar no longer hug the viewport edges; both sit on the shared 840 px axis.
- Workspace: practice and character-information cards remain a stable two-column grid within the container, preserving the live HanziWriter board and existing visual hierarchy.
- Footer: previous, progress text, and next action align with the same container edges as the content above.
- Mobile: at 390 × 844 CSS px, header/workspace/footer measure 349 px, the workspace collapses to one column, and there is no horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: unchanged; existing Vietnamese UI and Chinese display stacks remain intact.
- Spacing and layout rhythm: corrected from an almost full-width 1120 px cap to a centered 840 px cap; vertical sizing and card gaps remain unchanged.
- Colors and visual tokens: unchanged; coral progress/actions, warm neutral canvas, and white chrome still match the existing lesson design.
- Image quality and asset fidelity: unchanged; HanziWriter continues to render live vector strokes and the existing icon library supplies controls.
- Copy and content: unchanged and still populated from the selected lesson.

## Findings and comparison history

1. Baseline P1: the writing lesson used a 1120 px layout cap, placing cards and persistent controls against the viewport edges at 1028 px and visibly breaking the reference container rhythm.
2. Fix: introduced dedicated header/footer inner wrappers and applied one 840 px responsive container to header, character strip, workspace, and footer.
3. Post-fix evidence: matched-viewport browser capture shows all regions centered from x=94 to x=934; mobile has no overflow; the `Tiếp tục` action advances to step 2 / 13; browser warnings/errors are empty.

No actionable P0, P1, or P2 findings remain for the requested container correction.

final result: passed

---

# Design QA — Bài học toàn màn hình từ lộ trình ngành

- Source visual truth: ảnh giao diện bài học được đính kèm trong Browser Comment 1 (không có đường dẫn tệp cục bộ trong phiên).
- Implementation: `http://localhost:3001/learn/van-phong-hanh-chinh?lesson=chao-hoi-tai-noi-lam-viec`.
- Entry point: box `Bài 01 · Chào hỏi tại nơi làm việc` tại `http://localhost:3001/courses/van-phong-hanh-chinh`.
- Verified viewport: 957 × 901 CSS px trong Codex in-app Browser.
- State: bước từ vựng 01/14, bước 02/14, Cụm từ 07/14 và Nghe & Nói 11/14.

## Full-view comparison evidence

- Click toàn bộ hàng Bài 01 mở đúng bài học ở chế độ toàn màn hình; rail, topbar, breadcrumb, mobile navigation và chatbot của ứng dụng không còn chiếm chỗ.
- Thanh tiến trình, nút đóng, ba tab học, thẻ Hán tự ở giữa và footer cố định khớp cấu trúc ảnh tham chiếu.
- Toàn bộ nội dung chính và footer nằm trong một viewport, không xuất hiện cuộn trang sau khi loại bỏ breadcrumb wrapper.

## Focused region and interaction evidence

- Từ vựng sử dụng dữ liệu thật của bài: `同事 / tóngshì / đồng nghiệp`, có nút nghe, tốc độ phát và lưu từ.
- Nút `Tiếp tục` chuyển sang `部门 / bùmén / bộ phận, phòng ban` và cập nhật tiến trình từ 01/14 thành 02/14.
- Tab `Cụm từ` mở câu thực tế cùng pinyin, nghĩa và audio; tab `Nghe & Nói` mở đúng nội dung nghe của bài.
- Nút đóng quay lại chính xác `/courses/van-phong-hanh-chinh`.
- Loading state dùng cùng khung toàn màn hình để tránh nháy giao diện điều hướng cũ.

## Required fidelity surfaces

- Typography: Hanzi dùng font Songti/SimSun, pinyin dạng pill cam, nghĩa tiếng Việt đậm và căn giữa.
- Spacing: nội dung chính cân giữa vùng còn lại giữa header 74 px và footer 68 px.
- Colors: coral, trắng, kem nhạt và navy kế thừa hệ màu hiện có.
- Responsive behavior: desktop giữ toàn bộ bài học trong 100dvh; breakpoint mobile thu gọn header, thẻ từ và footer nhưng giữ touch targets.
- Copy and content: toàn bộ nội dung lấy theo bài được chọn, không hard-code dữ liệu từ ảnh mẫu.

## Verification

- Browser click-through từ roadmap: passed.
- Next / section navigation / close: passed.
- Targeted static UI test: 1/1 passed.
- ESLint: passed with zero warnings.
- Production compilation: 763 modules transformed and chunks rendered; final hosting plugin cleanup was blocked by the running dev server locking `dist/.openai/hosting.json` (`EPERM`).
- Browser console: no visible runtime error during the verified flow.

No actionable P0, P1, or P2 issue remains for this scoped implementation.

final result: passed

---

# Design QA — Tab Cụm từ và Nghe & Nói của bài học ngành

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-00e291a8-e199-4068-8c64-2d553628cebc.png` (Cụm từ, 816 × 520 px) và `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-be8b5eb0-21b8-41e4-b4ba-0e7617b7e89d.png` (Nghe & Nói, 816 × 554 px).
- Implementation: `http://localhost:3001/learn/van-phong-hanh-chinh?lesson=chao-hoi-tai-noi-lam-viec`.
- Browser capture: Codex in-app Browser; API chụp không cung cấp đường dẫn tệp.
- Verified viewport: 957 × 901 CSS px; các kích thước dùng đơn vị responsive để giữ cùng tỷ lệ ở viewport tham chiếu 816 px.

## Full-view comparison evidence

- Cụm từ: thẻ câu kem viền cam nhạt chiếm gần toàn chiều ngang, Hanzi hai dòng căn giữa; pinyin cam, nghĩa Việt, cấu trúc tách bằng dấu cộng và ba nút hành động nằm đúng thứ tự dưới thẻ.
- Nghe & Nói: Hanzi được chia màu xanh/coral theo cụm mở đầu và nội dung chính; audio tròn nằm cuối câu, pinyin và nghĩa căn giữa; dock luyện phát âm nằm dưới nội dung.
- Header, ba tab, thanh tiến trình, nút điều hướng cạnh, footer và trạng thái bước giữ nguyên giữa hai màn hình.

## Focused interaction evidence

- Tab Cụm từ mở đúng dữ liệu thật `大家好，我是新来的同事，我叫安。` và hiển thị cấu trúc `大家好， + 我是新来的同事，我叫安。`.
- Tab Nghe & Nói hiển thị cùng câu, nút nghe mẫu, tốc độ phát, điểm phát âm và micro.
- Micro sử dụng `PronunciationEvaluator`/iFlytek sẵn có; điểm bên trái cập nhật từ kết quả thật thay vì số giả định trong ảnh mẫu.
- Nút nghe mẫu và điều chỉnh tốc độ vẫn hoạt động với dữ liệu từng câu.

## Fidelity and responsive findings

- Typography: Songti/SimSun cho Hanzi; trọng lượng, màu pinyin và nghĩa Việt khớp phân cấp của nguồn.
- Spacing and shape: card 20 px radius; dock 32 px radius; active pills và bóng coral giữ thiết kế hệ thống.
- Mobile breakpoint thu gọn card, câu, dock bốn cột và ẩn mũi tên cạnh để tránh tràn ngang.
- Không dùng ảnh giả hoặc nội dung hard-code; toàn bộ câu học lấy từ bài đang chọn.
- Browser state không có cuộn trang; footer luôn nằm trong viewport.

## Verification

- Browser tab switching and rendered states: passed.
- Targeted UI test: passed.
- ESLint: passed.
- Diff whitespace validation: passed.
- No visible runtime error in the verified browser flow.

No actionable P0, P1, or P2 mismatch remains for the requested tab designs.

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
<<<<<<< HEAD

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
=======
# Design QA — Authentication Himi v2 brand sync

- Source visual truth paths: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-ed3501aa-5c2c-4dba-910a-32669ee87a63.png`, `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-900c232d-601e-417a-950a-819f990230bb.png`, `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-5d4f00a4-4676-4adc-b152-0079a049abcc.png`, `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-913bcd07-fc22-4e5e-b38e-0e3ecd826014.png`, and the approved Himi v2 reference `public/assets/mascot/himi-v2/himi-wave.webp`.
- Implementation: `http://127.0.0.1:3002/login`, `/register`, and `/forgot-password`.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Source pixels: 1097 × 627, 986 × 542, 913 × 583, and 940 × 558. Implementation capture: 1238 × 878 CSS px at device scale factor 1.
- State: unauthenticated learner login, registration, forgot-password, and entrance animation.

**Full-view comparison evidence**

- The paper, coral satchel, mint ground, decorative stars, table, cup, and form positions remain consistent with the supplied screens.
- The embedded green-scarf mascot was removed from both desktop and portrait scene artwork. The approved black Himi with red scarf now occupies the same companion area beside the paper on all three verified desktop routes.
- Registration and forgot-password retain their original form density, hierarchy, button treatment, and empty-paper space.

**Focused region comparison evidence**

- Mascot region: Himi v2 is sharp, transparent, correctly grounded, and has no visible halo against the cream/mint scene.
- Entrance animation: the blue legacy walk-cycle reference is gone; the animation now consumes `himi-cheer-animated.webp` and preserves the existing travel/bob motion.
- Registration-success state now consumes `himi-celebrate.webp`, keeping the same accessible status copy and redirect behavior.

**Findings**

- No actionable P0/P1/P2 mismatch remains for the requested mascot-brand synchronization.
- Typography, spacing, colors, and copy were intentionally preserved because the request only changes brand imagery.

**Implementation Checklist**

- [x] Desktop and portrait auth art contain no legacy mascot
- [x] Login, registration, and forgot-password use the shared Himi v2 scene
- [x] Entrance and registration-success mascot assets use the Himi v2 suite
- [x] Production build succeeds
- [x] Targeted authentication and mascot tests pass (8/8)
- [x] Browser console has no warnings or errors

**Follow-up Polish**

- None required for this scope.

**Comparison History**

- P2 found after the first pass: on short desktop viewports the static Himi overlay was positioned relative to the oversized 3:2 scene, leaving only the top of the mascot visible below the fold. The entrance asset also waved while its container translated, which did not read as walking.
- Fix: compact-height layouts now position the static mascot from the live viewport (`top: 68vh`) and cap its size by viewport height. The entrance now uses a purpose-built 8-pose Himi v2 walk cycle rendered as a 16 fps animated WebP instead of the waving animation.
- Post-fix evidence: targeted asset tests confirm at least eight transparent animation frames with frame delays no greater than 63 ms; the refreshed browser capture shows the static Himi fully inside the viewport.

final result: passed

---
>>>>>>> 830582fbb5791b31b2f1fb30e8dd71d60fac9c0a

---

# Design QA — Mở bài học từ box lộ trình ngành

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-ce1a5ab4-7fdd-4286-96ca-5d2038c4d159.png`.
- Source state: box `Bài 01 · Chào hỏi tại nơi làm việc` đang học tại `/courses/van-phong-hanh-chinh`.
- Implementation state: cùng box và bố cục; click mở `/learn/van-phong-hanh-chinh?lesson=chao-hoi-tai-noi-lam-viec` bằng điều hướng toàn trang.

## Comparison and interaction evidence

- Typography, spacing, progress ring, duration, lesson number, border, and active-row background remain unchanged from the reference.
- The whole lesson row remains a semantic link and is keyboard accessible.
- Browser verification passed: clicking Bài 01 loads the existing lesson workspace with `Từ vựng`, `Cụm từ`, and `Nghe & nói`.
- Browser console warnings/errors: none observed.
- Targeted roadmap tests: 17/17 passed.
- ESLint and diff whitespace checks: passed.

No actionable P0, P1, or P2 visual or interaction findings remain.

final result: passed

---

# Design QA — Metadata box bài học HSK

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-79c4d05b-7e6d-4e23-8cfd-3aebf5cdf022.png`.
- Implementation: `http://localhost:3001/courses?view=hsk&level=hsk-1`.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Viewport and normalization: source crop is 750 × 95 px. Implementation was inspected at 1706 × 960 CSS px with a focused 1160 × 76 CSS px lesson-row region, plus 390 × 844 CSS px mobile validation. Browser captures use the in-app display density; comparison focused on the normalized lesson-row content and alignment.
- State: HSK 1, topic 1 expanded, with completed and in-progress lessons visible.

## Full-view comparison evidence

- Lesson title remains the dominant left-aligned element and progress state remains aligned at the far right, matching the reference hierarchy.
- Every visible HSK 1 row now contains only vocabulary count and exercise count beneath the title; dialogue count and duration are absent.
- Existing row spacing, dividers, title weight, status colors, and click target remain unchanged.

## Focused region comparison evidence

- HSK 1 lesson 1 renders `6 từ vựng · 2 bài tập · Đã hoàn thành`.
- HSK 2 lesson 1 renders `12 từ vựng · 4 bài tập` with its saved progress state.
- HSK 6 lesson 1 renders `32 từ vựng · 4 bài tập · Chưa bắt đầu`.
- At 390 × 844 CSS px, the first row remains within the 390 px document width and preserves both metadata fields and progress state without horizontal page overflow.

## Required fidelity surfaces

- Fonts and typography: unchanged; title, metadata, and progress-state weights retain the existing HSK hierarchy.
- Spacing and layout rhythm: removing two metadata items reduces clutter without changing row height, divider rhythm, or status alignment.
- Colors and visual tokens: unchanged; metadata stays muted blue-gray and progress states retain their semantic colors.
- Image quality and asset fidelity: no raster imagery is involved in the lesson row; BookOpen, FileText, and status icons continue using the existing icon library.
- Copy and content: metadata is now limited to the requested vocabulary count, exercise count, and learning progress state.

## Findings and comparison history

1. Baseline P1: lesson rows exposed dialogue count and estimated minutes, which violated the requested three-field information model; HSK 1 also did not surface its real practice-question count in the curriculum model.
2. Fix: removed dialogue/time rendering, always rendered vocabulary/exercise counts, and mapped each HSK 1 lesson's `practice` item count into `exercises`.
3. Post-fix evidence: component tests pass for all HSK 1–6 curriculum data, browser checks across HSK 1, 2, and 6 show only the approved metadata, mobile has no horizontal overflow, and browser warnings/errors are empty.

No actionable P0, P1, or P2 findings remain for this scoped metadata change.

final result: passed

---

# Design QA — Đồng bộ phong cách tab bài học Văn phòng

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-aa0d4937-bb09-43a4-8001-71292d4aa026.png` (phong cách HSK mục tiêu, 329 × 42 px).
- Baseline source path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-b661d889-23c4-4dcc-936b-fce9b3f32fad.png` (tab Văn phòng trước chỉnh sửa, 336 × 40 px).
- Implementation: `http://localhost:3001/learn/van-phong-hanh-chinh?lesson=chao-hoi-tai-noi-lam-viec`.
- Implementation screenshot path: Codex in-app Browser captures in this task; the browser capture API does not expose a filesystem path.
- Viewport and normalization: desktop page inspected at 1024 × 690 CSS px; focused tab capture was 330 × 45 CSS px (approximately 440 × 60 physical pixels at the browser's 4/3 capture density). Mobile was inspected at 390 × 800 CSS px with a 390 × 55 CSS px focused tab region.
- State: `Từ vựng` active; `Cụm từ` and `Nghe & Nói` were clicked and returned to the initial state.

## Full-view comparison evidence

- The office lesson retains its existing centered 840 px frame and all lesson content; only the tab/header styling changed.
- The active tab now uses the HSK coral, rounded pill, compact type scale, and soft coral elevation. Inactive tabs use the same muted blue-gray visual weight as the HSK reference.
- The header now shares the HSK reference's pale blue divider, subtle elevation, translucent white surface, and blur treatment.

## Focused region comparison evidence

- Active tab measured 33 px high with `#ff4f3d`, white text, 999 px radius, and `0 5px 12px rgba(255, 79, 61, .18)` shadow.
- Tab typography measured 12 px / weight 690 on desktop; inactive text resolved to `#71809a`.
- The three original labels remain unchanged and all active states transition correctly without horizontal overflow.
- At 390 px width, the nav remains inside its 363 px content frame; all three labels fit and the page has zero horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: tab size, weight, line height, and nowrap behavior now match the compact HSK treatment; the existing project font family remains unchanged.
- Spacing and layout rhythm: tab height, horizontal padding, inter-tab gap, pill radius, and header separation follow the HSK proportions while preserving the office container.
- Colors and visual tokens: active coral, inactive blue-gray, hover surface, focus ring, divider, and shadow now use the HSK visual language.
- Image quality and asset fidelity: no images or decorative assets are present in this component; no asset substitution was needed.
- Copy and content: `Từ vựng`, `Cụm từ`, and `Nghe & Nói` remain unchanged as requested; HSK-specific icons and counts were intentionally not introduced.

## Findings and comparison history

1. Baseline P1: the office tabs used a looser, lighter style and the header lacked the HSK divider/elevation treatment.
2. Fix: synchronized the pill geometry, colors, typography, gaps, hover/focus states, header divider, blur, and shadow using CSS only.
3. First browser pass P2: the existing `font` shorthand was invalid in the browser, so the tabs rendered at inherited 16 px / weight 400 instead of the intended compact HSK typography.
4. Fix: split the shorthand into explicit `font-family`, `font-size`, `font-weight`, and `line-height` declarations.
5. Post-fix evidence: computed styles report 12 px / 690, 33 px active pill height, exact target colors/shadow, successful transitions across all three tabs, zero desktop/mobile overflow, and no browser console errors.

No actionable P0, P1, or P2 findings remain for this scoped CSS synchronization.

final result: passed

---

# Design QA — Box tính năng trang chủ

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-8f48adcc-d769-4cd4-8a5f-8db2177ef552.png` (2172 × 724 px).
- Implementation: `http://localhost:3001/`.
- Desktop page screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-feature-boxes-page.png` (2013 × 1523 physical px).
- Focused implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-feature-boxes-focused.png` (1260 × 320 px).
- Mobile screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-feature-boxes-mobile.png` (390 × 844 CSS px at browser display density).
- Normalized comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-feature-boxes-comparison.png`.
- State: authenticated learner homepage, default feature-card state.

## Full-view comparison evidence

- The four cards remain in the same order and now match the selected visual direction: pale rose, blue, apricot, and lilac surfaces; large top-left labels; and isolated 3D learning objects at lower right.
- The feature heading now carries the coral vertical accent from the source. The existing `Xem tất cả` route remains intentionally visible to preserve product navigation.
- At desktop width all four cards remain on one row. At 390 px they become full-width stacked cards with large touch targets and no horizontal overflow.

## Focused region comparison evidence

- A normalized side-by-side image confirms that card ratio, title placement, object scale, object direction, and palette track the source closely.
- Pencil, headphones, keyboard, and book stack are real transparent PNG assets generated for the component rather than CSS or placeholder artwork.
- The source's subtle lower-left tonal arc is omitted as nonessential P3 decoration; card hierarchy and focal objects remain equivalent.

## Required fidelity surfaces

- Fonts and typography: titles retain the project's Roboto Vietnamese family, heavy optical weight, compact line height, and per-card source colors.
- Spacing and layout rhythm: four equal grid tracks, 16 px gaps, 20 px radii, top-left title padding, and lower-right illustration anchoring follow the source proportions.
- Colors and visual tokens: card surfaces resolve to `#fff0ef`, `#eaf6ff`, `#fff3df`, and `#f4e8ff`; title colors use deep red, navy, burnt orange, and deep violet.
- Image quality and asset fidelity: all four assets are 1536 px transparent PNG renders and remain sharp after responsive scaling; transparency and shadow edges were visually checked.
- Copy and content: `Luyện viết`, `Luyện nghe`, `Luyện gõ`, and `Giáo trình HSK` match the source exactly; existing destination links are unchanged.

## Findings and comparison history

1. Baseline P1: the cards used Himi mascot scenes, bottom descriptions, and circular arrows, which differed materially from the selected standalone-object design.
2. Fix: generated four source-matched 3D assets, removed secondary card copy/arrows, enlarged the labels, simplified the pastel surfaces, and matched object placement.
3. Post-fix evidence: desktop focused comparison matches the selected hierarchy and subjects; mobile cards stack cleanly; all images load at full intrinsic resolution; five scoped homepage tests and ESLint pass.

No actionable P0, P1, or P2 findings remain for the feature-box redesign.

final result: passed

---

# Design QA — Trang chủ mobile theo ảnh tham chiếu

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-cf3f7546-61d5-40a4-83a0-0b088b1b460d.png` (1024 × 1536 px, có khung điện thoại).
- Implementation: `http://localhost:3001/`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-mobile-reference-implementation.png` (503 × 1125 physical px; app viewport kiểm tra ở 390 × 844 CSS px).
- Normalized comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-mobile-reference-comparison.png` (788 × 844 px).
- Density normalization: nguồn được cắt còn vùng nội dung ứng dụng 800 × 1410 px, loại bỏ phần lớn khung máy và status bar, sau đó thu về chiều rộng 390 px. Ảnh triển khai được cắt đúng vùng nội dung 390 × 844 CSS px; hai bên được đặt cạnh nhau trên cùng một ảnh so sánh.
- State: người học đã đăng nhập, trang chủ ở đầu trang, thanh điều hướng mobile hiển thị.

## Full-view comparison evidence

- Header mobile có logo Himi bên trái và nút thông báo tròn bên phải, cùng nhịp chiều cao và khoảng thở như nguồn.
- Hero dùng bố cục chữ trái, mascot–sách–bút phải, bong bóng `Học là vui!`, nền kem–đào và CTA đỏ dạng pill; tỷ lệ thẻ và bán kính bám sát nguồn.
- Bốn tính năng được chuyển sang lưới 2 × 2, mỗi thẻ có tiêu đề, mô tả, nút tròn và minh họa 3D ở góc phải dưới.
- Chủ đề phổ biến là hàng cuộn ngang; thanh điều hướng cố định có bốn mục `Trang chủ`, `Khóa học`, `Tiến độ`, `Cá nhân`.
- Giao diện desktop giữ nguyên hero, lưới bốn cột, nội dung gần đây và điều hướng hiện có; không có tràn ngang ở desktop hoặc mobile.

## Focused region comparison evidence

- So sánh cạnh nhau cho thấy thứ tự nội dung, mật độ hero, lưới 2 × 2, bảng màu pastel, vị trí minh họa và nhịp giữa các section đều tương đương ảnh nguồn.
- Hero mobile sử dụng hai tài sản raster riêng: nền paper-cut đào–kem và mascot Himi cầm bút phía sau sách; card luyện viết dùng minh họa bút + giấy chữ `汉` riêng.
- Sai khác chấp nhận được: ảnh nguồn sử dụng một khung thiết bị ngắn hơn, trong khi triển khai được kiểm tra ở viewport 390 × 844 CSS px; so sánh đã chuẩn hóa theo chiều rộng và loại bỏ device chrome.

## Required fidelity surfaces

- Fonts and typography: giữ Roboto của sản phẩm, dùng tiêu đề đậm, kicker chữ hoa, mô tả nhỏ và nhấn coral theo nguồn; không có cắt chữ ở 390 px.
- Spacing and layout rhythm: header 72–76 px, hero khoảng tỷ lệ 1.76, card 2 cột tỷ lệ 1.55, gap 10 px, topic 94 px và nav bốn cột cố định tạo mật độ gần nguồn.
- Colors and visual tokens: nền `#fffdfb`, coral thương hiệu, bốn bề mặt rose/blue/apricot/lilac và nav trắng mờ khớp ngôn ngữ màu của ảnh.
- Image quality and asset fidelity: mascot, nền hero và card luyện viết là PNG chất lượng cao; các asset feature hiện có được tái sử dụng, không dùng placeholder hoặc hình vẽ CSS thay thế.
- Copy and content: nội dung hero, bốn mô tả tính năng, `Xem tất cả` và nhãn thanh điều hướng theo ảnh; các liên kết chính vẫn hoạt động.

## Interaction and console verification

- Nhấp `Luyện viết` điều hướng thành công tới `/writing` và quay lại trang chủ được.
- Nhấp `Khóa học` trên bottom navigation điều hướng thành công tới `/courses` và quay lại trang chủ được.
- Browser console errors: none.

## Findings and comparison history

1. Baseline P1: mobile trước đó dùng hero cao, feature card một cột, không có header logo và dùng thanh điều hướng năm mục của shell; mật độ khác rõ ảnh nguồn.
2. Fix: thêm bố cục mobile riêng, hero raster mới, lưới feature 2 × 2 có mô tả/nút tròn, topic cuộn ngang và nav bốn mục; desktop được giữ nguyên.
3. First browser pass P2: brand vẫn bị `opacity: 0` bởi quy tắc responsive cũ và ảnh feature nằm sau nền card do `z-index: -1`.
4. Fix: buộc brand về opacity/transform bình thường và đưa artwork mobile lên lớp nội dung card.
5. Post-fix evidence: comparison cuối bám sát nguồn, tất cả asset tải đầy đủ, viewport 390 × 844 không tràn ngang, hai luồng điều hướng hoạt động, console sạch, scoped tests và ESLint đều pass.

No actionable P0, P1, or P2 findings remain for the mobile homepage redesign.

final result: passed

---

# Design QA — Bài học gần đây trên trang chủ mobile

- Source requirement: hiển thị section `Bài học gần đây` ngay dưới `Chủ đề phổ biến` ở phiên bản mobile.
- Implementation: `http://localhost:3001/`.
- Browser screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-mobile-recent-lessons.png`.
- Viewport: 390 × 844 CSS px; trang được cuộn tới vùng chủ đề và bài học gần đây.

## Evidence

- Section mới nằm ngay sau hàng chủ đề cuộn ngang và trước vùng đệm của bottom navigation.
- Ba bài học hiển thị icon, tiêu đề, mô tả, thanh tiến độ, phần trăm và mũi tên điều hướng trong các card bo góc đồng nhất.
- Bottom navigation vẫn cố định, không gây tràn ngang; nội dung cuối có đủ khoảng trống để cuộn ra khỏi vùng nav.
- Desktop vẫn giữ bố cục `Chủ đề phổ biến` và `Bài học gần đây` hai cột như trước.
- Scoped homepage tests, rendered-home test và ESLint pass; browser console errors: none.

No actionable P0, P1, or P2 findings remain for this scoped mobile section update.

final result: passed

---

# Design QA — Menu năm mục trên trang chủ mobile

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-79f8da32-caf6-40b0-b614-cbd194a0dfa0.png` (336 × 67 px).
- Implementation: `http://localhost:3001/`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-mobile-five-item-menu.png` (503 × 1125 physical px; app viewport 390 × 844 CSS px).
- Focused implementation crop: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-mobile-five-item-menu-focused.png` (390 × 62 px).
- Combined comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-mobile-menu-comparison.png` (390 × 144 px).
- Density normalization: ảnh nguồn được nội suy lên 390 × 74 px theo đúng tỷ lệ; menu triển khai được cắt theo vùng 390 × 62 px và đặt chung trong một ảnh so sánh.
- State: trang chủ mobile, mục `Hôm nay` đang active; ảnh nguồn minh họa trạng thái `Tài khoản` active nên khác biệt màu active là có chủ đích theo route.

## Full-view comparison evidence

- Thanh điều hướng cố định sát cạnh dưới viewport, phủ gần trọn chiều rộng và giữ đủ khoảng trống để nội dung không bị che.
- Năm mục theo đúng thứ tự `Hôm nay`, `Luyện tập`, `Trò chơi`, `VIP`, `Tài khoản`; biểu tượng nằm trên nhãn và phân bố đều trên năm cột.
- Nền trắng, viền xám rất nhạt, bo góc phía trên và bóng đổ nhẹ bám sát mật độ gọn của ảnh nguồn.

## Focused region comparison evidence

- Ảnh so sánh ghép chung cho thấy chiều cao, vị trí icon, khoảng cách icon–nhãn, màu xám inactive và màu coral active tương đồng nguồn.
- Khác biệt chấp nhận được: icon dùng bộ Lucide nhất quán của sản phẩm; mục active là `Hôm nay` do đang ở route trang chủ, thay vì `Tài khoản` như trạng thái minh họa trong nguồn.

## Required fidelity surfaces

- Fonts and typography: nhãn 8 px, đậm vừa, canh giữa và không bị xuống dòng ở chiều rộng 390 px.
- Spacing and layout rhythm: dock cao 62 px, năm cột bằng nhau, gap nội bộ 3 px và lề ngang 2 px.
- Colors and visual tokens: coral thương hiệu cho active, xám trung tính cho inactive, nền trắng mờ và viền nhạt.
- Image quality and asset fidelity: icon vector Lucide sắc nét ở kích thước 18 px, không dùng emoji hoặc placeholder.
- Copy and content: đủ năm nhãn tiếng Việt, đúng thứ tự và liên kết đến `/`, `/practice`, `/games`, `/vip`, `/account`.

## Interaction and console verification

- Nhấp `Trò chơi` từ menu trang chủ điều hướng thành công tới `http://localhost:3001/games`.
- Trở lại trang chủ và menu hiển thị lại ở trạng thái `Hôm nay` active.
- Browser console errors: none.
- Scoped responsive tests, rendered-home test, ESLint và `git diff --check` đều pass.

## Findings and comparison history

1. Baseline P2: menu trang chủ trước đó có bốn mục `Trang chủ`, `Khóa học`, `Tiến độ`, `Cá nhân`, cao 72 px và nổi cách mép dưới 8 px nên khác mẫu.
2. Fix: thay bằng năm đích điều hướng theo nguồn, giảm icon/nhãn, đổi lưới thành năm cột, hạ chiều cao còn 62 px và đưa dock sát mép dưới.
3. Post-fix evidence: ảnh focused comparison cho thấy cấu trúc và mật độ đã bám sát nguồn; điều hướng hoạt động và console sạch.

No actionable P0, P1, or P2 findings remain for this scoped mobile menu update.

final result: passed

---

# Design QA — Đóng/mở chủ đề HSK bằng tiêu đề

- Source visual truth paths: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-1e3bddd4-ab6b-413a-b35f-cc3de8315b6e.png` (trạng thái mở) và `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-fa5aca48-eece-4bf2-81fc-b417c298033b.png` (trạng thái đóng).
- Implementation: `http://localhost:3001/courses?view=hsk`.
- Browser-rendered implementation screenshot: Codex in-app Browser capture trong lượt QA ngày 2026-10-03.
- Viewport: 1707 × 960 CSS px, desktop, HSK 1.
- Density normalization: đối chiếu trực tiếp theo vùng tiêu đề chủ đề; không cần đổi mật độ vì thay đổi chỉ liên quan trạng thái hiển thị.
- State: mở Chủ đề 3, click lại toàn bộ tiêu đề, danh sách Bài 11–15 biến mất và `aria-expanded` đổi từ `true` sang `false`.

## Full-view and focused comparison evidence

- Khi mở, danh sách bài học nằm ngay dưới tiêu đề và chevron hướng lên như ảnh 1.
- Khi click lại tiêu đề, chỉ còn hàng chủ đề, tiến độ và chevron hướng xuống như ảnh 2.
- Không cần focused crop bổ sung vì trạng thái đóng/mở và toàn bộ vùng bị ảnh hưởng đều nhìn rõ trong capture toàn trang.

## Required fidelity surfaces

- Fonts and typography: không thay đổi font, cỡ, độ đậm hoặc phân cấp chữ hiện có.
- Spacing and layout rhythm: trạng thái đóng loại bỏ toàn bộ danh sách bài và giữ đúng một hàng chủ đề.
- Colors and visual tokens: không thay đổi màu sắc hoặc token hiện có.
- Image quality and asset fidelity: icon chủ đề hiện có được giữ nguyên; không thêm asset thay thế.
- Copy and content: tiêu đề, mô tả và tiến độ chủ đề giữ nguyên ở cả hai trạng thái.

## Interaction and console verification

- Chủ đề 3 mở thành công khi click lần đầu và hiển thị Bài 11–15.
- Click lại cùng tiêu đề thu gọn thành công; Bài 11–15 không còn trong accessibility tree.
- Browser console errors: none.
- Scoped HSK tests: 3 passed; ESLint scoped: passed.

No actionable P0, P1, or P2 findings remain for the topic toggle interaction.

final result: passed

---

# Design QA — Badge xác minh email trên mobile

- Source visual truth: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/account-email-verified-before.png` (823 × 1585 physical px), captured from the annotated `/account` state before refinement.
- Implementation: `http://localhost:3001/account`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/account-email-verified-after.png` (823 × 1585 physical px).
- Narrow mobile screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/account-email-verified-390.png` (503 × 1125 physical px; 390 × 844 CSS viewport).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/account-email-verified-comparison.png` (1586 × 290 px; identical before/after crops).
- Primary viewport: 628 × 1189 CSS px at approximately 1.31 density; additional 390 × 844 CSS check.
- State: signed-in VIP account, email verified, account information panel visible.

## Full-view comparison evidence

- The information card, row heights, icons, email value and surrounding security section remain aligned at the annotated viewport.
- At 390 px, the badge wraps below the email within the same row rather than overflowing or covering content.
- The rest of the account page and persistent mobile navigation remain unchanged.

## Focused region comparison evidence

- The combined crop shows the previous unlabeled 32 px mint circle on the left and the revised compact `Đã xác minh` pill on the right.
- The new pill keeps the verification icon while making the status explicit, with a soft teal border and background that separate it from the white card.

## Required fidelity surfaces

- Fonts and typography: 9 px bold status text is legible without competing with the 12 px account metadata.
- Spacing and layout rhythm: 27 px pill height, 8 px horizontal padding and 4 px icon gap keep the control compact.
- Colors and visual tokens: teal foreground and pale mint surface retain the existing semantic verified color.
- Image quality and asset fidelity: the existing Lucide `BadgeCheck` vector remains crisp at 13 px; no image assets were changed.
- Copy and content: the visible status now matches the existing accessible text `Đã xác minh`.

## Interaction and console verification

- The badge remains discoverable in the rendered accessibility tree as part of the email value.
- Browser console errors: none.
- Scoped account layout test, avatar tests, ESLint and `git diff --check` pass.

## Findings and comparison history

1. Baseline P2: mobile CSS set `font-size: 0` and forced the status to a 32 px icon-only circle, hiding the meaning of the state.
2. Fix: restored the text in a compact pill, added a subtle semantic border/surface and retained flexible email truncation/wrapping behavior.
3. Post-fix evidence: focused before/after comparison and the 390 px capture show the label is readable with no overflow or overlap.

No actionable P0, P1, or P2 findings remain for this scoped verification-badge update.

final result: passed

---

# Design QA — Icon điều hướng card khóa học

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-12bc887e-81fb-47dd-8060-22ad093cd57d.png` (168 × 141 px), biểu tượng hai chevron hướng phải.
- Target card reference: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-d31a5f66-5bd0-4ed5-bc59-dcb674df4d31.png` (527 × 593 px).
- Implementation: `http://localhost:3001/courses`.
- Desktop evidence: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/course-cards-double-chevron-desktop.png` (2257 × 1280 px).
- Mobile evidence: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/course-cards-double-chevron-mobile.png` (675 × 1500 px; 390 × 844 CSS viewport).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/course-card-double-chevron-comparison.png` (820 × 430 px).
- State: signed-in course catalog with all nine available course cards rendered.

## Full-view and focused comparison evidence

- Desktop capture confirms the icon is applied consistently across the three-column catalog without changing card spacing, footer alignment or button dimensions.
- Mobile capture confirms the first HSK card retains the original square control and displays a crisp double chevron at the narrow breakpoint.
- The combined comparison places the provided source icon and the rendered control in one image; direction, two-stroke silhouette and visual weight match the requested reference.

## Required fidelity surfaces

- Fonts and typography: unchanged.
- Spacing and layout rhythm: existing 42 × 42 px icon container, border radius and footer placement are preserved.
- Colors and visual tokens: existing neutral border, white surface and dark foreground remain consistent with the site brand.
- Image quality and asset fidelity: the icon uses Lucide `ChevronsRight` at 23 px with stroke width 3, so it remains sharp at every density without a raster dependency.
- Copy and content: unchanged across HSK and specialist course cards.

## Interaction and console verification

- DOM verification: nine `.lucide-chevrons-right` icons and zero legacy `.lucide-arrow-up-right` icons inside course-card action controls.
- Selecting a course card navigates successfully to its roadmap page.
- Browser console errors: none.
- Scoped course roadmap tests: 2 passed; HSK curriculum tests: 3 passed; scoped ESLint and `git diff --check`: passed.

## Findings and comparison history

1. Baseline P2: course-card action controls used a single diagonal arrow, which did not match the supplied double-chevron reference.
2. Fix: replaced the icon in both shared course-card components with a bold right-facing double chevron while preserving the existing control and navigation behavior.
3. Post-fix evidence: desktop, mobile and focused comparison captures show the requested icon consistently across the catalog.

No actionable P0, P1, or P2 findings remain for this scoped course-card icon update.

final result: passed

---

# Design QA — Viền trái tiêu đề trang chủ

- Source visual truth: ảnh tham chiếu đính kèm trong Browser Comment 1 và 2 (`Tính năng học tập`, 296 × 58 px), cho thấy thanh đỏ dày ở bên trái và khoảng đệm rõ trước tiêu đề.
- Implementation: `http://localhost:3001/`.
- Browser-rendered evidence: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/home-heading-left-border-mobile.jpg` (579 × 1585 px).
- Viewport: 448 × 1189 CSS px; browser-reported device pixel ratio 0.75; capture scale approximately 1.29 px/CSS px.
- State: trang chủ mobile, các mục `Chủ đề phổ biến` và `Bài học gần đây` cùng link `Xem tất cả` hiển thị.
- Density normalization: nguồn là crop tập trung còn implementation là toàn viewport, nên kiểm tra trực quan theo tỷ lệ nét/typography và xác minh thêm bằng kích thước CSS thực tế thay vì so khớp từng pixel.

## Full-view comparison evidence

- Cả hai tiêu đề hiện có thanh đỏ `#ff5a4e` ở mép trái, cùng sắc đỏ với ảnh mẫu.
- Thanh viền và khoảng đệm không làm thay đổi bề rộng card, hàng chủ đề, danh sách bài học hoặc thanh điều hướng cố định.
- Link `Xem tất cả` vẫn nằm cùng hàng và không chồng lên tiêu đề tại viewport kiểm tra.

## Focused region comparison evidence

- Ảnh nguồn thể hiện mô-típ viền trái 7 px và khoảng cách 18 px trước chữ; implementation dùng đúng `border-left: 7px solid #ff5a4e` và `padding-left: 18px` cho cả hai heading.
- Kích thước render đo được: `Chủ đề phổ biến` 154.44 × 28.5 CSS px và `Bài học gần đây` 151.5 × 28.5 CSS px; border được trình duyệt raster hóa thành 6.67 CSS px ở mức zoom hiện tại.

## Required fidelity surfaces

- Fonts and typography: giữ nguyên Roboto, cỡ 19 px, weight và letter spacing hiện có; không phát sinh wrap.
- Spacing and layout rhythm: thêm đúng khoảng đệm trái 18 px; cả hai heading row còn hơn 178 CSS px khoảng trống trước link hành động và không overlap.
- Colors and visual tokens: dùng cùng coral `#ff5a4e` với mẫu viền hiện có trên trang.
- Image quality and asset fidelity: không thay đổi hoặc thay thế bất kỳ asset nào; nét viền là CSS sắc nét ở mọi mật độ.
- Copy and content: giữ nguyên `Chủ đề phổ biến`, `Bài học gần đây` và toàn bộ nội dung liên quan.

## Interaction and console verification

- Các link `Xem tất cả` và nội dung section vẫn hiển thị, không bị che hoặc lệch hàng.
- Browser console errors: none.
- Scoped responsive test: 4 passed.

## Findings and comparison history

1. Baseline P2: hai tiêu đề được đánh dấu không có viền trái nên thiếu phân cấp thị giác theo ảnh tham chiếu.
2. Fix: thêm chung viền trái coral 7 px và padding trái 18 px cho `#home-topic-title` và `#home-recent-title`; bổ sung kiểm thử hồi quy.
3. Post-fix evidence: ảnh browser sau chỉnh sửa và số đo layout xác nhận hai viền hiển thị đồng nhất, không chồng lấp hoặc làm vỡ responsive layout.

No actionable P0, P1, or P2 findings remain for this scoped heading-border update.

final result: passed

---

# Design QA — Logo mặt Himi trên header mobile

- Source visual truth: ảnh logo mặt Himi đính kèm trong Browser Comment 1 (64 × 64 px) và asset thương hiệu desktop tương ứng `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/public/assets/brand/himi-sidebar-logo-transparent.webp` (1254 × 1254 px, nền trong suốt).
- Implementation: `http://localhost:3001/`.
- Browser-rendered evidence: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/home-mobile-face-logo.jpg` (861 × 1585 px).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/home-mobile-face-logo-comparison.jpg` (981 × 120 px).
- Viewport: 660 × 1189 CSS px; browser-reported device pixel ratio 0.75; effective screenshot scale approximately 1.30 px/CSS px.
- State: trang chủ mobile, header và wordmark `Himi Chinese` đang hiển thị.
- Density normalization: asset nguồn được thu về 72 × 72 px trong comparison; implementation giữ nguyên capture để đánh giá crop, silhouette và tỷ lệ trong khung.

## Full-view comparison evidence

- Header trang chủ hiện dùng đúng mặt Himi đang dùng ở desktop thay cho mascot toàn thân trước đó.
- Wordmark, chuông thông báo, chiều cao header và toàn bộ nội dung trang chủ không thay đổi.
- Logo mới đọc rõ ở kích thước nhỏ và không làm thay đổi căn chỉnh ngang của header.

## Focused region comparison evidence

- Comparison đặt asset mặt Himi gốc cạnh crop header sau chỉnh sửa; mắt nháy, mỏ cam, má hồng và silhouette tóc khớp trực tiếp.
- Ảnh render dùng chính `himi-sidebar-logo-transparent.webp`, nằm trong box 44 × 44 CSS px, ảnh hiển thị 41.33 × 41.33 CSS px với `object-fit: contain` và radius 15 px.

## Required fidelity surfaces

- Fonts and typography: wordmark `Himi Chinese` giữ nguyên font, weight, màu đỏ/đen và khoảng cách hiện có.
- Spacing and layout rhythm: box logo 44 px và gap header hiện tại được giữ nguyên; không có overlap hoặc thay đổi chiều cao.
- Colors and visual tokens: nền box trắng, đường viền trung tính và màu mascot đúng asset thương hiệu đã duyệt.
- Image quality and asset fidelity: dùng trực tiếp WebP trong suốt 1254 × 1254 px của logo desktop, không dùng SVG/CSS/emoji thay thế; hình sắc nét và crop đúng mặt.
- Copy and content: không thay đổi nhãn truy cập `Himi Chinese - Trang chủ` hoặc wordmark hiển thị.

## Interaction and console verification

- Logo vẫn nằm trong link trang chủ hiện có và giữ nguyên hành vi điều hướng.
- Browser console errors: none.
- Scoped tests: 6 passed; scoped ESLint: passed.

## Findings and comparison history

1. Baseline P2: header mobile dùng mascot toàn thân trong khung nhỏ, khiến logo trông thu nhỏ và không đồng nhất với logo mặt Himi ở desktop.
2. Fix: thêm biến thể `face` cho `BrandMark` và dùng biến thể này riêng khi learner shell đang ở route trang chủ; các route khác tiếp tục dùng mascot hiện tại.
3. Post-fix evidence: browser capture và comparison tập trung xác nhận đúng asset mặt Himi, tỷ lệ lớn hơn trong box, không làm lệch header.

No actionable P0, P1, or P2 findings remain for this scoped mobile-logo update.

final result: passed

---

# Design QA — Bỏ “Xem tất cả” khỏi Bài học gần đây

- Source visual truth: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-mobile-recent-lessons.png` (503 × 1125 px), matching the annotated mobile state with the `Xem tất cả` link visible beside the section title.
- Implementation: `http://localhost:3001/`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/home-recent-lessons-without-view-all.png` (823 × 1585 px).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/home-recent-lessons-view-all-comparison.png` (900 × 300 px).
- Viewport: 630 × 1189 CSS px; browser capture density approximately 1.31.
- Density normalization: before and after header crops were scaled to a common 100 px comparison height.
- State: signed-in VIP learner, mobile homepage, recent-lessons section visible.

## Full-view and focused comparison evidence

- The full mobile capture shows the `Bài học gần đây` heading without a trailing header action while all three lesson rows remain in place.
- The combined comparison places the prior state and revised state together; the only scoped content removed is `Xem tất cả` and its arrow.
- The section title, red accent, card spacing and bottom navigation remain aligned and unobstructed.

## Required fidelity surfaces

- Fonts and typography: the heading font, size, weight and wrapping are unchanged.
- Spacing and layout rhythm: the heading row retains its height and alignment; removal does not collapse or shift the lesson list.
- Colors and visual tokens: the existing black heading, coral accent and lesson-card palette remain unchanged.
- Image quality and asset fidelity: no image assets were added, removed or rescaled.
- Copy and content: only the requested `Xem tất cả` header action was removed; all three recent lesson titles, subtitles and progress values remain visible.

## Interaction and console verification

- DOM verification: zero links inside `.home-redesign-recent .home-redesign-heading-row` and three lesson links inside the recent list.
- Browser console errors: none.
- Scoped responsive-home tests: 4 passed; scoped ESLint and `git diff --check`: passed.
- The broader rendered-HTML suite still has four unrelated pre-existing failures in deployment, learner-shell, daily-session and course-cover assertions; none touch this section.

## Findings and comparison history

1. Baseline P2: the recent-lessons heading included a `Xem tất cả` action that the annotation requested to remove.
2. Fix: removed only the `/courses` link from the recent-lessons heading, preserving the feature and popular-topic header actions.
3. Post-fix evidence: mobile capture and focused before/after comparison show the header action is gone with no layout regression.

No actionable P0, P1, or P2 findings remain for this scoped homepage update.

final result: passed

---

# Design QA — Nút chevron không có hover

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-315a7efa-1d2f-4c54-b5a5-6f9f19f2b4cf.png` (69 × 66 px), showing the requested neutral square chevron control.
- Implementation: `http://localhost:3001/courses`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/course-card-chevron-static.png` (2257 × 1280 px).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/course-card-chevron-static-comparison.png` (760 × 330 px).
- Viewport: 1706 × 960 CSS px; device pixel ratio 0.75.
- Density normalization: source and implementation icon crops were enlarged into equal visual panels for shape, border and resting-state comparison.
- State: signed-in VIP learner, desktop course catalog with nine course cards visible.

## Full-view and focused comparison evidence

- The full catalog capture confirms every card retains the same 42 × 42 px chevron control, footer alignment and neutral border treatment.
- The focused comparison shows the supplied neutral icon box and rendered control share the same white/transparent surface, pale border, rounded corners and black double chevron.
- Browser CSS inspection found zero hover selectors targeting `.icon-link` across the loaded stylesheets.

## Required fidelity surfaces

- Fonts and typography: unchanged; the control contains only the existing vector icon.
- Spacing and layout rhythm: width, height, radius, footer gap and card layout are unchanged.
- Colors and visual tokens: the control remains dark text on a transparent surface with the existing neutral border in both resting and pointer-hover states.
- Image quality and asset fidelity: the Lucide double chevron remains a crisp vector; the supplied raster image was used only as visual reference.
- Copy and content: unchanged across HSK and specialist course cards.

## Interaction and console verification

- Runtime CSS verification: nine controls rendered; `background-color: transparent`, neutral border, dark foreground and `transform: none` at rest, with no hover rules able to alter them.
- Keyboard `:focus-visible` feedback remains available for accessibility.
- All course cards retain their destination links and navigation semantics.
- Browser console errors: none before the preview restart; the restored preview loads successfully at `/courses`.
- Scoped course-card tests: 3 passed; scoped ESLint and `git diff --check`: passed.

## Findings and comparison history

1. Baseline P2: direct icon hover and parent-card hover changed the control color, background and position.
2. Fix: removed both direct `.icon-link:hover` declarations and changed the parent-card motion rules to apply only on `:focus-visible`.
3. Post-fix evidence: browser CSS inspection reports no hover selector for the control, and the visual capture shows the requested neutral state without layout drift.

No actionable P0, P1, or P2 findings remain for this scoped hover-state update.

final result: passed

---

# Design QA — Tinh gọn phần đầu danh mục lộ trình

- Source visual truth: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/course-card-chevron-static.png` (2257 × 1280 px), showing the catalog before the three annotated text removals.
- Implementation: `http://localhost:3001/courses`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/course-catalog-clean-header.png` (2257 × 1280 px).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/course-catalog-clean-header-comparison.png` (2048 × 372 px).
- Viewport: 1706 × 960 CSS px; browser-reported device pixel ratio 0.75.
- Density normalization: source and implementation captures share the same 2257 × 1280 pixel dimensions; the focused comparison uses equal 1000 × 300 px panels from matching source regions.
- State: signed-in VIP learner, desktop course catalog, default “Tất cả” filter.

## Full-view and focused comparison evidence

- The full implementation capture shows one clear page title followed directly by search, filters and the course grid.
- The combined comparison visibly confirms removal of the uppercase eyebrow, explanatory sentence and route-count line while preserving the title and course content.
- DOM inspection reports zero `.explorer-count` elements and no matches for any of the three removed strings.

## Required fidelity surfaces

- Fonts and typography: the existing title family, weight, size, line height and color remain unchanged; only the requested secondary copy was removed.
- Spacing and layout rhythm: title spacing and the loading skeleton were updated together, keeping a clean title-to-toolbar transition without layout shift or horizontal overflow.
- Colors and visual tokens: the established forest title, coral active filter, neutral borders and white surfaces remain unchanged.
- Image quality and asset fidelity: all course imagery, crops, labels and card illustrations remain unchanged and sharp.
- Copy and content: only `LỘ TRÌNH HỌC TIẾNG TRUNG`, the explanatory sentence, and the route-count sentence were removed; the main title, filters and all course-card content remain present.

## Interaction and console verification

- Search and filter controls remain visible and accessible; nine destination cards remain in the catalog DOM.
- Horizontal overflow: none at the verified desktop viewport.
- Browser console warnings/errors: none.
- Scoped HSK/catalog tests: 3 passed; scoped ESLint and `git diff --check`: passed.

## Findings and comparison history

1. Baseline P2: three secondary text blocks added unnecessary hierarchy and vertical density in the annotated catalog header.
2. Fix: removed the eyebrow and description from `CourseLibraryView`, removed the dynamic count from `CourseExplorer`, and synchronized the loading skeleton and spacing styles.
3. Post-fix evidence: the browser capture, DOM assertions and focused comparison show the requested text is absent with the catalog controls and grid intact.

No actionable P0, P1, or P2 findings remain for this scoped catalog-header update.

final result: passed

---

# Design QA — Tinh gọn phần đầu lộ trình HSK

- Source visual truth: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/hsk-curriculum-before-removal.png` (2257 × 1280 px), captured at the annotated HSK state before removal.
- Implementation: `http://localhost:3001/courses?view=hsk`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/hsk-curriculum-clean-header.png` (2257 × 1280 px).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/hsk-curriculum-clean-header-comparison.png` (2048 × 383 px).
- Viewport: 1706 × 960 CSS px; browser-reported device pixel ratio 0.75.
- Density normalization: both full captures share the same pixel dimensions; the focused comparison uses equal 1000 × 311 px panels from matching source regions.
- State: signed-in VIP learner, desktop HSK curriculum, HSK 1 active, topic 1 expanded, 4/15 lessons completed.

## Full-view and focused comparison evidence

- The full implementation capture shows the curriculum beginning directly below the learner top bar, with the title and mascot leading into the level controls.
- The combined comparison confirms removal of the shared breadcrumb, uppercase `HIMI CHINESE` eyebrow and 15-lesson description while preserving all curriculum controls and content.
- Runtime DOM inspection reports zero `.client-breadcrumb-bar`, zero `.hsk-curriculum-heading-copy > span` and zero `.hsk-curriculum-heading-copy > p` elements.

## Required fidelity surfaces

- Fonts and typography: the HSK title retains its existing family, 900 weight, responsive size, line height and letter spacing; no unintended wrapping is introduced.
- Spacing and layout rhythm: removing the breadcrumb shifts the curriculum upward cleanly; the title remains vertically balanced against the mascot and the controls retain their grid alignment.
- Colors and visual tokens: the existing red/orange brand accents, neutral dividers and white page surface remain unchanged.
- Image quality and asset fidelity: the Himi mascot and speech bubble remain the same source asset, size and crop with no raster degradation.
- Copy and content: only the three requested text/navigation elements are absent; the title, six HSK level controls, progress, industry link and three topic sections remain intact.

## Interaction and console verification

- Level switching was tested from HSK 1 to HSK 2 and back to HSK 1; the title updated correctly in both states.
- Horizontal overflow: none at the verified desktop viewport.
- Browser console warnings/errors: none.
- Scoped HSK tests: 3 passed; breadcrumb tests: 5 passed; scoped ESLint and `git diff --check`: passed.

## Findings and comparison history

1. Baseline P2: the breadcrumb and two secondary copy lines added duplicate hierarchy and excess vertical density above the curriculum controls.
2. Fix: returned no shared breadcrumb for the HSK query view, removed the eyebrow and description from `HskCurriculumExplorer`, and deleted their now-unused responsive styles.
3. Post-fix evidence: matching browser captures, DOM counts and the focused comparison show the requested elements are gone without affecting title, mascot, controls, progress or lesson content.

No actionable P0, P1, or P2 findings remain for this scoped HSK-header update.

final result: passed

---

# Design QA — Liên kết quay lại trên lộ trình HSK

- Source visual truth: Browser Comment 1 additional inline reference (198 × 43 px), normalized for comparison at `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/hsk-back-link-reference-normalized.png` (198 × 43 px).
- Implementation: `http://localhost:3001/courses?view=hsk`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/hsk-curriculum-back-link.png` (2257 × 1280 px).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/hsk-curriculum-back-link-comparison.png` (1240 × 205 px).
- Viewport: 1706 × 960 CSS px; browser-reported device pixel ratio 0.75.
- Density normalization: the 198 × 43 px source reference and the matching implementation crop were enlarged into equal 600 × 131 px panels.
- State: signed-in VIP learner, desktop HSK curriculum, HSK 1 active, topic 1 expanded.

## Full-view and focused comparison evidence

- The full implementation capture shows the back link directly above `Lộ trình bài học HSK 1`, aligned to the same left edge as the title.
- The focused comparison confirms the small left chevron, dark semibold label and unboxed treatment match the reference direction.
- The reference wording `Về trang Bài tập` was intentionally adapted to `Về trang Lộ trình` because the destination of this screen is the course catalog.

## Required fidelity surfaces

- Fonts and typography: the link uses the existing UI font at 15 px/750 weight with a compact 1.2 line height, closely matching the supplied reference hierarchy.
- Spacing and layout rhythm: the link sits 14 px above the title and preserves alignment, mascot balance, controls and the lesson list below.
- Colors and visual tokens: the resting text uses neutral slate `#3f4752`; hover and focus reuse the existing HSK red token.
- Image quality and asset fidelity: no raster assets changed; the arrow uses the project’s installed Lucide icon library and remains crisp at all densities.
- Copy and content: one context-aware label, `Về trang Lộ trình`, was added without changing existing curriculum copy.

## Interaction and console verification

- The link resolved to `/courses`, was clicked successfully, navigated to the catalog, and browser history returned to the HSK view.
- Keyboard focus styling is present via `:focus-visible`.
- Horizontal overflow: none at the verified desktop viewport.
- Browser console warnings/errors: none.
- Scoped HSK tests: 3 passed; scoped ESLint and `git diff --check`: passed.

## Findings and comparison history

1. Baseline P2: after removal of the shared breadcrumb, the HSK title had no local path back to the course catalog.
2. Fix: added a semantic `Link` with a left chevron above the title, wired to the existing `catalogHref`, with hover and keyboard-focus states.
3. Post-fix evidence: browser capture, focused comparison and live navigation test confirm the link is visible, visually aligned and functional.

No actionable P0, P1, or P2 findings remain for this scoped back-link update.

final result: passed

---

# Design QA — Bỏ “Xem tất cả” khỏi Tính năng học tập

- Source visual truth: Browser Comment 1 inline capture at 1232 × 1189 px; the earlier matching desktop capture is preserved at `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/homepage-redesign-desktop.png` (2013 × 1523 px).
- Implementation: `http://localhost:3001/`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/home-feature-view-all-removed-desktop.png` (1232 × 1189 px).
- Combined focused comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/qa-artifacts/home-feature-view-all-comparison.png` (1200 × 620 px).
- Viewport: 1232 × 1189 CSS px; live in-app browser device pixel ratio 0.75. The saved headless capture uses device scale factor 1.
- Density normalization: the focused comparison resizes both heading/card regions to a common 1144 px panel width. The source capture comes from an earlier visual iteration, so comparison is intentionally scoped to the feature heading action and card preservation rather than unrelated page styling.
- State: desktop home dashboard. Live DOM checks used the signed-in learner state; the saved implementation screenshot used the signed-out state, whose feature section has identical content and structure.

## Full-view and focused comparison evidence

- The implementation capture shows `Tính năng học tập` followed directly by the four learning cards, with no trailing action text.
- The focused comparison shows the earlier `Xem tất cả` action in the source and its absence in the current implementation while keeping all four cards visible.
- Live DOM inspection reports zero links in the feature heading, four feature cards, one preserved `Xem tất cả` link in the popular-topics heading, zero links in the recent-lessons heading, and no horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: the feature heading family, weight, size, line height and left-accent hierarchy remain unchanged; removing the secondary link does not alter wrapping.
- Spacing and layout rhythm: the heading row keeps its existing height and alignment, and the four-column card grid remains directly below it without a gap or reflow regression.
- Colors and visual tokens: the red heading accent and the four pastel feature tones remain unchanged.
- Image quality and asset fidelity: the pencil, headphones, keyboard and HSK books assets retain their existing crop, scale and sharpness.
- Copy and content: only the requested `Xem tất cả` label in the feature heading is absent. The popular-topics `Xem tất cả` label remains present, and all four feature labels remain intact.

## Interaction and console verification

- Feature cards remain links and their count is unchanged at four.
- Popular-topics navigation remains available through its own `Xem tất cả` link.
- Browser console warnings/errors: none; only a development CSS hot-update debug entry was present.
- Scoped home tests: 4 passed; scoped ESLint and `git diff --check`: passed.

## Findings and comparison history

1. Baseline P2: the feature heading contained a secondary `Xem tất cả` action that the user requested to remove.
2. Fix: the feature heading now contains only `Tính năng học tập`; a regression assertion prevents the action from being reintroduced and separately protects the popular-topics action.
3. Post-fix evidence: browser DOM counts, the 1232 × 1189 implementation capture and the focused comparison confirm the requested action is gone without affecting the cards or neighboring sections.

No actionable P0, P1, or P2 findings remain for this scoped homepage update.

final result: passed

---

# Design QA — Độ đậm tiêu đề box Tính năng học tập

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-f2d33af1-b68c-48c6-879d-a0644589e23d.png` (1443 × 105 px).
- Implementation: `http://localhost:3001/`.
- Implementation screenshot: captured and visually inspected in the Codex in-app Browser at 1232 × 1189 CSS px, device pixel ratio 0.75; the browser capture API did not expose a filesystem path.
- State: signed-in VIP learner, desktop homepage, feature section visible, no hover or focus state.
- Density normalization: the source is a focused 1443 × 105 crop; the implementation was inspected at native browser density and its four computed title styles were measured directly.

## Evidence and required fidelity surfaces

- Fonts and typography: all four `.home-redesign-feature h3` elements resolve to `font-weight: 400`, approximately 17.864 px with a 19.6504 px line height. The family, size, line height, letter spacing and wrapping remain unchanged.
- Spacing and layout rhythm: the four desktop grid tracks remain equal at 225.125 px; card padding, height, radii and section spacing are unchanged.
- Colors and visual tokens: the existing rose, blue, apricot and lilac title colors remain unchanged.
- Image quality and asset fidelity: pencil, headphones, keyboard and HSK book assets remain unchanged and sharp.
- Copy and content: `Luyện viết`, `Luyện nghe`, `Luyện gõ` and `Giáo trình HSK` remain intact.
- Responsiveness: the shared title rule supplies weight 400 at every breakpoint; no horizontal overflow was present at the verified desktop viewport.
- Browser console warnings/errors: none.
- Scoped tests: 4 passed; scoped ESLint and `git diff --check`: passed.

## Findings and comparison history

1. Baseline P2: feature titles used `font-weight: 900`, visibly heavier than the supplied regular-weight reference.
2. Fix: changed the shared title rule to `font-weight: 400` and added a regression assertion.
3. Post-fix evidence: live computed styles report weight 400 for all four titles and the browser capture visually shows the lighter hierarchy.

## Blocker

- The in-app Browser security policy blocked the temporary combined reference/implementation comparison page, and its screenshot API did not provide a writable file path. The source and implementation were both opened and inspected, but the mandatory persisted combined comparison artifact could not be produced without switching browser surfaces or using a prohibited workaround.

No actionable P0, P1, or P2 implementation findings remain; only the required combined Design QA artifact is blocked.

final result: blocked

---

# Design QA — Khôi phục nút Tiếp tục học trên hero

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-8648e84a-e04d-4dd4-9288-50468624da2a.png` (1570 × 649 px), kèm yêu cầu khôi phục CTA `Tiếp tục học`.
- Implementation URL: `http://localhost:3001/`.
- Implementation screenshot: captured and visually inspected in the Codex in-app Browser; the screenshot API did not expose a writable filesystem path.
- Viewport/state: signed-in VIP learner, desktop homepage, approximately 1232 × 1189 CSS px, default state.
- Density normalization: the source is a focused hero capture while the implementation evidence is a full desktop viewport; the hero region was inspected directly, but no persisted combined comparison artifact was available.

## Evidence and required fidelity surfaces

- Fonts and typography: the restored CTA reuses the existing live `home-redesign-primary` button styles, including the established bold label and arrow icon; the banner's raster typography remains unchanged.
- Spacing and layout rhythm: the CTA is positioned at `left: 5.4%` and `bottom: 12%`, beneath the banner description and within the hero bounds without changing the banner aspect ratio or surrounding section spacing.
- Colors and visual tokens: the existing coral button fill, white foreground, pill radius, and shadow are reused.
- Image quality and asset fidelity: the supplied desktop banner asset remains unchanged and uncropped; no image layer or legacy mascot layer was reintroduced.
- Copy and content: `Tiếp tục học` is visible again and links to `/hsk/1/hsk1-bai-01-chao-anh`.
- Responsiveness: the override applies only above 720px; the existing mobile hero CTA and layout are unchanged.
- Browser evidence: after reload, the CTA is visibly rendered in the lower-left portion of the hero and the accessibility tree exposes it as a link named `Tiếp tục học` with the expected lesson URL.
- Automated evidence: all 4 focused home-responsive tests passed; scoped ESLint and `git diff --check` passed.

## Findings and comparison history

1. Baseline P1: the desktop hero's copy wrapper was fully hidden, which also removed the existing continuation CTA.
2. Fix: restored the wrapper as a non-interactive full-hero overlay, kept legacy copy/mascot/bubble children hidden, and enabled pointer interaction only for the existing CTA.
3. Post-fix evidence: the browser capture shows the CTA without duplicated banner text or artwork, and the focused regression assertion verifies its desktop position and interaction rule.

## Blocker

- The in-app Browser screenshot API did not provide a writable screenshot path, so the mandatory persisted combined source/implementation comparison artifact could not be created. The source and rendered implementation were both opened and inspected, but separate views cannot be treated as a passing combined comparison under the Design QA rules.

No actionable P0, P1, or P2 implementation findings remain; only the required combined Design QA artifact is blocked.

final result: blocked

---

# Design QA — Cỡ chữ tiêu đề section trang chủ

- Source visual truth paths: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-e8720316-aa65-4020-b33e-df96a7c09a70.png` (250 × 57 px), `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-23ecc1f9-19a1-44ca-b788-2770322a7a29.png` (263 × 51 px), and `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-0c08591b-f8a5-4896-af96-4485e44c5486.png` (256 × 46 px).
- Implementation: `http://localhost:3001/`.
- Implementation screenshot: captured and visually inspected in the Codex in-app Browser at 1232 × 1189 CSS px, device pixel ratio 0.75; the browser capture API did not expose a filesystem path.
- State: signed-in VIP learner, desktop homepage, all three section headings visible.
- Density normalization: the references are focused heading crops; implementation typography was measured directly through browser computed styles.

## Evidence and required fidelity surfaces

- Fonts and typography: `Tính năng học tập`, `Chủ đề phổ biến`, and `Bài học gần đây` each resolve to exactly `18px`, weight 880. The existing font family, letter spacing and hierarchy are preserved.
- Spacing and layout rhythm: the heading rows, coral accent bars, section margins and card grids remain unchanged; only font size declarations were normalized.
- Colors and visual tokens: heading foreground and coral accent colors are unchanged.
- Image quality and asset fidelity: no image or icon assets changed.
- Copy and content: all three labels remain unchanged and fully visible.
- Responsiveness: base, intermediate and mobile overrides all specify 18px, preventing breakpoint drift.
- Horizontal overflow: none at the verified desktop viewport.
- Browser console warnings/errors: none.
- Scoped tests: 4 passed; scoped ESLint and `git diff --check`: passed.

## Findings and comparison history

1. Baseline P2: the headings used inconsistent responsive values, including 22px and 19px; `Bài học gần đây` also had a more specific 22px override.
2. Fix: normalized the shared rule and every more-specific breakpoint override to 18px, with regression coverage for the general and recent-lessons selectors.
3. Post-fix evidence: live computed styles report 18px for all three headings with no overflow or layout shift.

## Blocker

- The in-app Browser screenshot API did not provide a writable implementation path, and the browser security policy previously blocked the temporary combined comparison surface. The references and rendered implementation were both opened and inspected, but a persisted combined comparison artifact could not be produced within the selected browser.

No actionable P0, P1, or P2 implementation findings remain; only the required combined Design QA artifact is blocked.

final result: blocked

---

# Design QA — Trạng thái active của menu Luyện tập

- Source visual truth paths: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-2a93dc5a-e172-4fa0-b8d9-3cd2234a02e1.png` (253 × 402 px) and `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-76e6caaf-ae2a-4cc1-8386-8950b75a1528.png` (246 × 309 px).
- Implementation URL: `http://localhost:3001/courses/van-phong-hanh-chinh`.
- Implementation screenshot path: unavailable; the Codex in-app Browser rejected the localhost tab selection before a capture could be produced.
- Intended viewport/state: signed-in desktop learner rail; a non-practice primary route remains selected while the Luyện tập submenu is expanded, then Luyện tập becomes selected only after navigating to a practice child route.
- Density normalization: not applicable because the implementation capture was blocked.

## Evidence and required fidelity surfaces

- Fonts and typography: unchanged by this implementation.
- Spacing and layout rhythm: unchanged; the existing collapsed and expanded submenu layouts remain intact.
- Colors and visual tokens: the existing active styling is preserved, but is now applied from route membership instead of the disclosure state.
- Image quality and asset fidelity: no images or icon assets changed.
- Copy and content: all menu labels and child links remain unchanged.
- Interaction logic: `practiceMenuOpen` exclusively controls expansion; `practiceSectionActive` exclusively controls the Luyện tập active state; primary rail items continue deriving active state from the current route.
- Automated evidence: four scoped navigation tests passed; scoped ESLint and `git diff --check` passed.
- Browser evidence: blocked before interaction testing; console errors could not be checked for this iteration.

## Findings and comparison history

1. Baseline P1: clicking the Luyện tập disclosure set `practiceTriggerSelected`, which incorrectly removed active styling from the current route and applied active styling to Luyện tập before a child route was selected.
2. Fix: removed the transient selection state, preserved route-based active state on primary items, and made the Luyện tập trigger active only when the current or pending route matches a practice child.
3. Post-fix evidence: source-level regression tests verify submenu expansion remains independent from active selection. A rendered post-fix comparison could not be captured.

## Blocker

- The selected in-app Browser rejected the local implementation URL under its browser security policy. Without an implementation screenshot, the required combined source/implementation comparison and direct interaction verification cannot be completed.

No actionable issue remains in the scoped source and automated tests, but the required rendered Design QA evidence is unavailable.

final result: blocked

---

# Design QA — Tiêu đề catalog 25px với thanh nhấn trái

- Source visual truth paths: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-448963dc-9d15-44ea-8a68-994f0f326304.png` (489 × 98 px), `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-b7281c00-cc98-4dac-89c9-ef4c0613d937.png` (464 × 99 px), `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-09711278-8c0a-4025-b70c-9fb54aee00a9.png` (587 × 89 px), and style reference `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-f86cb2ca-2378-4fed-b3ea-d1f03b2d6052.png` (263 × 51 px).
- Implementation URLs: `http://localhost:3001/courses`, `http://localhost:3001/typing`, and `http://localhost:3001/writing`.
- Implementation screenshots: captured and visually inspected in the Codex in-app Browser; the screenshot API did not expose writable filesystem paths.
- Viewport: desktop in-app Browser, approximately 2256 × 1268 captured pixels.
- State: signed-in VIP learner; catalog title visible on each of the three routes.
- Density normalization: the source images are focused text crops while the implementations are full-page browser captures; no pixel-normalized combined artifact was available.

## Evidence and required fidelity surfaces

- Fonts and typography: all three target titles render at the requested 25px with a 1.4 line height. Existing font family and weight are preserved per page.
- Spacing and layout rhythm: each title uses 18px left padding and a 7px border, matching the established homepage section-heading treatment; surrounding page layouts remain unchanged.
- Colors and visual tokens: all three borders use the existing Himi coral `#ff5a4e`.
- Image quality and asset fidelity: no image or icon assets changed.
- Copy and content: `Chọn chủ đề bạn muốn học`, `Bài luyện gõ HSK`, and `Bài luyện viết theo HSK` remain unchanged and fully visible.
- Responsiveness: the final selectors are placed after existing responsive overrides so the requested 25px size is retained at all breakpoints.
- Browser evidence: all three routes were reloaded and visually inspected; no clipping or wrapping regression was visible.
- Automated evidence: the new focused regression test passed; scoped ESLint and `git diff --check` passed.

## Findings and comparison history

1. Baseline P2: the three catalog titles used different responsive font sizes and did not share the homepage's coral left-border treatment.
2. Fix: normalized each target selector to 25px, 18px left padding, a 7px solid `#ff5a4e` border, and 1.4 line height.
3. Post-fix evidence: browser captures show consistent title scale and border treatment on `/courses`, `/typing`, and `/writing` with no visible layout regression.

## Blocker

- The Browser screenshot API did not provide writable screenshot paths, so the required persisted combined source/implementation comparison artifact could not be produced. Separate source images and rendered pages were opened and inspected, but Design QA rules do not permit treating those separate views as a passing combined comparison.

No actionable P0, P1, or P2 implementation findings remain; only the required combined Design QA artifact is blocked.

final result: blocked

---

# Design QA — Thay ảnh bìa hero trang chủ

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-6a31b028-5615-4635-91e4-34eb90279b80.png` (1945 × 808 px).
- Implementation URL: `http://localhost:3001/`.
- Implementation asset: `public/assets/home/home-hero-cover-desktop.png` (1945 × 808 px, exact supplied source pixels).
- Implementation screenshot: captured twice and visually inspected in the Codex in-app Browser; the screenshot API did not expose a writable filesystem path.
- Viewport/state: signed-in VIP learner, desktop homepage, selected browser viewport approximately 1409 × 1189 CSS px.
- Density normalization: the implementation uses the source raster directly at its native 1945:808 aspect ratio; no resampling or generated substitute was introduced.

## Evidence and required fidelity surfaces

- Fonts and typography: all hero typography is now part of the supplied raster on desktop, preserving the exact source lettering, wrapping, weight, and spacing. Mobile retains the existing live-text hero.
- Spacing and layout rhythm: the desktop hero uses `aspect-ratio: 1945 / 808`, preserving the full composition without cropping; existing border radius and page spacing remain intact.
- Colors and visual tokens: the supplied warm coral, cream, black, and orange palette is preserved exactly.
- Image quality and asset fidelity: the original 1945 × 808 PNG was copied directly into the public asset folder and rendered through `next/image`; no approximation, recompression, or generated replacement was used.
- Copy and content: the desktop banner visibly contains `Nǐ hǎo!`, `Chào mừng bạn đến với Himi Chinese!`, the supporting sentence, and `Học là vui!` exactly as supplied.
- Responsiveness: the replacement is desktop-only at widths above 720px; the established mobile hero background, copy, mascot, CTA, and layout remain unchanged.
- Browser evidence: first capture exposed the legacy speech bubble layered over the supplied banner; the desktop hiding rule was moved to the end of the stylesheet and strengthened, and the second capture shows only the supplied banner with no duplicate copy, mascot, or bubble.
- Automated evidence: 4 home-responsive tests passed; the focused home rendering assertion passed. Scoped ESLint and `git diff --check` passed. The wider rendered-html suite still has 3 unrelated pre-existing failures.

## Findings and comparison history

1. Baseline P1: the previous desktop hero used a different background plus independent live copy, mascot, speech bubble, and CTA layers.
2. Fix: added the exact supplied banner asset, rendered it as the desktop hero cover at its native aspect ratio, and kept the existing mobile composition unchanged.
3. First post-fix P2: the legacy speech bubble remained visible because a later CSS rule overrode the initial desktop hide rule.
4. Second fix: moved the desktop-only override to the end of the stylesheet and scoped it to direct hero children.
5. Final visible evidence: the second browser capture shows the full supplied banner, correct crop and radius, and no duplicated overlay elements.

## Blocker

- The Browser screenshot API did not provide a writable screenshot path, so the mandatory persisted combined source/implementation comparison artifact could not be created. The source and both implementation iterations were opened and inspected, but separate views cannot be treated as a passing combined comparison under the Design QA rules.

No actionable P0, P1, or P2 implementation findings remain; only the required combined Design QA artifact is blocked.

final result: blocked

---

# Design QA — Hover nâng nhẹ các box trang chủ

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-44412757-1063-454f-9c60-b03b0e9a8d6c.png` (1604 × 659 px).
- Implementation URL: `http://localhost:3001/`.
- Implementation screenshot: captured and visually inspected in the Codex in-app Browser; the screenshot API did not expose a writable filesystem path.
- Viewport/state: signed-in VIP learner, desktop homepage, default non-hover state.
- Density normalization: source and implementation were inspected as desktop layouts; no combined normalized comparison artifact was available.

## Evidence and required fidelity surfaces

- Fonts and typography: unchanged.
- Spacing and layout rhythm: card dimensions and grid gaps remain unchanged in the resting state. Feature and topic cards lift 4px; recent lesson rows lift 3px.
- Colors and visual tokens: existing card colors are preserved; hover adds only a slightly stronger soft shadow and coral border emphasis where applicable.
- Image quality and asset fidelity: no image or icon assets changed.
- Copy and content: all labels, lesson titles, progress values, and links remain unchanged.
- Interaction state: hover transitions use a 220ms cubic-bezier motion and run only on fine-pointer devices through `@media (hover: hover) and (pointer: fine)`.
- Accessibility: `prefers-reduced-motion: reduce` removes both transitions and hover transforms; touch devices do not receive sticky hover movement.
- Automated evidence: all 4 home-responsive tests passed; scoped ESLint and `git diff --check` passed.
- Browser evidence: the resting page was reloaded and captured with no layout regression. The selected in-app Browser surface does not expose pointer-hover automation, so an actual hovered frame could not be captured.

## Findings and comparison history

1. Baseline P2: feature and topic cards had inconsistent lift distances, while recent lesson rows moved horizontally instead of lifting.
2. Fix: normalized desktop hover behavior to vertical lift with coordinated shadows and timing across the three card groups.
3. Post-fix source evidence: focused regression assertions verify feature/topic `translateY(-4px)`, recent lessons `translateY(-3px)`, the fine-pointer media query, and the reduced-motion fallback.

## Blocker

- The chosen in-app Browser can reload and capture the page but does not expose pointer movement or element hover controls. Therefore the required hovered implementation screenshot and combined source/implementation comparison could not be produced.

The resting layout has no actionable P0, P1, or P2 findings; direct rendered verification of the new hover state remains blocked.

final result: blocked

---

# Design QA — Menu Luyện tập mobile và gỡ `/practice`

- Source visual truth path: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-06524365-178f-4c4e-9894-74d1d44b2902.png` (249 × 101 px).
- Implementation URL: `http://localhost:3001/`.
- Implementation screenshot: desktop homepage captured and visually inspected in the Codex in-app Browser; the available in-app surface did not expose a mobile viewport control or pointer/click automation, so the requested open mobile-menu state could not be captured.
- Intended viewport/state: phone width at or below 720 CSS px, signed-in learner, homepage, `Luyện tập` menu expanded.
- Density normalization: unavailable because a matching mobile implementation capture could not be produced.

## Evidence and required fidelity surfaces

- Fonts and typography: the shared mobile menu preserves the existing compact labels and weights for `Lộ trình`, `Luyện gõ`, `Luyện viết`, `Luyện nghe`, `Video`, and `Bộ từ vựng`.
- Spacing and layout rhythm: the menu remains a 3-column × 2-row grid with equal cells, matching the reference structure.
- Colors and visual tokens: the existing pale mint option backgrounds and coral active state are preserved; opening the parent trigger alone no longer applies its active color.
- Image quality and asset fidelity: no raster artwork is involved; the existing Lucide icon components remain unchanged.
- Copy and content: the six labels and their destination routes match the supplied reference. The standalone `/practice` route and its loading route were removed.
- Interaction/accessibility: `Luyện tập` remains a semantic button with `aria-expanded` and `aria-controls`; choosing an option closes the menu and navigates. Opening the menu does not navigate or mark the parent active.
- Route evidence: public and admin-facing links formerly targeting `/practice` now use `/listening?mode=scenario`; daily-session links preserve scenario and session query parameters.
- Automated evidence: 51/54 selected tests passed; all focused tests for this change passed. The three failures are unrelated pre-existing assertions in staging configuration, legacy daily-session rendering, and course-cover counts. Scoped ESLint and `git diff --check` passed.
- Build evidence: Vinext compiled all 765 modules successfully, then the Sites close hook was blocked by an existing Windows file lock on `dist/.openai/hosting.json` (`EPERM`).

## Findings and comparison history

1. Baseline P1: the homepage-specific mobile `Luyện tập` item was a direct link to `/practice`, bypassing the six-option menu.
2. Fix: removed the duplicate homepage nav so the shared learner mobile navigation and its six-option menu render on the homepage.
3. Baseline P1: `/practice` remained as a legacy redirect route and several public/admin/daily-session links still targeted it.
4. Fix: deleted the route files and migrated those links to the canonical listening scenario mode.
5. Baseline P2: opening the parent menu visually applied the active color before a child destination was selected.
6. Fix: removed the `aria-expanded=true` active-color rule; active styling now follows only the selected child route.

## Blocker

- The selected in-app Browser surface can capture and navigate the desktop page but does not expose viewport resizing or click/pointer controls. Therefore the required matching mobile expanded-state screenshot and combined source/implementation comparison could not be produced.

No actionable code-level P0, P1, or P2 findings remain; direct visual verification of the expanded mobile state remains blocked.

final result: blocked

---

# Design QA — Bỏ breadcrumb trang Luyện viết

- Source visual truth: Browser annotation capture attached to the request, route `/writing`, target `.client-breadcrumb-bar` containing `Học tập / Luyện viết` (source capture path was not exposed by the annotation surface).
- Implementation: `http://localhost:3001/writing`.
- Browser-rendered implementation screenshot: Codex in-app Browser capture from 2026-10-03 (no persistent screenshot path exposed by the browser surface).
- Viewport: 1169 × 1189 CSS px, desktop, authenticated learner.
- State: writing catalog landing page after removing the shared breadcrumb on the exact `/writing` route.
- Density normalization: not required; comparison is limited to the presence/absence of the full-width breadcrumb row.

## Full-view and focused comparison evidence

- The original capture contains a full-width row between the top bar and the writing hero.
- The implementation capture begins the writing hero directly below the top bar; the targeted breadcrumb and its vertical space are gone.
- A focused crop is unnecessary because the removed row spans the complete content width and is clearly visible in the full-page comparison.

## Required fidelity surfaces

- Fonts and typography: all writing-page typography remains unchanged.
- Spacing and layout rhythm: the redundant breadcrumb row and its reserved height are removed; the hero moves upward without overlap.
- Colors and visual tokens: the writing page palette remains unchanged.
- Image quality and asset fidelity: the hero artwork and catalog assets remain unchanged and sharp.
- Copy and content: only `Học tập / Luyện viết` is removed; all writing-page content and links remain intact.

## Verification

- `/writing` accessibility tree no longer contains `Điều hướng trang` or `Học tập / Luyện viết`.
- Deeper writing routes retain their useful level and lesson breadcrumbs.
- Browser console errors: none.
- Breadcrumb tests: 5 passed; scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Bỏ box kỹ năng khỏi bản đồ trò chơi

- Source visual truth: browser annotation screenshot in the current task targeting `aside.game-journey-skills` on `/games`; the annotation capture did not expose a filesystem path.
- Implementation URL: `http://localhost:3001/games`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the capture API did not expose a filesystem path.
- Viewport: 1525 × 901 CSS px at device scale 1, matching the annotated desktop state.
- State: game journey map loaded with `Luyện chém từ` as the current station.

## Evidence and required fidelity surfaces

- Full-view comparison: the targeted `Kỹ năng bạn đang rèn` panel is absent while the map composition, featured game card, stations and chatbot remain intact.
- Focused DOM evidence: `.game-journey-skills` count is `0`; all six secondary `.game-journey-station` nodes remain present alongside the featured first station.
- Fonts and typography: no surviving typography or hierarchy was changed.
- Spacing and layout rhythm: removing the absolutely positioned panel does not alter the map grid or station positions.
- Colors and visual tokens: existing Himi palette and state colors remain unchanged.
- Image quality and asset fidelity: all original game artwork remains unchanged and fully rendered.
- Copy and content: only the requested skills-panel copy was removed.

## Verification

- Browser visual inspection at 1525 × 901: passed.
- Focused rendered-HTML test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Bỏ breadcrumb trang Luyện gõ

- Source visual truth: Browser annotation capture attached to the request, route `/typing`, target `.client-breadcrumb-bar` containing `Học tập / Luyện gõ` (source capture path was not exposed by the annotation surface; supplied image 1409 × 1189 px).
- Implementation: `http://localhost:3001/typing`.
- Browser-rendered implementation screenshot: Codex in-app Browser capture from 2026-10-03 (no persistent screenshot path exposed by the browser surface; capture 1708 × 1189 px).
- Viewport/state: desktop, authenticated learner, typing catalog landing page after removing the shared breadcrumb on the exact `/typing` route.
- Density normalization: not required; comparison is limited to the presence or absence of the full-width breadcrumb row.

## Full-view and focused comparison evidence

- The source capture contains a full-width breadcrumb row between the top bar and the typing hero.
- The implementation capture begins the typing hero directly below the top bar; the targeted breadcrumb and its reserved vertical space are gone.
- A focused crop is unnecessary because the removed row spans the complete content width and the result is unambiguous in the full-view capture.

## Required fidelity surfaces

- Fonts and typography: all typing-page typography remains unchanged.
- Spacing and layout rhythm: the redundant breadcrumb row and its reserved height are removed; the hero moves upward without overlap.
- Colors and visual tokens: the typing-page palette remains unchanged.
- Image quality and asset fidelity: the hero artwork and catalog assets remain unchanged and sharp.
- Copy and content: only `Học tập / Luyện gõ` is removed; all typing-page content and links remain intact.

## Verification

- `/typing` accessibility tree no longer contains `Điều hướng trang` or `Học tập / Luyện gõ`.
- Deeper typing routes retain their useful level and lesson breadcrumbs.
- Browser console errors: none.
- Breadcrumb tests: 5 passed; scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Lưới full-width trang Luyện viết

- Source visual truth: reference image attached to the Browser annotation and the live `/typing` catalog used by that image (attachment path was not exposed).
- Implementation: `http://localhost:3001/writing`.
- Browser-rendered captures: Codex in-app Browser captures of `/typing` and `/writing` at the same 1706 × 960 CSS viewport; screenshot paths were not exposed by the browser surface.
- State: authenticated desktop learner, expanded navigation rail, catalog landing pages.
- Density normalization: both live pages were captured by the same browser surface, viewport and device density.

## Full-view and focused comparison evidence

- Source `/typing`: content and grid are both 1437.33px wide, with three equal 467.1px columns and no horizontal overflow.
- Implementation `/writing`: content and grid are both 1437.33px wide, with the same three equal 467.1px columns and no horizontal overflow.
- At the normal 1173 × 1189 viewport, `/writing` remains full-width inside the learner area and renders three equal 361.33px columns; all six HSK cards form a 3 × 2 grid.
- The full-view captures clearly show page width, column count, card edges and spacing, so no additional focused crop was needed.

## Required fidelity surfaces

- Fonts and typography: existing writing typography and hierarchy are unchanged.
- Spacing and layout rhythm: the former large side padding is removed; hero, heading and grid now share one full-width alignment. Card gaps remain 18px like the reference.
- Colors and visual tokens: existing red/orange/white writing palette is preserved.
- Image quality and asset fidelity: the writing hero artwork is unchanged and remains sharp at the wider width.
- Copy and content: all writing labels, descriptions, counts and links remain unchanged.

## Comparison history and verification

1. Initial P2: the writing catalog used large page padding and switched to two columns too early, making its boxes visibly narrower than the three-column reference.
2. Fix: matched the typing catalog's 1480px full-width container, aligned the banner and topic section to 100%, and delayed the two-column breakpoint to 1050px.
3. Post-fix evidence: source and implementation have identical desktop grid widths and column tracks at the comparison viewport; the normal viewport has no horizontal overflow.

- Primary interaction checked: every visible card retains its `Xem bài học` link.
- Browser console errors: none.
- Focused writing route test: passed; scoped ESLint and `git diff --check`: passed.
- Known unrelated suite state: the broader `rendered-html` suite still has three pre-existing failures outside this change.

No actionable P0, P1, or P2 findings remain for this scoped layout update.

final result: passed

---

# Design QA — Bỏ mô tả phụ trang Luyện viết

- Source visual truth: Browser annotation on `/writing`, targeting `.writing-topic-heading > p` with the text `Chọn cấp độ rồi vào đúng bài đang học. Mỗi bài đều có xem nét, tô theo và tự viết.` (annotation capture path was not exposed).
- Implementation: `http://localhost:3001/writing`.
- Browser-rendered implementation screenshot: Codex in-app Browser capture from 2026-10-03 (no persistent screenshot path exposed by the browser surface).
- Viewport/state: 1173 × 1189 CSS px, authenticated desktop learner, writing catalog landing page.
- Density normalization: not required; comparison concerns the presence or absence of one text block at the same route and state.

## Evidence and required fidelity surfaces

- Full-view evidence: the targeted paragraph is absent and the HSK heading remains aligned above the unchanged three-column grid.
- Focused evidence: DOM inspection reports zero matching `.writing-topic-heading > p` elements containing the removed copy and one retained section heading.
- Fonts and typography: all remaining headings and card typography are unchanged.
- Spacing and layout rhythm: the empty right-side copy block is removed without leaving overflow or a placeholder.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: hero and card assets are unchanged.
- Copy and content: only the explicitly selected sentence is removed.

## Verification

- Browser console errors: none.
- Horizontal overflow: none.
- Focused writing route test, scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Empty state full box trên trang chủ

- Source visual truth: Browser annotation capture on `/`, targeting `.home-redesign-recent-empty` (annotation capture path was not exposed).
- Implementation: `http://localhost:3001/`; the empty-history state was rendered on the same local app through the clean `[::1]` origin to avoid changing the learner's existing local history.
- Browser-rendered implementation screenshot: Codex in-app Browser capture from 2026-10-03 (no persistent screenshot path exposed by the browser surface).
- Viewport/state: 1280 × 720 CSS px, desktop, empty recent-learning history.
- Density normalization: not required; source and implementation use the same desktop composition and the comparison focuses on the selected empty-state box.

## Evidence and required fidelity surfaces

- Full-view evidence: the dashed empty-state surface now occupies the complete content area below the `Bài học gần đây` heading.
- Focused measurements: recent section height 206px; content list height 141px; empty-state box height 141px. The empty box and list share the same top, bottom and width.
- Fonts and typography: message typography, centering and wrapping are unchanged.
- Spacing and layout rhythm: the unused space below the previous 60px box is removed; the message remains vertically and horizontally centered.
- Colors and visual tokens: existing border, white surface and muted text color are preserved.
- Image quality and asset fidelity: no image assets changed.
- Copy and content: empty-state wording is unchanged.

## Verification

- Empty state is visible and fills its content region without horizontal overflow.
- Populated recent lessons remain correctly stacked inside the same outer card.
- Browser console errors: none.
- Home responsive tests: 4 passed; scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped layout update.

final result: passed

---

# Design QA — Màu icon mũi tên thẻ khóa học

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-9635b796-9898-4967-8e12-c9250303ef91.png` (34 × 40 px).
- Implementation URL: `http://localhost:3001/courses`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/courses-chevron-color.jpg` (2257 × 1280 px).
- Focused source/implementation comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/courses-chevron-comparison.png` (460 × 230 px).
- Viewport/state: 1706 × 960 CSS px, desktop, authenticated course catalog, default card state.
- Density normalization: the 34 × 40 source and focused implementation crop were enlarged only for inspection; color verification used the browser's computed CSS value.

## Evidence and required fidelity surfaces

- Full-view evidence: all nine visible course-card double-chevron icons use the requested red while the catalog layout remains unchanged.
- Focused evidence: the combined comparison shows the same rounded bordered icon control, with only the double-chevron foreground changed to red.
- Fonts and typography: unchanged.
- Spacing and layout rhythm: the existing 42 × 42 px control, border and radius are unchanged.
- Colors and visual tokens: computed icon and SVG color are `rgb(255, 76, 59)`, equivalent to `#FF4C3B`; border and background remain unchanged.
- Image quality and asset fidelity: the existing Lucide vector icon is preserved; no raster assets changed.
- Copy and content: unchanged.

## Verification

- Primary interaction checked: course cards remain navigable; the icon remains visually static on hover and retains the existing focus treatment.
- Browser console errors: none.
- Focused course-roadmap UI tests: 3 passed.
- `git diff --check`: passed for the scoped files.

No actionable P0, P1, or P2 findings remain for this scoped color update.

final result: passed

---

# Design QA — Bỏ box ngoài icon mũi tên

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-5f715115-309f-4157-beab-be8daee75b11.png` (38 × 46 px), with the user's explicit override to remove the outer box and keep only the icon.
- Implementation URL: `http://localhost:3001/courses`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/courses-chevron-icon-only.jpg` (2257 × 1280 px).
- Focused source/implementation comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/courses-chevron-icon-only-comparison.png` (460 × 230 px).
- Viewport/state: 1706 × 960 CSS px, desktop, authenticated course catalog, default card state.
- Density normalization: the source and focused implementation crop were enlarged for inspection; computed CSS measurements were used for exact box verification.

## Evidence and required fidelity surfaces

- Full-view evidence: all nine visible course cards now show the red double-chevron without a surrounding white box or border.
- Focused evidence: the combined comparison makes the requested removal visible while preserving the same icon form.
- Fonts and typography: unchanged.
- Spacing and layout rhythm: the wrapper now resolves to the icon's intrinsic 23 × 23 px size; no surrounding 42 × 42 px box remains.
- Colors and visual tokens: icon remains `rgb(255, 76, 59)` (`#FF4C3B`); wrapper background is transparent and border width is 0px.
- Image quality and asset fidelity: the existing Lucide vector icon is preserved and remains sharp.
- Copy and content: unchanged.

## Verification

- Default and focus CSS states no longer add a border or background to the icon wrapper.
- Course cards remain navigable and the catalog layout is unchanged.
- Browser console errors: none.
- Focused course-roadmap UI tests: 3 passed.
- `git diff --check`: passed for the scoped files.

No actionable P0, P1, or P2 findings remain for this scoped visual update.

final result: passed

---

# Design QA — Màu badge HSK 3 và HSK 6

- Source visual truth: two browser annotation captures on `/writing` targeting the `HSK 3` and `HSK 6` badges, each specifying `#FF4C3B` (annotation file paths were not exposed).
- Implementation URL: `http://localhost:3001/writing`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/writing-hsk-3-6-badges-red.jpg` (1547 × 1585 px).
- Focused source/implementation comparison: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/writing-hsk-3-6-color-comparison.png` (520 × 240 px), using the exact requested color swatch beside both rendered badges.
- Viewport/state: desktop authenticated writing catalog, default card state.
- Density normalization: focused badge crops were enlarged uniformly for inspection; exact color was verified from computed CSS.

## Evidence and required fidelity surfaces

- Full-view evidence: `HSK 3` and `HSK 6` now visually match the red badges used by the other HSK levels.
- Focused evidence: both badge crops match the `#FF4C3B` reference swatch; computed background is `rgb(255, 76, 59)`.
- Fonts and typography: badge text, weight and white foreground are unchanged.
- Spacing and layout rhythm: badge padding, pill radius and card layout are unchanged.
- Colors and visual tokens: only the two requested badge backgrounds changed from orange to `#FF4C3B`; foreground remains white.
- Image quality and asset fidelity: no image assets changed.
- Copy and content: unchanged.

## Verification

- Browser console errors: none.
- Focused writing badge color test: 1 passed.
- `git diff --check`: passed for the scoped files.

No actionable P0, P1, or P2 findings remain for this scoped color update.

final result: passed

---

# Design QA — Bỏ tiêu đề và box Himi khỏi header HSK

- Source visual truth: two browser annotation captures on `/courses?view=hsk` (1280 × 756 px each), targeting `#hsk-curriculum-title` and `.hsk-curriculum-coach`; annotation file paths were not exposed.
- Implementation URL: `http://localhost:3001/courses?view=hsk`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/hsk-header-without-title-coach.jpg` (2256 × 1280 px).
- Viewport/state: 1706 × 960 CSS px, desktop, authenticated HSK 1 curriculum with the first topic expanded.
- Density normalization: not required for the removal check; source and implementation were compared by the same header region and DOM selectors.

## Evidence and required fidelity surfaces

- Full-view evidence: the large `Lộ trình bài học HSK 1` heading and the Himi coach illustration/message are absent; the back link, HSK tabs, progress and industry link remain visible.
- Focused evidence: no separate crop was needed because both removed regions occupied the complete top header; DOM verification reports zero matches for `#hsk-curriculum-title` and `.hsk-curriculum-coach`.
- Fonts and typography: retained controls and lesson typography are unchanged.
- Spacing and layout rhythm: header height is reduced to about 147px and the tabs/progress move upward without leaving the former empty coach column.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: only the explicitly selected coach asset is removed; all remaining course imagery is unchanged.
- Copy and content: only the selected title and coach message are removed; navigation and progress copy remain.

## Verification

- Primary interaction checked: HSK level tabs, progress summary and topic disclosure remain present.
- Browser console errors: none.
- HSK curriculum tests: 3 passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Bỏ breadcrumb trang Lộ trình (latest)

- Source visual truth: browser annotation capture on `/courses` (1525 × 901 px) targeting `.client-breadcrumb-bar`; the annotation file path was not exposed.
- Implementation URL: `http://localhost:3001/courses`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/courses-without-breadcrumb.jpg` (2256 × 1280 px).
- Viewport/state: 1706 × 960 CSS px, desktop, authenticated course catalog.
- Density normalization: not required for the removal check; the source and implementation were compared using the same top-of-page content region and the annotated DOM selector.

## Evidence and required fidelity surfaces

- Full-view evidence: the selected `Học tập / Lộ trình` breadcrumb box is absent and the catalog begins with `Chọn chủ đề bạn muốn học`.
- Focused evidence: a separate crop was unnecessary because the selected element occupied the full-width strip above the catalog; DOM verification reports zero `.client-breadcrumb-bar` elements.
- Fonts and typography: the catalog heading and card typography are unchanged.
- Spacing and layout rhythm: the removed strip no longer reserves vertical space; the course catalog remains aligned and has no horizontal overflow.
- Colors and visual tokens: unchanged outside the removed breadcrumb surface.
- Image quality and asset fidelity: course card imagery remains unchanged and sharp.
- Copy and content: only the selected breadcrumb copy is removed; the heading, filters and course cards remain present.

## Verification

- Primary page content checked: catalog heading and the HSK course card remain visible.
- Browser console errors: none.
- Focused breadcrumb tests: 5 passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Bỏ breadcrumb trang chi tiết lộ trình

- Source visual truth: browser annotation capture on `/courses/van-phong-hanh-chinh` (1525 × 901 px) targeting `.client-breadcrumb-bar`; the annotation file path was not exposed.
- Implementation URL: `http://localhost:3001/courses/van-phong-hanh-chinh`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/course-detail-without-breadcrumb.jpg` (2256 × 1280 px).
- Viewport/state: 1525 × 901 CSS px, desktop, authenticated roadmap detail with the first stage expanded.
- Density normalization: not required for the removal check; source and implementation use the same route, content and interaction state.

## Evidence and required fidelity surfaces

- Full-view evidence: the selected `Lộ trình / Chi tiết lộ trình` strip is absent and the page begins directly with `Lộ trình học` and the roadmap title.
- Focused evidence: no separate crop was needed because the selected element occupied the complete top strip; DOM verification reports zero `.client-breadcrumb-bar` elements.
- Fonts and typography: roadmap title, lesson rows and summary typography are unchanged.
- Spacing and layout rhythm: the removed strip no longer reserves vertical space; the roadmap and summary panel remain aligned with no horizontal overflow.
- Colors and visual tokens: unchanged outside the removed breadcrumb surface.
- Image quality and asset fidelity: stage thumbnails and the Himi coach illustration remain unchanged and sharp.
- Copy and content: only the selected breadcrumb copy is removed; the roadmap title, progress, lessons and summary remain present.

## Verification

- Primary interactions checked: all 30 lesson links remain in the DOM and the first roadmap stage remains expanded.
- Browser console errors: none.
- Focused breadcrumb tests: 5 passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Thẻ quay lại trên trang chi tiết lộ trình

- Source visual truth: browser annotation on `/courses/van-phong-hanh-chinh` plus the attached compact reference showing a left arrow and `Về trang Lộ trình`; attachment file path was not exposed.
- Implementation URL: `http://localhost:3001/courses/van-phong-hanh-chinh`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/course-roadmap-back-link.jpg` (2256 × 1280 px).
- Viewport/state: 1525 × 901 CSS px, desktop, authenticated roadmap detail, page scrolled to the top.
- Density normalization: not required; the reference is a focused component crop and the implementation was inspected at rendered CSS size.

## Evidence and required fidelity surfaces

- Full-view evidence: `Về trang Lộ trình` appears immediately above `Lộ trình Văn phòng & hành chính` without displacing the progress bar or roadmap controls.
- Focused evidence: DOM geometry confirms the back link is above the title with a 7px gap; its destination is `/courses`.
- Fonts and typography: 13px, weight 700, matching the compact reference hierarchy.
- Spacing and layout rhythm: inline arrow/text alignment and 7px title separation match the supplied compact treatment; no horizontal overflow is introduced.
- Colors and visual tokens: default text uses `rgb(63, 75, 80)` and changes to the existing Himi red on hover/focus.
- Image quality and asset fidelity: the arrow uses the existing Lucide icon library and remains vector-sharp.
- Copy and content: exact requested copy `Về trang Lộ trình`; the former non-interactive eyebrow is replaced by this functional link.

## Verification

- Primary interaction: link resolves to `/courses`.
- Browser console errors: none.
- Focused course-roadmap UI tests: 3 passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped addition.

final result: passed

---

# Design QA — Bỏ tiến độ khỏi header chi tiết lộ trình

- Source visual truth: browser annotation capture on `/courses/van-phong-hanh-chinh` (1525 × 901 px) targeting `.course-roadmap-progress-row`; annotation file path was not exposed.
- Implementation URL: `http://localhost:3001/courses/van-phong-hanh-chinh`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/course-roadmap-without-header-progress.jpg` (2256 × 1280 px).
- Viewport/state: 1525 × 901 CSS px, desktop, authenticated roadmap detail with the first stage expanded.
- Density normalization: not required for the removal check; source and implementation use the same route and interaction state.

## Evidence and required fidelity surfaces

- Full-view evidence: the selected `1 / 30 bài`, progress track and `3%` row is absent from the header; the roadmap begins below the title divider.
- Focused evidence: a separate crop was unnecessary because the selected row spanned the full title column; DOM verification reports zero `.course-roadmap-progress-row` elements.
- Fonts and typography: the back link, page title and roadmap typography remain unchanged.
- Spacing and layout rhythm: header height contracts cleanly without leaving an empty progress-row gap; no horizontal overflow is introduced.
- Colors and visual tokens: unchanged outside the removed progress row.
- Image quality and asset fidelity: roadmap and coach imagery remain unchanged.
- Copy and content: only the selected header progress summary is removed; `Tiến độ tổng` remains available in the overview panel.

## Verification

- Primary page content checked: back link, title, switch action, lesson stages and overview progress remain present.
- Browser console errors: none.
- Focused course-roadmap UI tests: 3 passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Đồng bộ tone box chặng bài học

- Source visual truth: browser annotation on the active roadmap stage plus the attached HSK topic reference showing a white lesson surface, neutral separators and orange accents; attachment file path was not exposed.
- Implementation URL: `http://localhost:3001/courses/van-phong-hanh-chinh`.
- Browser-rendered implementation screenshot: `D:/Code/HiMi/Hanzi-work-lab-nextjs-web-app/tmp/design-qa/course-roadmap-neutral-tone.jpg` (2256 × 1280 px).
- Viewport/state: 1525 × 901 CSS px, desktop, authenticated roadmap detail with stage 1 expanded.
- Density normalization: not required; the visual comparison focused on palette, borders and row states rather than pixel-identical structure.

## Evidence and required fidelity surfaces

- Full-view evidence: the active stage now reads as a white lesson list with light neutral separators and orange status/progress accents, matching the HSK reference tone.
- Focused evidence: computed styles confirm white backgrounds for the stage, list, in-progress row and completed row; stage shadow is removed and borders use the neutral line token.
- Fonts and typography: lesson hierarchy, weights and labels are preserved.
- Spacing and layout rhythm: existing roadmap image header, row heights and open/close affordance remain unchanged.
- Colors and visual tokens: pink/red surface fills are removed; `Đang học` uses the orange-soft state while the progress ring keeps the existing red-to-orange treatment.
- Image quality and asset fidelity: course thumbnail and Himi artwork remain unchanged.
- Copy and content: all six lessons, statuses, durations and progress values remain unchanged.

## Verification

- Primary interaction checked: stage 1 remains expanded and lesson links remain available.
- Browser console errors: none.
- Focused course-roadmap UI tests: 4 passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped tone update.

final result: passed

---

# Design QA — Bài luyện viết luôn nằm gọn trong viewport

- Source visual truth: `codex-clipboard-a07bea1c-ad02-44bd-9b1b-9e26338cc11c.png` (trạng thái lỗi 1914 × 806 px) và `codex-clipboard-2406d6ea-be7a-4a9a-afe1-0b28bc6f804b.png` (giao diện mục tiêu 1898 × 883 px).
- Implementation URL: `http://localhost:3001/writing/hsk-1/hsk1-bai-01-chao-anh/practice`.
- Viewports verified in the in-app browser: 1914 × 807, 1898 × 883, 1367 × 768 và 391 × 844 CSS px.
- Density normalization: browser viewport override was normalized to the rendered CSS viewport before geometry comparison.

## Evidence and required fidelity surfaces

- Full-view evidence: ở 1914 × 807, khung luyện viết kết thúc tại y=737, nút thao tác tại y=645 và footer bắt đầu tại y=745; không còn phần tử bị footer che.
- Focused evidence: ở 1898 × 883, khung luyện viết kết thúc tại y=805, nút thao tác tại y=719 và footer bắt đầu tại y=817, khớp bố cục của ảnh mục tiêu.
- Fonts and typography: không thay đổi font, cỡ chữ hay phân cấp nội dung.
- Spacing and layout rhythm: bảng chữ co theo chiều cao khả dụng; màn hình thấp dùng khoảng đệm và nút gọn hơn nhưng vẫn giữ nhịp dọc rõ ràng.
- Colors and visual tokens: giữ nguyên toàn bộ palette đỏ, trắng và nền xám hiện tại.
- Mobile behavior: trang ngoài vẫn cố định trong `100dvh`; nội dung bài học cuộn bên trong vùng workspace, footer luôn nằm trong viewport và các nút luyện tập xuất hiện trước phần thông tin chữ.

## Verification

- 1914 × 807: `documentScrollHeight === innerHeight`, nút thao tác không chạm footer.
- 1898 × 883: `documentScrollHeight === innerHeight`, toàn bộ card và footer cùng nằm trong viewport.
- 1367 × 768: kiểm tra hình học đạt, không có cuộn trang ngoài.
- 391 × 844: trang ngoài không tràn; workspace dùng cuộn nội bộ có kiểm soát.
- Focused writing-route test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this responsive containment update.

final result: passed

---

# Design QA — Thanh điều hướng mobile trên `/videos`

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-eaac31d8-efd6-4de9-a7e8-0d1ba7e0466f.png` (trạng thái lỗi, 280 × 54 px) và `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-8281fd29-d4b8-43d8-a62a-ab1eb8924136.png` (trạng thái mục tiêu, 280 × 54 px).
- Implementation URL: `http://localhost:3001/videos`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser at 391 × 844 CSS px; the browser capture API did not expose a filesystem path.
- Density normalization: the source is a focused navigation crop; the implementation was judged against the matching bottom-navigation region rather than the full page.
- State: video library loaded on mobile, practice menu closed, chatbot deferred component mounted.

## Evidence and required fidelity surfaces

- Full-view evidence: the video catalog remains usable and the mobile navigation stays pinned to the bottom without an overlapping floating control.
- Focused evidence: DOM state confirms `Hôm nay` is active with `aria-current="page"`, `Luyện tập` is inactive, and the mounted chatbot widget computes to `display: none`.
- Fonts and typography: labels, sizes, weights and five-column hierarchy are unchanged from the reference navigation.
- Spacing and layout rhythm: the existing 72px navigation height, item spacing, top radii and shadow are preserved.
- Colors and visual tokens: the red active token is applied only to `Hôm nay`; the remaining items use the neutral gray token.
- Image quality and asset fidelity: navigation uses the existing Lucide icon set; no raster or replacement assets were introduced.
- Copy and content: all five labels remain `Hôm nay`, `Luyện tập`, `Trò chơi`, `VIP`, and `Tài khoản`.

## Verification

- Primary state: `/videos` activates the home tab only.
- Delayed state: chatbot remains hidden after its deferred component mounts.
- Focused tests: 3 passed.
- Scoped ESLint and `git diff --check`: passed.

## Comparison history

- P1: `Luyện tập` was active on `/videos`, differing from the supplied target. Fixed by assigning the video-library mobile state to `Hôm nay` and excluding it from the mobile practice-active calculation.
- P1: the chatbot launcher overlapped the mobile navigation region. Fixed by hiding the launcher on `.video-library-page` at the mobile breakpoint.

No actionable P0, P1, or P2 findings remain for this scoped mobile navigation fix.

final result: passed

---

# Design QA — Bỏ box thể lệ khỏi màn chọn khóa HSK

- Source visual truth: browser annotation screenshot on `/games` at 1525 × 901 CSS px, targeting the box labelled `Thể lệ mỗi lượt chơi`.
- Implementation URL: `http://localhost:3001/games`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the browser capture API did not expose a filesystem path.
- State: `Luyện chém từ` course-selection screen with all six HSK choices visible.

## Evidence and required fidelity surfaces

- The targeted `.writing-course-facts` box is absent from the slice-game course-selection screen.
- The heading `Chọn khóa HSK để chơi`, mascot artwork, six HSK course cards and bottom status message remain present.
- DOM inspection reports `factsCount: 0` and `courseButtons: 6`.
- No shared `.writing-course-facts` styling was removed, so other game experiences that still use the component remain unaffected.

## Verification

- Browser visual inspection at desktop size: passed.
- Focused rendered-HTML test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Bỏ breadcrumb khỏi trang Trò chơi

- Source visual truth: browser annotation screenshot in the current task targeting `div#learner-main-content > div.client-breadcrumb-bar` on `/games`; the annotation capture did not expose a filesystem path.
- Implementation URL: `http://localhost:3001/games`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the capture API did not expose a filesystem path.
- Viewport and density: source and implementation use 1525 × 901 CSS px at device scale 1; no density normalization was required.
- State: game journey map loaded with `Luyện chém từ` as the current station.

## Evidence and required fidelity surfaces

- Full-view comparison: the requested `Học tập / Trò chơi` breadcrumb row is absent and the journey map begins directly below the persistent top header.
- Focused DOM evidence: `.client-breadcrumb-bar` count is `0`, `.game-journey-stage` count remains `1`, and the game dashboard top begins at approximately 88px.
- Fonts and typography: no surviving text style, weight or hierarchy changed.
- Spacing and layout rhythm: the removed row leaves no blank band; the map reflows upward naturally.
- Colors and visual tokens: the map, navigation and active-game colors remain unchanged.
- Image quality and asset fidelity: all original journey artwork remains unchanged and fully rendered.
- Copy and content: only the requested breadcrumb text was removed from `/games`.

## Verification

- Browser visual inspection at 1525 × 901: passed.
- Client breadcrumb test suite: 5 passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Bỏ hero khỏi trang cấp độ Luyện gõ

- Source visual truth: browser annotation screenshot in the current task targeting `header.typing-lesson-hero` on `/typing/hsk-1`; the annotation capture did not expose a filesystem path.
- Implementation URL: `http://localhost:3001/typing/hsk-1`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the capture API did not expose a filesystem path.
- Viewport and density: source is 1525 × 901 CSS px; implementation was inspected at 1140 × 901 CSS px at device scale 1. The changed region is responsive and was compared by DOM identity and layout behavior rather than pixel position.
- State: HSK 1 typing lesson list with all 15 lessons loaded.

## Evidence and required fidelity surfaces

- Full-view comparison: the requested hero is absent and the lesson-card grid begins directly below the retained `Các cấp độ / HSK 1` breadcrumb.
- Focused DOM evidence: `.typing-lesson-hero` count is `0`, `.typing-lesson-card` count remains `15`, and the list begins at approximately 192px in the inspected viewport.
- Fonts and typography: all lesson-card and breadcrumb typography remains unchanged.
- Spacing and layout rhythm: the lesson grid reflows upward with no placeholder or empty hero space.
- Colors and visual tokens: cards, badges and action buttons retain the current Himi palette.
- Image quality and asset fidelity: this scoped removal changes no image assets.
- Copy and content: only hero-specific copy and its preview-character strip were removed; lesson content is intact.

## Verification

- Browser visual inspection: passed.
- Focused typing-level test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Bỏ hero khỏi trang cấp độ Luyện viết

- Source visual truth: browser annotation screenshot in the current task targeting `header.writing-lesson-hero` on `/writing/hsk-1`; the annotation capture did not expose a filesystem path.
- Implementation URL: `http://localhost:3001/writing/hsk-1`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the capture API did not expose a filesystem path.
- Viewport and density: source is 1525 × 901 CSS px; implementation was inspected at 1706 × 960 CSS px at device scale 1. The scoped responsive region was compared using DOM identity and layout behavior.
- State: HSK 1 writing lesson list with all 15 lessons loaded.

## Evidence and required fidelity surfaces

- Full-view comparison: the requested hero is absent and the lesson-card grid begins directly below the retained `Các cấp độ / HSK 1` breadcrumb.
- Focused DOM evidence: `.writing-lesson-hero` count is `0`, `.writing-lesson-card` count remains `15`, and the list starts at approximately 240px in the inspected viewport.
- Fonts and typography: all lesson-card and breadcrumb typography remains unchanged.
- Spacing and layout rhythm: hero-specific separation was removed so the lesson grid reflows upward without a placeholder gap.
- Colors and visual tokens: cards, character chips and action buttons retain the current Himi palette.
- Image quality and asset fidelity: this scoped removal changes no image assets.
- Copy and content: only hero-specific copy and its preview-character strip were removed; all lesson content remains intact.

## Verification

- Browser visual inspection: passed.
- Focused writing-route test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Căn giữa box luyện viết

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-afb0f5dc-5083-4083-9ed8-166e598bf046.png`.
- Source dimensions: 772 × 642 px.
- Implementation URL: `http://localhost:3001/writing/hsk-1/hsk1-bai-01-chao-anh/practice`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the capture API did not expose a filesystem path.
- Viewport and density: implementation inspected at 1706 × 960 CSS px at device scale 1.
- States checked: `Xem nét` and `Tô theo`.

## Evidence and required fidelity surfaces

- Full-view comparison: the mode tabs, character board, progress bar and action buttons form one centered vertical group inside the practice card.
- Focused DOM evidence: the practice card computed `align-items: center`; the practice, tabs, board, feedback and actions all share an x-center of approximately 736.83px in both inspected modes.
- Typography: no font, size, weight or line-height was changed.
- Spacing and layout rhythm: existing vertical spacing is preserved while child alignment is made explicit and stable.
- Colors and visual tokens: no color token changed.
- Image quality and assets: no image asset changed.
- Copy and behavior: no copy or writing interaction changed.

## Verification

- Browser visual inspection in `Xem nét`: passed.
- Browser visual inspection in `Tô theo`: passed.
- Focused writing-route test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped centering change.

final result: passed

---

# Design QA — Bỏ banner trang Luyện viết

- Source visual truth: browser annotation screenshot in the current task targeting `header.himi-section-banner.is-immersive` on `/writing`; the annotation capture did not expose a filesystem path.
- Implementation URL: `http://localhost:3001/writing`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the capture API did not expose a filesystem path.
- Source viewport: 1140 × 901 CSS px from the browser annotation.
- Implementation viewport: 1706 × 960 CSS px at device pixel ratio 0.9375.
- State: writing catalog with all six HSK level cards loaded.

## Evidence and required fidelity surfaces

- Full-view comparison: the annotated hero banner is absent and `Bài luyện viết theo HSK` now begins directly below the persistent application header.
- Focused DOM evidence: `.himi-section-banner` count is `0`, `.writing-topic-card` count remains `6`, and the topic section begins at approximately 114px with no horizontal overflow.
- Fonts and typography: the HSK section heading and all card typography remain unchanged.
- Spacing and layout rhythm: banner-specific spacing was removed; the catalog section now uses a zero top margin on desktop and mobile breakpoints.
- Colors and visual tokens: no palette or semantic color changed.
- Image quality and asset fidelity: the removed banner was the only affected image surface; card content and icons remain intact.
- Copy and content: only the banner title and description were removed; all HSK level content remains present.

## Findings and comparison history

- Initial P2: removing only the component would leave banner-oriented top spacing at responsive breakpoints.
- Fix: removed the banner component, its unused data/import, and the catalog-specific banner spacing rules; normalized the topic section top margin to zero.
- Post-fix evidence: the browser capture shows the heading and six cards reflowed upward without a blank placeholder or overflow.

## Verification

- Browser visual inspection: passed.
- Writing catalog banner test: passed.
- Focused writing-route test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped removal.

final result: passed

---

# Design QA — Liên kết quay lại trang cấp độ Luyện gõ

- Source visual truth: browser annotation on `/typing/hsk-1` plus the attached 256 × 92 px reference crop showing `‹ Về trang Lộ trình`; the attachment API did not expose a filesystem path.
- Implementation URL: `http://localhost:3001/typing/hsk-1`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the capture API did not expose a filesystem path.
- Source viewport: 1140 × 901 CSS px for the annotated page.
- Implementation viewport: 1706 × 960 CSS px at device pixel ratio 0.9375.
- State: HSK 1 lesson list with all 15 lesson cards loaded.

## Evidence and required fidelity surfaces

- Full-view comparison: the full-width shared breadcrumb bar is absent and a compact back link now sits inside the page content above the lesson grid.
- Focused region comparison: the new link uses a left chevron, 16px text, 700 weight, dark neutral color and a 6px icon gap, matching the reference's compact single-line treatment.
- Focused DOM evidence: `.client-breadcrumb-bar` count is `0`; the link text is `Về trang Luyện gõ`, its href is `/typing`, and its measured size is approximately 153 × 36px.
- Fonts and typography: the link inherits the existing app font and uses the reference-like 16px/700 hierarchy; lesson-card typography is unchanged.
- Spacing and layout rhythm: the link occupies one 36px row with a 16px gap before the lesson grid; no empty breadcrumb container remains.
- Colors and visual tokens: neutral text uses `#3f4b50`, with the existing Himi red token reserved for hover/focus feedback.
- Image quality and asset fidelity: no raster assets were changed; the chevron comes from the project's existing Lucide icon library.
- Copy and content: the label is contextualized to `Về trang Luyện gõ`; all HSK lesson content remains intact.

## Findings and comparison history

- Initial P2: the shared breadcrumb displayed two labels and occupied a full-width page bar, unlike the compact reference link.
- Fix: suppressed the shared breadcrumb for typing level pages and replaced the hidden local breadcrumb with one accessible back link.
- Post-fix evidence: the browser capture shows the compact link in the intended location, and activating it navigates successfully to `/typing`.

## Verification

- Browser visual inspection: passed.
- Back-link interaction to `/typing`: passed.
- Client breadcrumb tests: 5 passed.
- Focused typing-level test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped navigation change.

final result: passed

---

# Design QA — Liên kết quay lại trang bài học Luyện gõ

- Source visual truth: browser annotation on `/typing/hsk-1/hsk1-l1` plus the attached 256 × 92 px reference crop showing `‹ Về trang Lộ trình`; the attachment API did not expose a filesystem path.
- Implementation URL: `http://localhost:3001/typing/hsk-1/hsk1-l1`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the capture API did not expose a filesystem path.
- Source viewport: 1140 × 901 CSS px for the annotated page.
- Implementation viewport: 1706 × 960 CSS px at device pixel ratio 0.9375.
- State: HSK 1 lesson 1 choice screen with word and sentence practice cards.

## Evidence and required fidelity surfaces

- Full-view comparison: the full-width `HSK 1 / Bài học` breadcrumb is gone and one compact back link appears above the lesson hero.
- Focused region comparison: the link uses the same left chevron, 16px/700 typography, neutral color and spacing as the supplied reference and the preceding HSK-level implementation.
- Focused DOM evidence: `.client-breadcrumb-bar` count is `0`, `.typing-level-back a` count is `1`, and the link measures approximately 132 × 36px with text `Về trang HSK 1` and href `/typing/hsk-1`.
- Fonts and typography: no hero or card typography changed; the new link inherits the app font and shared back-link styling.
- Spacing and layout rhythm: the link occupies one compact row, followed by a 16px gap before the hero; the previous duplicate navigation row is removed.
- Colors and visual tokens: the neutral back-link color and Himi red hover/focus token match the established pattern.
- Image quality and asset fidelity: no raster assets changed; the existing Lucide chevron is used.
- Copy and content: the contextual label points to the exact previous level page; lesson title, practice choices and tip remain intact.

## Findings and comparison history

- Initial P2: after exposing route-local navigation, the detail page temporarily showed both the shared breadcrumb and its older local breadcrumb.
- Fix: suppressed the shared breadcrumb for non-session typing pages and converted the local row into the single reference-style back link.
- Post-fix evidence: the browser capture shows exactly one link, no duplicate breadcrumb, no horizontal overflow, and successful navigation to `/typing/hsk-1`.

## Verification

- Browser visual inspection: passed.
- Back-link interaction to `/typing/hsk-1`: passed.
- Client breadcrumb tests: 5 passed.
- Focused typing lesson test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped navigation change.

final result: passed

---

# Design QA — Liên kết quay lại trang cấp độ Luyện viết

- Source visual truth: browser annotation on `/writing/hsk-1` plus the attached 256 × 92 px reference crop showing `‹ Về trang Lộ trình`; the attachment API did not expose a filesystem path.
- Implementation URL: `http://localhost:3001/writing/hsk-1`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the capture API did not expose a filesystem path.
- Source viewport: 1140 × 901 CSS px for the annotated page.
- Implementation viewport: 1140 × 901 CSS px at device pixel ratio 0.9375.
- State: HSK 1 lesson list with all 15 lesson cards loaded.

## Evidence and required fidelity surfaces

- Full-view comparison: the full-width shared breadcrumb bar is absent and a compact back link now sits inside the page content above the lesson grid.
- Focused region comparison: the new link uses a left chevron, 16px text, 700 weight, dark neutral color and a 6px icon gap, matching the reference's compact single-line treatment.
- Focused DOM evidence: `.client-breadcrumb-bar` count is `0`; `.writing-level-back a` count is `1`; the link text is `Về trang Luyện viết`, its href is `/writing`, and its measured size is approximately 161 × 36px.
- Fonts and typography: the link inherits the existing app font and uses the reference-like 16px/700 hierarchy; lesson-card typography is unchanged.
- Spacing and layout rhythm: the link occupies one 36px row with a 16px gap before the lesson grid; no empty breadcrumb container remains.
- Colors and visual tokens: neutral text uses `#3f4b50`, with the existing Himi red token reserved for hover/focus feedback.
- Image quality and asset fidelity: no raster assets were changed; the chevron comes from the project's existing Lucide icon library.
- Copy and content: the label is contextualized to `Về trang Luyện viết`; all 15 HSK 1 lesson cards remain intact.

## Findings and comparison history

- Initial P2: the shared breadcrumb displayed two labels and occupied a full-width page bar, unlike the compact reference link.
- Fix: suppressed the shared breadcrumb for writing level pages and replaced the local breadcrumb with one accessible back link.
- Post-fix evidence: the browser capture shows the compact link in the intended location, no horizontal overflow, and successful navigation to `/writing`.

## Verification

- Browser visual inspection: passed.
- Back-link interaction to `/writing`: passed.
- Client breadcrumb tests: 5 passed.
- Focused writing route test: passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped navigation change.

final result: passed

---

# Design QA — Header điều hướng mobile dùng chung

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-c03c9edb-e875-41ec-bc5d-28d89e0b4098.png`, a 414 × 62 px crop showing a warm-white mobile header with back chevron, centered title and notification bell.
- Implementation URL: `http://localhost:3001/typing/hsk-1`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the screenshot API did not expose a filesystem path.
- Implementation capture: 675 × 1500 px JPEG; browser-reported viewport 520 × 1125 CSS px at device pixel ratio 0.75.
- Density normalization: the focused header region was compared by its CSS geometry and proportional layout because the source is a component crop while the implementation capture includes the full page.
- State: authenticated HSK 1 typing lesson selection on a phone layout, with the shared bottom navigation visible.

## Evidence and required fidelity surfaces

- Full-view comparison: the lesson grid begins immediately below one sticky header, while the bottom navigation remains fully visible and the page has no horizontal overflow.
- Focused region comparison: source and implementation both use three equal control tracks, a left chevron, centered bold title and right bell on a warm-white surface with a fine coral top edge.
- Focused DOM evidence: `.learner-mobile-header` count is `1`; title is `Chọn bài luyện gõ`; back href is `/typing`; the header measures approximately 507 × 56 CSS px and both icon targets measure 44 × 44 CSS px.
- Fonts and typography: the shared app font uses a 21px, 790-weight centered title with single-line ellipsis; this preserves the reference's compact, strong hierarchy across longer route titles.
- Spacing and layout rhythm: symmetric 48px side tracks keep the title optically centered; safe-area padding, a 56px base height and 44px touch targets preserve phone usability.
- Colors and visual tokens: warm white `rgba(255, 250, 247, .94)`, dark neutral text and the existing Himi red token match the reference and app palette.
- Image quality and asset fidelity: no raster artwork is used in the header; both controls use the project's Lucide icon library at the measured reference-like scale.
- Copy and content: route-aware titles describe the current screen (`Chọn bài luyện gõ`, `Chọn bài luyện viết`, `Chi tiết lộ trình`, `Video`, `Hồ sơ`), while back links point to each screen's deterministic parent.

## Findings and comparison history

- Initial P1: learner pages used inconsistent page-local back rows and most screens lacked the centered current-page title and bell shown in the reference.
- Fix: promoted the existing account header pattern into one shell-level mobile header, added route-aware title/parent mapping, removed the duplicate account header, and hid legacy breadcrumb/back rows on phones.
- Initial P1 interaction regression: the pending-navigation preview could update the back href during the click and jump two levels to Home.
- Fix: bound header content to the committed pathname rather than the pending visual route.
- Post-fix evidence: activating the header back control on `/typing/hsk-1` reaches `/typing`; browser checks on Home, Account, Writing HSK 1, course detail and Videos each show exactly one header, the expected title/back link and no overflow.

## Verification

- Source and implementation compared in one browser evidence pass: passed.
- Primary back interaction `/typing/hsk-1` → `/typing`: passed.
- Route coverage checks on five additional learner screens: passed.
- Browser console errors: none.
- Mobile header and breadcrumb tests: 7 passed.
- Home responsive tests: 4 passed.
- Focused learner-navigation test: passed.
- Scoped ESLint and `git diff --check`: passed.

Focused full-screen learning sessions retain their dedicated exit controls and intentionally suppress the shared header to avoid duplicated navigation.

No actionable P0, P1, or P2 findings remain for this scoped mobile navigation change.

final result: passed

---

# Design QA — Header Trang chủ mobile

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-c5a9c2f2-3ef6-4c3e-a523-b1f1ffe162c2.png`, a 270 × 52 px crop showing the Himi logo and wordmark on the left and a notification bell in a pale circular surface on the right.
- Implementation URL: `http://localhost:3001/`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the screenshot API did not expose a filesystem path.
- Implementation capture: 675 × 1500 px JPEG; browser-reported viewport 520 × 1125 CSS px at device pixel ratio 0.75.
- Density normalization: the source crop and the focused 52px implementation header were compared proportionally using the measured CSS geometry; the full implementation capture was also reviewed for page context and responsive behavior.
- State: authenticated Trang chủ on the mobile learner layout with the shared bottom navigation visible.

## Evidence and required fidelity surfaces

- Full-view comparison: the home content starts directly below the compact header, the persistent bottom navigation remains visible and the body has no horizontal overflow (`bodyClientWidth = bodyScrollWidth = 507px`).
- Focused region comparison: source and implementation were displayed in the same comparison pass; both show one white 52px header, compact brand lockup at left and a pale-pink circular bell at right.
- Focused DOM evidence: `.learner-mobile-header.is-home` count is `1`; header is approximately 507 × 52 CSS px, logo 28 × 28px, wordmark 71.8 × 13px and bell target 36 × 36px.
- Fonts and typography: the existing Himi wordmark component renders compact 13px/800 text with red `Himi` and black `Chinese`, preserving the reference hierarchy and preventing wrapping.
- Spacing and layout rhythm: 6px left inset, 6px brand gap and 10px right inset closely match the compact crop; vertical centering is exact within the 52px header.
- Colors and visual tokens: white header, subtle warm border, Himi red wordmark accent and `#fff3ef` bell surface match the supplied palette without introducing a desktop-style shadow.
- Image quality and asset fidelity: the real existing Himi face asset and production `BrandWordmark` component are reused; the bell uses the project's Lucide icon rather than a placeholder or custom approximation.
- Copy and content: the mobile home header now reads only `Himi Chinese`; the unrelated centered `Học tập` title is intentionally omitted on Home while all non-home mobile headers keep their route-aware title and back navigation.

## Findings and comparison history

- Initial P2: the shared mobile header rendered the generic centered title `Học tập`, which did not match the supplied home-specific brand lockup.
- Fix: added a Home-only shell variant with a linked Himi logo/wordmark on the left and a 36px pale circular notification control on the right; non-home route headers remain unchanged.
- Post-fix visual evidence: the focused comparison matches the 52px reference height and left/right visual anchors; the full mobile capture confirms correct integration with the Home content and bottom navigation.

## Verification

- Source and implementation compared in one browser evidence pass: passed.
- Notification interaction `/` → `/notifications`: passed.
- Browser console errors after returning to Home: none.
- Home/mobile header tests: 6 passed.
- Scoped ESLint and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped home-header change.

final result: passed

---

# Design QA — Đồng bộ tone màu lộ trình Văn phòng

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-cd45b270-6968-4ce8-a10c-a3ab6aef7c3e.png`, a 1320 × 456 px HSK topic reference using white surfaces, cool-neutral status text and quiet gray dividers with orange reserved for the topic marker.
- Original implementation reference: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-10f147ce-a92a-4e87-942a-a62d3dc30129.png`, a 904 × 506 px crop of the office roadmap stage before the palette update.
- Implementation URL: `http://localhost:3001/courses/van-phong-hanh-chinh`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the screenshot API did not expose a filesystem path.
- Implementation capture: 1728 × 1080 px; browser-reported viewport 1706 × 960 CSS px at device pixel ratio 0.9375.
- Density normalization: the full-page implementation was judged together with the source image, then the active stage was measured as an 894 × 484 CSS px focused region; structural differences were intentionally excluded because the request was scoped to color.
- State: authenticated office roadmap with the first stage expanded and its six lessons visible.

## Evidence and required fidelity surfaces

- Full-view comparison: the roadmap keeps the original office layout, artwork and information hierarchy while removing the previous orange tint from non-accent surfaces.
- Focused region comparison: the source and post-fix implementation were displayed in the same evidence pass; both now use white cards and lesson rows, quiet gray dividers, dark lesson titles and muted gray-blue status text.
- Fonts and typography: unchanged intentionally; weight, hierarchy, wrapping and truncation remain consistent with the established roadmap component and the scope was color-only.
- Spacing and layout rhythm: unchanged intentionally; card dimensions, row heights, radii, image slot and stage spacing remain stable.
- Colors and visual tokens: active and available cards resolve to white; borders resolve to `rgb(232, 225, 222)`; status text resolves to `rgb(98, 91, 88)`; orange remains only on the active marker/progress ring and the Himi-red token is used for expand chevrons.
- Image quality and asset fidelity: all existing office/penguin artwork is preserved at its original crop and resolution; no placeholders or generated replacements were introduced.
- Copy and content: all Vietnamese lesson titles, times, progress values and statuses remain unchanged.

## Findings and comparison history

- Initial P2: available stage cards, stage pills, lesson actions, dividers and connecting rails were tinted orange, making the office roadmap visually warmer and busier than the neutral HSK reference.
- Fix: remapped stage surfaces and borders to `--himi-white`/`--himi-line`, status text to `--himi-muted`, hover fill to a 2% neutral mix, connecting rails to the shared line token and expand arrows to `--himi-red`.
- Post-fix visual evidence: the active and available stages now share white surfaces and neutral borders; `Mở bài`, `Đã hoàn thành`, `Đang học` and `Sẵn sàng` use the same muted tone while the active orange marker remains the single dominant accent.

## Verification

- Source and implementation compared in one browser evidence pass: passed.
- Expand/collapse interaction on an available stage: passed; the page returned to one open stage.
- Horizontal overflow: none.
- Browser console errors: none.
- Focused roadmap tests: 2 passed.
- Scoped `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped palette update.

final result: passed

---

# Design QA — Đồng bộ khung full-width cho Lộ trình, Luyện nghe và Video

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-4d1c31c7-a016-4af2-8f4b-61b5b5fb61d0.png`, a 1648 × 795 px desktop reference showing the wide Luyện gõ catalog with approximately 30px outer gutters, a full-width hero and a three-column card grid.
- Supporting current-state references: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-1839c6a6-63fc-497b-b971-64c2e6784a15.png` and `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-fef4b898-9244-4339-9419-6e295a278517.png`.
- Implementation URLs: `http://localhost:3001/courses`, `http://localhost:3001/listening`, and `http://localhost:3001/videos`.
- Browser-rendered implementations: captured and inspected in the Codex in-app browser; the screenshot API did not expose filesystem paths.
- Implementation captures: 1728 × 1080 px each; browser-reported viewport 1706 × 960 CSS px at device pixel ratio 0.9375.
- Density normalization: the 1648px source and 1706px browser viewport were compared proportionally; the target was the shared content-frame ratio and outer gutter rather than page-specific artwork or copy.
- State: authenticated desktop catalogs with default filters selected and loaded content visible.

## Evidence and required fidelity surfaces

- Full-view comparison: the source and all three implementations were displayed in the same browser evidence pass. Course, listening and video content now occupy the same wide frame as the typing reference instead of stopping at legacy 1180–1320px caps.
- Focused region comparison: DOM measurements confirm the course heading/grid, listening hero/browser and video shell/hero/grid each span 1436.8 CSS px, from x=236 to x=1672.8, leaving exactly 20px on each side of the 1476.8px post-sidebar content region.
- Fonts and typography: unchanged intentionally; existing families, weights, sizes, line heights and page-specific hierarchies remain intact because the request is strictly about full-screen composition.
- Spacing and layout rhythm: all three catalogs use `min(1480px, calc(100% - 40px))` on wide desktop, matching the typing catalog frame. Existing vertical rhythm, card gaps, radii and responsive breakpoints are preserved.
- Colors and visual tokens: unchanged intentionally; every page retains its established palette and semantic states.
- Image quality and asset fidelity: all existing Himi hero art and catalog thumbnails are reused at their original quality and crop behavior; the wider cards expose more usable image area without stretching or replacing assets.
- Copy and content: unchanged; titles, descriptions, counts, categories and lesson/video names remain the same.

## Findings and comparison history

- Initial P2: the course catalog was capped at 1180px, while listening and video were capped at 1220px and 1320px; at the reference viewport this left visibly larger side margins and made hero/filter/grid regions feel smaller than the typing reference.
- Fix: introduced a shared `learner-full-width-catalog` modifier and scoped each catalog's desktop container to the typing reference width. Listening also releases its old outer horizontal padding on wide screens. Detail/study routes and viewports below 1121px are intentionally unaffected.
- Post-fix visual evidence: all six measured primary regions resolve to 1436.8px at the 1706px viewport, the card grids remain three columns, and `document.documentElement.scrollWidth` equals the 1692px client surface with no horizontal overflow.

## Verification

- Source and implementations compared in one browser evidence pass: passed.
- Course filter `Văn phòng`: passed; only `Văn phòng & hành chính` remained.
- Video filter `Ăn uống`: passed; result count updated to 3.
- Listening tab `Độc thoại`: passed; active tab and lesson heading updated.
- Browser console errors after interactions: none.
- Responsive protection: the full-width rule is desktop-only (`min-width: 1121px`); existing tablet/mobile widths remain in control. A 520px video capture retained the mobile header, single-column cards and no horizontal overflow.
- Focused catalog tests: passed.
- Scoped ESLint: no errors; one pre-existing internal-navigation warning remains in `components/listening-catalog-studio.tsx`.
- Scoped `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped full-width layout change.

final result: passed

---

# Design QA — Căn chỉnh ba thẻ thống kê hoàn thành

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-0453f67b-2c34-4ea2-b781-f798daeeff8b.png` (649 × 108 px, density 96), showing three 193 × 86 px statistic cards with 10px gaps.
- Implementation URL: `http://localhost:3001/learn/nha-may-san-xuat?lesson=xac-nhan-quy-trinh-van-hanh`.
- Browser-rendered implementation: captured and inspected in the Codex in-app browser; the screenshot API did not expose a filesystem path.
- Desktop viewport: 1545 × 901 CSS px. The rendered statistic group measures 597.87 × 86px; each card measures 192.62 × 86px with a 10px gap.
- Responsive viewport: browser-reported 520 × 1125 CSS px after the mobile viewport override; cards stack at 454.4 × 64px without horizontal overflow.
- State: completed lesson `Xác nhận quy trình vận hành`.

## Evidence and required fidelity surfaces

- Full-view comparison: the three cards retain their position and visual role inside the centered completion modal.
- Focused comparison: source and implementation both use a 46px icon circle, approximately 17px left inset, 11px icon-to-count gap, 86px card height and 10px inter-card gap.
- Fonts and typography: the count remains 24px in the Himi coral color; the 11px muted label begins at the top of the count area and remains stable for one- or two-digit values.
- Spacing and layout rhythm: replaced negative-margin positioning with a three-column grid (`46px max-content minmax(0, 1fr)`), matching the source while preventing drift when the count width changes.
- Colors and visual tokens: card border resolves to the sampled source color `rgb(251, 202, 196)`; the icon surface uses `#fef0ee`; white card surfaces and coral content remain unchanged.
- Image quality and asset fidelity: no raster assets are used in this focused UI region; the existing project Lucide icons remain crisp and correctly sized.
- Copy and content: labels and data-driven values are unchanged; the reference's two-digit sample is supported without hardcoding counts.

## Findings and comparison history

- Initial P2: labels were positioned with a large negative top margin, making their alignment dependent on count width and fragile across lessons.
- Fix: moved icon, count and label into explicit grid tracks and sampled the border/icon-surface colors from the provided reference.
- Post-fix visual evidence: card size, spacing, icon placement, count baseline and label top offset now match the reference measurements; desktop and responsive captures show no clipping or overlap.

## Verification

- Source and implementation inspected in the same focused evidence pass: passed.
- Desktop card geometry: passed.
- Responsive layout and horizontal overflow: passed.
- Browser console warnings/errors: none.
- Focused UI test, scoped ESLint, TypeScript check and `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this scoped statistic-card adjustment.

final result: passed

---

# Design QA — Trang chủ HIMI theo mock-up số 2 (2026-10-05)

- Source visual truth: `D:/CodexData/.codex/generated_images/01a10a9e-b3f2-7d31-9234-fea853a10fcb/exec-f1a31a7e-c131-4573-9c7d-2a242934bc92.png` (1544 × 1018 px).
- Implementation: `/` on local preview `http://localhost:4173/`.
- Captures: `qa-artifacts/home-study-desktop.png` (1440 px), `qa-artifacts/home-study-laptop.png` (1024 px), `qa-artifacts/home-study-mobile.png` (390 px), `qa-artifacts/home-study-mobile-with-history.png` (390 px), and `qa-artifacts/home-study-comparison.png` (side-by-side).
- State: signed out; empty recent history and then one HSK lesson opened from the home hero.

## Comparison and responsive result

- Four Himi feature cards use the mock's palette, type hierarchy, prominent mascot illustrations and colored calls to action. They remain in one row at 1440 and 1024 px as requested; the 390 px layout becomes a two-column grid.
- Popular topics match the six compact horizontal cards and 3 × 2 arrangement in the mock. At 390 px they become 2 × 3 without horizontal clipping.
- The recent lesson panel has a Himi reading illustration and clear empty-state action. Opening HSK 1 lesson 1 and returning home replaces it with the actual lesson title, HSK level, progress and continuation link. The existing history source also supports industry lessons.
- The desktop hero's referenced image path was missing and is now supplied from the existing homepage illustration, keeping the complete homepage visual in the final browser capture.
- At 1024 px the mascot positions were raised to stay visible within the narrow four-card row. The existing phone bottom navigation overlays the full-page capture at its viewport position; content remains scrollable below it.

## Verification

- `node --test tests/home-responsive.test.mjs tests/recent-learning-history.test.mjs`: 6/6 passed.
- `npx eslint components/review-home-studio.tsx`: passed.
- `git diff --check`: passed.
- `npm run build` with `NODE_OPTIONS=--max-old-space-size=8192`: passed. Initial build with default memory failed during transform with a memory allocation error; rerun completed.
- Browser interaction: opening HSK 1 lesson 1 and returning home displayed `Bài 1: Xin chào!` in recent lessons with `0%` progress and the correct study link.

## Findings

- No remaining P0/P1/P2 visual or functional issue in the checked desktop, laptop and phone states.

final result: passed

---

# Design QA — Chỉnh độ giống mock-up số 2 (2026-10-05)

- Source: `D:/CodexData/.codex/generated_images/01a10a9e-b3f2-7d31-9234-fea853a10fcb/exec-f1a31a7e-c131-4573-9c7d-2a242934bc92.png`.
- Final captures: `qa-artifacts/home-study-desktop-v2.png` (1440 px), `qa-artifacts/home-study-laptop-v2.png` (1024 px), `qa-artifacts/home-study-mobile-v2.png` (390 px), `qa-artifacts/home-study-comparison-v2.png`.
- Refined all four feature artworks into full square scenes matching the reference mascot, color palette, brush, headphones, keyboard and HSK books. The artwork now fills each card instead of leaving large flat pastel areas.
- Desktop and 1024 px: four features remain in a single row; text, mascot faces and calls to action remain visible. Phone: a two-column layout retains all four scenes and topic cards without horizontal clipping.
- Recent lessons still display real history; one-item history adds decorative reading artwork in the unused space. The empty state retains its dedicated illustration and action.
- Visual exception from the reference is intentional: reference features are 2 × 2, while implementation is one row on laptop, as requested by the user. This necessarily changes each card's crop and copy scale.
- Browser captures inspected at all three widths. Targeted tests 6/6, ESLint, `git diff --check`, and production build with an 8 GB Node heap pass.

final result: passed

---

# Design QA — Ảnh phủ kín card trang chủ (2026-10-05)

- User references: `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-cc51e44a-aa80-4f9e-801f-79847fc8ad40.png` and `C:/Users/Windows/AppData/Local/Temp/codex-clipboard-35cb5136-b9a7-4559-9e18-d9a20875148b.png`.
- Root causes: feature images were translated downward, leaving a fallback-color strip at the top; the desktop hero asset itself has a white outer frame.
- Fix: feature images now fill the entire content area with `object-fit: cover`, with soft gradient overlays behind live text; the desktop hero image is scaled within its clipped container to remove its baked-in white frame. The 721–900 px hero button sits lower so it does not cover the image's paragraph. The decorative recent-lesson image is hidden when that panel stacks into one column.
- Browser captures: `qa-artifacts/home-image-fit-1440.png`, `home-image-fit-1024.png`, `home-image-fit-768.png`, `home-image-fit-390.png`, `home-image-fit-360.png`.
- Verified at 1440, 1024, 768, 390 and 360 CSS px: images meet card edges within their 1 px borders, the hero is cropped edge-to-edge, and no horizontal page overflow is present in the stable 360 px state.
- Targeted tests: 6/6 passed. `git diff --check` passed.

final result: passed

---

# Design QA — Chủ đề phổ biến, mẫu số 1 (2026-10-05)

- Reference: `D:/CodexData/.codex/generated_images/01a10a9e-b3f2-7d31-9234-fea853a10fcb/exec-59b601d8-e256-4993-aacc-56d0bef91a9c.png`.
- Applied the selected open editorial layout: six topic links in two rows on desktop, without individual card backgrounds, borders, or shadows; pastel icon stickers, fine row dividers, coral arrows, and a Himi landscape illustration at the bottom.
- Kept the four learning features in one desktop row. Recent lessons remain alongside topics at 1440 px and below them at 1024 px and phone widths, still using actual lesson history.
- Captures: `qa-artifacts/home-topics-open-1440.png`, `home-topics-open-1024.png`, `home-topics-open-720.png`, `home-topics-open-390.png`, `home-topics-open-320.png`.
- Checked 1440, 1024, 720, 390, 360, and 320 CSS px in the browser. All six topic links and the recent-lesson panel were present, the landscape image loaded, and horizontal overflow was 0 px after layout settled.
- Targeted tests 6/6 passed; ESLint and `git diff --check` passed.

final result: passed

---

# Design QA — Danh sách bài học luyện viết full-width (2026-10-05)

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-88108937-1d0f-4b06-81cc-74bb39fcfd1e.png` (bố cục full-width, ba cột) và `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-a7bb022b-26ab-43a8-adef-509cff36b6ab.png` (trang danh sách bài học cần chỉnh).
- Implementation: `/writing/hsk-1` trên local preview `http://localhost:3000/writing/hsk-1`.
- Scope: chỉ thay đổi chiều rộng khung, số cột và breakpoint; dữ liệu, copy, liên kết và hành vi thẻ bài học giữ nguyên.

## Evidence and responsive result

- Desktop 1634 × 900 CSS px: khung nội dung rộng 1365 px trong phần còn lại sau sidebar, ba cột bằng nhau khoảng 443 px, gap 18 px và không có tràn ngang.
- Desktop rộng: khung giữ trần 1480 px đúng với catalog HSK tham chiếu; ba thẻ đầu tiên nằm cùng một hàng và đồng đều chiều cao.
- Tablet 1000 × 900 CSS px: tự chuyển còn hai cột khoảng 356 px; không tràn ngang.
- Mobile 400 × 900 CSS px: tự chuyển một cột khoảng 363 px, nút hành động chiếm toàn chiều rộng thẻ và không tràn ngang.
- Typography, màu thương hiệu, badge chữ Hán, viền, shadow và nội dung thẻ không bị thay đổi ngoài việc reflow theo kích thước mới.
- Không cần thêm hoặc thay thế raster asset cho thay đổi bố cục này.

## Verification

- Targeted rendered HTML test `writing route flows from HSK levels to their lessons and the writing studio`: passed.
- Scoped ESLint: passed.
- `git diff --check`: passed.
- Browser console warnings/errors on the verified route: none.
- Repository-wide TypeScript check vẫn báo các lỗi nền có sẵn ở CSS `?url` module declarations và một số file ngoài phạm vi; không có lỗi mới từ hai file đã chỉnh.

No actionable P0, P1, or P2 findings remain for this scoped writing-list layout change.

final result: passed

---

# Giao diện khóa VIP dùng chung

- Source visual truth: `C:/Users/DELL/AppData/Local/Temp/codex-clipboard-2a9270e6-2f24-4969-9e54-ddee658281fb.png` (ảnh 2, 925 × 641 px).
- Implementation: `components/vip-upgrade-prompt.tsx`, dùng lại `VipUpgradeDialog` và linh vật hiện có.
- State: popup khóa VIP tự mở khi gặp nội dung bị khóa; bấm X thoát bài học về danh sách tương ứng. Escape hoặc bấm nền cũng thoát bài học, không để lại trang trống. Khung khóa nền đã được bỏ hoàn toàn.
- Implementation screenshot / CSS viewport / density normalization: chưa có.
- Full-view và focused-region comparison: chưa thực hiện.
- Fonts, spacing, colors, asset, copy: dùng lại nguyên mẫu popup hiện có; chưa xác nhận bằng ảnh trình duyệt.
- Verification: ESLint đạt; 28 kiểm tra phân quyền và Luyện gõ đạt.
- Comparison history: không có vòng so sánh trực quan.
- Blocker: trình duyệt tích hợp lỗi khởi động. Người dùng chọn “Chỉ sửa mã, tôi tự kiểm tra giao diện”, không cho phép dùng Playwright.
- Kiểm tra thủ công còn lại: desktop/mobile, X thoát bài học về đúng danh sách (HSK lưu tiến độ trước khi thoát), Escape và bấm nền thoát bài học, không còn khung khóa nền, nút nâng cấp, chuyển giữa các mục bị khóa.

final result: blocked
