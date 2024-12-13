import { userSkills } from "@/drizzle/schema/skills";
import { db } from "@/lib/db";

export async function writeUserSkills(userId: string, skillIds: string[]) {
  for (const skillId of skillIds) {
    console.log(`Adding skill ${skillId} for user ${userId}`);
    try {
      const result = await db.transaction(async (tx) => {
        const userSkillResult = await tx
          .insert(userSkills)
          .values({
            userId: userId,
            skillId: skillId,
          })
          .returning();
        return userSkillResult[0];
      });
      console.log(`Added skill ${skillId} for user ${userId}:`, result);
    } catch (error) {
      console.error(`Error adding skill ${skillId} for user ${userId}:`, error);
    }
  }
}
