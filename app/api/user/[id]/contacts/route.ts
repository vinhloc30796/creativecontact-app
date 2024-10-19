import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contacts } from '@/drizzle/schema/contact';
import { userInfos, authUsers } from '@/drizzle/schema/user';
import { eq } from 'drizzle-orm';

async function fetchUserContacts(userId: string) {
  // Fetch the user's contacts
  const userContacts = await db
    .select({
      contactId: contacts.contactId,
    })
    .from(contacts)
    .where(eq(contacts.userId, userId));

  // Fetch user info for each contact
  const contactsInfo = await Promise.all(
    userContacts.map(async (contact) => {
      const contactInfo = await db
        .select({
          id: userInfos.id,
          firstName: userInfos.firstName,
          lastName: userInfos.lastName,
          displayName: userInfos.displayName,
          location: userInfos.location,
          occupation: userInfos.occupation,
          industries: userInfos.industries,
          experience: userInfos.experience,
          email: authUsers.email,
        })
        .from(userInfos)
        .innerJoin(authUsers, eq(userInfos.id, authUsers.id))
        .where(eq(userInfos.id, contact.contactId as string))
        .limit(1);

      return contactInfo[0];
    })
  );

  return contactsInfo;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const contactsInfo = await fetchUserContacts(userId);
    return NextResponse.json(contactsInfo);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
