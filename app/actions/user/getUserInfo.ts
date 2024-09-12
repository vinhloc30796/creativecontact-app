import { db } from '@/lib/db';
import { userInfos, authUsers } from '@/drizzle/schema/user';
import { eq } from 'drizzle-orm';

export async function getUserInfo(userId: string) {
  try {
    // Step 1: Query the auth.users table
    const authUser = await db.select().from(authUsers).where(eq(authUsers.id, userId)).limit(1);

    if (!authUser || authUser.length === 0) {
      console.error('User not found in auth.users');
      return null;
    }

    // Step 2: Query the user_infos table
    const userInfo = await db.select().from(userInfos).where(eq(userInfos.id, userId)).limit(1);

    // Step 3: Combine and return the data
    return {
      ...authUser[0],
      ...(userInfo && userInfo[0] ? userInfo[0] : {}),
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}
