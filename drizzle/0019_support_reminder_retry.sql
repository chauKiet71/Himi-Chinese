ALTER TABLE "support_conversations" ADD COLUMN "reminder_failures" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "support_conversations" ADD COLUMN "last_reminder_error" text;