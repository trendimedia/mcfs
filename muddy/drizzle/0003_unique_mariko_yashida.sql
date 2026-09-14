CREATE TYPE "public"."application_status" AS ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'hired');--> statement-breakpoint
CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'half_day');--> statement-breakpoint
CREATE SEQUENCE "public"."employee_code_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_code" text NOT NULL,
	"date" date NOT NULL,
	"status" "attendance_status" NOT NULL,
	"marked_by" text,
	"marked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "performance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_code" text NOT NULL,
	"month" text NOT NULL,
	"score_percent" numeric NOT NULL,
	"notes" text,
	"reviewed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."application_status";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DATA TYPE "public"."application_status" USING "status"::"public"."application_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "mobile_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "location" text NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "position" text NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "next_of_kin_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "next_of_kin_phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "zip_code";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_employee_code_unique" UNIQUE("employee_code");