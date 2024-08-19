// File: app/actions/email.ts
"use server";

import { EventRegistration } from "@/app/types/EventRegistration";
import { EventSlot } from "@/app/types/EventSlot";
import { eventSlots } from "@/drizzle/schema";
import { TIMEZONE } from "@/lib/constants";
import { db } from "@/lib/db";
import { generateOTP } from "@/utils/otp";
import { createClient } from "@/utils/supabase/server";
import { adminSupabaseClient } from "@/utils/supabase/server-admin";
import { eq } from "drizzle-orm";
import { createEvent } from "ics";
import QRCode from "qrcode";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

function generateICSFile(slotData: EventSlot): Promise<string> {
  return new Promise((resolve, reject) => {
    const event = {
      start: [
        slotData.time_start.getUTCFullYear(),
        slotData.time_start.getUTCMonth() + 1,
        slotData.time_start.getUTCDate(),
        slotData.time_start.getUTCHours(),
        slotData.time_start.getUTCMinutes(),
      ],
      end: [
        slotData.time_end.getUTCFullYear(),
        slotData.time_end.getUTCMonth() + 1,
        slotData.time_end.getUTCDate(),
        slotData.time_end.getUTCHours(),
        slotData.time_end.getUTCMinutes(),
      ],
      // Event information
      title: "Hoàn Tất Project",
      description: "Dự án độc đáo kêu gọi các bạn thực hành sáng tạo và nghệ thuật trao đổi và hoàn thành tác phẩm dang dở, kết hợp với Neo-",
      organizer: { name: "Creative Contact", email: "no-reply@creativecontact.vn" },
      // Geo
      location: "NEO-, 393/7 Hai Bà Trưng, Phường 8, Quận 3, Hồ Chí Minh, Vietnam",
      geo: { lat: 10.790062, lon: 106.688437 },
      // Other information
      url: "https://creativecontact.vn",
      status: "CONFIRMED" as const,
      busyStatus: "BUSY" as const,
      alarms: [
        {
          action: "display",
          description: "Reminder: Hoàn Tất is starting in 1 day",
          trigger: { hours: 24, minutes: 0, before: true },
        },
        {
          action: "display",
          description: "Reminder: Hoàn Tất is starting in 1 hour",
          trigger: { hours: 1, minutes: 0, before: true },
        },
      ],
      // Explicitly set the timezone
      startInputType: "utc",
      startOutputType: "utc",
      endInputType: "utc",
      endOutputType: "utc",
    };

    createEvent(event as any, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}

function sendSignInWithOtp(email: string, options?: {
  shouldCreateUser?: boolean;
  redirectTo?: string;
  data?: Record<string, any>;
}) {
  const otp = generateOTP();
  let linkData: any;

  return adminSupabaseClient.auth.admin.generateLink({
    type: "magiclink",
    email: email,
    options: {
      data: { ...options?.data, otp },
      redirectTo: options?.redirectTo,
    },
  })
    .then((response) => {
      if (response.error) throw response.error;
      linkData = response.data;
      console.log("Magic link confirmation URL:", linkData);

      const confirmationURL =
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?token=${linkData.properties.hashed_token}&email=${email}&type=magiclink&redirect_to=${
          options?.redirectTo || ""
        }`;

      return resend.emails.send({
        from: "Creative Contact <no-reply@bangoibanga.com>",
        to: email,
        subject: "Your Magic Link for Event Check-In",
        html: `
        <h1>Welcome to our Event!</h1>
        <p>Here's your one-time password: <strong>${otp}</strong></p>
        <p>Or click the link below to sign in and complete your check-in:</p>
        <p><a href="${confirmationURL}">Sign In to Check-In</a></p>
        <p>If you didn't request this email, please ignore it.</p>
      `,
      });
    })
    .then((emailData) => {
      console.log("Custom magic link email sent:", emailData);
      return {
        success: true,
        email: email,
        error: null,
      };
    })
    .catch((error) => {
      console.error("Error in sendSignInWithOtp:", error);
      return {
        success: false,
        error: error,
      };
    });
}

async function sendConfirmationRequestEmail(email: string, signature: string) {
  const registrationURL =
    `${process.env.NEXT_PUBLIC_APP_URL}/api/confirm-registration?signature=${signature}`;
  const otp = generateOTP();
  let linkData: any;
  let confirmationURL: string;

  try {
    const linkResponse = await adminSupabaseClient.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        data: {
          shouldCreateUser: false,
          otp,
        },
        redirectTo: registrationURL,
      },
    });

    if (linkResponse.error) {
      console.warn("Magic link generation failed:", linkResponse.error);
      // Fallback to a direct confirmation URL without the magic link
      confirmationURL =
        `${process.env.NEXT_PUBLIC_APP_URL}/api/confirm-registration?signature=${signature}&email=${email}`;
    } else {
      linkData = linkResponse.data;
      console.log("Magic link confirmation URL:", linkData);
      confirmationURL =
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?token=${linkData.properties.hashed_token}&email=${email}&type=magiclink&redirect_to=${registrationURL}`;
    }

    const emailResponse = await resend.emails.send({
      from: "Creative Contact <no-reply@bangoibanga.com>",
      to: email,
      subject: "Confirm Your Event Registration",
      html: `
        <p>Please confirm your registration by clicking on this link:</p>
        <p><a href="${confirmationURL}">Confirm Registration</a></p>
        <p>This will also sign you in & confirm your email (<a href=mailto:${email}>${email}</a>) as the contact address for this registration.</p>`,
    });

    console.log("Confirmation request email sent:", emailResponse);
    return {
      success: true,
      email: email,
      error: null,
    };
  } catch (error) {
    console.error("Error in sendConfirmationRequestEmail:", error);
    return {
      success: false,
      error: error,
    };
  }
}

async function sendConfirmationEmailWithICSAndQR(
  email: string,
  slotData: EventSlot,
  registrationId: string,
) {
  try {
    // Prep vars
    const dateStr = new Date(slotData.time_start).toLocaleDateString(TIMEZONE);
    const timeStartStr = new Date(slotData.time_start).toLocaleTimeString(TIMEZONE);
    const timeEndStr = new Date(slotData.time_end).toLocaleTimeString(TIMEZONE);
    // Prep ICS file
    const icsData = await generateICSFile(slotData);
    // Generate QR code as a Buffer
    const qrCodeBase64 = await QRCode.toDataURL(registrationId, {
      width: 300,
      errorCorrectionLevel: "H",
    });
    const qrCodeBuffer = new Buffer(qrCodeBase64.split(",")[1], "base64");

    // Build email
    const emailContent = `<h1>Your registration is confirmed!</h1>
      <p>Event details:</p>
      <ul>
          <li>Date: ${dateStr}</li>
          <li>Time: ${timeStartStr} - ${timeEndStr}</li>
      </ul>
      <img src="${qrCodeBase64}" alt="Registration QR Code" />`;

    const { data, error } = await resend.emails.send({
      from: "Creative Contact <no-reply@bangoibanga.com>",
      to: email,
      subject: "Your Event Registration is Confirmed",
      html: emailContent,
      attachments: [
        { filename: "event.ics", content: icsData },
        { filename: "qr-code.png", content: qrCodeBuffer },
      ],
    });

    if (error) {
      console.error("Error sending confirmation email with ICS:", error);
    } else {
      console.log(
        `Confirmation email with ICS sent for slot ${slotData.id}: `,
        data,
      );
    }
  } catch (error) {
    console.error(
      "Unexpected error sending confirmation email with ICS:",
      error,
    );
  }
}

async function sendForgotEmail(identifier: string) {
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

async function sendEventDetailsEmail(
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
  const dateStr = new Date(slot.time_start).toLocaleDateString(TIMEZONE);
  const timeStartStr = new Date(slot.time_start).toLocaleTimeString(TIMEZONE);
  const timeEndStr = new Date(slot.time_end).toLocaleTimeString(TIMEZONE);
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
      from: "Creative Contact <no-reply@bangoibanga.com>",
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

export {
  generateICSFile,
  sendConfirmationEmailWithICSAndQR,
  sendConfirmationRequestEmail,
  sendEventDetailsEmail,
  sendForgotEmail,
  sendSignInWithOtp
};

