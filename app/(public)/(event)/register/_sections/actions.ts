// File: app/(public)/(event)/register/_sections/actions.ts

"use server";

import {
  sendConfirmationEmailWithICSAndQR,
  sendConfirmationRequestEmail,
} from "@/app/actions/email";
import { EventRegistration } from "@/app/types/EventRegistration";
import { RegistrationConfirm } from "@/app/types/RegistrationConfirm";
import {
  authUsers,
  eventRegistrations,
  eventSlots,
  ExperienceType,
  IndustryType,
  userInfos,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { adminSupabaseClient } from "@/utils/supabase/server-admin";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { Resend } from "resend";
import {
  // EventRegistration,
  EventRegistrationWithSlot,
  FormData,
} from "./types";
import { generateOTP } from "@/utils/otp";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function getRegistrationsForSlots(
  slotIds: string[],
): Promise<EventRegistration[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("event_registrations").select(
    "*",
  ).in("slot", slotIds).in("status", ["confirmed", "pending"]);
  // Return or error
  if (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }
  return data as EventRegistration[];
}

export async function signInAnonymously() {
  const cookieStore = cookies();
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInAnonymously();
  // Return or error
  if (error) {
    console.error("Error signing in anonymously:", error);
    return null;
  }
  return data.user;
}

export async function confirmRegistration(signature: string): Promise<RegistrationConfirm> {
  const supabase = createClient();

  // Start a transaction
  const { data: registration, error: fetchError } = await supabase.from(
    "event_registrations",
  ).select("*").eq("id", signature).single();
  if (fetchError) {
    console.error("Failed to fetch registration:", fetchError);
    return { success: false, error: "Failed to fetch registration" };
  }
  if (!registration) {
    return { success: false, error: "Registration not found" };
  }
  if (registration.status === "confirmed") {
    return { success: false, error: "Registration already confirmed" };
  }

  // Update the registration status
  const { error: updateError } = await supabase.from("event_registrations")
    .update({ status: "confirmed" }).eq("id", signature);
  if (updateError) {
    console.error("Failed to confirm registration:", updateError);
    return { success: false, error: "Failed to confirm registration" };
  }

  // Store the user ID and email for later use
  let userId = registration.created_by;
  let email: string = registration.email;

  // Check if user email already exists
  const { data: existingUser, error: existingUserError } =
    await adminSupabaseClient.rpc(
      "get_user_id_by_email",
      { email: email },
    );

  if (
    existingUser
    // existingUser is a string
    && typeof existingUser === "string"
  ) {
    console.log(`An account with email ${email} already exists, userId is`, existingUser);
    return db.update(eventRegistrations)
    .set({created_by: existingUser})
    .where(eq(eventRegistrations.id, signature))
    .then((result) => {
      console.log(`Updated registration ${signature} with userId ${existingUser}`);
      return { success: true as const, email: email, userId: existingUser };
    })
    .catch((error) => {
      console.error(`Failed to update registration ${signature} with userId ${existingUser}:`, error);
      return { success: false as const, error: "Email already in use & failed to update registration" };
    })
  } else if (existingUserError) {
    console.error("Error checking for existing user:", existingUserError);
    return { success: false, error: "Error checking email availability" };
  } else if (userId) {
    // Update the user's email after registration confirmation
    console.debug(`Updating user email for registration ${signature}`);
    const { data: userData, error: userError } = await adminSupabaseClient.auth
      .admin.getUserById(userId);

    if (userError) {
      console.error("Failed to fetch user:", userError);
      // We don't return here because the registration is confirmed, even if email update fails
    } else if (userData && userData.user) {
      // Check if the user is anonymous
      // Should double-check this, as the user may have signed in since the registration was created
      if (userData.user.email === null || userData.user.email === "") {
        const { error: authUpdateError } = await adminSupabaseClient.auth.admin
          .updateUserById(userId, {
            email: email,
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
        }
      }
    }
  }

  return {
    success: true,
    email: email,
    userId: userId,
  };
}

export async function checkExistingRegistration(
  email: string,
): Promise<EventRegistrationWithSlot | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      `
      *,
      event_slot:event_slots(*)
    `,
    )
    .eq("email", email)
    .eq("status", "confirmed")
    .order("created_at", { ascending: false })
    .limit(1);
  // Return or error
  if (error) {
    console.error("Error checking existing registration:", error);
    return null;
  }
  return data[0] || null;
}

