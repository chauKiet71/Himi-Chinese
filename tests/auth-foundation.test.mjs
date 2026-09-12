import assert from "node:assert/strict";
import test from "node:test";
import { createSessionToken, hashPassword, hashPrivateIdentifier, hashSessionToken, passwordNeedsRehash, verifyPassword } from "../lib/auth-crypto.ts";
import { normalizeEmail, parseRegistrationInput, safeAdminReturnTo, safeReturnTo, validateAuthToken } from "../lib/auth-validation.ts";
import { authRedirectUrl, clientAddress, isSameOriginRequest } from "../lib/request-security.ts";
import { scheduleReview } from "../lib/review-scheduler.ts";
import { adminSecurityHeaders, applicationSecurityHeaders, contentSecurityPolicy, secureResponse } from "../lib/security-headers.ts";

test("passwords are salted and verified with PBKDF2", async () => {
  const first = await hashPassword("Mat-khau-an-toan-2026!");
  const second = await hashPassword("Mat-khau-an-toan-2026!");
  assert.notEqual(first, second);
  assert.match(first, /^pbkdf2-sha256-v3\$600000\$/u);
  assert.equal(passwordNeedsRehash(first), false);
  assert.equal(passwordNeedsRehash("pbkdf2-sha256-v2$100000$salt$hash"), true);
  assert.equal(await verifyPassword("Mat-khau-an-toan-2026!", first), true);
  assert.equal(await verifyPassword("mat-khau-sai", first), false);
});

