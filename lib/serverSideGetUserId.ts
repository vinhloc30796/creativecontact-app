// it run on the server

import { createClient } from "@/utils/supabase/server";

export async function getServerSideUserId() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user?.id) {
    return session.user.id
  }
  throw new Error("can't get user id")
}