// File: app/api/magic-link/route.ts
import { sendSignInWithOtp } from "@/app/actions/email";
import { NextRequest, NextResponse } from "next/server";

export function POST(req: NextRequest) {
  return req.json()
    .then(({ email }) => {
      const hostUrl = process.env.NEXT_PUBLIC_HOST_URL ||
        "http://localhost:3000";
      return sendSignInWithOtp(email, {
        redirectTo: `${hostUrl}/checkin`,
        shouldCreateUser: false,
      });
    })
    .then((result) => {
      if (!result.success) {
        throw new Error(result.error || "Unknown error occurred");
      }
      return NextResponse.json({ success: true });
    })
    .catch((error) => {
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
    });
}
