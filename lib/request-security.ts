import { safeReturnTo } from "./auth-validation.ts";

function firstForwardedValue(value: string | null): string | undefined {
  return value?.split(",", 1)[0]?.trim() || undefined;
}

function requestOrigin(request: Request): string {
  const directOrigin = new URL(request.url).origin;
  const trustForwardedOrigin =
    Boolean(process.env.RAILWAY_SERVICE_ID) ||
    process.env.VERCEL === "1" ||
    process.env.AUTH_TRUST_FORWARDED_ORIGIN === "1";

  if (!trustForwardedOrigin) return directOrigin;

  const protocol = firstForwardedValue(request.headers.get("x-forwarded-proto"));
  const host = firstForwardedValue(request.headers.get("x-forwarded-host"));
  if ((protocol !== "http" && protocol !== "https") || !host) return directOrigin;

  try {
    return new URL(`${protocol}://${host}`).origin;
  } catch {
    return directOrigin;
  }
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === requestOrigin(request);
  } catch {
    return false;
  }
}

export function formString(formData: FormData, name: string, maxLength = 512): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.slice(0, maxLength + 1) : "";
}

export function clientAddress(request: Request): string {
  const development = process.env.NODE_ENV !== "production";
  const trustForwardedFor = process.env.VERCEL === "1" || process.env.AUTH_TRUST_X_FORWARDED_FOR === "1" || development;
  const trustCloudflare = process.env.AUTH_TRUST_CF_CONNECTING_IP === "1" || development;
  const forwardedFor = trustForwardedFor ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : undefined;
  const cloudflareAddress = trustCloudflare ? request.headers.get("cf-connecting-ip")?.trim() : undefined;
  return forwardedFor || cloudflareAddress || "unknown";
}

export function authRedirectUrl(request: Request, pathname: string, options: {
  error?: string;
  returnTo?: string;
} = {}): URL {
  const url = new URL(pathname, requestOrigin(request));
  if (options.error) url.searchParams.set("error", options.error);
  if (options.returnTo) url.searchParams.set("returnTo", safeReturnTo(options.returnTo));
  return url;
}
