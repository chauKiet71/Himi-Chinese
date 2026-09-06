import { getIndustryCurriculum } from "./industry-curriculum.ts";

const curriculum = getIndustryCurriculum("van-phong-hanh-chinh");
export const foundationChallenge = curriculum.lessons[5].content.challenge!;
export const officeExpansionModules = curriculum.modules.slice(1);
export const officeExpansionLessons = curriculum.lessons.slice(6);
