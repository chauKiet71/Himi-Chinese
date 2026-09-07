CREATE TYPE "public"."support_sender" AS ENUM('USER', 'ADMIN', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."support_status" AS ENUM('OPEN', 'CLAIMED', 'WAITING_USER', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "support_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"user_name" varchar(120) NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"status" "support_status" DEFAULT 'OPEN' NOT NULL,
	"claimed_by_telegram_user_id" text,
	"claimed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"completed_by" text,
	"next_reminder_at" timestamp with time zone,
	"reminder_count" integer DEFAULT 0 NOT NULL,
	"telegram_chat_id" text NOT NULL,
	"telegram_notification_message_id" integer,
	"telegram_reminder_message_id" integer,
	"generation" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_images" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"public_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid,
	"kind" text NOT NULL,
	"dedupe_key" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_type" "support_sender" NOT NULL,
	"sender_id" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"image_url" text,
	"image_id" uuid,
	"telegram_message_id" integer,
	"request_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_reply_sessions" (
	"telegram_chat_id" text NOT NULL,
	"telegram_admin_user_id" text NOT NULL,
	"prompt_message_id" integer NOT NULL,
	"conversation_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "support_reply_sessions_telegram_chat_id_telegram_admin_user_id_prompt_message_id_pk" PRIMARY KEY("telegram_chat_id","telegram_admin_user_id","prompt_message_id")
);
--> statement-breakpoint
CREATE TABLE "support_telegram_updates" (
	"update_id" text PRIMARY KEY NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "support_conversations" ADD CONSTRAINT "support_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_images" ADD CONSTRAINT "support_images_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_jobs" ADD CONSTRAINT "support_jobs_conversation_id_support_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."support_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_conversation_id_support_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."support_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_image_id_support_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."support_images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_reply_sessions" ADD CONSTRAINT "support_reply_sessions_conversation_id_support_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."support_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "support_conversation_user_idx" ON "support_conversations" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "support_reminder_due_idx" ON "support_conversations" USING btree ("next_reminder_at") WHERE "support_conversations"."status" = 'OPEN';--> statement-breakpoint
CREATE UNIQUE INDEX "support_job_dedupe_uq" ON "support_jobs" USING btree ("dedupe_key");--> statement-breakpoint
CREATE INDEX "support_job_due_idx" ON "support_jobs" USING btree ("available_at") WHERE "support_jobs"."finished_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "support_message_request_uq" ON "support_messages" USING btree ("sender_id","request_id");--> statement-breakpoint
CREATE INDEX "support_message_conversation_idx" ON "support_messages" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE INDEX "support_reply_expiry_idx" ON "support_reply_sessions" USING btree ("expires_at");