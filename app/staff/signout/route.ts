import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to the login page after sign out
  const method = "GET";
  const url = new URL("/staff/login", request.url);
  return NextResponse.redirect(url, { status: 303, statusText: "See Other", headers: { Location: url.toString() } });
}
