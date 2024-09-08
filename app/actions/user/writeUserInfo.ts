"use server";

import { IndustryType, ExperienceType, userInfos } from "@/drizzle/schema/user";
import { db } from "@/lib/db";
import { getDisplayName } from "@/lib/name";


export async function writeUserInfo(
  userId: string,
  userInfo: {
    phone: string;
    firstName: string;
    lastName: string;
  },
  professionalInfo: {
    industries: IndustryType[];
    experience: ExperienceType | null;
  }
) {
  console.log("Received professionalInfo:", professionalInfo);
  // Validate professional info
  if (!professionalInfo.industries || professionalInfo.industries.length === 0 ||
    !professionalInfo.experience) {
    console.error("Invalid professional info:", professionalInfo);
    return { success: false, error: "Invalid professional info" };
  }

  // Validate user info
  if (!userInfo.phone || !userInfo.firstName || !userInfo.lastName) {
    console.error("Invalid user info:", userInfo);
    return { success: false, error: "Invalid user info" };
  }

  try {
    const updateSet = {
      phone: userInfo.phone,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      displayName: getDisplayName(userInfo.firstName, userInfo.lastName, true),
      industries: professionalInfo.industries,
      experience: professionalInfo.experience,
    };

    console.log("writeUserInfo updating with:", updateSet);

    const result = await db
      .insert(userInfos)
      .values({
        id: userId,
        ...updateSet,
      })
      .onConflictDoUpdate({
        target: userInfos.id,
        set: updateSet,
      })
      .returning();

    console.log("writeUserInfo update result:", result);

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("writeUserInfo error writing user info:", error);
    return { success: false, error: (error as Error).message };
  }
}
