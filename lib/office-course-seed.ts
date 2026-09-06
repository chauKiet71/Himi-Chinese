import { getIndustryCurriculum } from "./industry-curriculum.ts";
import { industryCourseStats } from "./industry-curriculum-validation.ts";

const curriculum = getIndustryCurriculum("van-phong-hanh-chinh");
export type { CourseModuleSeed as OfficeModuleSeed, CourseLessonSeed as OfficeLessonSeed } from "./course-seed-types.ts";
export const officeModule = curriculum.modules[0];

export const officeModules = curriculum.modules;
export const officeLessons = curriculum.lessons;
export const officeCourseStats = industryCourseStats(curriculum);
