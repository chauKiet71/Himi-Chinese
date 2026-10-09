import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "vite";
import postgres from "postgres";

const root = process.cwd();
const envFile = process.env.HANZIWORK_ENV_FILE || [".env.local", ".env"].find(existsSync);
if (!process.env.DATABASE_URL && envFile) process.loadEnvFile(envFile);
const dryRun = process.argv.includes("--dry-run");
if (!dryRun && !process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const sourceRoot = resolve(root, "content/listening-catalog");
const catalog = JSON.parse(readFileSync(resolve(sourceRoot, "index.json"), "utf8"));
const server = await createServer({ configFile: false, appType: "custom", root,
  server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true, include: [] } });
let client;
try {
  const writing = await server.ssrLoadModule("/lib/writing-content.ts");
  const validation = await server.ssrLoadModule("/lib/listening-catalog.ts");
  if (!validation.isListeningCatalogIndex(catalog)) throw new Error("Invalid listening catalog");
  const levels = writing.getWritingLevels();
  const lessons = Object.fromEntries(levels.map((level) => [level.id, writing.getWritingLessons(level.id)]));
  const documents = [
    { kind: "writing_catalog", key: "index", payload: { levels, lessons } },
    { kind: "listening_catalog", key: "index", payload: catalog },
  ];
  for (const level of levels) for (const summary of lessons[level.id]) {
    const topic = writing.getWritingTopic(level.id, summary.id);
    if (!topic?.characters.length) throw new Error(`Empty writing lesson: ${summary.id}`);
    documents.push({ kind: "writing_lesson", key: `${level.id}:${summary.id}`, payload: topic });
  }
  for (const track of catalog.tracks) for (const group of track.groups) for (const topic of group.topics) for (const summary of topic.lessons) {
    if (!/^[a-z0-9-]+$/.test(summary.id)) throw new Error("Unsafe listening source ID");
    const lesson = JSON.parse(readFileSync(resolve(sourceRoot, "lessons", `${summary.id}.json`), "utf8"));
    if (!validation.isListeningCatalogLesson(lesson) || lesson.id !== summary.id || lesson.trackId !== track.id || lesson.groupId !== group.id || lesson.topicId !== topic.id) {
      throw new Error(`Invalid listening lesson: ${summary.id}`);
    }
    documents.push({ kind: "listening_lesson", key: lesson.id, payload: lesson });
  }
  if (new Set(documents.map((doc) => `${doc.kind}:${doc.key}`)).size !== documents.length) throw new Error("Duplicate content IDs");
  if (!dryRun) {
    client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
    await client.begin(async (tx) => {
      for (const doc of documents) {
        await tx`insert into practice_content_documents (kind, key, payload) values (${doc.kind}, ${doc.key}, ${tx.json(doc.payload)})
          on conflict (kind, key) do update set payload = excluded.payload, updated_at = now()`;
      }
    });
  }
  console.log(`${dryRun ? "Validated" : "Imported"}: ${documents.filter((doc) => doc.kind === "writing_lesson").length} writing lessons, ${documents.filter((doc) => doc.kind === "listening_lesson").length} listening lessons. Access policies preserved.`);
} finally {
  await server.close();
  if (client) await client.end({ timeout: 5 });
}
