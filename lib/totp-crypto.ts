// RFC 4226/6238. Web Crypto also runs in the production Workers runtime.
import { constantTimeTextEqual } from "./auth-crypto.ts";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function encodeBase32(bytes: Uint8Array): string {
  let value = 0, bits = 0, output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte; bits += 8;
    while (bits >= 5) { bits -= 5; output += ALPHABET[(value >>> bits) & 31]; }
  }
  if (bits) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
}
function decodeBase32(input: string): Uint8Array<ArrayBuffer> {
  const value = input.toUpperCase().replace(/=+$/u, "");
  if (!/^[A-Z2-7]+$/u.test(value)) throw new Error("Invalid TOTP secret");
  let buffer = 0, bits = 0;
  const bytes: number[] = [];
  for (const character of value) {
    buffer = (buffer << 5) | ALPHABET.indexOf(character); bits += 5;
    if (bits >= 8) { bits -= 8; bytes.push((buffer >>> bits) & 255); }
  }
  return new Uint8Array(bytes);
}
export function createTotpSecret(): string {
  return encodeBase32(crypto.getRandomValues(new Uint8Array(20)));
}
export async function totpAtStep(secret: string, step: number, digits = 6): Promise<string> {
  if (!Number.isSafeInteger(step) || step < 0 || ![6, 8].includes(digits)) throw new Error("Invalid TOTP parameters");
  const counter = new Uint8Array(8);
  new DataView(counter.buffer).setBigUint64(0, BigInt(step));
  const key = await crypto.subtle.importKey("raw", decodeBase32(secret), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, counter));
  const offset = digest[digest.length - 1] & 15;
  const number = ((digest[offset] & 127) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3];
  return String(number % (10 ** digits)).padStart(digits, "0");
}
export async function matchTotpStep(secret: string, code: string, lastUsedStep: number | null = null, now = Date.now()): Promise<number | null> {
  if (!/^\d{6}$/u.test(code)) return null;
  const current = Math.floor(now / 30_000);
  for (const step of [current, current - 1, current + 1]) {
    if (step < 0 || (lastUsedStep !== null && step <= lastUsedStep)) continue;
    if (constantTimeTextEqual(await totpAtStep(secret, step), code)) return step;
  }
  return null;
}
function base64(bytes: Uint8Array): string {
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}
function unbase64(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}
export function totpEncryptionConfigured(): boolean {
  try { return unbase64(process.env.ADMIN_TOTP_ENCRYPTION_KEY ?? "").length === 32; } catch { return false; }
}
async function encryptionKey() {
  if (!totpEncryptionConfigured()) throw new Error("ADMIN_TOTP_ENCRYPTION_KEY must be 32 bytes encoded as Base64");
  return crypto.subtle.importKey("raw", unbase64(process.env.ADMIN_TOTP_ENCRYPTION_KEY!), "AES-GCM", false, ["encrypt", "decrypt"]);
}
export async function encryptTotpSecret(secret: string, userId: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: new TextEncoder().encode(userId) }, await encryptionKey(), new TextEncoder().encode(secret));
  return `v1.${base64(iv)}.${base64(new Uint8Array(encrypted))}`;
}
export async function decryptTotpSecret(encrypted: string, userId: string): Promise<string> {
  const [version, iv, ciphertext, extra] = encrypted.split(".");
  if (version !== "v1" || !iv || !ciphertext || extra) throw new Error("Invalid encrypted TOTP secret");
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unbase64(iv), additionalData: new TextEncoder().encode(userId) }, await encryptionKey(), unbase64(ciphertext));
  return new TextDecoder().decode(decrypted);
}
export function totpProvisioningUri(secret: string, email: string): string {
  return `otpauth://totp/${encodeURIComponent(`Himi Chinese:${email}`)}?${new URLSearchParams({ secret, issuer: "Himi Chinese", algorithm: "SHA1", digits: "6", period: "30" })}`;
}
export function createRecoveryCodes(): string[] {
  return Array.from({ length: 10 }, () => {
    const value = encodeBase32(crypto.getRandomValues(new Uint8Array(10)));
    return value.match(/.{4}/gu)!.join("-");
  });
}
export function normalizeRecoveryCode(code: string): string | null {
  const value = code.trim().toUpperCase().replaceAll("-", "");
  return /^[A-Z2-7]{16}$/u.test(value) ? value : null;
}
