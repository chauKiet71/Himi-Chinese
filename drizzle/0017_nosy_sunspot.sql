CREATE TABLE "admin_login_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"challenge_hash" varchar(64) NOT NULL,
	"code_hash" varchar(64) NOT NULL,
	"return_to" varchar(500) DEFAULT '/admin' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD COLUMN "last_seen_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_login_challenges" ADD CONSTRAINT "admin_login_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_login_challenges_hash_uq" ON "admin_login_challenges" USING btree ("challenge_hash");--> statement-breakpoint
CREATE INDEX "admin_login_challenges_user_idx" ON "admin_login_challenges" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "admin_login_challenges_expiry_idx" ON "admin_login_challenges" USING btree ("expires_at");