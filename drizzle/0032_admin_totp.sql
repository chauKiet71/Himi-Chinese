CREATE TABLE "admin_totp_credentials" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"version" uuid DEFAULT gen_random_uuid() NOT NULL,
	"encrypted_secret" text,
	"enabled_at" timestamp with time zone,
	"last_used_step" bigint,
	"recovery_hashes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"pending_secret" text,
	"pending_expires_at" timestamp with time zone,
	"pending_attempts" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_login_challenges" ADD COLUMN "method" varchar(10) DEFAULT 'email' NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_login_challenges" ADD COLUMN "credential_version" uuid;--> statement-breakpoint
ALTER TABLE "admin_totp_credentials" ADD CONSTRAINT "admin_totp_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;