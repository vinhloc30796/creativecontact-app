import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(`
   ALTER TABLE "payload"."staffs" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "payload"."staffs" ADD COLUMN "api_key" varchar;
  ALTER TABLE "payload"."staffs" ADD COLUMN "api_key_index" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(`
   ALTER TABLE "payload"."staffs" ADD COLUMN "_verified" boolean;
  ALTER TABLE "payload"."staffs" ADD COLUMN "_verificationtoken" varchar;
  ALTER TABLE "payload"."staffs" DROP COLUMN IF EXISTS "enable_a_p_i_key";`)
}
