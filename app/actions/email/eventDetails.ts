// File: app/actions/email/eventDetails.ts
"use server";

import { EventRegistration } from "@/app/types/EventRegistration";
import { EventSlot } from "@/app/types/EventSlot";
import { eventSlots } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { dateFormatter, timeslotFormatter } from "@/lib/timezones";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { generateICSFile, resend } from "./utils";

export async function sendEventDetailsEmail(
  to: string,
  registration: EventRegistration,
  slot: EventSlot,
) {
  console.log(
    "Sending event details email with registration details:",
    registration,
    "slot details: ",
    slot,
  );
  const icsData = await generateICSFile(slot);
  // console.debug("Generated ICS file:", icsData);
  const qr = await QRCode.toDataURL(registration.id);
  const dateStr = dateFormatter.format(new Date(slot.time_start));
  const timeStartStr = timeslotFormatter.format(new Date(slot.time_start));
  const timeEndStr = timeslotFormatter.format(new Date(slot.time_end));
  const emailContent = `
    <h1>Your Event Registration Details</h1>
    <p>Here are the details of your event registration:</p>
    <ul>
      <li>Name: ${registration.name}</li>
      <li>Email: ${registration.email}</li>
      <li>Phone: ${registration.phone}</li>
      <li>Event Date: ${dateStr}</li>
      <li>Event Time: ${timeStartStr} - ${timeEndStr}</li>
    </ul>
    <p>Your QR Code:</p>
    <img src="${qr}" alt="Registration QR Code" />`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Creative Contact <no-reply@creativecontact.vn>",
      to: [to],
      subject: "Your Event Registration Details",
      html: emailContent,
      attachments: [{ content: icsData, filename: "event.ics" }],
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

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
    slots.map((r) => (r as EventSlot))[0],
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
