import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_events_blocks_event_details_layout" AS ENUM('default', 'wide', 'fullWidth');
  CREATE TYPE "payload"."social_platform" AS ENUM('instagram', 'twitter', 'linkedin', 'facebook', 'youtube', 'website', 'other');
  CREATE TYPE "payload"."enum_events_blocks_event_speaker_layout" AS ENUM('standard', 'compact', 'expanded');
  CREATE TYPE "payload"."enum_events_blocks_event_speakers_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "payload"."enum_events_blocks_event_speakers_layout" AS ENUM('grid', 'list', 'carousel');
  CREATE TYPE "payload"."enum_events_blocks_event_gallery_layout" AS ENUM('grid', 'masonry', 'carousel', 'fullwidth');
  CREATE TYPE "payload"."enum_events_blocks_event_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "payload"."enum_events_blocks_event_credits_layout" AS ENUM('standard', 'compact', 'detailed');
  CREATE TYPE "payload"."enum_events_status" AS ENUM('draft', 'upcoming', 'active', 'past');
  ALTER TYPE "payload"."enum_staff_roles" RENAME TO "enum_staffs_roles";
  CREATE TABLE IF NOT EXISTS "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"alt" varchar,
  	"dark_mode_fallback_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"image_id" integer,
  	"use_video" boolean,
  	"video_url" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"published_on" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"staffs_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_image_id" integer,
  	"version_use_video" boolean,
  	"version_video_url" varchar,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_published_on" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"staffs_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"rich_text" jsonb NOT NULL,
  	"background_image_id" integer,
  	"layout" "payload"."enum_events_blocks_event_details_layout" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_speaker_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "payload"."social_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_speaker" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"bio" varchar,
  	"description" jsonb NOT NULL,
  	"image_id" integer NOT NULL,
  	"layout" "payload"."enum_events_blocks_event_speaker_layout" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_speakers_speakers_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "payload"."social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_speakers_speakers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"bio" varchar,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_speakers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Speakers',
  	"columns" "payload"."enum_events_blocks_event_speakers_columns" DEFAULT '3',
  	"layout" "payload"."enum_events_blocks_event_speakers_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"alt_text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Event Gallery',
  	"description" varchar,
  	"layout" "payload"."enum_events_blocks_event_gallery_layout" DEFAULT 'grid',
  	"columns" "payload"."enum_events_blocks_event_gallery_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_credits_credits_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_credits_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"social" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_event_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Credits',
  	"layout" "payload"."enum_events_blocks_event_credits_layout" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"status" "payload"."enum_events_status" DEFAULT 'draft' NOT NULL,
  	"summary" varchar NOT NULL,
  	"event_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"location" varchar NOT NULL,
  	"capacity" numeric,
  	"featured_image_id" integer NOT NULL,
  	"registration_required" boolean DEFAULT true,
  	"registration_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."staff_roles" RENAME TO "staffs_roles";
  ALTER TABLE "payload"."staff" RENAME TO "staffs";
  ALTER TABLE "payload"."payload_locked_documents_rels" RENAME COLUMN "staff_id" TO "staffs_id";
  ALTER TABLE "payload"."payload_preferences_rels" RENAME COLUMN "staff_id" TO "staffs_id";
  ALTER TABLE "payload"."staffs_roles" DROP CONSTRAINT "staff_roles_parent_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_staff_fk";
  
  ALTER TABLE "payload"."payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_staff_fk";
  
  DROP INDEX IF EXISTS "staff_roles_order_idx";
  DROP INDEX IF EXISTS "staff_roles_parent_idx";
  DROP INDEX IF EXISTS "staff_updated_at_idx";
  DROP INDEX IF EXISTS "staff_created_at_idx";
  DROP INDEX IF EXISTS "staff_email_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_staff_id_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_staff_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  DO $$ BEGIN
   ALTER TABLE "payload"."media" ADD CONSTRAINT "media_dark_mode_fallback_id_media_id_fk" FOREIGN KEY ("dark_mode_fallback_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_staffs_fk" FOREIGN KEY ("staffs_id") REFERENCES "payload"."staffs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_staffs_fk" FOREIGN KEY ("staffs_id") REFERENCES "payload"."staffs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_details" ADD CONSTRAINT "events_blocks_event_details_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_details" ADD CONSTRAINT "events_blocks_event_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_speaker_social_links" ADD CONSTRAINT "events_blocks_event_speaker_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_blocks_event_speaker"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_speaker" ADD CONSTRAINT "events_blocks_event_speaker_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_speaker" ADD CONSTRAINT "events_blocks_event_speaker_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_speakers_speakers_social_links" ADD CONSTRAINT "events_blocks_event_speakers_speakers_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_blocks_event_speakers_speakers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_speakers_speakers" ADD CONSTRAINT "events_blocks_event_speakers_speakers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_speakers_speakers" ADD CONSTRAINT "events_blocks_event_speakers_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_blocks_event_speakers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_speakers" ADD CONSTRAINT "events_blocks_event_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_gallery_images" ADD CONSTRAINT "events_blocks_event_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_gallery_images" ADD CONSTRAINT "events_blocks_event_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_blocks_event_gallery"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_gallery" ADD CONSTRAINT "events_blocks_event_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_credits_credits_roles" ADD CONSTRAINT "events_blocks_event_credits_credits_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_blocks_event_credits_credits"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_credits_credits" ADD CONSTRAINT "events_blocks_event_credits_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_blocks_event_credits"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_event_credits" ADD CONSTRAINT "events_blocks_event_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_tags" ADD CONSTRAINT "events_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events" ADD CONSTRAINT "events_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "media_dark_mode_fallback_idx" ON "payload"."media" USING btree ("dark_mode_fallback_id");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "posts_image_idx" ON "payload"."posts" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "payload"."posts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "payload"."posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "payload"."posts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "posts__status_idx" ON "payload"."posts" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "posts_rels_order_idx" ON "payload"."posts_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "posts_rels_parent_idx" ON "payload"."posts_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "posts_rels_path_idx" ON "payload"."posts_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "posts_rels_posts_id_idx" ON "payload"."posts_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "posts_rels_staffs_id_idx" ON "payload"."posts_rels" USING btree ("staffs_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_parent_idx" ON "payload"."_posts_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_image_idx" ON "payload"."_posts_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_slug_idx" ON "payload"."_posts_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_updated_at_idx" ON "payload"."_posts_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_created_at_idx" ON "payload"."_posts_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version__status_idx" ON "payload"."_posts_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_posts_v_created_at_idx" ON "payload"."_posts_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_updated_at_idx" ON "payload"."_posts_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_latest_idx" ON "payload"."_posts_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_order_idx" ON "payload"."_posts_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_parent_idx" ON "payload"."_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_path_idx" ON "payload"."_posts_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_posts_id_idx" ON "payload"."_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_staffs_id_idx" ON "payload"."_posts_v_rels" USING btree ("staffs_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_details_order_idx" ON "payload"."events_blocks_event_details" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_details_parent_id_idx" ON "payload"."events_blocks_event_details" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_details_path_idx" ON "payload"."events_blocks_event_details" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_details_background_image_idx" ON "payload"."events_blocks_event_details" USING btree ("background_image_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speaker_social_links_order_idx" ON "payload"."events_blocks_event_speaker_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speaker_social_links_parent_id_idx" ON "payload"."events_blocks_event_speaker_social_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speaker_order_idx" ON "payload"."events_blocks_event_speaker" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speaker_parent_id_idx" ON "payload"."events_blocks_event_speaker" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speaker_path_idx" ON "payload"."events_blocks_event_speaker" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speaker_image_idx" ON "payload"."events_blocks_event_speaker" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speakers_speakers_social_links_order_idx" ON "payload"."events_blocks_event_speakers_speakers_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speakers_speakers_social_links_parent_id_idx" ON "payload"."events_blocks_event_speakers_speakers_social_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speakers_speakers_order_idx" ON "payload"."events_blocks_event_speakers_speakers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speakers_speakers_parent_id_idx" ON "payload"."events_blocks_event_speakers_speakers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speakers_speakers_image_idx" ON "payload"."events_blocks_event_speakers_speakers" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speakers_order_idx" ON "payload"."events_blocks_event_speakers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speakers_parent_id_idx" ON "payload"."events_blocks_event_speakers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_speakers_path_idx" ON "payload"."events_blocks_event_speakers" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_gallery_images_order_idx" ON "payload"."events_blocks_event_gallery_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_gallery_images_parent_id_idx" ON "payload"."events_blocks_event_gallery_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_gallery_images_image_idx" ON "payload"."events_blocks_event_gallery_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_gallery_order_idx" ON "payload"."events_blocks_event_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_gallery_parent_id_idx" ON "payload"."events_blocks_event_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_gallery_path_idx" ON "payload"."events_blocks_event_gallery" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_credits_credits_roles_order_idx" ON "payload"."events_blocks_event_credits_credits_roles" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_credits_credits_roles_parent_id_idx" ON "payload"."events_blocks_event_credits_credits_roles" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_credits_credits_order_idx" ON "payload"."events_blocks_event_credits_credits" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_credits_credits_parent_id_idx" ON "payload"."events_blocks_event_credits_credits" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_credits_order_idx" ON "payload"."events_blocks_event_credits" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_credits_parent_id_idx" ON "payload"."events_blocks_event_credits" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_event_credits_path_idx" ON "payload"."events_blocks_event_credits" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "events_tags_order_idx" ON "payload"."events_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_tags_parent_id_idx" ON "payload"."events_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_slug_idx" ON "payload"."events" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "events_featured_image_idx" ON "payload"."events" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "events_updated_at_idx" ON "payload"."events" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "events_created_at_idx" ON "payload"."events" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload"."staffs_roles" ADD CONSTRAINT "staffs_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."staffs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staffs_fk" FOREIGN KEY ("staffs_id") REFERENCES "payload"."staffs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_staffs_fk" FOREIGN KEY ("staffs_id") REFERENCES "payload"."staffs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "staffs_roles_order_idx" ON "payload"."staffs_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "staffs_roles_parent_idx" ON "payload"."staffs_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "staffs_updated_at_idx" ON "payload"."staffs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "staffs_created_at_idx" ON "payload"."staffs" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "staffs_email_idx" ON "payload"."staffs" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_staffs_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("staffs_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_events_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_staffs_id_idx" ON "payload"."payload_preferences_rels" USING btree ("staffs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "payload"."enum_staffs_roles" RENAME TO "enum_staff_roles";
  ALTER TABLE "payload"."media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_speaker_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_speaker" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_speakers_speakers_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_speakers_speakers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_speakers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_credits_credits_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_credits_credits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_blocks_event_credits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."posts" CASCADE;
  DROP TABLE "payload"."posts_rels" CASCADE;
  DROP TABLE "payload"."_posts_v" CASCADE;
  DROP TABLE "payload"."_posts_v_rels" CASCADE;
  DROP TABLE "payload"."events_blocks_event_details" CASCADE;
  DROP TABLE "payload"."events_blocks_event_speaker_social_links" CASCADE;
  DROP TABLE "payload"."events_blocks_event_speaker" CASCADE;
  DROP TABLE "payload"."events_blocks_event_speakers_speakers_social_links" CASCADE;
  DROP TABLE "payload"."events_blocks_event_speakers_speakers" CASCADE;
  DROP TABLE "payload"."events_blocks_event_speakers" CASCADE;
  DROP TABLE "payload"."events_blocks_event_gallery_images" CASCADE;
  DROP TABLE "payload"."events_blocks_event_gallery" CASCADE;
  DROP TABLE "payload"."events_blocks_event_credits_credits_roles" CASCADE;
  DROP TABLE "payload"."events_blocks_event_credits_credits" CASCADE;
  DROP TABLE "payload"."events_blocks_event_credits" CASCADE;
  DROP TABLE "payload"."events_tags" CASCADE;
  DROP TABLE "payload"."events" CASCADE;
  ALTER TABLE "payload"."staffs_roles" RENAME TO "staff_roles";
  ALTER TABLE "payload"."staffs" RENAME TO "staff";
  ALTER TABLE "payload"."payload_locked_documents_rels" RENAME COLUMN "staffs_id" TO "staff_id";
  ALTER TABLE "payload"."payload_preferences_rels" RENAME COLUMN "staffs_id" TO "staff_id";
  ALTER TABLE "payload"."staff_roles" DROP CONSTRAINT "staffs_roles_parent_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_staffs_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "payload"."payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_staffs_fk";
  
  DROP INDEX IF EXISTS "staffs_roles_order_idx";
  DROP INDEX IF EXISTS "staffs_roles_parent_idx";
  DROP INDEX IF EXISTS "staffs_updated_at_idx";
  DROP INDEX IF EXISTS "staffs_created_at_idx";
  DROP INDEX IF EXISTS "staffs_email_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_staffs_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_media_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_events_id_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_staffs_id_idx";
  DO $$ BEGIN
   ALTER TABLE "payload"."staff_roles" ADD CONSTRAINT "staff_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."staff"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "payload"."staff"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "payload"."staff"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "staff_roles_order_idx" ON "payload"."staff_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "staff_roles_parent_idx" ON "payload"."staff_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "staff_updated_at_idx" ON "payload"."staff" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "staff_created_at_idx" ON "payload"."staff" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "staff_email_idx" ON "payload"."staff" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_staff_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("staff_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_staff_id_idx" ON "payload"."payload_preferences_rels" USING btree ("staff_id");
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "media_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "posts_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "events_id";
  DROP TYPE "payload"."enum_posts_status";
  DROP TYPE "payload"."enum__posts_v_version_status";
  DROP TYPE "payload"."enum_events_blocks_event_details_layout";
  DROP TYPE "payload"."social_platform";
  DROP TYPE "payload"."enum_events_blocks_event_speaker_layout";
  DROP TYPE "payload"."enum_events_blocks_event_speakers_columns";
  DROP TYPE "payload"."enum_events_blocks_event_speakers_layout";
  DROP TYPE "payload"."enum_events_blocks_event_gallery_layout";
  DROP TYPE "payload"."enum_events_blocks_event_gallery_columns";
  DROP TYPE "payload"."enum_events_blocks_event_credits_layout";
  DROP TYPE "payload"."enum_events_status";`)
}
