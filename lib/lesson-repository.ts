import { and, asc, desc, eq, isNull, lte, or } from "drizzle-orm";
import { unstable_cache } from "next/cache.js";
import { readDb } from "../db/index.ts";
import {
  courses as courseTable,
  lessons as lessonTable,
  lessonVocabulary,
  modules,
  reviewItems,
  vocabulary as vocabularyTable,
} from "../db/schema.ts";
import { getPublishedCourse } from "./course-repository.ts";
import { getContentAccessPolicies } from "./content-access-repository.ts";
import {
  learningLessonTarget,
  learningModuleTarget,
  learningPathTarget,
  learningQuestionTarget,
  resolveContentAccess,
  type ContentAccessTarget,
} from "./content-access-types.ts";
import { getLessonAccess, hasActiveVipAccess } from "./lesson-access.ts";
import { getLessonProgress } from "./progress-repository.ts";
import { coreWorkplaceLessons, coreWorkplaceModules } from "./core-workplace-course-seed.ts";
import { ecommerceLessons, ecommerceModules } from "./ecommerce-course-seed.ts";
import { factoryLessons, factoryModules } from "./factory-course-seed.ts";
import { highFrequencyLessons, highFrequencyModules } from "./high-frequency-course-seed.ts";
import { logisticsLessons, logisticsModules } from "./logistics-course-seed.ts";
import { officeLessons, officeModules } from "./office-course-seed.ts";
import { restaurantLessons, restaurantModules } from "./restaurant-course-seed.ts";
import { salesLessons, salesModules } from "./sales-course-seed.ts";
import type { CourseLessonSeed, CourseModuleSeed, CourseSeedBundle } from "./course-seed-types.ts";
import type {
  ChallengeQuestion,
  Course,
  DialogueLine,
  LessonAccess,
  LessonContent,
  LessonDetail,
  LessonProgressState,
  LessonSummary,
  UsageNote,
  Vocabulary,
} from "./content-types.ts";

const courseSeedBundles = new Map<string, CourseSeedBundle>([
  ["van-phong-hanh-chinh", { courseSlug: "van-phong-hanh-chinh", modules: officeModules, lessons: officeLessons }],
  ["nha-may-san-xuat", { courseSlug: "nha-may-san-xuat", modules: factoryModules, lessons: factoryLessons }],
  ["kho-van-logistics", { courseSlug: "kho-van-logistics", modules: logisticsModules, lessons: logisticsLessons }],
  ["ban-hang-cham-soc-khach-hang", { courseSlug: "ban-hang-cham-soc-khach-hang", modules: salesModules, lessons: salesLessons }],
  ["nha-hang-dich-vu", { courseSlug: "nha-hang-dich-vu", modules: restaurantModules, lessons: restaurantLessons }],
  ["thuong-mai-dien-tu", { courseSlug: "thuong-mai-dien-tu", modules: ecommerceModules, lessons: ecommerceLessons }],
  ["giao-tiep-cong-so", { courseSlug: "giao-tiep-cong-so", modules: coreWorkplaceModules, lessons: coreWorkplaceLessons }],
  ["tieng-trung-tan-suat-cao", { courseSlug: "tieng-trung-tan-suat-cao", modules: highFrequencyModules, lessons: highFrequencyLessons }],
]);

