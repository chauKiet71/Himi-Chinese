import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = path.join(root, "public", "assets", "banners", "himi-facebook-cover");
const brandDir = path.join(root, "public", "assets", "brand");

const WIDTH = 1640;
const HEIGHT = 624;
const RED = "#FF4C3B";
const ORANGE = "#FF8E2D";
const BLACK = "#222222";
const WHITE = "#FFFFFF";

const svg = (body, width = WIDTH, height = HEIGHT) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#222222" flood-opacity="0.16"/>
    </filter>
    <filter id="tinyShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="#222222" flood-opacity="0.12"/>
    </filter>
    <filter id="groundBlur" x="-40%" y="-200%" width="180%" height="500%">
      <feGaussianBlur stdDeviation="13"/>
    </filter>
    <filter id="headlineShadow" x="-20%" y="-30%" width="140%" height="170%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#7A241D" flood-opacity="0.10"/>
    </filter>
    <filter id="washBlur" x="-30%" y="-70%" width="160%" height="240%">
      <feGaussianBlur stdDeviation="42"/>
    </filter>
    <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${RED}"/>
      <stop offset="1" stop-color="${ORANGE}"/>
    </linearGradient>
    <linearGradient id="darkFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#121212" stop-opacity="0.82"/>
      <stop offset="0.72" stop-color="#121212" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#121212" stop-opacity="0"/>
    </linearGradient>
  </defs>
  ${body}
