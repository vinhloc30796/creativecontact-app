// File: app/api/user/[id]/contacts/helper.ts

import { UserData } from "@/app/types/UserInfo";
import { contacts } from "@/drizzle/schema/contact";
import {
  authUsers,
  userInfos,
  userIndustryExperience,
} from "@/drizzle/schema/user";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";

export async function fetchUserContacts(userId: string): Promise<UserData[]> {
  const contactsInfo = await db
    .select({
      id: userInfos.id,
      displayName: userInfos.displayName,
      userName: userInfos.userName,
      location: userInfos.location,
      occupation: userInfos.occupation,
      about: userInfos.about,
      email: authUsers.email,
      isAnonymous: authUsers.isAnonymous,
      emailConfirmedAt: authUsers.emailConfirmedAt,
      firstName: userInfos.firstName,
      lastName: userInfos.lastName,
      phoneCountryCode: userInfos.phoneCountryCode,
      phoneNumber: userInfos.phoneNumber,
      phoneCountryAlpha3: userInfos.phoneCountryAlpha3,
      instagramHandle: userInfos.instagramHandle,
      facebookHandle: userInfos.facebookHandle,
      profilePicture: userInfos.profilePicture,
    })
    .from(userInfos)
    .innerJoin(authUsers, eq(authUsers.id, userInfos.id))
    .innerJoin(contacts, eq(contacts.contactId, userInfos.id))
    .where(eq(contacts.userId, userId));

  // Fetch industry experiences for each contact
  const contactsWithIndustryExperiences = await Promise.all(
    contactsInfo.map(async (contact) => {
      const industryExperiences = await db
        .select({
          industry: userIndustryExperience.industry,
          experienceLevel: userIndustryExperience.experienceLevel,
        })
        .from(userIndustryExperience)
        .where(eq(userIndustryExperience.userId, contact.id));

      return {
        ...contact,
        industryExperiences,
      };
    }),
  );

  // Ensure type safety by mapping the result to UserData
  const typeSafeContacts: UserData[] = contactsWithIndustryExperiences.map(
    (contact) => ({
      ...contact,
      firstName: contact.firstName ?? "",
      lastName: contact.lastName ?? "",
      userName: contact.userName ?? "",
      displayName: contact.displayName ?? "",
      email: contact.email ?? "",
      isAnonymous: contact.isAnonymous ?? false,
      emailConfirmedAt: contact.emailConfirmedAt ?? null,
      phoneCountryCode: contact.phoneCountryCode ?? "84",
      phoneNumber: contact.phoneNumber ?? "",
      phoneCountryAlpha3: contact.phoneCountryAlpha3 ?? "VNM",
      location: contact.location ?? null,
      occupation: contact.occupation ?? null,
      about: contact.about ?? null,
      profilePicture: contact.profilePicture ?? null,
      instagramHandle: contact.instagramHandle ?? null,
      facebookHandle: contact.facebookHandle ?? null,
      industryExperiences: contact.industryExperiences.map((exp) => ({
        id: contact.id, // Using contact ID as a fallback
        userId: contact.id,
        industry: exp.industry,
        experienceLevel: exp.experienceLevel,
      })),
      userSkills: [], // Empty array as a placeholder
    }),
  );
  return typeSafeContacts;
}
