"use server";

import {
  IndustryType,
  ExperienceType,
  userInfos,
  userIndustryExperience,
} from "@/drizzle/schema/user";
import { db } from "@/lib/db";
import { getDisplayName } from "@/lib/name";
import { eq } from "drizzle-orm";

export async function writeUserInfo(
  userId: string,
  userInfo: {
    phoneCountryCode: string;
    phoneNumber: string;
    phoneCountryAlpha3: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    userName?: string;
    about?: string;
  },
  professionalInfo: {
    industryExperiences: {
      industry: IndustryType;
      experienceLevel: ExperienceType;
    }[];
  },
  socialInfo: {
    instagramHandle?: string;
    facebookHandle?: string;
  },
  validateProfessionalInfo: boolean = true,
  validateUserInfo: boolean = true,
) {
  console.log("Received professionalInfo:", professionalInfo);

  // Validate professional info
  if (validateProfessionalInfo) {
    if (
      !professionalInfo.industryExperiences ||
      professionalInfo.industryExperiences.length === 0
    ) {
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
      userName: userInfo.userName,
      displayName: getDisplayName(userInfo.firstName, userInfo.lastName, true),
      instagramHandle: socialInfo.instagramHandle,
      facebookHandle: socialInfo.facebookHandle,
      about: userInfo.about,
    };

    console.log("writeUserInfo updating with:", updateSet);

    // Use a transaction to update both user info and industry experiences
    const result = await db.transaction(async (tx) => {
      // Update user info
      const userInfoResult = await tx
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

      // Delete existing industry experiences
      await tx
        .delete(userIndustryExperience)
        .where(eq(userIndustryExperience.userId, userId));

      // Insert new industry experiences
      if (professionalInfo.industryExperiences.length > 0) {
        await tx.insert(userIndustryExperience).values(
          professionalInfo.industryExperiences.map((exp) => ({
            userId,
            industry: exp.industry,
            experienceLevel: exp.experienceLevel,
          })),
        );
      }

      return userInfoResult[0];
    });

    console.log("writeUserInfo update result:", result);

    return { success: true, data: result };
  } catch (error) {
    console.error("writeUserInfo error writing user info:", error);
    return { success: false, error: (error as Error).message };
  }
}
