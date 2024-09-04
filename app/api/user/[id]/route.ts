// app/api/user/[id]/route.ts
import { authUsers, userInfos } from '@/drizzle/schema/user';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
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
      })
      .from(authUsers)
      .leftJoin(userInfos, eq(authUsers.id, userInfos.id))
      .where(eq(authUsers.id, userId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = result[0];

    // Transform the data to match the UserData interface
    const transformedData = {
      id: userData.id,
      email: userData.email || '',
      isAnonymous: userData.isAnonymous,
      emailConfirmedAt: userData.emailConfirmedAt,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      industries: userData.industries || [],
      experience: userData.experience,
      // Add other fields as needed
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}