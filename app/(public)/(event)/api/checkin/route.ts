// File: app/(public)/(event)/api/checkin/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { performCheckin, CheckinResult } from "@/lib/checkin";

// Define the schema for input validation
const checkinSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user's session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

    // Validate the input
    const { id } = checkinSchema.parse(await request.json());

    // Perform the check-in
    const result = await performCheckin(id, userId);

    if (!result.success || !result.data) {
      console.error("Check-in failed:", result.error || "No data returned");
      return NextResponse.json({ error: result.error || "Check-in failed" }, { status: 400 });
    }

    return NextResponse.json({
      status: result.data.status,
      message: "Check-in successful",
      id: result.data.id,
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
    });

  } catch (error) {
    console.error("Unexpected error during check-in:", error);
    return NextResponse.json({
      error: "An unexpected error occurred during check-in",
    }, { status: 500 });
  }
}

