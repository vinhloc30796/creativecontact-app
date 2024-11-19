"use server";

import { IndustryType, ExperienceType, userInfos } from "@/drizzle/schema/user";
import { db } from "@/lib/db";
import { getDisplayName } from "@/lib/name";

export async function writeUserInfo(
  userId: string,
  userInfo: {
    phoneCountryCode: string;
    phoneNumber: string;
    phoneCountryAlpha3: string;
    firstName: string;
    lastName: string;
    displayName?: string;
  },
  professionalInfo: {
    industries: IndustryType[];
    experience: ExperienceType | null;
  },
  socialInfo: {
    instagramHandle?: string;
    facebookHandle?: string;
  },
  validateProfessionalInfo: boolean = true,
  validateUserInfo: boolean = true
) {
  console.log("Received professionalInfo:", professionalInfo);
  // Validate professional info
  if (validateProfessionalInfo) {
    if (!professionalInfo.industries || professionalInfo.industries.length === 0 ||
      !professionalInfo.experience) {
      console.error("Invalid professional info:", professionalInfo);
      return { success: false, error: "Invalid professional info" };
    }
  }

  // Validate user info
  if (validateUserInfo) {
    if (!userInfo.phoneNumber || !userInfo.firstName || !userInfo.lastName) {
      console.error("Invalid user info:", userInfo);
      return { success: false, error: "Invalid user info" };
    }
  }

  try {
    const updateSet = {
      phoneCountryCode: userInfo.phoneCountryCode,
      phoneNumber: userInfo.phoneNumber,
      phoneCountryAlpha3: userInfo.phoneCountryAlpha3,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      displayName: getDisplayName(userInfo.firstName, userInfo.lastName, true),
      instagramHandle: socialInfo.instagramHandle,
      facebookHandle: socialInfo.facebookHandle,
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
