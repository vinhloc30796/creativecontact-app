// app/forgot/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { sendEventDetailsEmail } from "./email";
import { EventSlot } from "@/app/types/EventSlot";
import { db } from "@/lib/db";
import { eventSlots } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { Row } from "react-day-picker";

export async function sendForgotEmail(identifier: string) {
  const supabase = createClient();

  // Search for the registration
  const { data: registrations, error } = await supabase
    .from("event_registrations")
    .select("*")
    .or(`email.eq.${identifier},phone.eq.${identifier}`)
    .eq("status", "confirmed")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching registration:", error);
    return {
      success: false,
      error: "An error occurred while fetching the registration",
    };
  }

  if (registrations.length === 0) {
    // Don't reveal that no registration was found
    return { success: true };
  }

  const registration = registrations[0];

  // Fetch the associated event slot
  const slots = await db.select()
    .from(eventSlots)
    .where(eq(eventSlots.id, registration.slot));
  // Send the email
  return await sendEventDetailsEmail(
    registration.email,
    registration,
    slots.map((r) => ({
      ...r,
      id: r.id as `${string}-${string}-${string}-${string}-${string}`,
      event: r.event as `${string}-${string}-${string}-${string}-${string}`,
    }))[0],
  ).then((data) => {
    console.log("Email sent:", data);
    return { success: true };
  }).catch((error) => {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: "An error occurred while sending the email",
    };
  });
}
