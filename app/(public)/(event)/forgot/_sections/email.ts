// File: app/(public)/(event)/forgot/_sections/email.ts
import { EventRegistration } from "@/app/types/EventRegistration";
import { EventSlot } from "@/app/types/EventSlot";
import { Resend } from "resend";
import QRCode from "qrcode";
import { generateICSFile } from "@/app/actions/email";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function sendEventDetailsEmail(
  to: string,
  registration: EventRegistration,
  slot: EventSlot,
) {
  console.log("Sending event details email with registration details:", registration, "slot details: ", slot);
  const icsData = await generateICSFile(slot);
  // console.debug("Generated ICS file:", icsData);
  const qr = await QRCode.toDataURL(registration.id);
  const dateStr = new Date(slot.time_start).toLocaleDateString();
  const timeStartStr = new Date(slot.time_start).toLocaleTimeString();
  const timeEndStr = new Date(slot.time_end).toLocaleTimeString();
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
