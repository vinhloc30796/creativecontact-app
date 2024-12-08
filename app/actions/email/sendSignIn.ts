// File: app/actions/email/sendSignIn.ts
import React from "react";
import { generateOTP } from "@/utils/otp";
import { getAdminSupabaseClient } from "@/utils/supabase/server-admin";
import { resend } from "./utils";
import { SignInEmail } from "@/emails/templates/SignInEmail";
import { render } from "@react-email/components";

export async function sendSignInWithOtp(
  email: string,
  options?: {
    shouldCreateUser?: boolean;
    redirectTo?: string;
    data?: Record<string, any>;
  },
) {
  const adminSupabaseClient = await getAdminSupabaseClient();
  const otp = generateOTP();
  let linkData: any;

  return adminSupabaseClient.auth.admin
    .generateLink({
      type: "magiclink",
      email: email,
      options: {
        data: { ...options?.data, otp },
        redirectTo: options?.redirectTo,
      },
    })
    .then(async (response) => {
      if (response.error) throw response.error;
      linkData = response.data;
      console.log("Magic link confirmation URL:", linkData);

      const redirectToParam = options?.redirectTo
        ? `&redirect_to=${options.redirectTo}`
        : "";
      const escapedEmail = encodeURIComponent(email);
      const confirmationURL =
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?token=${linkData.properties.hashed_token}&email=${escapedEmail}&type=magiclink` +
        redirectToParam;

      // using for debugging
      console.log("Confirmation URL:", confirmationURL);

      const component = React.createElement(SignInEmail, {
        otp,
        confirmationURL,
      });

      return resend.emails.send({
        from: "Creative Contact <no-reply@creativecontact.vn>",
        to: email,
        subject: "Your Magic Link for Event Check-In",
        react: component,
        text: await render(component, { plainText: true }),
      });
    })
    .then((emailData) => {
      if (emailData.error) throw emailData.error;
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
