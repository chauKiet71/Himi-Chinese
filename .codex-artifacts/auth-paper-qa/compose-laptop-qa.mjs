import sharp from "sharp";

const sourcePath = "C:/Users/Windows/AppData/Local/Temp/codex-clipboard-81a31099-050d-434a-9756-cc3fd077a2db.png";
const artifactDir = ".codex-artifacts/auth-paper-qa";
const routes = ["login", "register", "forgot"];

const label = (text, width) => Buffer.from(`
  <svg width="${width}" height="34" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" rx="8" fill="#173f39"/>
    <text x="15" y="23" fill="#fffdf7" font-family="Arial, sans-serif" font-size="15" font-weight="700">${text}</text>
  </svg>
`);

const source = await sharp(sourcePath).png().toBuffer();
const fullComposites = [
  { input: label("Mockup gốc · ba trạng thái", 1880), left: 15, top: 10 },
  { input: source, left: 0, top: 54 },
];

for (let index = 0; index < routes.length; index += 1) {
  const route = routes[index];
  const screenshot1280 = await sharp(`${artifactDir}/laptop-${route}-1280x720.png`)
    .resize({ width: 620, height: 349, fit: "fill" })
    .png()
    .toBuffer();
  const screenshot1024 = await sharp(`${artifactDir}/laptop-${route}-1024x768.png`)
    .resize({ width: 620, height: 465, fit: "fill" })
    .png()
    .toBuffer();
  const left = 15 + index * 635;
  fullComposites.push(
    { input: label(`Bản laptop · ${route} · 1280×720`, 620), left, top: 895 },
    { input: screenshot1280, left, top: 939 },
    { input: label(`Bản laptop · ${route} · 1024×768`, 620), left, top: 1308 },
    { input: screenshot1024, left, top: 1352 },
  );
}

await sharp({
  create: { width: 1910, height: 1832, channels: 3, background: "#e9e6df" },
})
  .composite(fullComposites)
  .png()
  .toFile(`${artifactDir}/comparison-auth-laptops.png`);

const sourceJoin = await sharp(sourcePath)
  .extract({ left: 0, top: 430, width: 620, height: 300 })
  .png()
  .toBuffer();
const implementationJoin = await sharp(`${artifactDir}/laptop-login-1024x768.png`)
  .extract({ left: 145, top: 430, width: 620, height: 300 })
  .png()
  .toBuffer();

await sharp({
  create: { width: 1280, height: 360, channels: 3, background: "#e9e6df" },
})
  .composite([
    { input: label("Mockup gốc · vùng chân form và miệng túi", 620), left: 10, top: 8 },
    { input: label("Laptop 1024×768 · vùng chân form và miệng túi", 620), left: 650, top: 8 },
    { input: sourceJoin, left: 10, top: 50 },
    { input: implementationJoin, left: 650, top: 50 },
  ])
  .png()
  .toFile(`${artifactDir}/comparison-auth-laptop-join.png`);
