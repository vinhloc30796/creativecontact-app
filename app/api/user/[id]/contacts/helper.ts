// File: app/api/user/[id]/contacts/helper.ts

import { UserData } from '@/app/types/UserInfo';
import { contacts } from '@/drizzle/schema/contact';
import { authUsers, userInfos } from '@/drizzle/schema/user';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function fetchUserContacts(userId: string): Promise<UserData[]> {
  const contactsInfo = await db
    .select({
      id: userInfos.id,
      displayName: userInfos.displayName,
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
      phone: userInfos.phone,
      instagramHandle: userInfos.instagramHandle,
      facebookHandle: userInfos.facebookHandle,
    })
    .from(userInfos)
    .innerJoin(authUsers, eq(authUsers.id, userInfos.id))
    .innerJoin(contacts, eq(contacts.contactId, userInfos.id))
    .where(eq(contacts.userId, userId));

  // Ensure type safety by mapping the result to UserData
  const typeSafeContacts: UserData[] = contactsInfo.map(contact => ({
    ...contact,
    firstName: contact.firstName ?? '',
    lastName: contact.lastName ?? '',
    email: contact.email ?? '', // Ensure email is always a string
    isAnonymous: contact.isAnonymous ?? false, // Provide a default value
    emailConfirmedAt: contact.emailConfirmedAt ?? null, // Allow null
    industries: contact.industries ?? [], // Ensure it's always an array
    experience: contact.experience ?? null, // Allow null as per UserData type
  }));

  return typeSafeContacts;
}