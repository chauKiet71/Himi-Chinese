import vinext from "vinext";
import { sites } from "@openai/sites-vite-plugin";
import { defineConfig, loadEnv } from "vite";
import hostingConfig from "./.openai/hosting.json";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async ({ mode, command }) => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  const viteEnv = loadEnv(mode, process.cwd(), "");
  // Windows local development avoids Miniflare's loopback fetch transport.
  // Production builds always retain the Cloudflare Worker entry and bindings.
  const useWorkerRuntime =
    command === "build" ||
    (viteEnv.HIMI_DEV_RUNTIME ?? (process.platform === "win32" ? "node" : "workerd")) === "workerd";
  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const workerPlugin = useWorkerRuntime
    ? (await import("@cloudflare/vite-plugin")).cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      })
    : undefined;
  const supportWebhookHost = viteEnv.SUPPORT_WEBHOOK_BASE_URL
    ? new URL(viteEnv.SUPPORT_WEBHOOK_BASE_URL).hostname
    : undefined;

  return {
    // Keep the app's optimizer separate from middleware-mode tests using .vite.
    cacheDir: useWorkerRuntime ? "node_modules/.vite-app" : "node_modules/.vite-app-node",
    // Let Node load the SDK's CommonJS dependency graph natively in local dev.
    ...(!useWorkerRuntime ? { ssr: { external: ["cloudinary"] } } : {}),
    optimizeDeps: {
      // Vinext runs separate client/RSC/SSR Vite environments. Keeping these
      // browser-ready ESM packages out of the shared pre-bundle avoids stale
      // optimizer hashes (504 "Outdated Optimize Dep") after HMR restarts.
      exclude: [
        "lucide-react",
        "@gsap/react",
        "gsap",
        "gsap/MotionPathPlugin",
      ],
    },
    server: {
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
      ...(supportWebhookHost
        ? { allowedHosts: [supportWebhookHost, ".lhr.life"] }
        : {}),
    },
    plugins: [
      vinext(),
      sites(),
      workerPlugin,
    ],
  };
});
