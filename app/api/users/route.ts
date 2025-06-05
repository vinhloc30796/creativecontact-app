import { NextResponse, NextRequest } from "next/server";
// import { createClient } from "@/utils/supabase/server"; // unused import
// Import the core logic function and its return type
import { getServerContacts, UserContactView } from "./helper";

// API Route Handler
export async function GET(request: NextRequest) {
  try {
    // Extract pagination and cursor parameters
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const seed = url.searchParams.get("seed") || "";
    const cursor = url.searchParams.get("cursor") || undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : 5;
    const { contacts, nextCursor } = await getServerContacts(limit, cursor, seed);
    return NextResponse.json({ data: contacts, nextCursor });
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users. An internal error occurred." },
      { status: 500 }
    );
  }
}
