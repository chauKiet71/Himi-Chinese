import type { CourseSeedBundle } from "./course-seed-types.ts";

export type IndustryCurriculum = CourseSeedBundle & {
  schemaVersion: 1;
  category: string;
  language: "zh-CN";
  translationLanguage: "vi";
  level: string;
  learningDesign: {
    audience: string;
    sequence: string[];
    authoredAppliedLessons: number;
    originalLessonCount: number;
    audio: string;
  };
};

/** Validate JSON before it reaches either the web or a database import. */
export function validateIndustryCurriculum(value: unknown): IndustryCurriculum {
  function fail(path: string, reason: string): never {
    throw new Error(`Industry curriculum ${path}: ${reason}`);
  }
  function object(value: unknown, path: string): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) fail(path, "expected an object");
    return value as Record<string, unknown>;
  }
  function string(value: unknown, path: string, maximum = 5000): string {
    if (typeof value !== "string" || !value.trim() || value.length > maximum) fail(path, "expected non-empty text within the length limit");
    return value;
  }
  function slug(value: unknown, path: string, maximum = 160): string {
    const result = string(value, path, maximum);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) fail(path, "invalid slug");
    return result;
  }
  function array(value: unknown, path: string, minimum = 0): unknown[] {
    if (!Array.isArray(value) || value.length < minimum) fail(path, `expected at least ${minimum} items`);
    return value;
  }
  function integer(value: unknown, path: string, minimum: number, maximum: number): number {
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum || value > maximum) fail(path, "integer out of range");
    return value;
  }
  function unique(values: string[], path: string) {
    if (new Set(values).size !== values.length) fail(path, "duplicate values");
  }
  function lines(value: unknown, path: string, minimum: number) {
    array(value, path, minimum).forEach((line, i) => {
      const item = object(line, `${path}[${i}]`);
      for (const field of ["speaker", "hanzi", "pinyin", "translation"]) string(item[field], `${path}[${i}].${field}`);
    });
  }
  const root = object(value, "root");
  if (root.schemaVersion !== 1 || root.language !== "zh-CN" || root.translationLanguage !== "vi") fail("root", "unsupported version or language");
  const courseSlug = slug(root.courseSlug, "courseSlug");
  string(root.category, "category");
  string(root.level, "level");
  const design = object(root.learningDesign, "learningDesign");
  string(design.audience, "learningDesign.audience");
  string(design.audio, "learningDesign.audio");
  array(design.sequence, "learningDesign.sequence", 1).forEach((step, i) => string(step, `learningDesign.sequence[${i}]`));
  const originalCount = integer(design.originalLessonCount, "learningDesign.originalLessonCount", 0, 10000);
  const authoredCount = integer(design.authoredAppliedLessons, "learningDesign.authoredAppliedLessons", 0, 10000);
  const moduleSlugs = array(root.modules, "modules", 1).map((module, i) => {
    const item = object(module, `modules[${i}]`);
    string(item.title, `modules[${i}].title`, 180);
    string(item.description, `modules[${i}].description`);
    return slug(item.slug, `modules[${i}].slug`);
  });
  unique(moduleSlugs, `${courseSlug}.modules`);
  const lessons = array(root.lessons, "lessons", 1);
  if (lessons.length !== originalCount + authoredCount) fail("learningDesign", "lesson counts do not match the curriculum");
  const lessonSlugs: string[] = [];
  const usedModules = new Set<string>();
  lessons.forEach((lesson, index) => {
    const item = object(lesson, `lessons[${index}]`);
    const path = `${courseSlug}.${slug(item.slug, `lessons[${index}].slug`)}`;
    lessonSlugs.push(item.slug as string);
    const moduleSlug = slug(item.moduleSlug, `${path}.moduleSlug`);
    if (!moduleSlugs.includes(moduleSlug)) fail(path, "unknown module");
    usedModules.add(moduleSlug);
    string(item.title, `${path}.title`, 180);
    string(item.summary, `${path}.summary`);
    string(item.situation, `${path}.situation`, 180);
    integer(item.estimatedMinutes, `${path}.estimatedMinutes`, 1, 180);
    if (typeof item.isFree !== "boolean") fail(path, "isFree must be boolean");
    const wordSlugs = array(item.vocabulary, `${path}.vocabulary`, 1).map((word, i) => {
      const w = object(word, `${path}.vocabulary[${i}]`);
      for (const [field, max] of [["hanzi", 120], ["pinyin", 220], ["meaning", 5000], ["example", 5000], ["translation", 5000]] as const) string(w[field], `${path}.vocabulary[${i}].${field}`, max);
      if (w.audioUrl !== null && (typeof w.audioUrl !== "string" || !/^(?:\/(?!\/)|https:\/\/)/.test(w.audioUrl))) fail(path, "audioUrl must be null, a local path or HTTPS URL");
      return slug(w.slug, `${path}.vocabulary[${i}].slug`, 180);
    });
    unique(wordSlugs, `${path}.vocabulary`);
    const content = object(item.content, `${path}.content`);
    lines(content.dialogue, `${path}.dialogue`, 4);
    if (content.phrases !== undefined) lines(content.phrases, `${path}.phrases`, 1);
    array(content.notes, `${path}.notes`).forEach((note, i) => {
      const n = object(note, `${path}.notes[${i}]`);
      for (const field of ["title", "pattern", "explanation"]) string(n[field], `${path}.notes[${i}].${field}`);
    });
    if (content.challenge !== undefined) {
      const challenge = object(content.challenge, `${path}.challenge`);
      string(challenge.title, `${path}.challenge.title`);
      string(challenge.description, `${path}.challenge.description`);
      const questions = array(challenge.questions, `${path}.challenge.questions`, 1);
      integer(challenge.passScore, `${path}.challenge.passScore`, 1, questions.length);
      questions.forEach((question, i) => {
        const q = object(question, `${path}.questions[${i}]`);
        string(q.prompt, `${path}.questions[${i}].prompt`);
        string(q.explanation, `${path}.questions[${i}].explanation`);
        const options = array(q.options, `${path}.questions[${i}].options`, 2).map((option, j) => string(option, `${path}.questions[${i}].options[${j}]`));
        unique(options, `${path}.questions[${i}].options`);
        integer(q.correctOption, `${path}.questions[${i}].correctOption`, 0, options.length - 1);
      });
    }
  });
  unique(lessonSlugs, `${courseSlug}.lessons`);
  if (usedModules.size !== moduleSlugs.length) fail(courseSlug, "empty module");
  return value as IndustryCurriculum;
}

export function industryCourseStats(course: CourseSeedBundle) {
  return {
    lessons: course.lessons.length,
    minutes: course.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0),
    freeLessons: course.lessons.filter(lesson => lesson.isFree).length,
    vocabulary: new Set(course.lessons.flatMap(lesson => lesson.vocabulary.map(word => word.slug))).size,
    modules: course.modules.length,
  };
}
