import { db } from "@/lib/db";
import { Skill, skills, UserSkill, userSkills } from "@/drizzle/schema/skills";
import { eq, InferSelectModel } from "drizzle-orm";

export async function getAllSkills(): Promise<Skill[]> {
  try {
    const result = await db.select().from(skills);
    return result;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  try {
    const result = await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, userId));
    return result;
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return [];
  }
}
