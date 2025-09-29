CREATE TYPE "public"."registration_status" AS ENUM('pending', 'confirmed', 'checked-in', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."asset_type" AS ENUM('image', 'video', 'audio', 'font');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_registration_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_registration_id" uuid NOT NULL,
	"staff_id" uuid NOT NULL,
	"status_before" "registration_status" NOT NULL,
	"status_after" "registration_status" NOT NULL,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_registrations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"created_by" uuid NOT NULL,
	"status" "registration_status" DEFAULT 'pending' NOT NULL,
	"signature" text,
	"slot" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_country_code" text DEFAULT '84' NOT NULL,
	"phone_number" text,
	"phone_country_alpha3" text DEFAULT 'VNM' NOT NULL,
	CONSTRAINT "unique_user_slot_registration" UNIQUE("created_by","slot")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_slots" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"event" uuid NOT NULL,
	"time_start" timestamp with time zone NOT NULL,
	"time_end" timestamp with time zone NOT NULL,
	"capacity" integer NOT NULL,
	"special_notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_by" uuid,
	"time_end" timestamp with time zone,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artwork_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"file_path" text NOT NULL,
	"description" text,
	"asset_type" "asset_type",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"bucket_id" text DEFAULT 'artwork_assets' NOT NULL,
	"is_thumbnail" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artwork_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text,
	CONSTRAINT "unique_artwork_user" UNIQUE("artwork_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artwork_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	CONSTRAINT "unique_artwork_event" UNIQUE("artwork_id","event_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"contact_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "portfolio_artworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"artwork_id" uuid NOT NULL,
	"event_id" uuid,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_highlighted" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_registration_logs" ADD CONSTRAINT "event_registration_logs_event_registration_id_event_registrations_id_fk" FOREIGN KEY ("event_registration_id") REFERENCES "public"."event_registrations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_registration_logs" ADD CONSTRAINT "event_registration_logs_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_slot_event_slots_id_fk" FOREIGN KEY ("slot") REFERENCES "public"."event_slots"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_slots" ADD CONSTRAINT "event_slots_event_events_id_fk" FOREIGN KEY ("event") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artwork_assets" ADD CONSTRAINT "artwork_assets_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artwork_credits" ADD CONSTRAINT "artwork_credits_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artwork_credits" ADD CONSTRAINT "artwork_credits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artwork_events" ADD CONSTRAINT "artwork_events_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artwork_events" ADD CONSTRAINT "artwork_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts" ADD CONSTRAINT "contacts_contact_id_users_id_fk" FOREIGN KEY ("contact_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolio_artworks" ADD CONSTRAINT "portfolio_artworks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolio_artworks" ADD CONSTRAINT "portfolio_artworks_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolio_artworks" ADD CONSTRAINT "portfolio_artworks_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_portfolio_artworks_event_id" ON "portfolio_artworks" USING btree ("event_id");