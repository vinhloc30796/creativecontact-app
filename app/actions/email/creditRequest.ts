"use server";

import { ArtworkCreditRequest } from "@/emails/templates/ArtworkCreditRequest";
import { getAdminSupabaseClient } from "@/utils/supabase/server-admin";
import { render } from "@react-email/components";
import React from "react";
import { resend } from "./utils";

export async function sendArtworkCreditRequestEmail(
  email: string,
  artistName: string,
  artworkTitle: string,
  eventSlug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminSupabaseClient = await getAdminSupabaseClient();
    const linkResponse = await adminSupabaseClient.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        data: {
          shouldCreateUser: true,
        },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/signup`,
      },
    });

    if (linkResponse.error) {
      console.error("Magic link generation failed:", linkResponse.error);
      throw new Error("Failed to generate magic link");
    }

    const linkData = linkResponse.data;
    const escapedEmail = encodeURIComponent(email);
    const claimAccountUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?token=${linkData.properties.hashed_token}&email=${escapedEmail}&ignoreOtpExpired=true&type=magiclink&redirect_to=${process.env.NEXT_PUBLIC_APP_URL}/signup`;

    const component = React.createElement(ArtworkCreditRequest, {
      claimAccountUrl,
      artistName,
      artworkTitle,
    });

    const emailResponse = await resend.emails.send({
      from: "Creative Contact <no-reply@creativecontact.vn>",
      to: email,
      subject: `Claim Credit for Your "${artworkTitle}" Artwork on Creative Contact`,
      react: component,
      text: await render(component, { plainText: true }),
    });

    console.log("Artwork credit request email sent:", emailResponse);
    return { success: true };
  } catch (error) {
    console.error("Error in sendArtworkCreditRequestEmail:", error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