export type LessonPageData = {
  course: Course;
  lessons: LessonSummary[];
  lesson: LessonDetail | null;
  access: LessonAccess | null;
  progress: LessonProgressState | null;
  invalidLesson: boolean;
};

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function parseLessonContent(value: unknown): LessonContent {
  if (!value || typeof value !== "object") return { dialogue: [], notes: [] };
  const raw = value as { dialogue?: unknown; phrases?: unknown; notes?: unknown };

  const parseLines = (lines: unknown) => Array.isArray(lines)
    ? lines.filter((line): line is DialogueLine => {
        if (!line || typeof line !== "object") return false;
        const item = line as Record<string, unknown>;
        return isString(item.speaker) && isString(item.hanzi) && isString(item.pinyin) && isString(item.translation);
      })
    : [];
  const dialogue = parseLines(raw.dialogue);
  const phrases = parseLines(raw.phrases);

  const notes = Array.isArray(raw.notes)
    ? raw.notes.filter((note): note is UsageNote => {
        if (!note || typeof note !== "object") return false;
        const item = note as Record<string, unknown>;
        return isString(item.title) && isString(item.pattern) && isString(item.explanation);
      })
    : [];

  let challenge: LessonContent["challenge"];
  if ("challenge" in raw && raw.challenge && typeof raw.challenge === "object") {
    const item = raw.challenge as Record<string, unknown>;
    const questions = Array.isArray(item.questions)
      ? item.questions.filter((question): question is ChallengeQuestion => {
          if (!question || typeof question !== "object") return false;
          const value = question as Record<string, unknown>;
          return isString(value.prompt)
            && Array.isArray(value.options)
            && value.options.every(isString)
            && typeof value.correctOption === "number"
            && isString(value.explanation);
        }).map((question, index) => ({
          ...question,
          id: isString(question.id) && question.id.trim() ? question.id.trim() : `question-${index + 1}`,
          accessTier: question.accessTier === "vip" ? "vip" as const : "free" as const,
        }))
      : [];
    if (isString(item.title) && isString(item.description) && typeof item.passScore === "number" && questions.length) {
      challenge = { title: item.title, description: item.description, passScore: item.passScore, questions };
    }
  }

  return { dialogue, ...(phrases.length ? { phrases } : {}), notes, ...(challenge ? { challenge } : {}) };
}

function toLessonAccess(state: ReturnType<typeof resolveContentAccess>): LessonAccess {
  return {
    allowed: state.allowed,
    source: state.source,
    requiredTier: state.requiredTier,
    lockedAt: state.lockedAt ? `${state.lockedAt.type}:${state.lockedAt.key}` : null,
  };
}

function lessonTargets(row: {
  courseId: string;
  moduleId: string;
  id: string;
  isFree: boolean;
}): ContentAccessTarget[] {
  return [
    learningPathTarget(row.courseId),
    learningModuleTarget(row.moduleId),
    learningLessonTarget(row.id, row.isFree),
  ];
}

async function filterLessonQuestions({
  content,
  lessonId,
  parentTargets,
  viewerHasVip,
}: {
  content: LessonContent;
  lessonId: string;
  parentTargets: ContentAccessTarget[];
  viewerHasVip: boolean;
}): Promise<LessonContent> {
  if (!content.challenge?.questions.length) return content;
  const questions = content.challenge.questions.map((question, index) => ({
    ...question,
    id: question.id?.trim() || `question-${index + 1}`,
  }));
  const questionTargets = questions.map((question) => learningQuestionTarget(
    lessonId,
    question.id!,
    question.accessTier ?? "free",
  ));
  const policies = await getContentAccessPolicies([...parentTargets, ...questionTargets]);
  const filteredQuestions = questions.map((question, index): ChallengeQuestion => {
    const access = resolveContentAccess({
      targets: [...parentTargets, questionTargets[index]],
      policies,
      viewerHasVip,
    });
    return access.allowed ? question : {
      id: question.id,
      prompt: "Câu hỏi dành cho thành viên VIP",
      options: [],
      correctOption: -1,
      explanation: "",
      accessTier: "vip",
      locked: true,
    };
  });
  const accessibleCount = filteredQuestions.filter((question) => !question.locked).length;
  return {
    ...content,
    challenge: {
      ...content.challenge,
      passScore: accessibleCount ? Math.min(content.challenge.passScore, accessibleCount) : content.challenge.passScore,
      questions: filteredQuestions,
    },
  };
}

function toSummary(lesson: CourseLessonSeed, order: number, moduleSeeds: CourseModuleSeed[]): LessonSummary {
  const moduleSeed = moduleSeeds.find((item) => item.slug === lesson.moduleSlug) ?? moduleSeeds[0];
  return {
    slug: lesson.slug,
    title: lesson.title,
    summary: lesson.summary,
    situation: lesson.situation,
    estimatedMinutes: lesson.estimatedMinutes,
    isFree: lesson.isFree,
    order,
    moduleSlug: moduleSeed.slug,
    moduleTitle: moduleSeed.title,
    moduleOrder: moduleSeeds.indexOf(moduleSeed),
  };
}

