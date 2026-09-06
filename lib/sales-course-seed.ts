import { getIndustryCurriculum } from "./industry-curriculum.ts";
import { industryCourseStats } from "./industry-curriculum-validation.ts";

const curriculum = getIndustryCurriculum("ban-hang-cham-soc-khach-hang");

export const salesModules = curriculum.modules;
export const salesLessons = curriculum.lessons;
export const salesCourseStats = industryCourseStats(curriculum);
