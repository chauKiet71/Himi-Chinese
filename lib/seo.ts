import type { Metadata } from "next";
import { publicSiteUrl } from "./site-url.ts";

export const SITE_NAME = "Himi Chinese";
export const HOME_TITLE = "Himi Chinese — Nền tảng học tiếng Trung cho người mới bắt đầu";
export const HOME_DESCRIPTION = "Học tiếng Trung từ phát âm, từ vựng đến giao tiếp với bài học trực quan, lộ trình HSK và tiếng Trung chuyên ngành cùng Himi Chinese.";
export const SHARE_IMAGE = "/assets/brand/himi-mascot-icon.png";

export function siteUrl(path: string): string {
  return new URL(path, publicSiteUrl()).href;
}

/** Call at request time so deployment origins never leak across environments. */
export function publicPageMetadata(path: string, title: string, description: string, image = SHARE_IMAGE): Metadata {
  const canonical = siteUrl(path);
  const shareTitle = title.includes(SITE_NAME) ? title : title + " | " + SITE_NAME;
  return {
    title: path === "/" ? { absolute: title } : title, description,
    alternates: { canonical },
    openGraph: {
      type: "website", locale: "vi_VN", siteName: SITE_NAME,
      url: canonical, title: shareTitle, description,
      images: [{ url: siteUrl(image), alt: title }],
    },
    twitter: { card: "summary", title: shareTitle, description, images: [siteUrl(image)] },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: siteUrl(item.path),
    })),
  };
}

export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": siteUrl("/#organization"), name: SITE_NAME, url: siteUrl("/"), logo: siteUrl(SHARE_IMAGE) },
      { "@type": "WebSite", "@id": siteUrl("/#website"), name: SITE_NAME, url: siteUrl("/"), inLanguage: "vi", publisher: { "@id": siteUrl("/#organization") } },
    ],
  };
}

/** Emit Google video markup only when the source provides its publication date. */
export function videoSchema(video: { slug: string; title: string; summary: string; thumbnailUrl: string; uploadDate?: string; youtubeId?: string; videoUrl?: string }) {
  const url = siteUrl(`/videos/${encodeURIComponent(video.slug)}`);
  const page = { "@context": "https://schema.org", "@type": "WebPage", name: video.title, description: video.summary, url, inLanguage: "vi" };
  if (!video.uploadDate || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(video.uploadDate) || !Number.isFinite(Date.parse(video.uploadDate))) return page;
  return { ...page, "@type": "VideoObject", thumbnailUrl: siteUrl(video.thumbnailUrl), uploadDate: video.uploadDate, ...(video.youtubeId ? { embedUrl: `https://www.youtube.com/embed/${video.youtubeId}` } : video.videoUrl ? { contentUrl: siteUrl(video.videoUrl) } : {}) };
}
