import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import test from "node:test";
import { createServer } from "vite";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { hashPassword } from "../lib/auth-crypto.ts";
import { totpAtStep, decryptTotpSecret } from "../lib/totp-crypto.ts";

test("admin enrollment, TOTP login, recovery, rotation and email downgrade protection", async (t) => {
  const root = process.cwd();
  const oldKey = process.env.ADMIN_TOTP_ENCRYPTION_KEY;
  const oldAuth = process.env.AUTH_SECRET;
  process.env.ADMIN_TOTP_ENCRYPTION_KEY = Buffer.alloc(32, 9).toString("base64");
  process.env.AUTH_SECRET = "totp-integration-test";
  t.after(() => {
    if (oldKey === undefined) delete process.env.ADMIN_TOTP_ENCRYPTION_KEY; else process.env.ADMIN_TOTP_ENCRYPTION_KEY = oldKey;
    if (oldAuth === undefined) delete process.env.AUTH_SECRET; else process.env.AUTH_SECRET = oldAuth;
    delete globalThis.__adminTotpTest;
  });
  const pg = new PGlite();
  t.after(() => pg.close());
  await pg.exec(`
    CREATE TYPE user_role AS ENUM ('learner','editor','reviewer','admin');
    CREATE TABLE users (id uuid PRIMARY KEY, email varchar(255), password_hash text, display_name varchar(120), avatar_url text, avatar_public_id varchar(500), role user_role, is_active boolean DEFAULT true, email_verified_at timestamptz, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
    CREATE TABLE admin_login_challenges (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id), challenge_hash varchar(64), code_hash varchar(64), return_to varchar(500), attempts integer DEFAULT 0, expires_at timestamptz, used_at timestamptz, created_at timestamptz DEFAULT now());
    CREATE TABLE auth_sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, token_hash varchar(64), expires_at timestamptz, last_seen_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now());
    CREATE TABLE audit_logs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid, action varchar(100), entity_type varchar(60), entity_id uuid, metadata jsonb DEFAULT '{}', created_at timestamptz DEFAULT now());
  `);
  for (const statement of readFileSync(path.join(root, "drizzle/0032_admin_totp.sql"), "utf8").split("--> statement-breakpoint")) await pg.exec(statement);
  const userId = crypto.randomUUID();
  const password = "Strong-Password-Test-2026!";
  await pg.query("INSERT INTO users (id,email,password_hash,display_name,role,email_verified_at) VALUES ($1,$2,$3,$4,'admin',now())",
    [userId, "totp-test@example.invalid", await hashPassword(password), "Test Admin"]);
  const state = { db: drizzle(pg), user: { id: userId, email: "totp-test@example.invalid", displayName: "Test Admin", role: "admin", emailVerified: true, sessionCreatedAt: new Date() }, emails: 0, sessions: 0 };
  globalThis.__adminTotpTest = state;
  const fixtures = {
    "auth-session": "export function secureAuthCookiesEnabled(){return false} export async function getCurrentUser(){return globalThis.__adminTotpTest.user} export async function createSession(){globalThis.__adminTotpTest.sessions++;return {token:'test-session',expiresAt:new Date(Date.now()+3600000)}} export async function revokeUserSessions(){} export function sessionCookieName(){return 'test-session'} export function sessionCookieOptions(){return {httpOnly:true,path:'/'}}",
    "auth-service": "export async function authenticateWithPassword(){return globalThis.__adminTotpTest.user}",
    "auth-email": "export async function sendAdminLoginCodeEmail(){globalThis.__adminTotpTest.emails++;return 'brevo'}",
    "auth-rate-limit": "export async function consumeAuthRateLimit(){return {allowed:true,retryAfterSeconds:0}} export async function clearSuccessfulLoginLimit(){}",
    "auth-audit": "export async function recordAuthEvent(){}",
    "auth-workflows": "export async function sendEmailVerificationCode(){return 'brevo'}",
    "auth-token-service": "export async function verifyEmailCode(){return globalThis.__adminTotpTest.user} export async function verifyEmailToken(){return globalThis.__adminTotpTest.user}",
  };
  const server = await createServer({ configFile: false, appType: "custom", root,
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "admin-totp"), server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
    resolve: { alias: [{ find: "server-only", replacement: path.join(root, "tests/fixtures/server-only.ts") }, { find: "@", replacement: root }] },
    plugins: [{ name: "totp-test-services", enforce: "pre", resolveId(source) {
      const name = source.split("/").at(-1).replace(/\.ts$/, "");
      if (fixtures[name]) return `\0totp:${name}`;
      if (/db\/index(?:\.ts)?$/.test(source)) return "\0totp:db";
    }, load(id) {
      if (id === "\0totp:db") return "export async function readDb(fn){return fn(globalThis.__adminTotpTest.db)} export async function writeDb(fn){return fn(globalThis.__adminTotpTest.db)} export async function withRequestDb(fn){return fn(globalThis.__adminTotpTest.db)} export function isDatabaseUnavailableError(){return false}";
      if (id.startsWith("\0totp:")) return fixtures[id.slice(6)];
    } }],
  });
  t.after(() => server.close());
  const [totp, mfa, setupApi, loginApi, mfaApi, verifyEmailApi] = await Promise.all([
    server.ssrLoadModule("/lib/admin-totp.ts"), server.ssrLoadModule("/lib/admin-mfa.ts"),
    server.ssrLoadModule("/app/api/auth/admin-totp/route.ts"), server.ssrLoadModule("/app/api/auth/login/route.ts"),
    server.ssrLoadModule("/app/api/auth/admin-mfa/route.ts"),
    server.ssrLoadModule("/app/api/auth/verify-email/route.ts"),
  ]);
  const request = (fields, origin = "https://admin.test") => {
    const body = new FormData(); for (const [key, value] of Object.entries(fields)) body.set(key, value);
    return new Request("https://admin.test/api/auth/admin-totp", { method: "POST", headers: { Origin: origin }, body });
  };
  assert.equal((await setupApi.POST(request({ action: "begin", password }, "https://evil.invalid"))).status, 403);
  const oldUser = state.user; state.user = null;
  assert.equal((await setupApi.POST(request({ action: "begin", password }))).status, 401);
  state.user = { ...oldUser, role: "learner" };
  assert.equal((await setupApi.POST(request({ action: "begin", password }))).status, 403);
  state.user = { ...oldUser, sessionCreatedAt: new Date(Date.now() - 16 * 60000) };
  assert.equal((await setupApi.POST(request({ action: "begin", password }))).status, 409);
  state.user = oldUser;
  assert.equal((await loginApi.POST(request({ mode: "admin", email: oldUser.email, password }))).status, 303);
  assert.equal(state.emails, 1);
  const setupResponse = await setupApi.POST(request({ action: "begin", password }));
  assert.equal(setupResponse.status, 200);
  assert.equal(setupResponse.headers.get("Cache-Control"), "private, no-store");
  const setup = await setupResponse.json();
  assert.match(setup.qr, /^data:image\/svg\+xml;base64,/);
  assert.equal((await totp.getAdminTotpStatus(userId)).enabled, false);
  const stored = (await pg.query("SELECT * FROM admin_totp_credentials WHERE user_id=$1", [userId])).rows[0];
  assert.equal(stored.pending_secret.includes(setup.secret), false);
  assert.equal(await decryptTotpSecret(stored.pending_secret, userId), setup.secret);
  const emailChallenge = await mfa.issueAdminMfaChallenge(userId, "/admin");
  assert.equal(emailChallenge.method, "email");
  await pg.query("INSERT INTO auth_sessions (user_id) VALUES ($1)", [userId]);
  const step = Math.floor(Date.now() / 30000);
  const confirm = await setupApi.POST(request({ action: "confirm", code: await totpAtStep(setup.secret, step) }));
  assert.equal(confirm.status, 200);
  const { recoveryCodes } = await confirm.json();
  assert.equal(recoveryCodes.length, 10);
  assert.equal((await pg.query("SELECT count(*)::int AS count FROM auth_sessions")).rows[0].count, 0);
  assert.equal((await totp.getAdminTotpStatus(userId)).enabled, true);
  assert.equal((await mfa.verifyAdminMfaChallenge(emailChallenge.challengeToken, emailChallenge.code)).ok, false);
  const login = await loginApi.POST(request({ mode: "admin", email: oldUser.email, password }));
  assert.equal(new URL(login.headers.get("Location")).pathname, "/admin/mfa");
  assert.equal(state.emails, 1, "TOTP accounts never send email login codes");
  const challenge = await mfa.issueAdminMfaChallenge(userId, "/admin");
  assert.equal(challenge.method, "totp");
  assert.equal((await mfa.verifyAdminMfaChallenge(challenge.challengeToken, await totpAtStep(setup.secret, step))).ok, false, "setup code cannot be reused for login");
  assert.equal((await mfa.verifyAdminMfaChallenge(challenge.challengeToken, await totpAtStep(setup.secret, step + 1))).ok, true);
  const replay = await mfa.issueAdminMfaChallenge(userId, "/admin");
  assert.equal((await mfa.verifyAdminMfaChallenge(replay.challengeToken, await totpAtStep(setup.secret, step + 1))).ok, false);
  assert.equal((await mfa.verifyAdminMfaChallenge(replay.challengeToken, recoveryCodes[0])).ok, true);
  const reusedRecovery = await mfa.issueAdminMfaChallenge(userId, "/admin");
  assert.equal((await mfa.verifyAdminMfaChallenge(reusedRecovery.challengeToken, recoveryCodes[0])).ok, false);
  const invalidCode = "bad-code";
  for (let i = 0; i < 4; i++) await mfa.verifyAdminMfaChallenge(reusedRecovery.challengeToken, invalidCode);
  assert.equal((await mfa.verifyAdminMfaChallenge(reusedRecovery.challengeToken, recoveryCodes[1])).ok, false, "five failures invalidate challenge");
  const oldChallenge = await mfa.issueAdminMfaChallenge(userId, "/admin");
  const oldVersion = (await totp.getAdminTotpStatus(userId)).version;
  assert.equal(await totp.beginAdminTotpSetup(userId, "wrong-password", recoveryCodes[1]), null);
  const rotated = await totp.beginAdminTotpSetup(userId, password, recoveryCodes[1]);
  assert.ok(rotated);
  assert.equal((await totp.getAdminTotpStatus(userId)).version, oldVersion);
  const nextCredential = await totp.confirmAdminTotpSetup(userId, await totpAtStep(rotated.secret, Math.floor(Date.now() / 30000)));
  assert.ok(nextCredential);
  assert.notEqual((await totp.getAdminTotpStatus(userId)).version, oldVersion);
  assert.equal((await mfa.verifyAdminMfaChallenge(oldChallenge.challengeToken, recoveryCodes[2])).ok, false, "old-version challenge cannot survive rotation");
  const active = (await pg.query("SELECT recovery_hashes FROM admin_totp_credentials WHERE user_id=$1", [userId])).rows[0];
  assert.equal(JSON.stringify(active).includes(recoveryCodes[0]), false);
  const apiChallenge = await mfa.issueAdminMfaChallenge(userId, "/admin/security");
  const sessionsBefore = state.sessions;
  const apiRequest = (code) => {
    const body = new FormData(); body.set("code", code);
    return new Request("https://admin.test/api/auth/admin-mfa", { method: "POST", headers: { Origin: "https://admin.test", Cookie: `${mfa.adminMfaCookieName()}=${apiChallenge.challengeToken}` }, body });
  };
  assert.equal(new URL((await mfaApi.POST(apiRequest("bad-code"))).headers.get("Location")).pathname, "/admin/mfa");
  assert.equal(state.sessions, sessionsBefore);
  const authenticated = await mfaApi.POST(apiRequest(nextCredential.recoveryCodes[0]));
  assert.equal(new URL(authenticated.headers.get("Location")).pathname, "/admin/security");
  assert.equal(state.sessions, sessionsBefore + 1);
  assert.match(authenticated.headers.get("Set-Cookie"), /test-session=/);
  await mfaApi.POST(apiRequest(nextCredential.recoveryCodes[0]));
  assert.equal(state.sessions, sessionsBefore + 1, "consumed challenge cannot create another session");
  const beforeEmailVerification = state.sessions;
  const staffEmailVerification = await verifyEmailApi.POST(request({ email: oldUser.email, code: "123456" }));
  assert.equal(new URL(staffEmailVerification.headers.get("Location")).pathname, "/admin/login");
  assert.equal(state.sessions, beforeEmailVerification, "email verification cannot bypass staff MFA");
  state.user = { ...oldUser, role: "learner" };
  await verifyEmailApi.POST(request({ email: oldUser.email, code: "123456" }));
  assert.equal(state.sessions, beforeEmailVerification + 1, "learner verification retains automatic login");
  state.user = oldUser;
  const pending = await totp.beginAdminTotpSetup(userId, password, nextCredential.recoveryCodes[1]);
  for (let i = 0; i < 5; i++) assert.equal(await totp.confirmAdminTotpSetup(userId, "bad-code"), null);
  assert.equal(await totp.confirmAdminTotpSetup(userId, await totpAtStep(pending.secret, Math.floor(Date.now() / 30000))), null, "five setup failures require starting again");
  const expired = await totp.beginAdminTotpSetup(userId, password, nextCredential.recoveryCodes[2]);
  await pg.query("UPDATE admin_totp_credentials SET pending_expires_at=now()-interval '1 minute' WHERE user_id=$1", [userId]);
  assert.equal(await totp.confirmAdminTotpSetup(userId, await totpAtStep(expired.secret, Math.floor(Date.now() / 30000))), null);
  assert.equal((await totp.getAdminTotpStatus(userId)).enabled, true, "failed rotation leaves active credentials intact");
});
