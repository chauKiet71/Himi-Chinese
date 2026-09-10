CREATE TYPE "public"."access_tier" AS ENUM('free', 'vip');--> statement-breakpoint
CREATE TYPE "public"."content_access_target_type" AS ENUM('learning_path', 'learning_module', 'learning_lesson', 'learning_question', 'hsk_level', 'hsk_lesson', 'hsk_question');--> statement-breakpoint
CREATE TABLE "content_access_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_type" "content_access_target_type" NOT NULL,
	"target_key" varchar(500) NOT NULL,
	"tier" "access_tier" DEFAULT 'free' NOT NULL,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_access_policies" ADD CONSTRAINT "content_access_policies_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "content_access_policies_target_uq" ON "content_access_policies" USING btree ("target_type","target_key");--> statement-breakpoint
CREATE INDEX "content_access_policies_target_type_idx" ON "content_access_policies" USING btree ("target_type");