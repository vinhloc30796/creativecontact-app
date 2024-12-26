"use server";

import { userSkills } from "@/drizzle/schema/skills";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { string } from "zod";

export async function updateUserSkills(
  userId: string,
  skillsInfo: { skills: string[] },
  validateSkillsInfo: boolean = true,
) {
  console.log("Received skillsInfo:", skillsInfo);

  // Validate skills info
  if (validateSkillsInfo) {
    if (!skillsInfo || !skillsInfo.skills || skillsInfo.skills.length === 0) {
      console.error("Invalid skills info:", skillsInfo);
      return { success: false, error: "Invalid skills info" };
    }
  }

  try {
    // Use a transaction to update user skills
    const result = await db.transaction(async (tx) => {
      // Delete existing user skills
      await tx.delete(userSkills).where(eq(userSkills.userId, userId));

      // Insert new user skills
      if (skillsInfo.skills.length > 0) {
        for (const skill of skillsInfo.skills) {
          await tx.insert(userSkills).values({
            id: crypto.randomUUID(),
            userId: userId,
            skillId: skill,
          });
        }
      }

      return { success: true };
    });

    console.log("updateUserSkills update result:", result);

    return { success: true, data: result };
  } catch (error) {
    console.error("updateUserSkills error updating user skills:", error);
    return { success: false, error: (error as Error).message };
  }
}
