import assert from "node:assert/strict";
import test from "node:test";
import { createRecoveryCodes, createTotpSecret, decryptTotpSecret, encodeBase32, encryptTotpSecret, matchTotpStep, normalizeRecoveryCode, totpAtStep, totpProvisioningUri } from "../lib/totp-crypto.ts";

test("TOTP matches the official RFC 6238 SHA1 vectors", async () => {
  const secret = encodeBase32(new TextEncoder().encode("12345678901234567890"));
  for (const [time, expected] of [[59, "94287082"], [1111111109, "07081804"], [1111111111, "14050471"], [1234567890, "89005924"], [2000000000, "69279037"], [20000000000, "65353130"]]) {
    assert.equal(await totpAtStep(secret, Math.floor(time / 30), 8), expected);
  }
});
test("TOTP allows a small clock drift and rejects stale, malformed and reused codes", async () => {
  const secret = createTotpSecret();
  const now = 1234567890000;
  const step = Math.floor(now / 30000);
  const code = await totpAtStep(secret, step);
  assert.equal(await matchTotpStep(secret, code, null, now), step);
  assert.equal(await matchTotpStep(secret, code, step, now), null);
  assert.equal(await matchTotpStep(secret, await totpAtStep(secret, step - 1), null, now), step - 1);
  assert.equal(await matchTotpStep(secret, await totpAtStep(secret, step + 1), null, now), step + 1);
  assert.equal(await matchTotpStep(secret, await totpAtStep(secret, step - 2), null, now), null);
  assert.equal(await matchTotpStep(secret, "1234567", null, now), null);
});
test("TOTP keys are encrypted, bound to their account and reject tampering/wrong encryption keys", async () => {
  const old = process.env.ADMIN_TOTP_ENCRYPTION_KEY;
  process.env.ADMIN_TOTP_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
  try {
    const secret = createTotpSecret();
    const ciphertext = await encryptTotpSecret(secret, "user-a");
    assert.equal(ciphertext.includes(secret), false);
    assert.notEqual(await encryptTotpSecret(secret, "user-a"), ciphertext);
    assert.equal(await decryptTotpSecret(ciphertext, "user-a"), secret);
    await assert.rejects(decryptTotpSecret(ciphertext, "user-b"));
    await assert.rejects(decryptTotpSecret(ciphertext.slice(0, -5) + "AAAAA", "user-a"));
    process.env.ADMIN_TOTP_ENCRYPTION_KEY = Buffer.alloc(32, 8).toString("base64");
    await assert.rejects(decryptTotpSecret(ciphertext, "user-a"));
    delete process.env.ADMIN_TOTP_ENCRYPTION_KEY;
    await assert.rejects(encryptTotpSecret(secret, "user-a"), /ENCRYPTION_KEY/);
  } finally { if (old === undefined) delete process.env.ADMIN_TOTP_ENCRYPTION_KEY; else process.env.ADMIN_TOTP_ENCRYPTION_KEY = old; }
});
test("provisioning uses interoperable parameters and recovery codes have distinct 80-bit values", () => {
  const secret = createTotpSecret();
  const uri = new URL(totpProvisioningUri(secret, "admin@example.com"));
  assert.equal(uri.searchParams.get("secret"), secret);
  assert.equal(uri.searchParams.get("algorithm"), "SHA1");
  assert.equal(uri.searchParams.get("digits"), "6");
  assert.equal(uri.searchParams.get("period"), "30");
  const codes = createRecoveryCodes();
  assert.equal(codes.length, 10);
  assert.equal(new Set(codes).size, 10);
  assert.ok(codes.every((code) => /^[A-Z2-7]{4}(?:-[A-Z2-7]{4}){3}$/u.test(code)));
  assert.equal(normalizeRecoveryCode(codes[0].toLowerCase()), codes[0].replaceAll("-", ""));
  assert.equal(normalizeRecoveryCode("garbage"), null);
});
