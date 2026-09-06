import { getIndustryCurriculum } from "./industry-curriculum.ts";
import { industryCourseStats } from "./industry-curriculum-validation.ts";

const curriculum = getIndustryCurriculum("nha-hang-dich-vu");

export const restaurantModules = curriculum.modules;
export const restaurantLessons = curriculum.lessons;
export const restaurantCourseStats = industryCourseStats(curriculum);
