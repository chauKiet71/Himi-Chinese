CREATE TABLE "saved_vocabulary_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source_type" varchar(30) NOT NULL,
	"source_key" varchar(180) NOT NULL,
	"source_title" varchar(180) NOT NULL,
	"hanzi" varchar(120) NOT NULL,
	"pinyin" varchar(220) NOT NULL,
	"meaning" text NOT NULL,
	"example" text DEFAULT '' NOT NULL,
	"translation" text DEFAULT '' NOT NULL,
	"audio_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved_vocabulary_words" ADD CONSTRAINT "saved_vocabulary_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "saved_vocabulary_words_source_uq" ON "saved_vocabulary_words" USING btree ("user_id","source_type","source_key");--> statement-breakpoint
CREATE INDEX "saved_vocabulary_words_user_idx" ON "saved_vocabulary_words" USING btree ("user_id","updated_at");