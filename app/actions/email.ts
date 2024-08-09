"use server";

import { EventSlot } from "@/app/(public)/(event)/register/_sections/types";
import { createEvent } from "ics";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

function generateICSFile(slotData: EventSlot): Promise<string> {
  return new Promise((resolve, reject) => {
    const startDate = new Date(slotData.time_start);
    const endDate = new Date(slotData.time_end);

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
      from: "Creative Contact <no-reply@creativecontact.vn>",
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
    const icsData = await generateICSFile(slotData);

    const { data, error } = await resend.emails.send({
      from: "Creative Contact <no-reply@bangoibanga.com>",
      to: email,
      subject: "Your Event Registration is Confirmed",
      html: `
                  <h1>Your registration is confirmed!</h1>
                  <p>Event details:</p>
                  <ul>
                      <li>Date: ${
        new Date(slotData.time_start).toLocaleDateString()
      }</li>
                      <li>Time: ${
        new Date(slotData.time_start).toLocaleTimeString()
      } - ${new Date(slotData.time_end).toLocaleTimeString()}</li>
                  </ul>
                  <img src="${qrCodeDataURL}" alt="Registration QR Code" />
              `,
      attachments: [
        {
          content: icsData,
        },
      ],
    });

    if (error) {
      console.error("Error sending confirmation email with ICS:", error);
    } else {
      console.log("Confirmation email with ICS sent:", data);
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
};
