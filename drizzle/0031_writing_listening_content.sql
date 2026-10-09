ALTER TYPE "public"."content_access_target_type" ADD VALUE 'writing_level';--> statement-breakpoint
ALTER TYPE "public"."content_access_target_type" ADD VALUE 'writing_lesson';--> statement-breakpoint
ALTER TYPE "public"."content_access_target_type" ADD VALUE 'writing_character';--> statement-breakpoint
ALTER TYPE "public"."content_access_target_type" ADD VALUE 'listening_track';--> statement-breakpoint
ALTER TYPE "public"."content_access_target_type" ADD VALUE 'listening_group';--> statement-breakpoint
ALTER TYPE "public"."content_access_target_type" ADD VALUE 'listening_topic';--> statement-breakpoint
ALTER TYPE "public"."content_access_target_type" ADD VALUE 'listening_lesson';--> statement-breakpoint
CREATE TABLE "practice_content_documents" (
	"kind" varchar(32) NOT NULL,
	"key" varchar(500) NOT NULL,
	"payload" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "practice_content_documents_kind_key_pk" PRIMARY KEY("kind","key")
);
