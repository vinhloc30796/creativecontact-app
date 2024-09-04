import { useCallback } from 'react';
import { getUserId } from '@/app/actions/auth';
import { signUpUser } from "@/app/actions/signUp";
import { useAuth } from '@/hooks/useAuth'; // Assuming you have this hook

// Either:
// - formData.email is a confirmed email address (getUserId is not null)
// - user is logged-in with a confirmed email address, but registering for their friend (we should create a new user)
// - user is logged-in anonymously (a user is already created via signInAnonymously)
export function useFormUserId() {
  const { user } = useAuth();

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

  return resolveFormUserId;
}
