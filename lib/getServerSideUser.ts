import { createClient } from "@/utils/supabase/server";

async function getServerSideUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user;
  } catch {
    return null
  }
}

export default getServerSideUser;

