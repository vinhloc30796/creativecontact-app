//File: app/api/confirm-registration/route.ts

import { confirmRegistration } from "@/app/(public)/(event)/register/_sections/actions";
import { sendConfirmationEmailWithICSAndQR } from "@/app/actions/email/registration"; // Adjust the import path as necessary
import { eventRegistrations, eventSlots } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { getAdminSupabaseClient } from "@/utils/supabase/server-admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const registrationId = searchParams.get("signature");
  const adminSupabaseClient = await getAdminSupabaseClient();

  if (!registrationId) {
    return NextResponse.json({ error: "Invalid signature/registrationId" }, {
      status: 400,
    });
  }

  const result = await confirmRegistration(registrationId);

  if (result.success) {
    // Send confirmation email
    try {
      // Fetch registration details
      const registration = await db.select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.id, registrationId))
        .limit(1);

      if (!registration.length) {
        return NextResponse.json({ error: "Registration not found" }, {
          status: 404,
        });
      }
      const foundRegistration = registration[0];

      // Fetch slot details
      const slot = await db.select()
        .from(eventSlots)
        .where(eq(eventSlots.id, foundRegistration.slot))
        .limit(1);

      if (!slot.length) {
        return NextResponse.json({ error: "Event slot not found" }, {
          status: 404,
        });
      }

      // Send confirmation email with ICS and QR code
      await sendConfirmationEmailWithICSAndQR(
        foundRegistration.email,
        {
          id: foundRegistration.id as `${string}-${string}-${string}-${string}-${string}`,
          event: slot[0].event as `${string}-${string}-${string}-${string}-${string}`,
          created_at: foundRegistration.created_at,
          time_start: slot[0].time_start,
          time_end: slot[0].time_end,
          capacity: slot[0].capacity,
        },
        registrationId,
        foundRegistration.name,
      );
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      // Note: We're not returning here, as we still want to redirect the user
    }

    // Update the user's email after registration confirmation
    if (result.userId) {
      const userId = result.userId;
      console.debug(`Updating user email for registration ${registrationId}`);
      const { data: userData, error: userError } = await adminSupabaseClient.auth
        .admin.getUserById(userId);

      if (userError) {
        console.error("Failed to fetch user:", userError);
        // We don't return here because the registration is confirmed, even if email update fails
      } else if (userData && userData.user) {
        // Check if the user is anonymous
        // Should double-check this, as the user may have signed in since the registration was created
        const { data: authUpdateData, error: authUpdateError } = await adminSupabaseClient.auth.admin
          .updateUserById(userId, {
            email: result.email,
            email_confirm: true,
            // @ts-ignore -- this works, but Supabase needs to update their types
            is_anonymous: false,
          });
        if (authUpdateError) {
          console.error(
            "Failed to update user email:",
            authUpdateError,
          );
          // We don't return here because the registration is confirmed, even if email update fails
        } else {
          console.log("User email updated:", authUpdateData);
        }
      }
    }

    // Redirect to a confirmation success page
    const confirmationUrl = new URL("/registration-confirmed", request.url);
    confirmationUrl.searchParams.set("email", result.email);
    confirmationUrl.searchParams.set("userId", result.userId);
    confirmationUrl.searchParams.set("registrationId", registrationId);
    confirmationUrl.searchParams.set("emailSent", "true"); // Add this flag
    return NextResponse.redirect(confirmationUrl);
  } else {
    // Redirect to an error page with the error message
    const errorUrl = new URL("/registration-error", request.url);
    errorUrl.searchParams.set("error", result.error || "Unknown error");
    return NextResponse.redirect(errorUrl);
  }
}
