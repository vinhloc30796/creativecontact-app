// File: drizzle/schema.ts

import {
  boolean,
  integer,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { experienceLevels, industries } from "@/app/types/UserInfo";

// Partial schema for auth.users
export const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  isAnonymous: boolean("is_anonymous").notNull(),
});

// Public schema
export const events = pgTable("events", {
  id: uuid("id").primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  created_by: uuid("created_by").notNull(),
});

export const eventSlots = pgTable("event_slots", {
  id: uuid("id").primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull(),
  event: uuid("event").references(() => events.id).notNull(),
  time_start: timestamp("time_start", { withTimezone: true }).notNull(),
  time_end: timestamp("time_end", { withTimezone: true }).notNull(),
  capacity: integer("capacity").notNull(),
  special_notes: text("special_notes"),
});

/* postgres=> \d event_registrations
postgres=> \d event_registrations
                              Table "public.event_registrations"
   Column   |           Type           | Collation | Nullable |            Default
------------+--------------------------+-----------+----------+--------------------------------
 id         | uuid                     |           | not null |
 created_at | timestamp with time zone |           | not null |
 created_by | uuid                     |           | not null |
 status     | registration_status      |           | not null | 'pending'::registration_status
 signature  | text                     |           |          |
 slot       | uuid                     |           | not null |
Indexes:
    "event_registrations_pkey" PRIMARY KEY, btree (id)
    "idx_event_registrations_created_by" btree (created_by)
    "idx_event_registrations_slot" btree (slot)
    "idx_unique_registration" UNIQUE, btree (created_by, slot)
    "unique_user_slot_registration" UNIQUE CONSTRAINT, btree (created_by, slot)
Foreign-key constraints:
    "event_registrations_slot_fkey" FOREIGN KEY (slot) REFERENCES event_slots(id)
    "fk_event_registrations_user" FOREIGN KEY (created_by) REFERENCES auth.users(id)
*/

// Enum
export const registrationStatus = pgEnum("registration_status", [
  "pending",
  "confirmed",
  "checked-in",
  "cancelled",
]);

export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull(),
  created_by: uuid("created_by").notNull().references(() => authUsers.id),
  status: registrationStatus("status").notNull().default("pending"),
  signature: text("signature"),
  slot: uuid("slot").references(() => eventSlots.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
}, (table) => ({
  uniqueUserSlotRegistration: unique("unique_user_slot_registration").on(
    table.created_by,
    table.slot,
  ),
}));


/* postgres=> \d event_registration_logs
                           Table "public.event_registration_logs"
        Column         |           Type           | Collation | Nullable |      Default
-----------------------+--------------------------+-----------+----------+-------------------
 id                    | uuid                     |           | not null | gen_random_uuid()
 event_registration_id | uuid                     |           | not null |
 staff_id              | uuid                     |           | not null |
 status_before         | registration_status      |           | not null |
 status_after          | registration_status      |           | not null |
 changed_at            | timestamp with time zone |           | not null | now()
Indexes:
    "event_registration_logs_pkey" PRIMARY KEY, btree (id)
    "idx_event_registration_logs_registration_id" btree (event_registration_id)
Foreign-key constraints:
    "event_registration_logs_event_registration_id_fkey" FOREIGN KEY (event_registration_id) REFERENCES event_registrations(id)
    "event_registration_logs_staff_id_fkey" FOREIGN KEY (staff_id) REFERENCES auth.users(id)
*/

export const eventRegistrationLogs = pgTable("event_registration_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  event_registration_id: uuid("event_registration_id").references(() => eventRegistrations.id).notNull(),
  staff_id: uuid("staff_id").notNull().references(() => authUsers.id),
  status_before: registrationStatus("status_before").notNull(),
  status_after: registrationStatus("status_after").notNull(),
  changed_at: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
});

/* postgres=> \d user_infos
                    Table "public.user_infos"
    Column    |       Type       | Collation | Nullable | Default
--------------+------------------+-----------+----------+---------
 id           | uuid             |           | not null |
 display_name | text             |           |          |
 location     | text             |           |          |
 occupation   | text             |           |          |
 about        | text             |           |          |
 industries   | industry[]       |           |          |
 experience   | experience_level |           |          |
Indexes:
    "user_infos_pkey" PRIMARY KEY, btree (id)
    "idx_user_infos_industries" gin (industries)
Foreign-key constraints:
    "user_infos_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id)
Policies (row security enabled): (none)
*/
export const industryEnum = pgEnum('industry', industries);
export const experienceEnum = pgEnum('experience_level', experienceLevels);
export const userInfos = pgTable('user_infos', {
  id: uuid('id').primaryKey().references(() => authUsers.id),
  displayName: text('display_name'),
  location: text('location'),
  occupation: text('occupation'),
  about: text('about'),
  industries: industryEnum('industries').array(),
  experience: experienceEnum('experience').notNull(),
});

// TypeScript types for use in your application
export type IndustryType = typeof industries[number];
export type ExperienceType = typeof experienceLevels[number];
