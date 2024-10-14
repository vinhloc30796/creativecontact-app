"use server";

import { checkUserIsAnonymous } from '@/app/actions/user/auth';
import { createClient } from '@/utils/supabase/server';

export async function useServerAuth() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let isAnonymous = true;
  if (session?.user) {
    isAnonymous = session.user.email ? await checkUserIsAnonymous(session.user.email) ?? true : true;
  }

  return {
    user: session?.user ?? null,
    isLoggedIn: !!session?.user,
    isAnonymous,
  };
}