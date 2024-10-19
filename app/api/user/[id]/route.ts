// app/api/user/[id]/route.ts
import { NextResponse } from 'next/server';
import { authUsers, userInfos } from '@/drizzle/schema/user';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function fetchUserData(userId: string) {
  const result = await db
    .select({
      id: authUsers.id,
      email: authUsers.email,
      firstName: userInfos.firstName,
      lastName: userInfos.lastName,
      phone: userInfos.phone,
      isAnonymous: authUsers.isAnonymous,
      emailConfirmedAt: authUsers.emailConfirmedAt,
      location: userInfos.location,
      occupation: userInfos.occupation,
      about: userInfos.about,
      industries: userInfos.industries,
      experience: userInfos.experience,
      instagramHandle: userInfos.instagramHandle,
      facebookHandle: userInfos.facebookHandle,
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
    email: userData.email || '',
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    phone: userData.phone || '',
    isAnonymous: userData.isAnonymous,
    emailConfirmedAt: userData.emailConfirmedAt,
    location: userData.location || '',
    occupation: userData.occupation || '',
    about: userData.about || '',
    industries: userData.industries || [],
    experience: userData.experience || '',
    instagramHandle: userData.instagramHandle,
    facebookHandle: userData.facebookHandle,
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const userData = await fetchUserData(userId);

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}