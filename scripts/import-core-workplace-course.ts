import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { and, eq, inArray, sql } from "drizzle-orm";
import { closeDb, getDb } from "../db/index.ts";
import { auditLogs, courses, lessons, lessonVocabulary, modules, vocabulary } from "../db/schema.ts";
import { coreWorkplaceLessons, coreWorkplaceModules } from "../lib/core-workplace-course-seed.ts";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) {
    process.loadEnvFile(file);
    break;
  }
}

const apply = process.argv.includes("--apply");
const allowedArguments = new Set(["--apply", "--dry-run"]);
if (process.argv.slice(2).some((argument) => !allowedArguments.has(argument))) throw new Error("Use --dry-run (default) or --apply.");
if (process.argv.includes("--apply") && process.argv.includes("--dry-run")) throw new Error("Choose only one import mode.");

const courseSlug = "giao-tiep-cong-so";

async function run() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required. Without it the web app already reads the bundled course.");
  const db = getDb();
  const report = {
    mode: apply ? "apply" : "dry-run",
    modules: coreWorkplaceModules.length,
    lessons: coreWorkplaceLessons.length,
    vocabulary: coreWorkplaceLessons.reduce((total, lesson) => total + lesson.vocabulary.length, 0),
    phrases: coreWorkplaceLessons.reduce((total, lesson) => total + (lesson.content.phrases?.length ?? 0), 0),
    sentences: coreWorkplaceLessons.reduce((total, lesson) => total + lesson.content.dialogue.length, 0),
    createdLessons: 0,
    updatedLessons: 0,
    unchangedLessons: 0,
    createdWords: 0,
    updatedWords: 0,
  };

  await db.transaction(async (tx) => {
    if (apply) await tx.execute(sql`select pg_advisory_xact_lock(hashtext('core-workplace-course-import'))`);
    const [course] = await tx.select().from(courses).where(eq(courses.slug, courseSlug)).limit(1);
    if (!course) throw new Error(`Course ${courseSlug} is missing. Initialize the course catalog before importing.`);
    if (apply) await tx.select({ id: courses.id }).from(courses).where(eq(courses.id, course.id)).for("update");

    const moduleRows = await tx.select().from(modules).where(eq(modules.courseId, course.id));
    const lessonRows = moduleRows.length
      ? await tx.select().from(lessons).where(inArray(lessons.moduleId, moduleRows.map((courseModule) => courseModule.id)))
      : [];
    if (apply && lessonRows.length) {
      await tx.select({ id: lessons.id }).from(lessons).where(inArray(lessons.id, lessonRows.map((lesson) => lesson.id))).for("update");
    }
    const links = lessonRows.length
      ? await tx.select().from(lessonVocabulary).where(inArray(lessonVocabulary.lessonId, lessonRows.map((lesson) => lesson.id)))
      : [];
    const inputSlugs = [...new Set(coreWorkplaceLessons.flatMap((lesson) => lesson.vocabulary.map((word) => word.slug)))];
    const wordRows = inputSlugs.length ? await tx.select().from(vocabulary).where(inArray(vocabulary.slug, inputSlugs)) : [];
    const linkedWords = links.length
      ? await tx.select().from(vocabulary).where(inArray(vocabulary.id, [...new Set(links.map((link) => link.vocabularyId))]))
      : [];
    const wordMap = new Map(wordRows.map((word) => [word.slug, word]));
    const now = new Date();
    let backupPath: string | null = null;

    if (apply) {
      const directory = resolve("outputs", "core-workplace-course-backups");
      mkdirSync(directory, { recursive: true });
      backupPath = resolve(directory, `${now.toISOString().replaceAll(":", "-")}.json`);
      writeFileSync(backupPath, JSON.stringify({
        schemaVersion: 1,
        createdAt: now.toISOString(),
        course,
        modules: moduleRows,
        lessons: lessonRows,
        lessonVocabulary: links,
        vocabulary: [...new Map([...wordRows, ...linkedWords].map((word) => [word.id, word])).values()],
      }, null, 2) + "\n", { flag: "wx" });
      console.log(`Backup: ${backupPath}`);
    }

    for (const [moduleOrder, moduleSeed] of coreWorkplaceModules.entries()) {
      let moduleRow = moduleRows.find((row) => row.slug === moduleSeed.slug);
      if (!moduleRow && apply) {
        [moduleRow] = await tx.insert(modules).values({ courseId: course.id, ...moduleSeed, sortOrder: moduleOrder }).returning();
      } else if (moduleRow && apply && (moduleRow.title !== moduleSeed.title || moduleRow.description !== moduleSeed.description || moduleRow.sortOrder !== moduleOrder)) {
        [moduleRow] = await tx.update(modules).set({ title: moduleSeed.title, description: moduleSeed.description, sortOrder: moduleOrder }).where(eq(modules.id, moduleRow.id)).returning();
      }
      if (!moduleRow && !apply) {
        throw new Error(`Module ${moduleSeed.slug} is missing. Run with --apply to create it.`);
      }

      const moduleLessons = coreWorkplaceLessons.filter((lesson) => lesson.moduleSlug === moduleSeed.slug);
      for (const [sortOrder, lesson] of moduleLessons.entries()) {
        const existing = moduleRow && lessonRows.find((row) => row.moduleId === moduleRow.id && row.slug === lesson.slug);
        if (!existing && lessonRows.some((row) => row.slug === lesson.slug)) {
          throw new Error(`Lesson ${lesson.slug} has moved modules; reconcile it before importing.`);
        }
        const fields = {
          title: lesson.title,
          summary: lesson.summary,
          situation: lesson.situation,
          estimatedMinutes: lesson.estimatedMinutes,
          isFree: existing?.isFree ?? lesson.isFree,
          status: existing?.status ?? "published" as const,
          sortOrder,
          content: lesson.content,
        };
        const changed = existing && Object.entries(fields).some(([key, value]) => !isDeepStrictEqual(existing[key as keyof typeof existing], value));
        if (!existing) report.createdLessons++;
        else if (changed) report.updatedLessons++;
        else report.unchangedLessons++;

        let lessonId = existing?.id;
        if (apply && moduleRow) {
          if (!existing) {
            const [created] = await tx.insert(lessons).values({ ...fields, moduleId: moduleRow.id, slug: lesson.slug, updatedAt: now }).returning({ id: lessons.id });
            lessonId = created.id;
          } else if (changed) {
            await tx.update(lessons).set({ ...fields, updatedAt: now }).where(eq(lessons.id, existing.id));
          }
        }

        const wordIds: string[] = [];
        for (const word of lesson.vocabulary) {
          const old = wordMap.get(word.slug);
          const values = {
            hanzi: word.hanzi,
            pinyin: word.pinyin,
            meaningVi: word.meaning,
            exampleZh: word.example,
            exampleVi: word.translation,
            audioUrl: word.audioUrl ?? old?.audioUrl ?? null,
            tags: [courseSlug, lesson.slug],
          };
          const wordChanged = old && Object.entries(values).some(([key, value]) => !isDeepStrictEqual(old[key as keyof typeof old], value));
          if (!old) report.createdWords++;
          else if (wordChanged) report.updatedWords++;
          if (apply) {
            let current = old;
            if (!old) {
              [current] = await tx.insert(vocabulary).values({ slug: word.slug, ...values, updatedAt: now }).returning();
            } else if (wordChanged) {
              [current] = await tx.update(vocabulary).set({ ...values, updatedAt: now }).where(eq(vocabulary.id, old.id)).returning();
            }
            wordMap.set(word.slug, current!);
            wordIds.push(current!.id);
          }
        }

        if (apply && lessonId) {
          const currentLinks = links.filter((link) => link.lessonId === lessonId).sort((a, b) => a.sortOrder - b.sortOrder);
          if (!isDeepStrictEqual(currentLinks.map((link) => link.vocabularyId), wordIds)) {
            await tx.delete(lessonVocabulary).where(eq(lessonVocabulary.lessonId, lessonId));
            await tx.insert(lessonVocabulary).values(wordIds.map((vocabularyId, wordOrder) => ({ lessonId: lessonId!, vocabularyId, sortOrder: wordOrder })));
          }
        }
      }
    }

    if (apply) {
      const [stats] = await tx.select({
        lessonCount: sql<number>`count(*)::int`,
        totalMinutes: sql<number>`coalesce(sum(${lessons.estimatedMinutes}), 0)::int`,
        freeLessonCount: sql<number>`count(*) filter (where ${lessons.isFree})::int`,
      }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).where(and(eq(modules.courseId, course.id), eq(lessons.status, "published")));
      await tx.update(courses).set({ ...stats, updatedAt: now }).where(eq(courses.id, course.id));
      await tx.insert(auditLogs).values({
        action: "content.core-workplace.imported",
        entityType: "course",
        entityId: course.id,
        metadata: { ...report, schemaVersion: 1, courseSlug, backupPath },
      });
    }
  });

  console.log(JSON.stringify(report, null, 2));
  if (apply) console.log("Core workplace course import committed. Published-content caches refresh within 300 seconds.");
}

try {
  await run();
} catch (error) {
  console.error(error instanceof Error && error.message && !error.message.includes("query:") && !/postgres(?:ql)?:\/\//i.test(error.message)
    ? error.message
    : "Database connection or import failed; no partial import was committed.");
  process.exitCode = 1;
} finally {
  await closeDb();
}
