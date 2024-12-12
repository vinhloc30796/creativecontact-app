import { checkUserIsAnonymous } from '@/app/actions/user/auth';
import { createClient } from '@/utils/supabase/server';
import { cache } from 'react';

export const getServerAuth = cache(async () => {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let isAnonymous = true;
  if (session?.user) {
    isAnonymous = session.user.email ? 
      await checkUserIsAnonymous(session.user.email) ?? true : 
      true;
  }

  return {
    user: session?.user ?? null,
    isLoggedIn: !!session?.user,
    isAnonymous,
  };
});