import type { MetadataRoute } from "next";
import { listPublishedCourses } from "../lib/course-repository.ts";
import { publicSiteUrl } from "../lib/site-url.ts";
import { TYPING_LEVEL_IDS } from "../lib/typing-practice.ts";
import { learningVideos } from "../lib/video-library.ts";
import { WRITING_LEVEL_IDS } from "../lib/writing-content.ts";

// Resolve the deployment origin and published catalog at runtime, not build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = publicSiteUrl();
  const courses = await listPublishedCourses();

  // Keep authenticated lessons, personal content and query-string variants out.
  const paths = [
    "/",
    "/courses",
    "/listening",
    "/videos",
    "/typing",
    "/writing",
    "/vip",
    "/privacy",
    "/terms",
    ...courses.filter((course) => course.availability === "available")
      .map((course) => `/courses/${encodeURIComponent(course.slug)}`),
    ...learningVideos.map((video) => `/videos/${encodeURIComponent(video.slug)}`),
    ...TYPING_LEVEL_IDS.map((level) => `/typing/${level}`),
    ...WRITING_LEVEL_IDS.map((level) => `/writing/${level}`),
  ];

  // No synthetic lastModified: only emit dates when actual content dates exist.
  return [...new Set(paths)].map((path) => ({ url: new URL(path, origin).href }));
}
