CREATE TYPE IF NOT EXISTS "public"."notification_type" AS ENUM('login', 'form', 'system');
--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."notification_role" AS ENUM('admin', 'manager');
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" "public"."notification_type" DEFAULT 'form' NOT NULL,
	"source" text,
	"actor_email" text,
	"recipient_role" "public"."notification_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT now() + interval '3 days' NOT NULL
);