interface RegistrationResult {
  success: boolean;
  data?: any;
  error?: string;
  status: "confirmed" | "pending";
}

export async function createRegistration(
  formData: FormData & {
    created_by: string | null;
    is_anonymous: boolean;
    existingRegistrationId?: string;
  },
): Promise<RegistrationResult> {
  const existingRegistration = await checkExistingRegistration(formData.email);
  const isAnonymous: boolean = formData.is_anonymous;
  const status = isAnonymous ? "pending" : "confirmed";

  try {
    const dbResult: any = await db.transaction(async (tx) => {
      let registrationResult: EventRegistration;

      if (existingRegistration) {
        // Update existing registration
        const updateResult = await tx.update(eventRegistrations)
          .set({
            slot: formData.slot,
            email: formData.email,
            name: `${formData.lastName} ${formData.firstName}`,
            phone: formData.phone,
            status: status,
          })
          .where(eq(eventRegistrations.id, existingRegistration.id))
          .returning();
        registrationResult = updateResult.map((r) => ({
          ...r,
          // map id
          id: r.id as `${string}-${string}-${string}-${string}-${string}`,
          created_by: r
            .created_by as `${string}-${string}-${string}-${string}-${string}`,
          slot: r.slot as `${string}-${string}-${string}-${string}-${string}`,
        }))[0];
      } else {
        // Insert new registration
        const name: string = `${formData.lastName} ${formData.firstName}`;
        const slot: string = formData.slot;
        // @ts-ignore
        const insertResult = await tx.insert(eventRegistrations)
          // @ts-ignore
          .values({
            slot: slot,
            email: formData.email,
            name: name,
            phone: formData.phone,
            created_by: formData.created_by,
            status: status,
          })
          .returning();
        registrationResult =
          insertResult.map((r) => (r as EventRegistration))[0];
      }

      // Update auth.users -- set isAnonymous to false if the user is no longer anonymous
      await tx.update(authUsers)
        .set({ isAnonymous: isAnonymous })
        // @ts-ignore
        .where(eq(authUsers.id, formData.created_by));

      return { success: true, registrationResult, status };
    });

    // Handle emails after the DB transaction
    if (isAnonymous) {
      // Ask the user to confirm their email
      await sendConfirmationRequestEmail(
        formData.email,
        dbResult.registrationResult.id,
      );
      return { success: true, data: "sendConfirmationRequestEmail", status };
    } else {
      // Generate a QR code for the registration
      const slotData = await db.select()
        .from(eventSlots)
        .where(eq(eventSlots.id, formData.slot));
      // Send confirmation email with ICS file and QR code
      await sendConfirmationEmailWithICSAndQR(
        formData.email,
        {
          id: dbResult.registrationResult.id,
          created_at: slotData[0].created_at,
          time_start: slotData[0].time_start,
          time_end: slotData[0].time_end,
          capacity: slotData[0].capacity,
          event: slotData[0]
            .event as `${string}-${string}-${string}-${string}-${string}`,
        },
        dbResult.registrationResult.id,
      );
      return {
        success: true,
        data: "sendConfirmationEmailWithICSAndQR",
        status,
      };
    }
  } catch (error) {
    console.error("Error handling registration:", error);
    return { success: false, error: (error as Error).message, status };
  }
}

export async function cancelExpiredRegistrations() {
  const supabase = createClient();

  try {
    await supabase.rpc("cancel_expired_registrations");
    return { success: true };
  } catch (error) {
    console.error("Error cancelling expired registrations:", error);
    return {
      success: false,
      error: "Failed to cancel expired registrations",
    };
  }
}

export async function writeUserInfo(
  userId: string,
  professionalInfo: {
    industries: IndustryType[];
    experience: ExperienceType;
    field: string;
  },
) {
  try {
    const result = await db
      .insert(userInfos)
      .values({
        id: userId as any, // Type assertion to bypass strict type checking
        industries: professionalInfo.industries as any[], // Type assertion for array
        experience: professionalInfo.experience,
        field: professionalInfo.field,
      })
      .onConflictDoUpdate({
        target: userInfos.id,
        set: {
          industries: professionalInfo.industries as any[], // Type assertion for array
          experience: professionalInfo.experience,
          field: professionalInfo.field,
        },
      })
      .returning();

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error writing user info:", error);
    return { success: false, error: (error as Error).message };
  }
}