function chooseLesson<T extends { slug: string }>(lessons: T[], requestedSlug?: string): T | undefined {
  if (requestedSlug) return lessons.find((lesson) => lesson.slug === requestedSlug);
  return lessons[0];
}

const getCachedLessonCatalog = unstable_cache(async (courseSlug: string) => readDb((db) => db.select({
  id: lessonTable.id,
  moduleId: modules.id,
  courseId: courseTable.id,
  slug: lessonTable.slug,
  title: lessonTable.title,
  summary: lessonTable.summary,
  situation: lessonTable.situation,
  estimatedMinutes: lessonTable.estimatedMinutes,
  isFree: lessonTable.isFree,
  lessonOrder: lessonTable.sortOrder,
  moduleSlug: modules.slug,
  moduleTitle: modules.title,
  moduleOrder: modules.sortOrder,
})
  .from(lessonTable)
  .innerJoin(modules, eq(lessonTable.moduleId, modules.id))
  .innerJoin(courseTable, eq(modules.courseId, courseTable.id))
  .where(and(eq(courseTable.slug, courseSlug), eq(courseTable.status, "published"), eq(lessonTable.status, "published")))
  .orderBy(asc(modules.sortOrder), asc(lessonTable.sortOrder))), ["published-lesson-catalog"], {
  revalidate: 300,
  tags: ["published-content"],
});

const getCachedLessonBody = unstable_cache(async (courseSlug: string, lessonId: string) => readDb(async (db) => {
  const [contentRows, vocabularyRows] = await Promise.all([
    db.select({ content: lessonTable.content })
      .from(lessonTable)
      .innerJoin(modules, eq(lessonTable.moduleId, modules.id))
      .innerJoin(courseTable, eq(modules.courseId, courseTable.id))
      .where(and(
        eq(lessonTable.id, lessonId),
        eq(lessonTable.status, "published"),
        eq(courseTable.slug, courseSlug),
        eq(courseTable.status, "published"),
      ))
      .limit(1),
    db.select({
      slug: vocabularyTable.slug,
      hanzi: vocabularyTable.hanzi,
      pinyin: vocabularyTable.pinyin,
      meaning: vocabularyTable.meaningVi,
      example: vocabularyTable.exampleZh,
      translation: vocabularyTable.exampleVi,
      audioUrl: vocabularyTable.audioUrl,
    })
      .from(lessonVocabulary)
      .innerJoin(vocabularyTable, eq(lessonVocabulary.vocabularyId, vocabularyTable.id))
      .innerJoin(lessonTable, eq(lessonVocabulary.lessonId, lessonTable.id))
      .innerJoin(modules, eq(lessonTable.moduleId, modules.id))
      .innerJoin(courseTable, eq(modules.courseId, courseTable.id))
      .where(and(
        eq(lessonVocabulary.lessonId, lessonId),
        eq(lessonTable.status, "published"),
        eq(courseTable.slug, courseSlug),
        eq(courseTable.status, "published"),
      ))
      .orderBy(asc(lessonVocabulary.sortOrder)),
  ]);

  return {
    content: parseLessonContent(contentRows[0]?.content),
    vocabulary: vocabularyRows.map((word) => ({
      ...word,
      example: word.example ?? "",
      translation: word.translation ?? "",
    })),
  };
}), ["published-lesson-body"], { revalidate: 300, tags: ["published-content"] });

