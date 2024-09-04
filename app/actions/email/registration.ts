// File: app/actions/email/registration.ts
"use server";

import { EventSlot } from "@/app/types/EventSlot";
import { dateFormatter, timeslotFormatter } from "@/lib/timezones";
import { generateOTP } from "@/utils/otp";
import { getAdminSupabaseClient } from "@/utils/supabase/server-admin";
import QRCode from "qrcode";
import { generateICSFile, resend } from "./utils";
import { ConfirmationRequest } from "@/emails/templates/ConfirmationRequest";
import { ConfirmationWithICS } from "@/emails/templates/ConfirmationWithICS";
import React from "react";
import { render } from "@react-email/components";

export async function sendConfirmationRequestEmail(
  email: string,
  participantName: string,
  eventDate: string,
  eventTime: string,
  signature: string,
) {
  const registrationURL =
    `${process.env.NEXT_PUBLIC_APP_URL}/api/confirm-registration?signature=${signature}`;
  const otp = generateOTP();
  let linkData: any;
  let confirmationURL: string;

  try {
    const adminSupabaseClient = await getAdminSupabaseClient();
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
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?token=${linkData.properties.hashed_token}&email=${email}&ignoreOtpExpired=true&type=magiclink&redirect_to=${registrationURL}`;
    }

    // Send email
    const component = React.createElement(ConfirmationRequest, {
      confirmationUrl: confirmationURL,
      participantName: participantName || "Creative friend",
      eventDate: eventDate,
      eventTime: eventTime,
    });
    const emailResponse = await resend.emails.send({
      from: "Creative Contact <no-reply@creativecontact.vn>",
      to: email,
      subject: "Confirm Your Event Registration",
      react: component,
      text: await render(component, { plainText: true }),
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
  registrationName: string,
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
      color: { dark: "#F27151" },
    });
    const qrCodeBuffer = Buffer.from(qrCodeBase64.split(",")[1], "base64");
    const qrCodeUrl =
      `https://api.qrserver.com/v1/create-qr-code/?data=${registrationId}&size=300x300&color=f27151&ecc=H`;

    // Send email
    const component = React.createElement(ConfirmationWithICS, {
      participantName: registrationName || "Creative friend",
      eventDate: dateStr,
      eventTime: `${timeStartStr} - ${timeEndStr}`,
      qrCodeUrl: qrCodeUrl,
    });
    const { data, error } = await resend.emails.send({
      from: "Creative Contact <no-reply@creativecontact.vn>",
      to: email,
      subject: "Your Event Registration is Confirmed",
      react: component,
      text: await render(component, { plainText: true }),
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
