import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { closeDb, getDb } from "../db/index.ts";
import { auditLogs, courses, lessons, lessonVocabulary, modules, vocabulary } from "../db/schema.ts";
import { industryCurricula } from "../lib/industry-curriculum.ts";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) { process.loadEnvFile(file); break; }
}
const apply = process.argv.includes("--apply");
const courseSlugs = industryCurricula.map(course => course.courseSlug);
const allowedArguments = new Set(["--apply", "--dry-run"]);
if (process.argv.slice(2).some(argument => !allowedArguments.has(argument))) throw new Error("Use --dry-run (default) or --apply.");
if (process.argv.includes("--apply") && process.argv.includes("--dry-run")) throw new Error("Choose only one import mode.");

async function run() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for an import. The web demo already reads the JSON files directly.");
  const db = getDb();
  const report = { mode: apply ? "apply" : "dry-run", courses: 0, createdModules: 0, createdLessons: 0, updatedLessons: 0, unchangedLessons: 0, createdWords: 0, updatedWords: 0 };
  await db.transaction(async tx => {
    // Serialize importers; row locks also prevent an editor's concurrent update being overwritten.
    if (apply) await tx.execute(sql`select pg_advisory_xact_lock(hashtext('industry-curriculum-import'))`);
    const courseRows = await tx.select().from(courses).where(inArray(courses.slug, courseSlugs)).orderBy(asc(courses.slug));
    if (courseRows.length !== courseSlugs.length) throw new Error("Some target courses are missing. Initialize the course catalog before importing.");
    const courseIds = courseRows.map(course => course.id);
    if (apply) {
      await tx.select({ id: courses.id }).from(courses).where(inArray(courses.id, courseIds)).for("update");
      await tx.select({ id: lessons.id }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).where(inArray(modules.courseId, courseIds)).for("update", { of: lessons });
    }
    const moduleRows = await tx.select().from(modules).where(inArray(modules.courseId, courseIds));
    const lessonRows = moduleRows.length ? await tx.select().from(lessons).where(inArray(lessons.moduleId, moduleRows.map(module => module.id))) : [];
    const links = lessonRows.length ? await tx.select().from(lessonVocabulary).where(inArray(lessonVocabulary.lessonId, lessonRows.map(lesson => lesson.id))) : [];
    const inputWords = industryCurricula.flatMap(course => course.lessons.flatMap(lesson => lesson.vocabulary));
    const inputSlugs = [...new Set(inputWords.map(word => word.slug))];
    const wordRows = await tx.select().from(vocabulary).where(inArray(vocabulary.slug, inputSlugs));
    const linkedWords = links.length ? await tx.select().from(vocabulary).where(inArray(vocabulary.id, [...new Set(links.map(link => link.vocabularyId))])) : [];
    const wordMap = new Map(wordRows.map(word => [word.slug, word]));
    const now = new Date();
    let backupPath: string | null = null;
    if (apply) {
      const directory = resolve("outputs", "industry-curriculum-backups");
      mkdirSync(directory, { recursive: true });
      backupPath = resolve(directory, `${now.toISOString().replaceAll(":", "-")}.json`);
      writeFileSync(backupPath, JSON.stringify({ schemaVersion: 1, createdAt: now.toISOString(), courses: courseRows, modules: moduleRows, lessons: lessonRows, lessonVocabulary: links, vocabulary: [...new Map([...wordRows, ...linkedWords].map(word => [word.id, word])).values()] }, null, 2) + "\n", { flag: "wx" });
      console.log(`Backup: ${backupPath}`);
    }
    for (const curriculum of industryCurricula) {
      const course = courseRows.find(row => row.slug === curriculum.courseSlug)!;
      report.courses++;
      for (const [moduleOrder, module] of curriculum.modules.entries()) {
        let moduleRow = moduleRows.find(row => row.courseId === course.id && row.slug === module.slug);
        if (!moduleRow) {
          report.createdModules++;
          if (apply) [moduleRow] = await tx.insert(modules).values({ courseId: course.id, ...module, sortOrder: moduleOrder }).returning();
        } else if (apply && (moduleRow.title !== module.title || moduleRow.description !== module.description || moduleRow.sortOrder !== moduleOrder)) {
          await tx.update(modules).set({ title: module.title, description: module.description, sortOrder: moduleOrder }).where(eq(modules.id, moduleRow.id));
        }
        const moduleLessons = curriculum.lessons.filter(lesson => lesson.moduleSlug === module.slug);
        for (const [sortOrder, lesson] of moduleLessons.entries()) {
          const existing = moduleRow && lessonRows.find(row => row.moduleId === moduleRow.id && row.slug === lesson.slug);
          // A slug moved in an admin edit must never silently create a second copy with new progress IDs.
          if (!existing && lessonRows.some(row => row.slug === lesson.slug && moduleRows.some(m => m.id === row.moduleId && m.courseId === course.id))) {
            throw new Error(`Lesson ${curriculum.courseSlug}/${lesson.slug} has moved modules; reconcile its module in JSON first.`);
          }
          const fields = { title: lesson.title, summary: lesson.summary, situation: lesson.situation, estimatedMinutes: lesson.estimatedMinutes, isFree: existing?.isFree ?? lesson.isFree, status: existing?.status ?? "published" as const, sortOrder, content: lesson.content };
          const changed = existing && Object.entries(fields).some(([key, value]) => !isDeepStrictEqual(existing[key as keyof typeof existing], value));
          if (!existing) report.createdLessons++;
          else if (changed) report.updatedLessons++;
          else report.unchangedLessons++;
          let lessonId = existing?.id;
          if (apply && moduleRow) {
            if (!existing) {
              const [created] = await tx.insert(lessons).values({ ...fields, moduleId: moduleRow.id, slug: lesson.slug, updatedAt: now }).returning({ id: lessons.id });
              lessonId = created.id;
            } else if (changed) await tx.update(lessons).set({ ...fields, updatedAt: now }).where(eq(lessons.id, existing.id));
          }
          const wordIds: string[] = [];
          for (const word of lesson.vocabulary) {
            const old = wordMap.get(word.slug);
            const values = { hanzi: word.hanzi, pinyin: word.pinyin, meaningVi: word.meaning, exampleZh: word.example, exampleVi: word.translation, audioUrl: word.audioUrl ?? old?.audioUrl ?? null };
            const wordChanged = old && Object.entries(values).some(([key, value]) => !isDeepStrictEqual(old[key as keyof typeof old], value));
            if (!old) report.createdWords++;
            else if (wordChanged) report.updatedWords++;
            if (apply) {
              let current = old;
              if (!old) [current] = await tx.insert(vocabulary).values({ slug: word.slug, ...values, tags: [curriculum.courseSlug, lesson.slug], updatedAt: now }).returning();
              else if (wordChanged) [current] = await tx.update(vocabulary).set({ ...values, updatedAt: now }).where(eq(vocabulary.id, old.id)).returning();
              wordMap.set(word.slug, current!);
              wordIds.push(current!.id);
            }
          }
          if (apply && lessonId) {
            const currentLinks = links.filter(link => link.lessonId === lessonId).sort((a, b) => a.sortOrder - b.sortOrder);
            if (!isDeepStrictEqual(currentLinks.map(link => link.vocabularyId), wordIds)) {
              await tx.delete(lessonVocabulary).where(eq(lessonVocabulary.lessonId, lessonId));
              await tx.insert(lessonVocabulary).values(wordIds.map((vocabularyId, wordOrder) => ({ lessonId: lessonId!, vocabularyId, sortOrder: wordOrder })));
            }
          }
        }
      }
      if (apply) {
        // Count the actual published rows, including any additional lessons made in Admin.
        const [stats] = await tx.select({ lessonCount: sql<number>`count(*)::int`, totalMinutes: sql<number>`coalesce(sum(${lessons.estimatedMinutes}), 0)::int`, freeLessonCount: sql<number>`count(*) filter (where ${lessons.isFree})::int` }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).where(and(eq(modules.courseId, course.id), eq(lessons.status, "published")));
        await tx.update(courses).set({ ...stats, updatedAt: now }).where(eq(courses.id, course.id));
      }
    }
    if (apply) await tx.insert(auditLogs).values({ action: "content.industry-json.imported", entityType: "curriculum", metadata: { ...report, schemaVersion: 1, courseSlugs, backupPath } });
  });
  console.log(JSON.stringify(report, null, 2));
  if (apply) console.log("Import committed. Published-content caches refresh within 300 seconds.");
}

try { await run(); }
catch (error) {
  // Database errors may contain connection strings and SQL parameters; never print them.
  console.error(error instanceof Error && error.message && !error.message.includes("query:") && !/postgres(?:ql)?:\/\//i.test(error.message) ? error.message : "Database connection or import failed; no partial import was committed.");
  process.exitCode = 1;
} finally { await closeDb(); }