async function getDemoLessonPageData(course: Course, requestedSlug?: string): Promise<LessonPageData> {
  const bundle = courseSeedBundles.get(course.slug);
  const lessonSeeds = bundle?.lessons ?? [];
  const moduleSeeds = bundle?.modules ?? [];
  const lessons = lessonSeeds.map((lesson, order) => toSummary(lesson, order, moduleSeeds));
  const active = chooseLesson(lessonSeeds, requestedSlug);
  if (!active) return { course, lessons, lesson: null, access: null, progress: null, invalidLesson: Boolean(requestedSlug) };

  const access = await getLessonAccess({ isFree: active.isFree, userId: null });
  const summary = toSummary(active, lessonSeeds.indexOf(active), moduleSeeds);
  const demoTargets = [
    learningPathTarget(course.slug),
    learningModuleTarget(active.moduleSlug),
    learningLessonTarget(active.slug, active.isFree),
  ];
  const filteredContent = access.allowed
    ? await filterLessonQuestions({ content: active.content, lessonId: active.slug, parentTargets: demoTargets, viewerHasVip: false })
    : { dialogue: [], notes: [] } satisfies LessonContent;
  const lesson: LessonDetail = {
    ...summary,
    ...filteredContent,
    vocabulary: access.allowed ? active.vocabulary : [],
  };

  return { course, lessons, lesson, access, progress: null, invalidLesson: false };
}

export async function getLessonPageData({
  courseSlug,
  lessonSlug,
  userId = null,
}: {
  courseSlug: string;
  lessonSlug?: string;
  userId?: string | null;
}): Promise<LessonPageData | null> {
  if (!process.env.DATABASE_URL) {
    const course = await getPublishedCourse(courseSlug);
    return course ? getDemoLessonPageData(course, lessonSlug) : null;
  }

  const [course, rows] = await Promise.all([
    getPublishedCourse(courseSlug),
    getCachedLessonCatalog(courseSlug),
  ]);
  if (!course) return null;

  const allTargets = rows.flatMap(lessonTargets);
  const [policies, viewerHasVip] = await Promise.all([
    getContentAccessPolicies(allTargets),
    userId && process.env.DATABASE_URL ? hasActiveVipAccess(userId) : Promise.resolve(false),
  ]);

  const lessons: LessonSummary[] = rows.map((row, order) => ({
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    situation: row.situation ?? "",
    estimatedMinutes: row.estimatedMinutes,
    isFree: resolveContentAccess({ targets: lessonTargets(row), policies, viewerHasVip: false }).requiredTier === "free",
    order,
    moduleSlug: row.moduleSlug,
    moduleTitle: row.moduleTitle,
    moduleOrder: row.moduleOrder,
  }));
  const active = chooseLesson(rows, lessonSlug);
  if (!active) return { course, lessons, lesson: null, access: null, progress: null, invalidLesson: Boolean(lessonSlug) };

  const activeTargets = lessonTargets(active);
  const [accessState, progress] = await Promise.all([
    Promise.resolve(resolveContentAccess({ targets: activeTargets, policies, viewerHasVip })),
    userId ? getLessonProgress(userId, active.id) : Promise.resolve(null),
  ]);
  const access = toLessonAccess(accessState);
  const body = access.allowed
    ? await getCachedLessonBody(courseSlug, active.id)
    : { content: { dialogue: [], notes: [] } satisfies LessonContent, vocabulary: [] satisfies Vocabulary[] };
  const filteredContent = access.allowed
    ? await filterLessonQuestions({ content: body.content, lessonId: active.id, parentTargets: activeTargets, viewerHasVip })
    : body.content;

  const lesson: LessonDetail = {
    slug: active.slug,
    title: active.title,
    summary: active.summary ?? "",
    situation: active.situation ?? "",
    estimatedMinutes: active.estimatedMinutes,
    isFree: active.isFree,
    order: lessons.find((item) => item.slug === active.slug)?.order ?? 0,
    moduleSlug: active.moduleSlug,
    moduleTitle: active.moduleTitle,
    moduleOrder: active.moduleOrder,
    ...filteredContent,
    vocabulary: body.vocabulary,
  };

  return { course, lessons, lesson, access, progress, invalidLesson: false };
}

const practiceVocabularySelection = {
  slug: vocabularyTable.slug,
  hanzi: vocabularyTable.hanzi,
  pinyin: vocabularyTable.pinyin,
  meaning: vocabularyTable.meaningVi,
  example: vocabularyTable.exampleZh,
  translation: vocabularyTable.exampleVi,
  audioUrl: vocabularyTable.audioUrl,
  lessonId: lessonTable.id,
  moduleId: modules.id,
  courseId: courseTable.id,
  isFree: lessonTable.isFree,
};

