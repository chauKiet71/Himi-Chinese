import type { NextConfig } from "next";
import { adminSecurityHeaders, applicationSecurityHeaders } from "./lib/security-headers.ts";

const nextConfig: NextConfig = {
  async headers() {
    const shared = applicationSecurityHeaders(process.env.NODE_ENV !== "production");
    const admin = adminSecurityHeaders();
    return [
      { source: "/(.*)", headers: shared },
      { source: "/admin/:path*", headers: admin },
      { source: "/api/admin/:path*", headers: admin },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "vietqr.app", pathname: "/img" },
    ],
  },
};

export default nextConfig;
