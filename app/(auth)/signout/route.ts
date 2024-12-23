import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Sign out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Supabase signout error:', error);
      return NextResponse.json({ error: 'Signout failed' }, { status: 500 });
    }

    // Clear any auth cookies
    const cookieStore = await cookies();
    cookieStore.getAll().forEach(cookie => {
      if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
        cookieStore.delete(cookie.name);
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Server signout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
