import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrationsFolder = resolve(projectRoot, "drizzle");
const migrationLockNamespace = 721_946;
const migrationLockId = 20_260_924;

function loadLocalEnvironment() {
  if (process.env.DATABASE_URL?.trim()) return;

  const configuredPath = process.env.HANZIWORK_ENV_FILE?.trim();
  const candidates = configuredPath
    ? [resolve(projectRoot, configuredPath)]
    : [resolve(projectRoot, ".env.local"), resolve(projectRoot, ".env")];
  const environmentFile = candidates.find((candidate) => existsSync(candidate));
  if (environmentFile) process.loadEnvFile(environmentFile);
}

function migrationsEnabled(): boolean {
  const configured = process.env.DATABASE_AUTO_MIGRATE?.trim().toLowerCase();
  return configured !== "0" && configured !== "false";
}

loadLocalEnvironment();

if (!migrationsEnabled()) {
  console.log("Database auto-migration is disabled by DATABASE_AUTO_MIGRATE.");
} else {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.log("DATABASE_URL is not configured; skipping database migrations.");
  } else {
    if (!existsSync(migrationsFolder)) {
      throw new Error(`Không tìm thấy thư mục migration: ${migrationsFolder}`);
    }

    const client = postgres(databaseUrl, {
      connect_timeout: 15,
      max: 1,
      prepare: false,
    });

    try {
      console.log("Checking database migrations...");
      await client.unsafe(`select pg_advisory_lock(${migrationLockNamespace}, ${migrationLockId})`);
      await migrate(drizzle(client), { migrationsFolder });
      console.log("Database migrations are up to date.");
    } finally {
      await client
        .unsafe(`select pg_advisory_unlock(${migrationLockNamespace}, ${migrationLockId})`)
        .catch(() => undefined);
      await client.end({ timeout: 5 }).catch(() => undefined);
    }
  }
}