</svg>`);

const text = ({ x, y, value, size, color = BLACK, weight = 800, family = "Roboto, Segoe UI, Arial, sans-serif", spacing = 0, anchor = "start", opacity = 1, filter = "" }) =>
  `<text x="${x}" y="${y}" fill="${color}" fill-opacity="${opacity}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" text-anchor="${anchor}"${filter ? ` filter="url(#${filter})"` : ""}>${value}</text>`;

const pill = (x, y, width, label, fill = BLACK, labelColor = BLACK) => `
  <rect x="${x}" y="${y}" width="${width}" height="50" rx="25" fill="${fill}" filter="url(#tinyShadow)"/>
  ${text({ x: x + width / 2, y: y + 33, value: label, size: 18, color: labelColor, weight: 800, spacing: 2.2, anchor: "middle" })}`;

const headPath = path.join(brandDir, "himi-sidebar-logo-transparent.png");
const masterPath = path.join(brandDir, "himi-mascot-master.png");
const cutoutPath = path.join(outputDir, "himi-mascot-cutout.png");

async function makeMascotCutout() {
  const { data, info } = await sharp(masterPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const seen = new Uint8Array(info.width * info.height);
  const queue = new Int32Array(info.width * info.height);
  let head = 0;
  let tail = 0;

  const qualifies = (pixel) => {
    const i = pixel * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    return Math.min(r, g, b) >= 226 && Math.max(r, g, b) - Math.min(r, g, b) <= 22;
  };

  const enqueue = (pixel) => {
    if (!seen[pixel] && qualifies(pixel)) {
      seen[pixel] = 1;
      queue[tail++] = pixel;
    }
  };

  for (let x = 0; x < info.width; x += 1) {
    enqueue(x);
    enqueue((info.height - 1) * info.width + x);
  }
  for (let y = 0; y < info.height; y += 1) {
    enqueue(y * info.width);
    enqueue(y * info.width + info.width - 1);
  }

  while (head < tail) {
    const pixel = queue[head++];
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    if (x > 0) enqueue(pixel - 1);
    if (x + 1 < info.width) enqueue(pixel + 1);
    if (y > 0) enqueue(pixel - info.width);
    if (y + 1 < info.height) enqueue(pixel + info.width);
  }

  for (let pixel = 0; pixel < seen.length; pixel += 1) {
    if (seen[pixel]) data[pixel * channels + 3] = 0;
  }

  await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(cutoutPath);
}

async function resizedAsset(file, width, height) {
  return sharp(file)
    .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function resizedCutoutAsset(file, width, height) {
  return sharp(file)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
    .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function renderCover({ filename, background, overlay, composites = [] }) {
  const backgroundPath = path.join(outputDir, background);
  const base = sharp(backgroundPath).resize(WIDTH, HEIGHT, { fit: "fill" });
  await base
    .composite([
      { input: svg(overlay), left: 0, top: 0 },
      ...composites,
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(outputDir, filename));
}

async function build() {
  await fs.mkdir(outputDir, { recursive: true });
  await makeMascotCutout();

  const head72 = await resizedAsset(headPath, 72, 72);
  const head188 = await resizedAsset(headPath, 188, 188);
  const head228 = await resizedAsset(headPath, 228, 228);
  const full310 = await resizedCutoutAsset(cutoutPath, 310, 390);
  const full320 = await resizedCutoutAsset(cutoutPath, 320, 410);
  const full350 = await resizedCutoutAsset(cutoutPath, 350, 430);

  await renderCover({
    filename: "01-workday-studio-1640x624.png",
    background: "source-studio-arches.png",
    overlay: `
      <rect x="318" y="77" width="320" height="58" rx="29" fill="#FFFFFF" fill-opacity="0.90" stroke="#E8E1DE"/>
      ${text({ x: 410, y: 115, value: "HIMI CHINESE", size: 19, weight: 850, spacing: 2.8 })}
      ${text({ x: 330, y: 237, value: "TIẾNG TRUNG", size: 72, color: RED, weight: 900, spacing: -2 })}
      ${text({ x: 330, y: 316, value: "CHO NGƯỜI ĐI LÀM", size: 62, weight: 900, spacing: -2.4 })}
      <rect x="330" y="351" width="640" height="2" fill="#222222" fill-opacity="0.13"/>
      ${text({ x: 330, y: 402, value: "Học theo tình huống • Tiến bộ mỗi ngày", size: 25, weight: 560 })}
      ${pill(330, 447, 480, "NGHE  •  NÓI  •  ĐỌC  •  VIẾT", "url(#brandGradient)")}
      <ellipse cx="1324" cy="330" rx="210" ry="220" fill="#FFFFFF" fill-opacity="0.70" filter="url(#softShadow)"/>
    `,
    composites: [
      { input: head72, left: 332, top: 70 },
      { input: full350, left: 1147, top: 130 },
    ],
  });

  await renderCover({
    filename: "01-workday-studio-v2-minimal-1640x624.png",
    background: "source-studio-arches.png",
    overlay: `
      <rect x="442" y="144" width="690" height="286" rx="38" fill="#FFFFFF" fill-opacity="0.58"/>
      ${text({ x: 558, y: 127, value: "HIMI CHINESE", size: 22, weight: 850, spacing: 3.2 })}
      ${text({ x: 480, y: 279, value: "TIẾNG TRUNG", size: 88, color: RED, weight: 920, spacing: -3 })}
      ${text({ x: 482, y: 370, value: "CHO NGƯỜI ĐI LÀM", size: 67, weight: 920, spacing: -2.6 })}
      <rect x="482" y="402" width="184" height="7" rx="3.5" fill="url(#brandGradient)"/>
      <ellipse cx="1332" cy="330" rx="210" ry="220" fill="#FFFFFF" fill-opacity="0.70" filter="url(#softShadow)"/>
    `,
    composites: [
      { input: head72, left: 478, top: 82 },
      { input: full350, left: 1155, top: 130 },
    ],
  });

  await sharp(path.join(outputDir, "01-workday-studio-v2-minimal-1640x624.png"))
    .resize(640, 360, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "01-workday-studio-v2-minimal-mobile-crop-preview.png"));

  await renderCover({
    filename: "01-workday-studio-v3-premium-1640x624.png",
    background: "source-studio-arches.png",
    overlay: `
      ${text({ x: 550, y: 127, value: "HIMI CHINESE", size: 22, weight: 850, spacing: 3.2 })}
      ${text({ x: 465, y: 277, value: "TIẾNG TRUNG", size: 94, color: RED, weight: 920, spacing: -3.4, filter: "tinyShadow" })}
      ${text({ x: 469, y: 368, value: "CHO NGƯỜI ĐI LÀM", size: 64, weight: 920, spacing: -2.6 })}
      <rect x="469" y="401" width="138" height="7" rx="3.5" fill="url(#brandGradient)"/>
      <circle cx="626" cy="404.5" r="4" fill="#222222"/>
      <ellipse cx="1214" cy="522" rx="126" ry="15" fill="#222222" fill-opacity="0.16" filter="url(#groundBlur)"/>
    `,
    composites: [
      { input: head72, left: 470, top: 82 },
      { input: full320, left: 1055, top: 139 },
    ],
  });

  await sharp(path.join(outputDir, "01-workday-studio-v3-premium-1640x624.png"))
    .resize(640, 360, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "01-workday-studio-v3-premium-mobile-crop-preview.png"));

  await renderCover({
    filename: "01-workday-studio-v4-refined-1640x624.png",
    background: "source-studio-arches.png",
    overlay: `
      <ellipse cx="760" cy="272" rx="430" ry="158" fill="#FFFFFF" fill-opacity="0.56" filter="url(#washBlur)"/>
      ${text({ x: 550, y: 116, value: "HIMI CHINESE", size: 22, weight: 850, spacing: 3.2 })}
      ${text({ x: 465, y: 249, value: "TIẾNG TRUNG", size: 92, color: RED, weight: 920, spacing: -3.1, filter: "headlineShadow" })}
      ${text({ x: 468, y: 337, value: "CHO NGƯỜI ĐI LÀM", size: 62, weight: 920, spacing: -2.2 })}
      <rect x="468" y="369" width="164" height="6" rx="3" fill="url(#brandGradient)"/>
      <ellipse cx="1214" cy="508" rx="124" ry="14" fill="#222222" fill-opacity="0.15" filter="url(#groundBlur)"/>
    `,
    composites: [
      { input: head72, left: 470, top: 71 },
      { input: full320, left: 1055, top: 125 },
    ],
  });

  await sharp(path.join(outputDir, "01-workday-studio-v4-refined-1640x624.png"))
    .resize(640, 360, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "01-workday-studio-v4-refined-mobile-crop-preview.png"));

  await renderCover({
    filename: "02-hanzi-editorial-1640x624.png",
    background: "source-editorial-paper.png",
    overlay: `
      <rect x="365" y="64" width="292" height="54" rx="27" fill="#222222"/>
      ${text({ x: 458, y: 100, value: "HIMI CHINESE", size: 18, color: WHITE, weight: 850, spacing: 2.6 })}
      ${text({ x: 386, y: 292, value: "学以致用", size: 138, color: BLACK, weight: 850, family: "Microsoft YaHei, Noto Sans CJK SC, sans-serif", spacing: 7 })}
      ${text({ x: 395, y: 347, value: "xué yǐ zhì yòng", size: 27, color: RED, weight: 750, spacing: 4.1 })}
      <rect x="386" y="376" width="580" height="4" rx="2" fill="url(#brandGradient)"/>
      ${text({ x: 386, y: 433, value: "HỌC LÀ ĐỂ DÙNG ĐƯỢC", size: 35, weight: 900, spacing: 1.4 })}
      ${text({ x: 386, y: 476, value: "Tiếng Trung thực dụng cho công việc mỗi ngày", size: 22, weight: 520 })}
      <circle cx="1278" cy="310" r="133" fill="#FFFFFF" stroke="#222222" stroke-width="3" filter="url(#softShadow)"/>
      <circle cx="1278" cy="310" r="113" fill="#FFF0EE"/>
    `,
    composites: [
      { input: head72, left: 378, top: 55 },
      { input: head228, left: 1164, top: 196 },
    ],
  });

  await renderCover({
    filename: "03-ten-minute-momentum-1640x624.png",
    background: "source-daily-momentum.png",
    overlay: `
      <rect x="285" y="92" width="710" height="438" rx="42" fill="#FFFFFF" fill-opacity="0.84" stroke="#FFFFFF" stroke-width="2" filter="url(#softShadow)"/>
      ${text({ x: 344, y: 159, value: "HIMI CHINESE", size: 18, weight: 850, spacing: 2.8 })}
      ${text({ x: 340, y: 290, value: "10 PHÚT", size: 103, color: RED, weight: 920, spacing: -3.4 })}
      ${text({ x: 342, y: 374, value: "MỖI NGÀY", size: 74, weight: 920, spacing: -2.6 })}
      ${text({ x: 344, y: 425, value: "Một phiên học ngắn. Một bước tiến thật.", size: 25, weight: 580 })}
      ${pill(340, 456, 466, "HỌC ĐỀU  •  DÙNG ĐÚNG LÚC", "url(#brandGradient)")}
      <circle cx="1280" cy="232" r="143" fill="#FFFFFF" fill-opacity="0.90" filter="url(#softShadow)"/>
    `,
    composites: [
      { input: head188, left: 1186, top: 138 },
    ],
  });

  await renderCover({
    filename: "04-seven-career-paths-1640x624.png",
    background: "source-career-paths.png",
    overlay: `
      <rect x="265" y="82" width="610" height="470" rx="42" fill="#FFFFFF" fill-opacity="0.90" stroke="#E8E1DE" filter="url(#softShadow)"/>
      ${text({ x: 365, y: 138, value: "HIMI CHINESE", size: 18, weight: 850, spacing: 2.8 })}
      ${text({ x: 326, y: 255, value: "7 LỘ TRÌNH", size: 73, color: RED, weight: 920, spacing: -2.2 })}
      ${text({ x: 326, y: 328, value: "NGHỀ NGHIỆP", size: 61, weight: 920, spacing: -2.1 })}
      ${text({ x: 328, y: 388, value: "Học đúng tiếng Trung bạn cần cho công việc.", size: 23, weight: 560 })}
      ${pill(326, 430, 420, "MỘT HIMI ĐỒNG HÀNH", "url(#brandGradient)")}
    `,
    composites: [
      { input: head72, left: 286, top: 88 },
    ],
  });

  await renderCover({
    filename: "05-china-journey-1640x624.png",
    background: "source-china-journey.png",
    overlay: `
      <rect x="286" y="83" width="735" height="462" rx="42" fill="#FFFFFF" fill-opacity="0.86" stroke="#FFFFFF" stroke-width="2" filter="url(#softShadow)"/>
      ${text({ x: 387, y: 145, value: "HIMI CHINESE", size: 18, weight: 850, spacing: 2.8 })}
      ${text({ x: 344, y: 267, value: "TỪ BÀI HỌC", size: 70, color: RED, weight: 920, spacing: -2.4 })}
      ${text({ x: 344, y: 343, value: "ĐẾN CÔNG VIỆC", size: 61, weight: 920, spacing: -2.3 })}
      <rect x="344" y="374" width="555" height="3" rx="1.5" fill="url(#brandGradient)"/>
      ${text({ x: 344, y: 421, value: "Nghe • Nói • Đọc • Viết trong đúng ngữ cảnh", size: 23, weight: 560 })}
      ${pill(344, 457, 374, "TIẾNG TRUNG THỰC DỤNG", "#222222", WHITE)}
      <ellipse cx="1278" cy="345" rx="186" ry="199" fill="#FFFFFF" fill-opacity="0.70" filter="url(#softShadow)"/>
    `,
    composites: [
      { input: head72, left: 306, top: 95 },
      { input: full310, left: 1122, top: 160 },
    ],
  });

  const names = [
    ["01-workday-studio-1640x624.png", "01  Workday Studio"],
    ["02-hanzi-editorial-1640x624.png", "02  Hanzi Editorial"],
    ["03-ten-minute-momentum-1640x624.png", "03  10-minute Momentum"],
    ["04-seven-career-paths-1640x624.png", "04  7 Career Paths"],
    ["05-china-journey-1640x624.png", "05  China Journey"],
  ];
  const thumbWidth = 820;
  const thumbHeight = 312;
  const boardWidth = 1800;
  const boardHeight = 1210;
  const positions = [
    [60, 135], [920, 135], [60, 510], [920, 510], [490, 885],
  ];
  const boardComposites = [];
  for (let i = 0; i < names.length; i += 1) {
    const [file, label] = names[i];
    const [left, top] = positions[i];
    const thumb = await sharp(path.join(outputDir, file)).resize(thumbWidth, thumbHeight).png().toBuffer();
    boardComposites.push({ input: thumb, left, top });
    boardComposites.push({
      input: svg(text({ x: left, y: top - 19, value: label, size: 24, color: WHITE, weight: 760, spacing: 0.2 }), boardWidth, boardHeight),
      left: 0,
      top: 0,
    });
  }
  boardComposites.push({
    input: svg(`
      ${text({ x: 60, y: 62, value: "HIMI CHINESE — FACEBOOK COVER CONCEPTS", size: 34, color: WHITE, weight: 850, spacing: 1.1 })}
      ${text({ x: 60, y: 96, value: "5 hướng thiết kế • 1640 × 624 px • Desktop + mobile center-safe", size: 19, color: "#C9C9C9", weight: 520 })}
    `, boardWidth, boardHeight),
    left: 0,
    top: 0,
  });
  await sharp({ create: { width: boardWidth, height: boardHeight, channels: 4, background: "#171717" } })
    .composite(boardComposites)
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "00-five-concepts-comparison.png"));

  const mobileBoardWidth = 1400;
  const mobileBoardHeight = 1370;
  const mobilePositions = [
    [40, 135], [720, 135], [40, 560], [720, 560], [380, 985],
  ];
  const mobileComposites = [];
  for (let i = 0; i < names.length; i += 1) {
    const [file, label] = names[i];
    const [left, top] = mobilePositions[i];
    const crop = await sharp(path.join(outputDir, file))
      .resize(640, 360, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();
    mobileComposites.push({ input: crop, left, top });
    mobileComposites.push({
      input: svg(text({ x: left, y: top - 18, value: label, size: 23, color: WHITE, weight: 760 }), mobileBoardWidth, mobileBoardHeight),
      left: 0,
      top: 0,
    });
  }
  mobileComposites.push({
    input: svg(`
      ${text({ x: 40, y: 62, value: "MOBILE CENTER-CROP SIMULATION", size: 34, color: WHITE, weight: 850, spacing: 1.1 })}
      ${text({ x: 40, y: 96, value: "Mô phỏng khung hiển thị 640 × 360 px để kiểm tra nội dung quan trọng", size: 19, color: "#C9C9C9", weight: 520 })}
    `, mobileBoardWidth, mobileBoardHeight),
    left: 0,
    top: 0,
  });
  await sharp({ create: { width: mobileBoardWidth, height: mobileBoardHeight, channels: 4, background: "#171717" } })
    .composite(mobileComposites)
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "00-mobile-crop-simulation.png"));
}

await build();
