// File: app/actions/email/registration.ts
"use server";

import { EventSlot } from "@/app/types/EventSlot";
import { dateFormatter, timeslotFormatter } from "@/lib/timezones";
import { generateOTP } from "@/utils/otp";
import { adminSupabaseClient } from "@/utils/supabase/server-admin";
import QRCode from "qrcode";
import { generateICSFile, resend } from "./utils";

export async function sendConfirmationRequestEmail(
  email: string,
  signature: string,
) {
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
      from: "Creative Contact <no-reply@creativecontact.vn>",
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

export async function sendConfirmationEmailWithICSAndQR(
  email: string,
  slotData: EventSlot,
  registrationId: string,
) {
  try {
    // Prep vars
    const dateStr = dateFormatter.format(new Date(slotData.time_start));
    const timeStartStr = timeslotFormatter.format(
      new Date(slotData.time_start),
    );
    const timeEndStr = timeslotFormatter.format(
      new Date(slotData.time_end),
    );
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
      from: "Creative Contact <no-reply@creativecontact.vn>",
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