function normalizeVocabularyRows(rows: Array<{
  slug: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: string | null;
  translation: string | null;
  audioUrl: string | null;
}>): Vocabulary[] {
  return rows.map((word) => ({
    ...word,
    example: word.example ?? "",
    translation: word.translation ?? "",
  }));
}

export async function listPracticeVocabulary(limit = 12, userId: string | null = null, includeVip = false): Promise<Vocabulary[]> {
  if (!process.env.DATABASE_URL) {
    const lessonGroups = [officeLessons, factoryLessons, logisticsLessons, salesLessons, restaurantLessons, ecommerceLessons, coreWorkplaceLessons].map((lessons) => lessons.filter((lesson) => includeVip || lesson.isFree));
    const vocabularyGroups = lessonGroups.map((lessons) => lessons.flatMap((lesson) => lesson.vocabulary));
    const maxWords = Math.max(...vocabularyGroups.map((words) => words.length));
    return Array.from({ length: maxWords }, (_, index) => vocabularyGroups.flatMap((words) => words[index] ? [words[index]] : [])).flat().slice(0, limit);
  }

  const rows = await readDb(async (db) => {
    const published = and(
      eq(courseTable.status, "published"),
      eq(lessonTable.status, "published"),
    );
    const candidateLimit = Math.min(Math.max(limit * 20, 100), 2_000);
    const candidates = userId ? await db.select(practiceVocabularySelection)
      .from(lessonVocabulary)
      .innerJoin(vocabularyTable, eq(lessonVocabulary.vocabularyId, vocabularyTable.id))
      .innerJoin(lessonTable, eq(lessonVocabulary.lessonId, lessonTable.id))
      .innerJoin(modules, eq(lessonTable.moduleId, modules.id))
      .innerJoin(courseTable, eq(modules.courseId, courseTable.id))
      .leftJoin(reviewItems, and(eq(reviewItems.vocabularyId, vocabularyTable.id), eq(reviewItems.userId, userId)))
      .where(and(published, or(isNull(reviewItems.userId), lte(reviewItems.nextReviewAt, new Date()))))
      .orderBy(desc(reviewItems.wrongCount), asc(reviewItems.easeScore), asc(reviewItems.nextReviewAt), asc(modules.sortOrder), asc(lessonTable.sortOrder), asc(lessonVocabulary.sortOrder), asc(courseTable.sortOrder))
      .limit(candidateLimit)
      : await db.select(practiceVocabularySelection)
        .from(lessonVocabulary)
        .innerJoin(vocabularyTable, eq(lessonVocabulary.vocabularyId, vocabularyTable.id))
        .innerJoin(lessonTable, eq(lessonVocabulary.lessonId, lessonTable.id))
        .innerJoin(modules, eq(lessonTable.moduleId, modules.id))
        .innerJoin(courseTable, eq(modules.courseId, courseTable.id))
        .where(published)
        .orderBy(asc(modules.sortOrder), asc(lessonTable.sortOrder), asc(lessonVocabulary.sortOrder), asc(courseTable.sortOrder))
        .limit(candidateLimit);
    const candidateTargets = (candidate: typeof candidates[number]) => lessonTargets({
      id: candidate.lessonId,
      moduleId: candidate.moduleId,
      courseId: candidate.courseId,
      isFree: candidate.isFree,
    });
    const targets = candidates.flatMap(candidateTargets);
    const [policies, viewerHasVip] = await Promise.all([
      getContentAccessPolicies(targets, db),
      includeVip ? Promise.resolve(true) : userId ? hasActiveVipAccess(userId, db) : Promise.resolve(false),
    ]);
    return candidates.filter((candidate) => resolveContentAccess({
      targets: candidateTargets(candidate),
      policies,
      viewerHasVip,
    }).allowed).slice(0, limit);
  });

  return normalizeVocabularyRows(rows);
}
