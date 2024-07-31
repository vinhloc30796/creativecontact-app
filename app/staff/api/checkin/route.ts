// File: app/staff/api/checkin/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { eventRegistrationLogs, eventRegistrations } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

// Define the schema for input validation
const checkinSchema = z.object({
  id: z.string().uuid(),
});

// Define the type for registration status
type RegistrationStatus = "pending" | "confirmed" | "checked-in" | "cancelled";

// Define the expected type based on the schema and matching the table structure
type EventRegistrationLogInsert = {
  eventRegistrationId: string;
  staffId: string;
  statusBefore: RegistrationStatus;
  statusAfter: RegistrationStatus;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const staffId = session.user.id;

    // Validate the input
    const { id } = checkinSchema.parse(await request.json());

    // Start a transaction
    return await db.transaction(async (tx) => {
      // Get the current registration status
      const matchedRegistrations = await tx
        .select({
          id: eventRegistrations.id,
          status: eventRegistrations.status,
        })
        .from(eventRegistrations)
        .where(eq(eventRegistrations.id, id));

      // Assert that there is exactly one matching registration
      // and abort if there isn't
      if (matchedRegistrations.length !== 1) {
        throw new Error(
          `Invalid slot ID, expected 1 but found ${matchedRegistrations.length}`,
        );
      }
      const { id: registrationId, status } = matchedRegistrations[0];

      // If the status is 'pending' or 'confirmed', update it to 'checked-in'
      const validStatuses: RegistrationStatus[] = ["pending", "confirmed"];
      if (validStatuses.includes(status as RegistrationStatus)) {
        const [updatedRegistration] = await tx
          .update(eventRegistrations)
          .set({
            status: "checked-in",
          })
          .where(eq(eventRegistrations.id, id))
          .returning({
            id: eventRegistrations.id,
            status: eventRegistrations.status,
            name: eventRegistrations.name,
            email: eventRegistrations.email,
            phone: eventRegistrations.phone,
          });

        // Insert a new record into event_registration_logs
        const logEntry: EventRegistrationLogInsert = {
          eventRegistrationId: updatedRegistration.id,
          staffId: staffId,
          statusBefore: status as RegistrationStatus,
          statusAfter: "checked-in",
        };

        await tx.insert(eventRegistrationLogs).values(logEntry);

        return NextResponse.json({
          status: updatedRegistration.status,
          message: "Check-in successful",
          id: updatedRegistration.id,
          name: updatedRegistration.name,
          email: updatedRegistration.email,
          phone: updatedRegistration.phone,
        });
      } else {
        throw new Error(
          `Only [${validStatuses}] registrations can be checked in, but current registration is already '${status}'`,
        );
      }
    });
  } catch (error) {
    console.error("Error during check-in:", error);
    return NextResponse.json({
      error: error instanceof Error
        ? error.message
        : "An error occurred during check-in",
    }, { status: 500 });
  }
}
