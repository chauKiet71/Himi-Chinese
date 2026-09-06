import { industryCurricula } from "../lib/industry-curriculum.ts";
import { industryCourseStats } from "../lib/industry-curriculum-validation.ts";

for (const course of industryCurricula) console.log(JSON.stringify({ courseSlug: course.courseSlug, ...industryCourseStats(course) }));
console.log(`Validated ${industryCurricula.length} curricula, ${industryCurricula.reduce((sum, course) => sum + course.lessons.length, 0)} lessons.`);
