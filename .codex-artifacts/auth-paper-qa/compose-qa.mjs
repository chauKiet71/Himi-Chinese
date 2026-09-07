import sharp from "sharp";

const sourcePath = "C:/Users/Windows/AppData/Local/Temp/codex-clipboard-81a31099-050d-434a-9756-cc3fd077a2db.png";
const artifactDir = ".codex-artifacts/auth-paper-qa";
const screens = [
  { name: "Đăng nhập", sourceLeft: 0, rendered: `${artifactDir}/qa-login-620x823.png` },
  { name: "Đăng ký", sourceLeft: 645, rendered: `${artifactDir}/qa-register-620x823.png` },
  { name: "Đặt lại mật khẩu", sourceLeft: 1290, rendered: `${artifactDir}/qa-forgot-620x823.png` },
];

const labelSvg = (text, width = 620) => Buffer.from(`
  <svg width="${width}" height="34" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" rx="8" fill="#173f39"/>
    <text x="16" y="23" fill="#fffdf7" font-family="Arial, sans-serif" font-size="16" font-weight="700">${text}</text>
  </svg>
`);

const composites = [];
for (let index = 0; index < screens.length; index += 1) {
  const screen = screens[index];
  const y = index * 875;
  const sourcePanel = await sharp(sourcePath)
    .extract({ left: screen.sourceLeft, top: 0, width: 620, height: 823 })
    .png()
    .toBuffer();
  composites.push(
    { input: labelSvg(`Mockup gốc · ${screen.name}`), left: 10, top: y + 8 },
    { input: labelSvg(`Bản triển khai · ${screen.name}`), left: 650, top: y + 8 },
    { input: sourcePanel, left: 10, top: y + 50 },
    { input: screen.rendered, left: 650, top: y + 50 },
  );
}

await sharp({
  create: { width: 1280, height: 2625, channels: 3, background: "#e9e6df" },
})
  .composite(composites)
  .png()
  .toFile(`${artifactDir}/comparison-auth-620x823.png`);

const sourceJoin = await sharp(sourcePath)
  .extract({ left: 0, top: 450, width: 620, height: 250 })
  .png()
  .toBuffer();
const renderedJoin = await sharp(`${artifactDir}/qa-login-620x823.png`)
  .extract({ left: 0, top: 450, width: 620, height: 250 })
  .png()
  .toBuffer();

await sharp({
  create: { width: 1280, height: 310, channels: 3, background: "#e9e6df" },
})
  .composite([
    { input: labelSvg("Mockup gốc · vùng tiếp giáp giấy/túi"), left: 10, top: 8 },
    { input: labelSvg("Bản triển khai · vùng tiếp giáp giấy/túi"), left: 650, top: 8 },
    { input: sourceJoin, left: 10, top: 50 },
    { input: renderedJoin, left: 650, top: 50 },
  ])
  .png()
  .toFile(`${artifactDir}/comparison-paper-bag-join.png`);
