// File: app/actions/email.ts
"use server";

import { EventSlot } from "@/app/types/EventSlot";
import { generateOTP } from "@/utils/otp";
import { adminSupabaseClient } from "@/utils/supabase/server-admin";
import { createClient } from "@/utils/supabase/server";
import { createEvent } from "ics";
import { Resend } from "resend";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

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
      title: "Hoàn Tất",
      description: "Thank you for registering for our event!",
      location: "Event Location",
      url: "https://creativecontact.vn",
      status: "CONFIRMED" as const,
      busyStatus: "BUSY" as const,
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
  qrCodeDataURL: string,
) {
  try {
    // Prep vars
    const icsData = await generateICSFile(slotData);
    const dateStr = new Date(slotData.time_start).toLocaleDateString();
    const timeStartStr = new Date(slotData.time_start).toLocaleTimeString();
    const timeEndStr = new Date(slotData.time_end).toLocaleTimeString();
    // Build email
    const emailContent = `<h1>Your registration is confirmed!</h1>
      <p>Event details:</p>
      <ul>
          <li>Date: ${dateStr}</li>
          <li>Time: ${timeStartStr} - ${timeEndStr}</li>
      </ul>
      <img src="${qrCodeDataURL}" alt="Registration QR Code" />`;
    const { data, error } = await resend.emails.send({
      from: "Creative Contact <no-reply@bangoibanga.com>",
      to: email,
      subject: "Your Event Registration is Confirmed",
      html: emailContent,
      attachments: [{ content: icsData, filename: "event.ics" }],
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

export {
  generateICSFile,
  sendConfirmationEmailWithICSAndQR,
  sendConfirmationRequestEmail,
  sendSignInWithOtp,
};
