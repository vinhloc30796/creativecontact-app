import { createClient } from "@/utils/supabase/server";

async function getServerSideUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export default getServerSideUser;

