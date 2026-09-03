import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workerConfig = resolve(projectRoot, "dist", "server", "wrangler.json");
const wranglerCli = resolve(projectRoot, "node_modules", "wrangler", "bin", "wrangler.js");
const forwardedArgs = process.argv.slice(2);

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

if (!existsSync(workerConfig)) {
  throw new Error("Chưa có production build. Hãy chạy `npm run build` trước `npm start`.");
}

if (!existsSync(wranglerCli)) {
  throw new Error("Không tìm thấy Wrangler. Hãy chạy `npm install` rồi thử lại.");
}

const environmentFile = resolveEnvironmentFile();
const isRailwayRuntime = Boolean(process.env.RAILWAY_SERVICE_ID);
if (process.env.HANZIWORK_ENV_FILE?.trim() && (!environmentFile || !existsSync(environmentFile))) {
  throw new Error(
    `Không tìm thấy file môi trường đã cấu hình: ${process.env.HANZIWORK_ENV_FILE.trim()}`,
  );
}

const wranglerArgs = [
  wranglerCli,
  "dev",
  "--config",
  workerConfig,
  "--show-interactive-dev-session",
  "false",
];

if (!isRailwayRuntime && environmentFile && existsSync(environmentFile)) {
  wranglerArgs.push("--env-file", environmentFile);
} else {
  console.log("Using runtime environment variables.");
}

if (!hasPortArgument(forwardedArgs)) {
  wranglerArgs.push("--port", process.env.PORT?.trim() || "3000");
}

if (!hasIpArgument(forwardedArgs) && isRailwayRuntime) {
  wranglerArgs.push("--ip", "0.0.0.0");
}

if (isRailwayRuntime) {
  wranglerArgs.push("--var", "AUTH_TRUST_FORWARDED_ORIGIN:1");
}

wranglerArgs.push(...forwardedArgs);

console.log("Starting HanziWork production build in the Cloudflare Workers runtime...");

const child = spawn(process.execPath, wranglerArgs, {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error("Không thể khởi động production runtime:", error.message);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});
