import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
// Import the core logic function and its return type
import { getServerContacts, UserContactView } from "./helper";

// API Route Handler
export async function GET() {
  try {
    const processedUsers: UserContactView[] = await getServerContacts();
    return NextResponse.json(processedUsers);
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users. An internal error occurred." },
      { status: 500 }
    );
  }
}
