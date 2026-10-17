import { StructuredData } from "@/components/structured-data";
import { publicPageMetadata, breadcrumbSchema, siteUrl, SITE_NAME } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseRoadmap } from "@/components/course-roadmap";
import { getCurrentUser } from "@/lib/auth-session";
import { getCourseRoadmapPageData } from "@/lib/course-roadmap-repository";
import { getPublishedCourse, listPublishedCourses } from "@/lib/course-repository";

export async function generateStaticParams() {
  const courses = await listPublishedCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublishedCourse(slug);
  return course
    ? publicPageMetadata(`/courses/${encodeURIComponent(course.slug)}`, `Lộ trình ${course.title}`, course.description)
    : { title: "Lộ trình không tồn tại" };
}

export default async function CourseRoadmapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, user] = await Promise.all([params, getCurrentUser()]);
  const data = await getCourseRoadmapPageData({ courseSlug: slug, userId: user?.id ?? null });
  if (!data) notFound();

  return <>
    <StructuredData data={breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Lộ trình", path: "/courses" }, { name: data.course.title, path: `/courses/${encodeURIComponent(slug)}` }])} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "Course", name: data.course.title, description: data.course.description, url: siteUrl(`/courses/${encodeURIComponent(slug)}`), provider: { "@type": "Organization", name: SITE_NAME, url: siteUrl("/") } }} />
    <CourseRoadmap
    authenticated={Boolean(user)}
    course={data.course}
    roadmap={data.roadmap}
  /></>;
}
