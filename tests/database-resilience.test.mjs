import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { isDatabaseUnavailableError } from "../db/index.ts";

test("database availability detection recognizes Vinext proxy connection failures", () => {
  const error = new Error("Failed query");
  error.cause = new Error("proxy request failed, cannot connect to the specified address");

  assert.equal(isDatabaseUnavailableError(error), true);
});

test("database availability detection recognizes nested network error codes", () => {
  const error = new AggregateError([
    Object.assign(new Error("connect failed"), { code: "ECONNREFUSED" }),
  ]);

  assert.equal(isDatabaseUnavailableError(error), true);
});

test("database availability detection recognizes provider quota outages", () => {
  const error = new Error("Failed query");
  error.cause = Object.assign(
    new Error("Your account or project has exceeded the quota. Upgrade your plan to increase limits."),
    { code: "53000" },
  );

  assert.equal(isDatabaseUnavailableError(error), true);
});

test("database availability detection does not hide query or schema errors", () => {
  const error = Object.assign(new Error("column does not exist"), { code: "42703" });

  assert.equal(isDatabaseUnavailableError(error), false);
});

test("public VIP reads degrade safely during a database outage", async () => {
  const service = await readFile(new URL("../lib/vip-activation-request-service.ts", import.meta.url), "utf8");

  assert.match(service, /if \(!isDatabaseUnavailableError\(error\)\) throw error/);
  assert.match(service, /return \{ plans: \[\], pendingRequest: null, activeSubscription: null \}/);
});
