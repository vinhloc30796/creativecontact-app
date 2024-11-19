// File: app/api/user/[id]/contacts/helper.ts

import { UserData } from "@/app/types/UserInfo";
import { contacts } from "@/drizzle/schema/contact";
import { authUsers, userInfos } from "@/drizzle/schema/user";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function fetchUserContacts(userId: string): Promise<UserData[]> {
  const contactsInfo = await db
    .select({
      id: userInfos.id,
      displayName: userInfos.displayName,
      userName: userInfos.userName,
      location: userInfos.location,
      occupation: userInfos.occupation,
      about: userInfos.about,
      industries: userInfos.industries,
      experience: userInfos.experience,
      email: authUsers.email,
      isAnonymous: authUsers.isAnonymous,
      emailConfirmedAt: authUsers.emailConfirmedAt,
      firstName: userInfos.firstName,
      lastName: userInfos.lastName,
      phoneCountryCode: userInfos.phoneCountryCode,
      phoneNumber: userInfos.phoneNumber,
      phoneCountryAlpha3: userInfos.phoneCountryAlpha3,
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

  // Ensure type safety by mapping the result to UserData
  const typeSafeContacts: UserData[] = contactsInfo.map((contact) => ({
    ...contact,
    firstName: contact.firstName ?? "",
    lastName: contact.lastName ?? "",
    displayName: contact.displayName ?? "",
    userName: contact.userName ?? "",
    email: contact.email ?? "",
    isAnonymous: contact.isAnonymous ?? false,
    emailConfirmedAt: contact.emailConfirmedAt ?? null,
    industries: contact.industries ?? [],
    experience: contact.experience ?? null,
    phoneCountryCode: contact.phoneCountryCode ?? "84",
    phoneNumber: contact.phoneNumber ?? "",
    phoneCountryAlpha3: contact.phoneCountryAlpha3 ?? "VNM",
  }));

  return typeSafeContacts;
}