test("current password hashes require the configured server-side pepper", async () => {
  const previousSecret = process.env.AUTH_SECRET;
  try {
    process.env.AUTH_SECRET = "pepper-qa-a";
    const encodedHash = await hashPassword("Mat-khau-an-toan-2026!");
    assert.equal(await verifyPassword("Mat-khau-an-toan-2026!", encodedHash), true);

    process.env.AUTH_SECRET = "pepper-qa-b";
    assert.equal(await verifyPassword("Mat-khau-an-toan-2026!", encodedHash), false);
  } finally {
    if (previousSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = previousSecret;
  }
});

test("session tokens are random and only have deterministic hashes", async () => {
  const first = createSessionToken();
  const second = createSessionToken();
  assert.notEqual(first, second);
  assert.equal((await hashSessionToken(first)).length, 64);
  assert.equal(await hashSessionToken(first), await hashSessionToken(first));
  assert.equal(validateAuthToken(first), true);
  assert.equal(validateAuthToken(`${first}x`), false);
});

test("private audit identifiers use deterministic keyed hashes", async () => {
  const first = await hashPrivateIdentifier("203.0.113.9");
  assert.equal(first.length, 64);
  assert.equal(first, await hashPrivateIdentifier("203.0.113.9"));
  assert.notEqual(first, await hashPrivateIdentifier("203.0.113.10"));
});

test("registration normalization and validation keep learner input bounded", () => {
  const result = parseRegistrationInput({
    displayName: "  Gia   Huy  ",
    email: "  GIAHUY@EXAMPLE.COM ",
    password: "mat-khau-dai-2026",
    confirmPassword: "mat-khau-dai-2026",
  });
  assert.equal(result.data?.displayName, "Gia Huy");
  assert.equal(result.data?.email, "giahuy@example.com");
  assert.equal(normalizeEmail(" USER@Example.com "), "user@example.com");
});

test("return targets reject cross-origin redirects", () => {
  assert.equal(safeReturnTo("/learn/van-phong-hanh-chinh?lesson=1"), "/learn/van-phong-hanh-chinh?lesson=1");
  assert.equal(safeReturnTo("https://example.com/steal"), "/");
  assert.equal(safeReturnTo("//example.com/steal"), "/");
  assert.equal(safeAdminReturnTo("/admin/users?q=test"), "/admin/users?q=test");
  assert.equal(safeAdminReturnTo("/account"), "/admin");
  assert.equal(safeAdminReturnTo("https://example.com/admin"), "/admin");
});

test("security headers prevent framing and harden admin responses", async () => {
  const policy = contentSecurityPolicy(false);
  assert.match(policy, /frame-ancestors 'none'/u);
  assert.match(policy, /object-src 'none'/u);
  assert.match(policy, /script-src [^;]*https:\/\/www\.youtube\.com/u);
  assert.match(policy, /script-src [^;]*https:\/\/www\.youtube-nocookie\.com/u);
  assert.equal(policy.includes("'unsafe-eval'"), false);
  assert.equal(contentSecurityPolicy(true).includes("'unsafe-eval'"), true);
  assert.equal(applicationSecurityHeaders().find((header) => header.key === "X-Content-Type-Options")?.value, "nosniff");
  assert.equal(adminSecurityHeaders().find((header) => header.key === "X-Robots-Tag")?.value, "noindex, nofollow, noarchive");

  const secured = secureResponse(
    new Response("ok", { headers: { "Content-Type": "text/plain" } }),
    new Request("https://hanziwork.vn/admin/users"),
  );
  assert.equal(secured.headers.get("x-frame-options"), "DENY");
  assert.equal(secured.headers.get("cache-control"), "private, no-store, max-age=0");
  assert.equal(await secured.text(), "ok");
});

test("auth mutations require a matching Origin header", () => {
  assert.equal(isSameOriginRequest(new Request("https://hanziwork.vn/api/auth/login", { headers: { origin: "https://hanziwork.vn" } })), true);
  assert.equal(isSameOriginRequest(new Request("https://hanziwork.vn/api/auth/login", { headers: { origin: "https://evil.example" } })), false);
  assert.equal(isSameOriginRequest(new Request("https://hanziwork.vn/api/auth/login")), false);
  assert.equal(clientAddress(new Request("https://hanziwork.vn", { headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" } })), "203.0.113.9");
});

test("auth mutations use Railway's trusted public origin", () => {
  const previousTrustForwardedOrigin = process.env.AUTH_TRUST_FORWARDED_ORIGIN;
  try {
    process.env.AUTH_TRUST_FORWARDED_ORIGIN = "1";
    const request = new Request("http://0.0.0.0:3000/api/auth/login", {
      headers: {
        origin: "https://himi-chinese-production.up.railway.app",
        "x-forwarded-host": "himi-chinese-production.up.railway.app",
        "x-forwarded-proto": "https",
      },
    });

    assert.equal(isSameOriginRequest(request), true);
    assert.equal(
      isSameOriginRequest(new Request(request, { headers: { ...Object.fromEntries(request.headers), origin: "https://evil.example" } })),
      false,
    );
    assert.equal(
      authRedirectUrl(request, "/login", { error: "invalid_credentials" }).href,
      "https://himi-chinese-production.up.railway.app/login?error=invalid_credentials",
    );
  } finally {
    if (previousTrustForwardedOrigin === undefined) delete process.env.AUTH_TRUST_FORWARDED_ORIGIN;
    else process.env.AUTH_TRUST_FORWARDED_ORIGIN = previousTrustForwardedOrigin;
  }
});

test("review scheduling advances remembered words and resets hard words", () => {
  const now = new Date("2026-07-31T00:00:00.000Z");
  const first = scheduleReview(null, true, now);
  assert.equal(first.correctCount, 1);
  assert.equal(first.intervalDays, 1);
  assert.equal(first.nextReviewAt.toISOString(), "2026-08-01T00:00:00.000Z");

  const advanced = scheduleReview({ ...first, intervalDays: 4, correctCount: 3 }, true, now);
  assert.equal(advanced.correctCount, 4);
  assert.equal(advanced.intervalDays, 10);
  assert.equal(advanced.state, "reviewing");

  const hard = scheduleReview(advanced, false, now);
  assert.equal(hard.intervalDays, 1);
  assert.equal(hard.wrongCount, 1);
  assert.equal(hard.state, "learning");
  assert.ok(hard.easeScore < advanced.easeScore);
});
