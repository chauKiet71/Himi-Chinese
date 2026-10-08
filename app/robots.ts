import type { MetadataRoute } from "next";
import { publicSiteUrl } from "../lib/site-url.ts";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/account", "/notifications", "/dev", "/games"],
    },
    sitemap: `${publicSiteUrl()}/sitemap.xml`,
  };
}
