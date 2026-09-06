import { getIndustryCurriculum } from "./industry-curriculum.ts";
import { industryCourseStats } from "./industry-curriculum-validation.ts";

const curriculum = getIndustryCurriculum("kho-van-logistics");

export const logisticsModules = curriculum.modules;
export const logisticsLessons = curriculum.lessons;
export const logisticsCourseStats = industryCourseStats(curriculum);
