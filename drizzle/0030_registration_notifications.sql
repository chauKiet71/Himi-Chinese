CREATE TABLE "registration_notification_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"telegram_message_id" integer,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "registration_notification_jobs" ADD CONSTRAINT "registration_notification_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "registration_notification_user_uq" ON "registration_notification_jobs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "registration_notification_due_idx" ON "registration_notification_jobs" USING btree ("available_at") WHERE "registration_notification_jobs"."finished_at" is null;