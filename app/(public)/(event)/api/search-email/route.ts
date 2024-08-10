// File: app/(public)/(event)/api/search-email/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { eventRegistrations, eventSlots, events } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

// Define the schema for input validation
const searchSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the input
    const { email } = searchSchema.parse(await request.json());
    console.log("Searching for registration with email:", email);

    // Search for the registration with join to get event details
    const registrations = await db
      .select({
        id: eventRegistrations.id,
        createdAt: eventRegistrations.createdAt,
        status: eventRegistrations.status,
        signature: eventRegistrations.signature,
        name: eventRegistrations.name,
        email: eventRegistrations.email,
        phone: eventRegistrations.phone,
        slotId: eventSlots.id,
        slotTimeStart: eventSlots.timeStart,
        slotTimeEnd: eventSlots.timeEnd,
        eventId: events.id,
        eventName: events.name,
      })
      .from(eventRegistrations)
      .innerJoin(eventSlots, eq(eventRegistrations.slot, eventSlots.id))
      .innerJoin(events, eq(eventSlots.event, events.id))
      .where(eq(eventRegistrations.email, email));

    if (registrations.length === 0) {
      return NextResponse.json({
        error: `Registration not found for email ${email}`,
      }, { status: 404 });
    }

    // Return all matching registrations
    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error during registration search by email:", error);
    return NextResponse.json({
      error: error instanceof Error
        ? error.message
        : "An error occurred during registration search by email",
    }, { status: 500 });
  }
}