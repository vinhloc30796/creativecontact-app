import { getUserId } from '@/app/actions/user/auth';
import { signUpUser } from "@/app/actions/user/signUp";
import { authUsers, userInfos } from '@/drizzle/schema/user';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExperienceLevel, Industry, UserInfo } from '@/app/types/UserInfo';

export interface UserData extends Omit<UserInfo, 'experience'> {
  email: string;
  isAnonymous: boolean;
  emailConfirmedAt: Date | null;
  firstName: string;
  lastName: string;
  phone: string;
  industries: Industry[];
  experience: ExperienceLevel | null;
}

async function fetchUserData(userId: string): Promise<UserData | null> {
  const response = await fetch(`/api/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

// Either:
// - formData.email is a confirmed email address (getUserId is not null)
// - user is logged-in with a confirmed email address, but registering for their friend (we should create a new user)
// - user is logged-in anonymously (a user is already created via signInAnonymously)
export function useFormUserId() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: () => (user ? fetchUserData(user.id) : null),
    enabled: !!user && !isAuthLoading,
  });

  const isLoading = isAuthLoading || isUserDataLoading;

  const resolveFormUserId = useCallback(async (formEmail: string): Promise<string> => {
    const dbUserId = await getUserId(formEmail);

    if (dbUserId) {
      // we found a user in the database, good, use that
      return dbUserId;
    }

    if (user?.email === formEmail) {
      // we didn't find a user in the database,
      // but we have a logged-in user with a confirmed email address
      // and it is matching the email we are registering with
      // so we should use that user
      return user.id;
    }

    if (user?.email !== formEmail) {
      // we didn't find a user in the database,
      // and we have a logged-in user with a confirmed email address
      // but it is not matching the email we are registering with
      // so they're registering for another user
      // we should create an anonymous user 
      // then update that user with the email and professional info from the form
      const newUser = await signUpUser(formEmail, true);
      if (newUser) {
        return newUser.id;
      }
      throw new Error('Failed to create a new anonymous user');
    }

    // finally, if we got here, the user is not logged in
    // so we should use the user.id from signInAnonymously
    if (user) {
      return user.id;
    }

    throw new Error('Unable to resolve user ID');
  }, [user]);

  return { resolveFormUserId, userData, isLoading };
}
