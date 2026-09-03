import "server-only";
import { writeDb, type Database } from "../db/index.ts";
import { auditLogs } from "../db/schema.ts";
import { hashPrivateIdentifier } from "./auth-crypto.ts";
import { clientAddress } from "./request-security.ts";

type AuthAuditInput = {
  action: string;
  request: Request;
  userId?: string | null;
  identifier?: string;
  metadata?: Record<string, boolean | number | string | null>;
};

export async function recordAuthEvent(input: AuthAuditInput, database?: Database): Promise<void> {
  try {
    const [ipHash, identifierHash] = await Promise.all([
      hashPrivateIdentifier(clientAddress(input.request)),
      input.identifier ? hashPrivateIdentifier(input.identifier) : Promise.resolve(null),
    ]);
    const insert = (db: Database) => db.insert(auditLogs).values({
      actorId: input.userId ?? null,
      action: input.action.slice(0, 100),
      entityType: "user",
      entityId: input.userId ?? null,
      metadata: {
        ...input.metadata,
        ipHash,
        identifierHash,
        userAgent: (input.request.headers.get("user-agent") ?? "unknown").slice(0, 240),
      },
    });
    await (database ? insert(database) : writeDb(insert));
  } catch (error) {
    console.error("Không thể ghi auth audit log.", error instanceof Error ? error.message : "unknown");
  }
}
