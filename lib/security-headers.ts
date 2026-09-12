const productionScriptSources = [
  "'self'",
  "'unsafe-inline'",
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
];

export function contentSecurityPolicy(development = false): string {
  const scriptSources = development
    ? [...productionScriptSources, "'unsafe-eval'"]
    : productionScriptSources;

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "media-src 'self' blob: https:",
    "connect-src 'self' https: wss: ws:",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join("; ");
}

export function applicationSecurityHeaders(development = false): Array<{ key: string; value: string }> {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(development) },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Permissions-Policy", value: "camera=(), geolocation=(), payment=(), usb=()" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  ];
}

export function adminSecurityHeaders(): Array<{ key: string; value: string }> {
  return [
    { key: "Cache-Control", value: "private, no-store, max-age=0" },
    { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  ];
}

export function secureResponse(response: Response, request: Request, development = false): Response {
  const headers = new Headers(response.headers);
  for (const header of applicationSecurityHeaders(development)) headers.set(header.key, header.value);

  const pathname = new URL(request.url).pathname;
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/")) {
    for (const header of adminSecurityHeaders()) headers.set(header.key, header.value);
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
