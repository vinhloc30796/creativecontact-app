// File: app/actions/email/sendSignIn.ts
import { generateOTP } from "@/utils/otp";
import { adminSupabaseClient } from "@/utils/supabase/server-admin";
import { resend } from "./utils";


export function sendSignInWithOtp(email: string, options?: {
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

      const confirmationURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?token=${linkData.properties.hashed_token}&email=${email}&type=magiclink&redirect_to=${options?.redirectTo || ""}`;

      return resend.emails.send({
        from: "Creative Contact <no-reply@creativecontact.vn>",
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
