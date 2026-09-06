import office from "../content/industry-curriculum/van-phong-hanh-chinh.json" with { type: "json" };
import factory from "../content/industry-curriculum/nha-may-san-xuat.json" with { type: "json" };
import logistics from "../content/industry-curriculum/kho-van-logistics.json" with { type: "json" };
import sales from "../content/industry-curriculum/ban-hang-cham-soc-khach-hang.json" with { type: "json" };
import restaurant from "../content/industry-curriculum/nha-hang-dich-vu.json" with { type: "json" };
import ecommerce from "../content/industry-curriculum/thuong-mai-dien-tu.json" with { type: "json" };
import { validateIndustryCurriculum } from "./industry-curriculum-validation.ts";

export const industryCurricula = [office, factory, logistics, sales, restaurant, ecommerce].map(validateIndustryCurriculum);

export function getIndustryCurriculum(courseSlug: string) {
  const curriculum = industryCurricula.find(course => course.courseSlug === courseSlug);
  if (!curriculum) throw new Error(`Unknown industry curriculum: ${courseSlug}`);
  return curriculum;
}
