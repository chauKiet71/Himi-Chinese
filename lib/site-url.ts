/** Canonical site origin shared by crawler metadata routes. */
export function publicSiteUrl(): string {
  // Indirect access keeps NEXT_PUBLIC_* from being inlined with the build's URL.
  const environment = process.env;
  const configuredUrl = environment.NEXT_PUBLIC_APP_URL?.trim();
  if (!configuredUrl && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_APP_URL chưa được cấu hình cho sitemap.");
  }

  const url = new URL(configuredUrl || "http://localhost:3000");
  if (!/^https?:$/u.test(url.protocol) || url.username || url.password) {
    throw new Error("NEXT_PUBLIC_APP_URL phải là URL http hoặc https, không chứa thông tin đăng nhập.");
  }

  return url.origin;
}
