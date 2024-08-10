// File: app/actions/email.ts

"use server";

// import { EventSlot } from "@/app/(public)/(event)/register/_sections/types";
import { EventSlot } from "@/app/types/EventSlot";
import { generateOTP } from "@/utils/otp";
import { adminSupabaseClient } from "@/utils/supabase/server-admin";
import { createEvent } from "ics";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

function generateICSFile(slotData: EventSlot): Promise<string> {
  return new Promise((resolve, reject) => {
    const startDate = new Date(slotData.timeStart);
    const endDate = new Date(slotData.timeEnd);

    // Adjust for UTC+7
    const utcOffset = 7 * 60; // 7 hours in minutes
    startDate.setMinutes(startDate.getMinutes() + utcOffset);
    endDate.setMinutes(endDate.getMinutes() + utcOffset);

    const event = {
      start: [
        startDate.getUTCFullYear(),
        startDate.getUTCMonth() + 1,
        startDate.getUTCDate(),
        startDate.getUTCHours(),
        startDate.getUTCMinutes(),
      ],
      end: [
        endDate.getUTCFullYear(),
        endDate.getUTCMonth() + 1,
        endDate.getUTCDate(),
        endDate.getUTCHours(),
        endDate.getUTCMinutes(),
      ],
      title: "Hoàn Tất",
      description: "Thank you for registering for our event!",
      location: "Event Location",
      url: "https://youreventwebsite.com",
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

async function sendConfirmationRequestEmail(email: string, signature: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Creative Contact <no-reply@bangoibanga.com>",
      to: email,
      subject: "Confirm Your Event Registration",
      html: `
          <p>Please confirm your registration by clicking on this link:</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/confirm-registration?signature=${signature}">Confirm Registration</a></p>
          <p>This will also confirm your email (<a href=mailto:${email}>${email}</a>) as the contact address for this registration.</p>`,
    });

    if (error) {
      console.error("Error sending confirmation request email:", error);
    } else {
      console.log("Confirmation request email sent:", data);
    }
  } catch (error) {
    console.error(
      "Unexpected error sending confirmation request email:",
      error,
    );
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
    const dateStr = new Date(slotData.timeStart).toLocaleDateString();
    const timeStartStr = new Date(slotData.timeStart).toLocaleTimeString();
    const timeEndStr = new Date(slotData.timeEnd).toLocaleTimeString();
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
        `Confirmation email with ICS sent for slot ${slotData.id}: ${data}`,
      );
    }
  } catch (error) {
    console.error(
      "Unexpected error sending confirmation email with ICS:",
      error,
    );
  }
}

async function sendSignInWithOtp(email: string, options?: {
  shouldCreateUser?: boolean;
  redirectTo?: string;
  data?: Record<string, any>;
}) {
  try {
    // Generate OTP
    const otp = generateOTP(); // Implement this function to generate a 6-digit OTP
    const { data: linkData, error: linkError } = await adminSupabaseClient.auth
      .admin.generateLink({
        type: "magiclink",
        email: email,
        options: {
          data: { ...options?.data, otp },
          redirectTo: options?.redirectTo,
        },
      });
    if (linkError) throw linkError;

    console.log("Magic link confirmation URL:", linkData);

    // Construct confirmation URL that goes through your Next.js app
    const confirmationURL =
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?token=${linkData.properties.hashed_token}&email=${email}&type=magiclink&redirect_to=${
        options?.redirectTo || ""
      }`;

    // Send custom email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
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

    if (emailError) {
      console.error("Error sending custom magic link email:", emailError);
      throw emailError;
    }

    console.log("Custom magic link email sent:", emailData);

    // Store OTP in Supabase for verification (you might want to encrypt this)
    const { error: storeError } = await adminSupabaseClient
      .from("otp_storage")
      .insert({
        email,
        otp,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      }); // OTP expires in 15 minutes

    if (storeError) throw storeError;

    return { data: { user: null, session: null }, error: null };
  } catch (error) {
    console.error("Error in sendSignInWithOtp:", error);
    return { data: { user: null, session: null }, error };
  }
}

export {
  generateICSFile,
  sendConfirmationEmailWithICSAndQR,
  sendConfirmationRequestEmail,
  sendSignInWithOtp,
};
