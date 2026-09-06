import { getIndustryCurriculum } from "./industry-curriculum.ts";
import { industryCourseStats } from "./industry-curriculum-validation.ts";

const curriculum = getIndustryCurriculum("nha-may-san-xuat");

export const factoryModules = curriculum.modules;
export const factoryLessons = curriculum.lessons;
export const factoryCourseStats = industryCourseStats(curriculum);
