// File: app/api/auth/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const email = requestUrl.searchParams.get("email");
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");
  const ignoreOtpExpired = requestUrl.searchParams.get("ignoreOtpExpired") === "true";
  const redirectTo = requestUrl.searchParams.get("redirect_to") || "/";

  if (!token || !type) {
    return NextResponse.redirect("/error");
  }

  try {
    const supabase = await createClient();

    if (!email || !token) {
      console.error("Missing email or token");
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
    }

    // Now verify the OTP
    console.log("Verifying OTP for email:", email, "with token:", token);
    const { data, error } = await supabase.auth.verifyOtp({ 
      token_hash: token,
      type: 'email'
    });

    if (error) {
      if (error.message === "OTP expired" && ignoreOtpExpired) {
        console.log("OTP expired, but ignoring...");
      } else {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    if (data.user && data.session) {
      // Successfully verified and logged in
      // Set the session in a cookie
      const response = NextResponse.redirect(redirectTo);
      await supabase.auth.setSession(data.session);
      
      return response;
    } else {
      // Verification successful but no session created (unlikely scenario)
      return NextResponse.redirect(redirectTo);
    }
  } catch (error) {
    console.error("Unexpected error during OTP verification:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}