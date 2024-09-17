import {
    boolean,
    pgEnum,
    pgSchema,
    pgTable,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";
import { experienceLevels, industries } from "@/app/types/UserInfo";


// Partial schema for auth.users
export const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  isAnonymous: boolean("is_anonymous").notNull(),
  email: text("email"),
  emailConfirmedAt: timestamp("email_confirmed_at", { withTimezone: true }),
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
  firstName: text('first_name'),
  lastName: text('last_name'),
  displayName: text('display_name'),
  phone: text('phone'),
  location: text('location'),
  occupation: text('occupation'),
  about: text('about'),
  industries: industryEnum('industries').array(),
  experience: experienceEnum('experience'),
  instagramHandle: text('instagram_handle'),
  facebookHandle: text('facebook_handle'),
});

// TypeScript types for use in your application
export type IndustryType = typeof industries[number];
export type ExperienceType = typeof experienceLevels[number];
