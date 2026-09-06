import { getIndustryCurriculum } from "./industry-curriculum.ts";
import { industryCourseStats } from "./industry-curriculum-validation.ts";

const curriculum = getIndustryCurriculum("thuong-mai-dien-tu");

export const ecommerceModules = curriculum.modules;
export const ecommerceLessons = curriculum.lessons;
export const ecommerceCourseStats = industryCourseStats(curriculum);
