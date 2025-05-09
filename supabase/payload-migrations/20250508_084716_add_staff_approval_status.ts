import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(`
   CREATE TYPE "payload"."enum_staffs_status" AS ENUM('pending', 'approved', 'rejected', 'inactive');
  ALTER TABLE "payload"."staffs" ADD COLUMN "status" "payload"."enum_staffs_status" DEFAULT 'pending' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(`
   ALTER TABLE "payload"."staffs" DROP COLUMN IF EXISTS "status";
  DROP TYPE "payload"."enum_staffs_status";`)
}
