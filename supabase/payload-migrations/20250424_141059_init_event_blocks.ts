import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."theme_options" AS ENUM('light', 'dark');
  CREATE TYPE "payload"."background_options" AS ENUM('solid', 'transparent', 'gradientUp', 'gradientDown');
  CREATE TYPE "payload"."enum_events_blocks_media_block_media_block_fields_position" AS ENUM('default', 'wide', 'fullWidth');
  CREATE TABLE IF NOT EXISTS "payload"."events_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_block_fields_settings_theme" "payload"."theme_options",
  	"media_block_fields_settings_background" "payload"."background_options",
  	"media_block_fields_position" "payload"."enum_events_blocks_media_block_media_block_fields_position" DEFAULT 'default',
  	"media_block_fields_media_id" integer NOT NULL,
  	"media_block_fields_caption" jsonb,
  	"block_name" varchar
  );
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_media_block" ADD CONSTRAINT "events_blocks_media_block_media_block_fields_media_id_media_id_fk" FOREIGN KEY ("media_block_fields_media_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."events_blocks_media_block" ADD CONSTRAINT "events_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "events_blocks_media_block_order_idx" ON "payload"."events_blocks_media_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_blocks_media_block_parent_id_idx" ON "payload"."events_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_blocks_media_block_path_idx" ON "payload"."events_blocks_media_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "events_blocks_media_block_media_block_fields_media_block_fields_media_idx" ON "payload"."events_blocks_media_block" USING btree ("media_block_fields_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."events_blocks_media_block" CASCADE;
  DROP TYPE "payload"."theme_options";
  DROP TYPE "payload"."background_options";
  DROP TYPE "payload"."enum_events_blocks_media_block_media_block_fields_position";`)
}
