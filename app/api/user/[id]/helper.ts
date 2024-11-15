// app/api/user/[id]/helper.ts
import { authUsers, userInfos } from "@/drizzle/schema/user";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function fetchUserData(userId: string) {
  const result = await db
    .select({
      id: authUsers.id,
      email: authUsers.email,
      firstName: userInfos.firstName,
      lastName: userInfos.lastName,
      displayName: userInfos.displayName,
      phoneCountryCode: userInfos.phoneCountryCode,
      phoneNumber: userInfos.phoneNumber,
      phoneCountryAlpha3: userInfos.phoneCountryAlpha3,
      isAnonymous: authUsers.isAnonymous,
      emailConfirmedAt: authUsers.emailConfirmedAt,
      location: userInfos.location,
      occupation: userInfos.occupation,
      about: userInfos.about,
      industries: userInfos.industries,
      experience: userInfos.experience,
      instagramHandle: userInfos.instagramHandle,
      facebookHandle: userInfos.facebookHandle,
      profilePicture: userInfos.profilePicture,
    })
    .from(authUsers)
    .leftJoin(userInfos, eq(authUsers.id, userInfos.id))
    .where(eq(authUsers.id, userId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const userData = result[0];

  // Transform the data to match the UserData interface
  return {
    id: userData.id,
    email: userData.email || "",
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    displayName: userData.displayName || "",
    phoneCountryCode: userData.phoneCountryCode || "84",
    phoneNumber: userData.phoneNumber || "",
    phoneCountryAlpha3: userData.phoneCountryAlpha3 || "VNM",
    isAnonymous: userData.isAnonymous,
    emailConfirmedAt: userData.emailConfirmedAt,
    location: userData.location || "",
    occupation: userData.occupation || "",
    about: userData.about || "",
    industries: userData.industries || [],
    experience: userData.experience || "",
    instagramHandle: userData.instagramHandle,
    facebookHandle: userData.facebookHandle,
    profilePicture: userData.profilePicture,
  };
}
