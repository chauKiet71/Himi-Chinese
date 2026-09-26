import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
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
    const database = drizzle(client);
    const migrations = readMigrationFiles({ migrationsFolder });

    try {
      console.log("Checking database migrations...");
      await database.transaction(async (transaction) => {
        await transaction.execute(sql.raw(`select pg_advisory_xact_lock(${migrationLockNamespace}, ${migrationLockId})`));
        await transaction.execute(sql`create schema if not exists "drizzle"`);
        await transaction.execute(sql`
          create table if not exists "drizzle"."__drizzle_migrations" (
            id serial primary key,
            hash text not null,
            created_at bigint
          )
        `);
        const applied = await transaction.execute<{ created_at: string }>(sql`
          select created_at
          from "drizzle"."__drizzle_migrations"
          order by created_at desc
          limit 1
        `);
        const lastAppliedAt = applied[0] ? Number(applied[0].created_at) : undefined;

        for (const migration of migrations) {
          if (lastAppliedAt !== undefined && lastAppliedAt >= migration.folderMillis) continue;
          for (const statement of migration.sql) await transaction.execute(sql.raw(statement));
          await transaction.execute(sql`
            insert into "drizzle"."__drizzle_migrations" (hash, created_at)
            values (${migration.hash}, ${migration.folderMillis})
          `);
        }
      });
      console.log("Database migrations are up to date.");
    } finally {
      await client.end({ timeout: 5 }).catch(() => undefined);
    }
  }
}
