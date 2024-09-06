// File: app/api/magic-link/route.ts
import { sendSignInWithOtp } from "@/app/actions/email/sendSignIn";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const result = await sendSignInWithOtp(email, {
      redirectTo: `${hostUrl}/checkin`,
      shouldCreateUser: false,
    });

    if (!result.success) {
      throw new Error(result.error || "Unknown error occurred");
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorStr = JSON.stringify(error, Object.getOwnPropertyNames(error));
    console.error("Error sending magic link:", error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : errorStr,
        details: error,
      },
      { status: 500 },
    );
  }
}
