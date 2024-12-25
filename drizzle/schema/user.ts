import { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Partial schema for auth.users
export const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  isAnonymous: boolean("is_anonymous").notNull(),
  email: text("email"),
  emailConfirmedAt: timestamp("email_confirmed_at", { withTimezone: true }),
});

export const industries = [
  "Advertising",
  "Architecture",
  "Arts and Crafts",
  "Design",
  "Fashion",
  "Film, Video, and Photography",
  "Music",
  "Performing Arts",
  "Publishing",
  "Software and Interactive",
  "Television and Radio",
  "Visual Arts",
  "Other",
] as const;

export const experienceLevels = [
  "Entry",
  "Junior",
  "Mid-level",
  "Senior",
  "Manager",
  "C-level",
] as const;

export const industryEnum = pgEnum("industry", industries);
export const experienceEnum = pgEnum("experience_level", experienceLevels);

/* postgres=> \d user_infos
                         Table "public.user_infos"
        Column        |     Type     | Collation | Nullable |    Default    
----------------------+--------------+-----------+----------+---------------
 id                   | uuid         |           | not null | 
 display_name         | text         |           |          | 
 location             | text         |           |          | 
 occupation           | text         |           |          | 
 about                | text         |           |          | 
 first_name           | text         |           |          | 
 last_name            | text         |           |          | 
 phone                | text         |           |          | 
 instagram_handle     | text         |           |          | 
 facebook_handle      | text         |           |          | 
 profile_picture      | text         |           |          | 
 phone_country_code   | text         |           |          | '84'::text
 phone_number         | text         |           |          | 
 phone_country_alpha3 | character(3) |           |          | 'VNM'::bpchar
 user_name            | text         |           | not null | 
Indexes:
    "user_infos_pkey" PRIMARY KEY, btree (id)
    "user_name_unique" UNIQUE CONSTRAINT, btree (user_name)
Foreign-key constraints:
    "user_infos_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id)
Referenced by:
    TABLE "user_industry_experience" CONSTRAINT "user_industry_experience_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_infos(id) ON DELETE CASCADE
Policies (row security enabled): (none)
*/

export const userInfos = pgTable("user_infos", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id),
  firstName: text("first_name"),
  lastName: text("last_name"),
  userName: text("user_name"),
  displayName: text("display_name"),
  phoneCountryCode: text("phone_country_code").default("84"),
  phoneNumber: text("phone_number"),
  phoneCountryAlpha3: text("phone_country_alpha3").default("VNM"),
  location: text("location"),
  occupation: text("occupation"),
  about: text("about"),
  profilePicture: text("profile_picture"),
  instagramHandle: text("instagram_handle"),
  facebookHandle: text("facebook_handle"),
});

/* postgres=> \d user_industry_experience
postgres=> \d user_industry_experience
                    Table "public.user_industry_experience"
      Column      |       Type       | Collation | Nullable |      Default      
------------------+------------------+-----------+----------+-------------------
 id               | uuid             |           | not null | gen_random_uuid()
 user_id          | uuid             |           | not null | 
 industry         | industry         |           | not null | 
 experience_level | experience_level |           | not null | 
Indexes:
    "user_industry_experience_pkey" PRIMARY KEY, btree (id)
    "idx_user_industry_experience_user_id" btree (user_id)
    "user_industry_experience_user_id_industry_key" UNIQUE CONSTRAINT, btree (user_id, industry)
Foreign-key constraints:
    "user_industry_experience_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_infos(id) ON DELETE CASCADE
*/

export const userIndustryExperience = pgTable("user_industry_experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userInfos.id, { onDelete: "cascade" }),
  industry: industryEnum("industry").notNull(),
  experienceLevel: experienceEnum("experience_level").notNull(),
});

// TypeScript types for use in your application
export type IndustryType = (typeof industries)[number];
export type ExperienceType = (typeof experienceLevels)[number];
export type UserInfo = InferSelectModel<typeof userInfos>;
export type UserIndustryExperience = InferSelectModel<
  typeof userIndustryExperience
>;

// Mappers
export const industriesMapper = [
  { value: "Advertising" as const, label: "Advertising" },
  { value: "Architecture" as const, label: "Architecture" },
  { value: "Arts and Crafts" as const, label: "Arts and Crafts" },
  { value: "Design" as const, label: "Design" },
  { value: "Fashion" as const, label: "Fashion" },
  {
    value: "Film, Video, and Photography" as const,
    label: "Film, Video, and Photography",
  },
  { value: "Music" as const, label: "Music" },
  { value: "Performing Arts" as const, label: "Performing Arts" },
  { value: "Publishing" as const, label: "Publishing" },
  {
    value: "Software and Interactive" as const,
    label: "Software and Interactive",
  },
  { value: "Television and Radio" as const, label: "Television and Radio" },
  { value: "Visual Arts" as const, label: "Visual Arts" },
  { value: "Other" as const, label: "Other" },
] as const;

export const experienceLevelsMapper = [
  { value: "Entry" as const, label: "Entry" },
  { value: "Junior" as const, label: "Junior" },
  { value: "Mid-level" as const, label: "Mid-level" },
  { value: "Senior" as const, label: "Senior" },
  { value: "Manager" as const, label: "Manager" },
  { value: "C-level" as const, label: "C-level" },
] as const;

export const skillsMapper = [
  { value: "Graphic Design" as const, label: "Graphic Design" },
  { value: "Photography" as const, label: "Photography" },
  { value: "Illustration" as const, label: "Illustration" },
  { value: "3D Art" as const, label: "3D Art" },
  { value: "UI/UX" as const, label: "UI/UX" },
  { value: "Motion" as const, label: "Motion" },
  { value: "Architecture" as const, label: "Architecture" },
  { value: "Product Design" as const, label: "Product Design" },
  { value: "Fashion" as const, label: "Fashion" },
  { value: "Advertising" as const, label: "Advertising" },
  { value: "Fine Arts" as const, label: "Fine Arts" },
  { value: "Crafts" as const, label: "Crafts" },
  { value: "Game Design" as const, label: "Game Design" },
  { value: "Sound" as const, label: "Sound" },
  { value: "Creative Challenges" as const, label: "Creative Challenges" },
  { value: "Photoshop" as const, label: "Photoshop" },
  { value: "Lightroom" as const, label: "Lightroom" },
  { value: "Illustrator" as const, label: "Illustrator" },
  { value: "InDesign" as const, label: "InDesign" },
  { value: "XD" as const, label: "XD" },
  { value: "Premiere Pro" as const, label: "Premiere Pro" },
  { value: "After Effects" as const, label: "After Effects" },
  { value: "Illustrator Draw" as const, label: "Illustrator Draw" },
  { value: "Photoshop Sketch" as const, label: "Photoshop Sketch" },
  { value: "Photoshop Mix" as const, label: "Photoshop Mix" },
  { value: "Stock" as const, label: "Stock" },
  { value: "Dimension" as const, label: "Dimension" },
  { value: "Capture" as const, label: "Capture" },
  { value: "Substance 3D Designer" as const, label: "Substance 3D Designer" },
  { value: "Substance 3D Sampler" as const, label: "Substance 3D Sampler" },
  { value: "Substance 3D Stager" as const, label: "Substance 3D Stager" },
  { value: "Fresco" as const, label: "Fresco" },
  { value: "Aero" as const, label: "Aero" },
];
