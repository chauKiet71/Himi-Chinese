import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const levelArgument = process.argv
  .slice(2)
  .find((argument) => argument.startsWith("--level="))
  ?.slice("--level=".length)
  .toUpperCase();
const LEVEL = levelArgument ?? "HSK1";
if (!/^HSK[1-9]$/u.test(LEVEL)) {
  throw new Error(`Cấp độ không hợp lệ: ${LEVEL}.`);
}

const outputArguments = process.argv.slice(2).filter((argument) => !argument.startsWith("--"));
const levelSlug = LEVEL.toLowerCase();
const SOURCE_URL = `https://hsk.tiengtrunghero.edu.vn/syllabus/${LEVEL}`;
const DEFAULT_JSON_OUTPUT = `output/tiengtrunghero-${levelSlug}-vocabulary.json`;
const DEFAULT_MARKDOWN_OUTPUT = `output/tiengtrunghero-${levelSlug}-vocabulary.md`;

type SourceVocabularyItem = {
  Id?: unknown;
  Hanzi?: unknown;
  Pinyin?: unknown;
  WordType?: unknown;
  MeaningVi?: unknown;
  ExampleHanzi?: unknown;
  ExamplePinyin?: unknown;
  ExampleVi?: unknown;
};

type VocabularyItem = {
  id: string;
  hanzi: string;
  pinyin: string;
  wordType: string;
  meaningVi: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleVi: string;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

function markdownCell(value: string): string {
  return value
    .replace(/\\/gu, "\\\\")
    .replace(/\|/gu, "\\|")
    .replace(/\r?\n/gu, "<br>") || "—";
}

function normalizeItem(item: SourceVocabularyItem): VocabularyItem {
  return {
    id: text(item.Id),
    hanzi: text(item.Hanzi),
    pinyin: text(item.Pinyin),
    wordType: text(item.WordType),
    meaningVi: text(item.MeaningVi),
    exampleHanzi: text(item.ExampleHanzi),
    examplePinyin: text(item.ExamplePinyin),
    exampleVi: text(item.ExampleVi),
  };
}

const response = await fetch(SOURCE_URL, {
  headers: {
    "user-agent": "Himi-Chinese curriculum data importer/1.0",
    accept: "text/html,application/xhtml+xml",
  },
});

if (!response.ok) {
  throw new Error(`Không thể tải ${SOURCE_URL}: HTTP ${response.status}.`);
}

const html = await response.text();
const dataMatch = html.match(
  /const\s+allVocabData\s*=\s*(\[[\s\S]*\]);\s*let\s+filteredVocabList/u,
);
if (!dataMatch) {
  throw new Error("Không tìm thấy biến allVocabData trong HTML nguồn.");
}

const sourceItems = JSON.parse(dataMatch[1]) as SourceVocabularyItem[];
if (!Array.isArray(sourceItems)) {
  throw new Error("allVocabData không phải là một mảng JSON.");
}
const expectedCountMatch = html.match(/tổng số\s+(\d+)\s+từ vựng/ui);
const expectedCount = expectedCountMatch ? Number(expectedCountMatch[1]) : undefined;
if (expectedCount !== undefined && sourceItems.length !== expectedCount) {
  throw new Error(`Số bản ghi không khớp giao diện: hiển thị ${expectedCount}, nhận được ${sourceItems.length}.`);
}

const vocabulary = sourceItems.map(normalizeItem);
const issues: string[] = [];
for (const [index, item] of vocabulary.entries()) {
  if (!item.id || !item.hanzi || !item.pinyin || !item.meaningVi) {
    issues.push(`Bản ghi ${index + 1} thiếu ID, chữ Hán, pinyin hoặc nghĩa tiếng Việt.`);
  }
}
if (issues.length > 0) {
  throw new Error(issues.slice(0, 20).join("\n"));
}

const duplicateIds = vocabulary
  .map((item) => item.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  throw new Error(`ID bị trùng: ${Array.from(new Set(duplicateIds)).join(", ")}`);
}

const scrapedAt = new Date().toISOString();
const jsonOutputPath = resolve(process.cwd(), outputArguments[0] ?? DEFAULT_JSON_OUTPUT);
const markdownOutputPath = resolve(process.cwd(), outputArguments[1] ?? DEFAULT_MARKDOWN_OUTPUT);
await mkdir(dirname(jsonOutputPath), { recursive: true });
await mkdir(dirname(markdownOutputPath), { recursive: true });

await writeFile(jsonOutputPath, `${JSON.stringify({
  schemaVersion: "1.0.0",
  source: SOURCE_URL,
  sourceTitle: `Đề cương từ vựng New ${LEVEL} (2026 Edition)`,
  level: LEVEL,
  scrapedAt,
  count: vocabulary.length,
  items: vocabulary,
}, null, 2)}\n`, "utf8");

const markdownLines = [
  `# Dữ liệu từ vựng New ${LEVEL} (2026 Edition)`,
  "",
  `- Nguồn: ${SOURCE_URL}`,
  `- Thời điểm trích xuất: ${scrapedAt}`,
  `- Tổng số bản ghi: **${vocabulary.length}**.`,
  "- Nội dung bên dưới được giữ theo dữ liệu công khai của trang nguồn; chưa tự sửa lỗi từ điển hoặc bản dịch.",
  "- Trường pinyin ví dụ trên nguồn chỉ chứa pinyin của mục từ trong dấu ngoặc vuông, không phải pinyin đầy đủ của cả câu.",
  "",
  "| # | ID | Chữ Hán | Pinyin | Từ loại | Nghĩa tiếng Việt | Câu ví dụ | Pinyin ví dụ trên nguồn | Dịch câu |",
  "|---:|---|---|---|---|---|---|---|---|",
];

for (const [index, item] of vocabulary.entries()) {
  markdownLines.push(
    `| ${index + 1} | ${markdownCell(item.id)} | ${markdownCell(item.hanzi)} | ${markdownCell(item.pinyin)} | ${markdownCell(item.wordType)} | ${markdownCell(item.meaningVi)} | ${markdownCell(item.exampleHanzi)} | ${markdownCell(item.examplePinyin)} | ${markdownCell(item.exampleVi)} |`,
  );
}

await writeFile(markdownOutputPath, `${markdownLines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  source: SOURCE_URL,
  level: LEVEL,
  count: vocabulary.length,
  jsonOutputPath,
  markdownOutputPath,
}, null, 2));
