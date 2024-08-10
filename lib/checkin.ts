// File: lib/checkin.ts

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { eventRegistrationLogs, eventRegistrations } from "@/drizzle/schema";

type RegistrationStatus = "pending" | "confirmed" | "checked-in" | "cancelled";

type EventRegistrationLogInsert = {
  eventRegistrationId: string;
  staffId: string;
  statusBefore: RegistrationStatus;
  statusAfter: RegistrationStatus;
};

export type CheckinResult = {
  success: boolean;
  data?: {
    id: string;
    status: string;
    name: string;
    email: string;
    phone: string;
  };
  error?: string;
  errorCode?: string;
};

export async function performCheckin(
  id: string,
  staffId: string,
): Promise<CheckinResult> {
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
    if (matchedRegistrations.length !== 1) {
      return {
        success: false,
        error: `Invalid slot ID, expected 1 but found ${matchedRegistrations.length}`,
        errorCode: "INVALID_ID",
      };
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

      return {
        success: true,
        data: updatedRegistration,
      };
    } else {
      return {
        success: false,
        error: `Registration cannot be checked in. Current status: '${status}'`,
        errorCode: "INVALID_STATUS",
      };
    }
  });
}