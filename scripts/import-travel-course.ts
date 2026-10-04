import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { auditLogs, courses, lessons, lessonVocabulary, modules, vocabulary } from "../db/schema.ts";
import { closeDb, getDb } from "../db/index.ts";
import { getCourse } from "../lib/course-data.ts";
import { travelLessons, travelModules } from "../lib/travel-course-seed.ts";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) { process.loadEnvFile(file); break; }
}

const apply = process.argv.includes("--apply");
const allowedArguments = new Set(["--apply", "--dry-run"]);
if (process.argv.slice(2).some((argument) => !allowedArguments.has(argument))) throw new Error("Use --dry-run (default) or --apply.");
if (process.argv.includes("--apply") && process.argv.includes("--dry-run")) throw new Error("Choose only one import mode.");

const courseSlug = "tu-tin-kham-pha-trung-quoc";
const course = getCourse(courseSlug);
if (!course) throw new Error(`Missing bundled course metadata for ${courseSlug}.`);

async function run() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required. Without it the web app already reads the bundled travel course.");
  const db = getDb();
  const existing = await db.select().from(courses).where(eq(courses.slug, courseSlug)).limit(1);
  const report = {
    mode: apply ? "apply" : "dry-run",
    course: existing.length ? "update" : "create",
    modules: travelModules.length,
    lessons: travelLessons.length,
    vocabulary: travelLessons.reduce((total, lesson) => total + lesson.vocabulary.length, 0),
    phrases: travelLessons.reduce((total, lesson) => total + (lesson.content.phrases?.length ?? 0), 0),
    sentences: travelLessons.reduce((total, lesson) => total + lesson.content.dialogue.length, 0),
  };

  if (!apply) {
    console.log(JSON.stringify(report, null, 2));
    await closeDb();
    return;
  }

  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('travel-course-import'))`);
    const [currentCourse] = await tx.select().from(courses).where(eq(courses.slug, courseSlug)).limit(1).for("update");
    let backupPath: string | null = null;

    if (currentCourse) {
      const currentModules = await tx.select().from(modules).where(eq(modules.courseId, currentCourse.id));
      const currentLessons = currentModules.length
        ? await tx.select().from(lessons).where(inArray(lessons.moduleId, currentModules.map((module) => module.id)))
        : [];
      const currentLinks = currentLessons.length
        ? await tx.select().from(lessonVocabulary).where(inArray(lessonVocabulary.lessonId, currentLessons.map((lesson) => lesson.id)))
        : [];
      const currentWords = currentLinks.length
        ? await tx.select().from(vocabulary).where(inArray(vocabulary.id, [...new Set(currentLinks.map((link) => link.vocabularyId))]))
        : [];
      const directory = resolve("outputs", "travel-course-backups");
      mkdirSync(directory, { recursive: true });
      backupPath = resolve(directory, `${now.toISOString().replaceAll(":", "-")}.json`);
      writeFileSync(backupPath, JSON.stringify({ schemaVersion: 1, createdAt: now.toISOString(), course: currentCourse, modules: currentModules, lessons: currentLessons, lessonVocabulary: currentLinks, vocabulary: currentWords }, null, 2) + "\n", { flag: "wx" });
      console.log(`Backup: ${backupPath}`);
    }

    const [lastCourse] = await tx.select({ sortOrder: courses.sortOrder }).from(courses).orderBy(desc(courses.sortOrder)).limit(1);
    const [courseRow] = await tx.insert(courses).values({
      slug: course.slug,
      titleVi: course.title,
      titleZh: course.chineseTitle,
      hanzi: course.hanzi,
      category: course.category,
      description: course.description,
      level: course.level,
      lessonCount: course.lessons,
      totalMinutes: course.minutes,
      freeLessonCount: course.freeLessons,
      themeColor: course.color,
      themeInk: course.ink,
      status: "published",
      sortOrder: currentCourse?.sortOrder ?? ((lastCourse?.sortOrder ?? -1) + 1),
      publishedAt: currentCourse?.publishedAt ?? now,
      updatedAt: now,
    }).onConflictDoUpdate({
      target: courses.slug,
      set: {
        titleVi: course.title,
        titleZh: course.chineseTitle,
        hanzi: course.hanzi,
        category: course.category,
        description: course.description,
        level: course.level,
        lessonCount: course.lessons,
        totalMinutes: course.minutes,
        freeLessonCount: course.freeLessons,
        themeColor: course.color,
        themeInk: course.ink,
        status: "published",
        updatedAt: now,
      },
    }).returning({ id: courses.id });

    const moduleIds = new Map<string, string>();
    for (const [sortOrder, moduleSeed] of travelModules.entries()) {
      const [moduleRow] = await tx.insert(modules).values({
        courseId: courseRow.id,
        ...moduleSeed,
        sortOrder,
      }).onConflictDoUpdate({
        target: [modules.courseId, modules.slug],
        set: { title: moduleSeed.title, description: moduleSeed.description, sortOrder },
      }).returning({ id: modules.id });
      moduleIds.set(moduleSeed.slug, moduleRow.id);
    }

    const moduleLessonOrders = new Map<string, number>();
    for (const lesson of travelLessons) {
      const moduleId = moduleIds.get(lesson.moduleSlug);
      if (!moduleId) throw new Error(`Missing module ${lesson.moduleSlug} for ${lesson.slug}.`);
      const sortOrder = moduleLessonOrders.get(lesson.moduleSlug) ?? 0;
      moduleLessonOrders.set(lesson.moduleSlug, sortOrder + 1);
      const [lessonRow] = await tx.insert(lessons).values({
        moduleId,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        situation: lesson.situation,
        estimatedMinutes: lesson.estimatedMinutes,
        isFree: lesson.isFree,
        status: "published",
        sortOrder,
        content: lesson.content,
        updatedAt: now,
      }).onConflictDoUpdate({
        target: [lessons.moduleId, lessons.slug],
        set: {
          title: lesson.title,
          summary: lesson.summary,
          situation: lesson.situation,
          estimatedMinutes: lesson.estimatedMinutes,
          isFree: lesson.isFree,
          status: "published",
          sortOrder,
          content: lesson.content,
          updatedAt: now,
        },
      }).returning({ id: lessons.id });

      for (const [wordOrder, word] of lesson.vocabulary.entries()) {
        const [wordRow] = await tx.insert(vocabulary).values({
          slug: word.slug,
          hanzi: word.hanzi,
          pinyin: word.pinyin,
          meaningVi: word.meaning,
          exampleZh: word.example,
          exampleVi: word.translation,
          audioUrl: word.audioUrl,
          tags: [courseSlug, lesson.slug],
          updatedAt: now,
        }).onConflictDoUpdate({
          target: vocabulary.slug,
          set: {
            hanzi: word.hanzi,
            pinyin: word.pinyin,
            meaningVi: word.meaning,
            exampleZh: word.example,
            exampleVi: word.translation,
            audioUrl: word.audioUrl,
            tags: [courseSlug, lesson.slug],
            updatedAt: now,
          },
        }).returning({ id: vocabulary.id });

        await tx.insert(lessonVocabulary).values({
          lessonId: lessonRow.id,
          vocabularyId: wordRow.id,
          sortOrder: wordOrder,
        }).onConflictDoUpdate({
          target: [lessonVocabulary.lessonId, lessonVocabulary.vocabularyId],
          set: { sortOrder: wordOrder },
        });
      }
    }

    await tx.insert(auditLogs).values({
      action: "content.travel-course.imported",
      entityType: "course",
      entityId: courseRow.id,
      metadata: { ...report, backupPath },
    });
  });

  console.log(JSON.stringify(report, null, 2));
  console.log("Travel course import committed. Published-content caches refresh within 300 seconds.");
  await closeDb();
}

try {
  await run();
} catch (error) {
  console.error(error instanceof Error && error.message && !error.message.includes("query:") && !/postgres(?:ql)?:\/\//i.test(error.message) ? error.message : "Database connection or import failed; no partial import was committed.");
  process.exitCode = 1;
  await closeDb();
}
