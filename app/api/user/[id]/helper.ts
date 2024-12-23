// app/api/user/[id]/helper.ts
import {
  authUsers,
  userInfos,
  userIndustryExperience,
} from "@/drizzle/schema/user";

import { skills, userSkills } from "@/drizzle/schema/skills";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function fetchUserData(userId: string) {
  // First get user info and auth data
  const result = await db
    .select({
      id: authUsers.id,
      email: authUsers.email,
      firstName: userInfos.firstName,
      lastName: userInfos.lastName,
      userName: userInfos.userName,
      displayName: userInfos.displayName,
      phoneCountryCode: userInfos.phoneCountryCode,
      phoneNumber: userInfos.phoneNumber,
      phoneCountryAlpha3: userInfos.phoneCountryAlpha3,
      isAnonymous: authUsers.isAnonymous,
      emailConfirmedAt: authUsers.emailConfirmedAt,
      location: userInfos.location,
      occupation: userInfos.occupation,
      about: userInfos.about,
      instagramHandle: userInfos.instagramHandle,
      facebookHandle: userInfos.facebookHandle,
      profilePicture: userInfos.profilePicture,
    })
    .from(authUsers)
    .leftJoin(userInfos, eq(authUsers.id, userInfos.id))
    .where(eq(authUsers.id, userId))
    .limit(1);

  if (result.length === 0) {
    console.error(`User with ID ${userId} not found`);
    return null;
  }
  const userData = result[0];

  // Then get industry experiences
  const industryExperiences = await db
    .select({
      industry: userIndustryExperience.industry,
      experienceLevel: userIndustryExperience.experienceLevel,
    })
    .from(userIndustryExperience)
    .where(eq(userIndustryExperience.userId, userId));

  if (industryExperiences.length === 0) {
    console.warn(`No industry experiences found for user with ID ${userId}`);
  }

  const skillsData = await db
    .select({
      skillId: userSkills.skillId,
      skillName: skills.skillName,
      numberOfPeople: skills.numberOfPeople,
    })
    .from(userSkills)
    .leftJoin(skills, eq(userSkills.skillId, skills.id))
    .where(eq(userSkills.userId, userId));

  // Transform the data to match the UserData interface
  return {
    id: userData.id,
    email: userData.email || "",
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    userName: userData.userName || "",
    displayName: userData.displayName || "",
    phoneCountryCode: userData.phoneCountryCode || "84",
    phoneNumber: userData.phoneNumber || "",
    phoneCountryAlpha3: userData.phoneCountryAlpha3 || "VNM",
    isAnonymous: userData.isAnonymous,
    emailConfirmedAt: userData.emailConfirmedAt,
    location: userData.location || "",
    occupation: userData.occupation || "",
    about: userData.about || "",
    industryExperiences: industryExperiences,
    userSkills: skillsData,
    instagramHandle: userData.instagramHandle,
    facebookHandle: userData.facebookHandle,
    profilePicture: userData.profilePicture,
  };
}
