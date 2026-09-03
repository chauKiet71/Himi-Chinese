import "server-only";
import type { Database } from "../db/index.ts";
import { sendAuthLinkEmail } from "./auth-email.ts";
import { issueAuthToken, type AuthTokenPurpose } from "./auth-token-service.ts";

type EmailUser = { id: string; email: string; displayName: string };

export async function sendAuthLink(
  user: EmailUser,
  purpose: AuthTokenPurpose,
  database?: Database,
): Promise<"brevo" | "console"> {
  const issued = await issueAuthToken(user.id, purpose, database);
  return sendAuthLinkEmail(user, purpose, issued);
}
