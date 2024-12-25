import { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { userInfos, industryEnum, experienceEnum } from "./user";

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  skillName: text("skill_name").notNull(),
  numberOfPeople: integer("number_of_people").default(0).notNull(),
});
export type Skill = InferSelectModel<typeof skills>;

export const userSkills = pgTable("user_skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  skillId: uuid("skill_id")
    .notNull()
    .references(() => skills.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => userInfos.id),
});
export type UserSkill = InferSelectModel<typeof userSkills>;
