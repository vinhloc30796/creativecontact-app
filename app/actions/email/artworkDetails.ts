// File: app/actions/email/artworkDetails.ts

"use server";

import { ArtworkUploadConfirmation } from "@/emails/templates/ArtworkUploadConfirmation";
import { getAdminSupabaseClient } from "@/utils/supabase/server-admin";
import { render } from "@react-email/components";
import React from "react";
import { resend } from "./utils";

export async function sendArtworkUploadConfirmationEmail(
  email: string,
  uploaderName: string,
  artworkTitle: string,
  eventSlug: string
) {
  const confirmationURL = `${process.env.NEXT_PUBLIC_APP_URL}/${eventSlug}`;
  let confirmationLink: string;

  try {
    const adminSupabaseClient = await getAdminSupabaseClient();
    const linkResponse = await adminSupabaseClient.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        data: {
          shouldCreateUser: false,
        },
        redirectTo: confirmationURL,
      },
    });

    if (linkResponse.error) {
      console.error("Magic link generation failed:", linkResponse.error);
      throw new Error("Failed to generate magic link");
    }

    const linkData = linkResponse.data;
    const escapedEmail = encodeURIComponent(email);
    confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?token=${linkData.properties.hashed_token}&email=${escapedEmail}&ignoreOtpExpired=true&type=magiclink&redirect_to=${confirmationURL}`;

    // Send email
    const component = React.createElement(ArtworkUploadConfirmation, {
      confirmationUrl: confirmationLink,
      uploaderName: uploaderName || "Creative artist",
      artworkTitle: artworkTitle,
    });
    const emailResponse = await resend.emails.send({
      from: "Creative Contact <no-reply@creativecontact.vn>",
      to: email,
      subject: "Confirm Your Artwork Upload",
      react: component,
      text: await render(component, { plainText: true }),
    });

    console.log("Artwork upload confirmation email sent:", emailResponse);
    return {
      success: true,
      email: email,
      error: null,
    };
  } catch (error) {
    console.error("Error in sendArtworkUploadConfirmationEmail:", error);
    return {
      success: false,
      error: error,
    };
  }
}
