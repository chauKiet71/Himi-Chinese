import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workerConfig = resolve(projectRoot, "dist", "server", "wrangler.json");
const wranglerCli = resolve(projectRoot, "node_modules", "wrangler", "bin", "wrangler.js");
const forwardedArgs = process.argv.slice(2);
const railwayEnvironmentVariables = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "SEPAY_API_KEY",
  "SEPAY_WEBHOOK_SECRET",
  "SEPAY_BANK_CODE",
  "SEPAY_BANK_ACCOUNT_NUMBER",
  "SEPAY_BANK_ACCOUNT_NAME",
  "NEXT_PUBLIC_APP_URL",
  "VIP_BANK_NAME",
  "VIP_BANK_ACCOUNT_NUMBER",
  "VIP_BANK_ACCOUNT_NAME",
  "BREVO_API_KEY",
  "BREVO_FROM_EMAIL",
  "BREVO_FROM_NAME",
  "AUTH_TRUST_X_FORWARDED_FOR",
  "AUTH_TRUST_CF_CONNECTING_IP",
  "AUTH_COOKIE_SECURE",
  "CLOUDINARY_URL",
  "IFLYTEK_ISE_APP_ID",
  "IFLYTEK_ISE_API_KEY",
  "IFLYTEK_ISE_API_SECRET",
] as const;

function resolveEnvironmentFile() {
  const configuredPath = process.env.HANZIWORK_ENV_FILE?.trim();
  if (configuredPath) return resolve(projectRoot, configuredPath);

  for (const filename of [".env.local", ".env"]) {
    const candidate = resolve(projectRoot, filename);
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

function hasPortArgument(args: string[]) {
  return args.some((argument) => argument === "--port" || argument.startsWith("--port="));
}

function hasIpArgument(args: string[]) {
  return args.some((argument) => argument === "--ip" || argument.startsWith("--ip="));
}

function createRailwayEnvironmentFile() {
  const directory = mkdtempSync(join(tmpdir(), "hanziwork-runtime-"));
  const path = join(directory, ".env");
  const variables = railwayEnvironmentVariables.flatMap((name) => {
    const value = process.env[name];
    return value === undefined ? [] : [`${name}=${JSON.stringify(value)}`];
  });
  variables.push('AUTH_TRUST_FORWARDED_ORIGIN="1"');
  writeFileSync(path, `${variables.join("\n")}\n`, { encoding: "utf8", mode: 0o600 });

  return {
    path,
    cleanup: () => rmSync(directory, { force: true, recursive: true }),
  };
}

if (!existsSync(workerConfig)) {
  throw new Error("Chưa có production build. Hãy chạy `npm run build` trước `npm start`.");
}

if (!existsSync(wranglerCli)) {
  throw new Error("Không tìm thấy Wrangler. Hãy chạy `npm install` rồi thử lại.");
}

const isRailwayRuntime = Boolean(process.env.RAILWAY_SERVICE_ID);
const configuredEnvironmentFile = resolveEnvironmentFile();
if (process.env.HANZIWORK_ENV_FILE?.trim() && (!configuredEnvironmentFile || !existsSync(configuredEnvironmentFile))) {
  throw new Error(
    `Không tìm thấy file môi trường đã cấu hình: ${process.env.HANZIWORK_ENV_FILE.trim()}`,
  );
}
const railwayEnvironment = isRailwayRuntime ? createRailwayEnvironmentFile() : null;
const environmentFile = railwayEnvironment?.path ?? configuredEnvironmentFile;

const wranglerArgs = [
  wranglerCli,
  "dev",
  "--config",
  workerConfig,
  "--show-interactive-dev-session",
  "false",
];

if (environmentFile && existsSync(environmentFile)) {
  wranglerArgs.push("--env-file", environmentFile);
} else {
  console.log("No environment file found; starting with Wrangler configuration only.");
}

if (!hasPortArgument(forwardedArgs)) {
  wranglerArgs.push("--port", process.env.PORT?.trim() || "3000");
}

if (!hasIpArgument(forwardedArgs) && isRailwayRuntime) {
  wranglerArgs.push("--ip", "0.0.0.0");
}

wranglerArgs.push(...forwardedArgs);

console.log("Starting HanziWork production build in the Cloudflare Workers runtime...");

const child = spawn(process.execPath, wranglerArgs, {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

let environmentCleaned = false;
function cleanupRailwayEnvironment() {
  if (environmentCleaned) return;
  railwayEnvironment?.cleanup();
  environmentCleaned = true;
}

function handleInterrupt() {
  cleanupRailwayEnvironment();
  child.kill("SIGINT");
}

function handleTermination() {
  cleanupRailwayEnvironment();
  child.kill("SIGTERM");
}

process.once("SIGINT", handleInterrupt);
process.once("SIGTERM", handleTermination);

child.on("error", (error) => {
  cleanupRailwayEnvironment();
  console.error("Không thể khởi động production runtime:", error.message);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  cleanupRailwayEnvironment();
  process.removeListener("SIGINT", handleInterrupt);
  process.removeListener("SIGTERM", handleTermination);
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});
