/**
 * Migration: add staff verification fields
 *
 * Generated via `payload migrate:create add-staff-verification-fields`
 * after enabling `auth.verify = true` in NODE_ENV DEVELOPMENT in Staffs collection.
 * Adds `_verified`, `_verificationToken`, and `_verificationTokenExpiration` columns to the `payload.staffs` table.
 */
import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(`
   ALTER TABLE "payload"."staffs" ADD COLUMN "_verified" boolean;
  ALTER TABLE "payload"."staffs" ADD COLUMN "_verificationtoken" varchar;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(`
   ALTER TABLE "payload"."staffs" DROP COLUMN IF EXISTS "_verified";
  ALTER TABLE "payload"."staffs" DROP COLUMN IF EXISTS "_verificationtoken";`);
}
