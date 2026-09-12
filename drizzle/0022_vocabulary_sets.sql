CREATE TABLE "vocabulary_set_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"set_id" uuid NOT NULL,
	"hanzi" varchar(40) NOT NULL,
	"pinyin" varchar(160) NOT NULL,
	"meaning" text NOT NULL,
	"example" text DEFAULT '' NOT NULL,
	"translation" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vocabulary_set_words" ADD CONSTRAINT "vocabulary_set_words_set_id_vocabulary_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."vocabulary_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_sets" ADD CONSTRAINT "vocabulary_sets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "vocabulary_set_words_unique" ON "vocabulary_set_words" USING btree ("set_id","hanzi","pinyin");--> statement-breakpoint
CREATE INDEX "vocabulary_sets_user_idx" ON "vocabulary_sets" USING btree ("user_id","updated_at");