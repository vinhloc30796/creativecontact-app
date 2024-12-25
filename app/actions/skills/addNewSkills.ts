"use server";

import { skills } from "@/drizzle/schema/skills";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function addNewSkills(
  skillNames: string[],
  validateSkillsInfo: boolean = true,
) {
  console.log("Received skillNames:", skillNames);

  // Validate skills info
  if (validateSkillsInfo) {
    if (!skillNames || skillNames.length === 0) {
      console.error("Invalid skills info:", skillNames);
      return { success: false, error: "Invalid skills info" };
    }
  }

  try {
    // Use a transaction to add new skills
    const result = await db.transaction(async (tx) => {
      const addedSkills = [];

      for (const skillName of skillNames) {
        // Check if the skill already exists
        const existingSkillArray = await tx
          .select({ skillName: skills.skillName })
          .from(skills)
          .where(eq(skills.skillName, skillName))
          .limit(1);

        const existingSkill =
          existingSkillArray.length > 0 ? existingSkillArray[0] : null;

        if (!existingSkill) {
          // Add the new skill
          const newSkill = await tx.insert(skills).values({
            skillName: skillName,
            numberOfPeople: 0,
          });

          addedSkills.push(newSkill);
        }
      }

      return { success: true, addedSkills };
    });

    console.log("addNewSkills result:", result);

    return { success: true, data: result };
  } catch (error) {
    console.error("addNewSkills error adding new skills:", error);
    return { success: false, error: (error as Error).message };
  }
}
