// File: app/actions/email/eventDetails.ts
"use server";

import { EventRegistration } from "@/app/types/EventRegistration";
import { EventSlot } from "@/app/types/EventSlot";
import { eventSlots } from "@/drizzle/schema/event";
import { EventDetailsEmail } from "@/emails/templates/EventDetailsEmail";
import { db } from "@/lib/db";
import { dateFormatter, timeslotFormatter } from "@/lib/timezones";
import { createClient } from "@/utils/supabase/server";
import { render } from "@react-email/components";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import React from "react";
import { generateICSFile, resend } from "./utils";

export async function sendEventDetailsEmail(
  to: string,
  registration: EventRegistration,
  slot: EventSlot,
) {
  try {
    const icsData = await generateICSFile(slot);
    const qrCodeUrl = await QRCode.toDataURL(registration.id, {
      width: 300,
      errorCorrectionLevel: "H",
      color: { dark: "#F27151" },
    });
    const dateStr = dateFormatter.format(new Date(slot.time_start));
    const timeStartStr = timeslotFormatter.format(new Date(slot.time_start));
    const timeEndStr = timeslotFormatter.format(new Date(slot.time_end));

    // Send email
    const component: React.ReactNode = React.createElement(EventDetailsEmail, {
      name: registration.name,
      email: registration.email,
      phone:
        registration.phone_number
          ? `${registration.phone_country_code}${registration.phone_number}`
          : "N/A",
      eventDate: dateStr,
      eventTime: `${timeStartStr} - ${timeEndStr}`,
      qrCodeUrl: qrCodeUrl,
    });
    const { data, error } = await resend.emails.send({
      from: "Creative Contact <no-reply@creativecontact.vn>",
      to: [to],
      subject: "Your Event Registration Details",
      react: component,
      attachments: [{ content: icsData, filename: "event.ics" }],
      text: await render(component, { plainText: true }),
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
  const supabase = await createClient();

  try {
    const { data: registrations, error } = await supabase
      .from("event_registrations")
      .select("*")
      .or(`email.eq.${identifier},phone.eq.${identifier}`)
      .eq("status", "confirmed")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    if (registrations.length === 0) {
      // Don't reveal that no registration was found
      return { success: true };
    }

    const registration = registrations[0];

    const slots = await db.select()
      .from(eventSlots)
      .where(eq(eventSlots.id, registration.slot));

    await sendEventDetailsEmail(
      registration.email,
      registration,
      slots.map((r) => (r as EventSlot))[0],
    );

    return { success: true };
  } catch (error) {
    console.error("Error in sendForgotEmail:", error);
    return {
      success: false,
      error: "An error occurred while processing your request",
    };
  }
}
