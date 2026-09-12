import assert from "node:assert/strict";
import test from "node:test";
import { loadConfigFromFile } from "vite";

async function readRuntimeConfig(command, runtime) {
  const previous = process.env.HIMI_DEV_RUNTIME;
  process.env.HIMI_DEV_RUNTIME = runtime;
  try {
    const result = await loadConfigFromFile({ command, mode: "development" });
    assert.ok(result);
    return result.config;
  } finally {
    if (previous === undefined) delete process.env.HIMI_DEV_RUNTIME;
    else process.env.HIMI_DEV_RUNTIME = previous;
  }
}

function hasWorkerPlugin(config) {
  return config.plugins.flat(Infinity).some((plugin) =>
    plugin?.name?.startsWith("vite-plugin-cloudflare"),
  );
}

test("Node development bypasses Miniflare, while Worker dev and production keep Cloudflare", async () => {
  const nodeDev = await readRuntimeConfig("serve", "node");
  assert.equal(hasWorkerPlugin(nodeDev), false);
  assert.ok(nodeDev.ssr.external.includes("cloudinary"));

  const workerDev = await readRuntimeConfig("serve", "workerd");
  assert.equal(hasWorkerPlugin(workerDev), true);
  assert.notEqual(workerDev.cacheDir, nodeDev.cacheDir);
  assert.equal(workerDev.ssr, undefined);

  const production = await readRuntimeConfig("build", "node");
  assert.equal(hasWorkerPlugin(production), true);
  assert.equal(production.cacheDir, workerDev.cacheDir);
  assert.equal(production.ssr, undefined);
});
