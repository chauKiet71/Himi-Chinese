import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDirectory = path.resolve("output/social");
const mascotPath = path.resolve("public/assets/games/quiz-penguin-cutout.png");
const logoPath = path.resolve("public/assets/brand/himi-mascot-icon-transparent.png");
const outputPath = path.join(outputDirectory, "himi-mini-quiz-gaolou-haishi-shan-1080.png");

await mkdir(outputDirectory, { recursive: true });
const mascotData = (await readFile(mascotPath)).toString("base64");
const logoData = (await readFile(logoPath)).toString("base64");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffaf7"/>
      <stop offset="1" stop-color="#fff1ea"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff4c3b"/>
      <stop offset="1" stop-color="#ff8e2d"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#7d3928" flood-opacity="0.13"/>
    </filter>
  </defs>

  <rect width="1080" height="1080" fill="url(#background)"/>
  <circle cx="1015" cy="90" r="150" fill="#ff8e2d" opacity="0.12"/>
  <circle cx="60" cy="1010" r="210" fill="#ff4c3b" opacity="0.08"/>

  <g opacity="0.22" fill="#ff8e2d">
    <rect x="84" y="115" width="18" height="48" rx="9" transform="rotate(-26 84 115)"/>
    <rect x="956" y="255" width="18" height="48" rx="9" transform="rotate(28 956 255)"/>
    <circle cx="932" cy="168" r="10"/>
    <circle cx="143" cy="892" r="12"/>
  </g>

  <g font-family="'Segoe UI','Inter','Arial',sans-serif">
    <g transform="translate(72 58)">
      <image href="data:image/png;base64,${logoData}" x="0" y="0" width="76" height="76" preserveAspectRatio="xMidYMid meet"/>
      <text x="94" y="34" font-size="25" font-weight="900" fill="#ff4c3b">Himi</text>
      <text x="154" y="34" font-size="25" font-weight="900" fill="#222222">Chinese</text>
      <text x="94" y="59" font-size="13" font-weight="700" letter-spacing="2.4" fill="#706762">HỌC LÀ VUI!</text>
    </g>

    <g filter="url(#shadow)">
      <rect x="70" y="170" width="940" height="815" rx="52" fill="#ffffff"/>
    </g>

    <rect x="112" y="212" width="254" height="52" rx="26" fill="#ff4c3b"/>
    <text x="239" y="246" text-anchor="middle" font-size="19" font-weight="900" letter-spacing="1.3" fill="#ffffff">MINI QUIZ • HSK 2</text>
    <text x="112" y="322" font-size="34" font-weight="900" fill="#222222">CÂU NÀY NGHĨA LÀ GÌ?</text>

    <rect x="112" y="356" width="856" height="196" rx="32" fill="#fff5ef" stroke="#ffd0c6" stroke-width="2"/>
    <text x="540" y="438" text-anchor="middle" font-family="'Microsoft YaHei','Noto Sans CJK SC','Segoe UI',sans-serif" font-size="47" font-weight="800" fill="#222222">你想看到高楼，还是看到山？</text>
    <text x="540" y="493" text-anchor="middle" font-size="25" font-weight="650" fill="#756a65">Nǐ xiǎng kàn dào gāolóu, háishì kàn dào shān?</text>

    <g font-size="23" font-weight="750" fill="#222222">
      <rect x="112" y="594" width="856" height="82" rx="24" fill="#ffffff" stroke="#ffd1c7" stroke-width="2"/>
      <circle cx="157" cy="635" r="25" fill="#ff8e2d"/>
      <text x="157" y="644" text-anchor="middle" font-size="23" font-weight="900" fill="#ffffff">A</text>
      <text x="200" y="644">Bạn muốn thấy những tòa nhà cao tầng hay ngọn núi?</text>

      <rect x="112" y="696" width="856" height="82" rx="24" fill="#ffffff" stroke="#ffd1c7" stroke-width="2"/>
      <circle cx="157" cy="737" r="25" fill="#ff8e2d"/>
      <text x="157" y="746" text-anchor="middle" font-size="23" font-weight="900" fill="#ffffff">B</text>
      <text x="200" y="746">Bạn muốn sống ở tầng cao hay dưới chân núi?</text>

      <rect x="112" y="798" width="856" height="82" rx="24" fill="#ffffff" stroke="#ffd1c7" stroke-width="2"/>
      <circle cx="157" cy="839" r="25" fill="#ff8e2d"/>
      <text x="157" y="848" text-anchor="middle" font-size="23" font-weight="900" fill="#ffffff">C</text>
      <text x="200" y="848">Bạn đang nhìn thấy tòa nhà và ngọn núi?</text>
    </g>

    <rect x="112" y="914" width="500" height="43" rx="21.5" fill="#fff0ec"/>
    <text x="362" y="942" text-anchor="middle" font-size="18" font-weight="850" fill="#ff4c3b">BÌNH LUẬN A, B HAY C NHÉ!</text>
  </g>

  <image href="data:image/png;base64,${mascotData}" x="705" y="848" width="330" height="220" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: false }).toFile(outputPath);
await writeFile(path.join(outputDirectory, "himi-mini-quiz-gaolou-haishi-shan.svg"), svg.trimStart(), "utf8");
console.log(outputPath);
