# Design QA — Responsive writing lesson cards

- Source visual truth: user-attached reference image in Browser Comment 1 (722 × 419 px).
- Implementation: `http://localhost:3001/writing/hsk-1/hsk1-bai-01-chao-anh/practice`.
- Implementation screenshot: Codex in-app Browser capture from this task; the browser capture API does not expose a filesystem path. `qa-artifacts/writing-lesson-final.png` records the pre-polish baseline.
- Browser viewports: 1112 × 802 and 766 × 802 CSS px, plus a 390 px mobile override. Layout was compared by CSS geometry because the browser surface applies display scaling to captured pixels.
- State: HSK 1, lesson 01, first character selected, watch-stroke mode.

## Full-view comparison evidence

The workspace now follows the reference's pale blue-gray canvas and two rounded white cards. The complete two-card group is constrained to the same centered 840 px container as the header, character strip, and footer. The practice and information cards stay side by side at an approximately 2.85:1 ratio on desktop/tablet, then stack on phone widths.

## Focused region comparison evidence

- Fonts and typography: compact Vietnamese controls, large Chinese display characters, coral pinyin, muted meanings, and small metadata reproduce the reference hierarchy with the existing product font stacks.
- Spacing and layout rhythm: 28 px card radii, responsive padding, a compact segmented control, a square board, a narrow information card, and a 2.85:1 column ratio reproduce the source grouping without fixed pixel-only sizing.
- Colors and visual tokens: coral active controls, white cards, pale blue-gray canvas, soft gray borders, restrained elevation, and black Hanzi map to the supplied reference and existing Himi tokens.
- Image quality and asset fidelity: HanziWriter remains the live vector stroke renderer; icons use the project's existing icon library. No raster placeholders or CSS-drawn assets were introduced.
- Copy and content: lesson characters, pinyin, Vietnamese meanings, HSK level, and stroke counts remain dynamic from the selected lesson.

## Primary interactions and console

- Clicking the lesson-card `Luyện viết` link opens the immersive route: passed.
- `Tiếp tục` moves from `Xem nét` to `Tô theo` and updates `Bước 1 / 13` to `Bước 2 / 13`: passed.
- Selecting `好` updates the active tile, live writing board, pinyin, meaning, and stroke count: passed.
- Close control targets the HSK 1 lesson list: passed.
- Desktop and near-tablet responsive checks report no horizontal overflow: passed.
- At 390 px, the cards stack and the complete writing board remains usable with no horizontal overflow: passed.
- Browser console warnings and errors: none.
- ESLint validation for changed components: passed.

## Findings and comparison history

1. Initial implementation retained the dashboard shell and a three-column library layout, materially differing from the focused source screen (P1).
2. Rebuilt the lesson route as a standalone, step-based experience while preserving HanziWriter, pronunciation, modes, VIP gating, and daily progress behavior.
3. The first reference-style pass kept a 390 px board and a 330 px mode switcher at the 766 px viewport, which made the practice card denser than the source (P2). Replaced both with viewport-aware clamps and reduced their tablet size.
4. The initial 760 px stacking breakpoint changed to one column earlier than the 722 px source (P2). Lowered it to 620 px so tablet widths preserve the reference composition while phones still stack safely.
5. Post-fix captures show the intended surfaces, ratios, responsive reflow, live Hanzi rendering, zero console warnings/errors, and no remaining actionable P0, P1, or P2 findings.
6. The final containment pass aligns the workspace's 840 px maximum width with every surrounding lesson region, preventing the information card from appearing outside the page container.

## Follow-up polish

No P3 follow-up is required for this scoped redesign.

final result: passed
