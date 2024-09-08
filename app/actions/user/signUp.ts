"use server";

import { createClient } from "@/utils/supabase/server";
import { getAdminSupabaseClient } from "@/utils/supabase/server-admin";

export async function signUpUser(email: string, isAnonymous: boolean = true) {
  const supabase = await createClient();
  const adminSupabaseClient = await getAdminSupabaseClient();
  if (isAnonymous) {
    // then use signInAnonymously
    // first by creating an anonymous user
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    if (anonError || !anonData.user) {
      console.error("signUpUser: Error signing in anonymously:", anonError);
      return null;
    }
    // then get the anon user's id
    const { data: userData, error: userError } = await adminSupabaseClient.auth.admin.getUserById(anonData.user.id);
    if (userError || !userData.user) {
      console.error("signUpUser: Error fetching user:", userError);
      return null;
    }
    // then update the anon user's email
    const {
      data: updateData, error: updateError
    } = await adminSupabaseClient.auth.admin.updateUserById(anonData.user.id, {
      email: email,
      // @ts-ignore -- this works, but Supabase needs to update their types
      is_anonymous: isAnonymous,
      email_confirmed_at: null
    });
    if (updateError) {
      console.error("signUpUser: Error updating user:", updateError);
      return null;
    }
    console.log(`signUpUser: Anon user with email ${email} created:`, anonData.user);
    return updateData.user;
  }

  // use normal signUp otherwise
  const password = Math.random().toString(36).slice(2, 10);
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error("signUpUser: Error signing up user:", error);
    return null;
  }
  console.log(`signUpUser: User with email ${email} signed up:`, data);
  return data.user;
}
