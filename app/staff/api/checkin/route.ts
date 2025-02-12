// File: app/staff/api/checkin/route.ts

import { performCheckin } from "@/lib/checkin";
import { validateStaffAccess } from "@/utils/middleware/staff-access";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the schema for input validation
const checkinSchema = z.object({
  id: z.string().uuid(),
});

export const POST = async (request: Request) => {
  // const validation = await validateStaffAccess(request);

  // if (!validation.isValid) {
  //   return NextResponse.json(
  //     { error: validation.error?.message },
  //     { status: validation.error?.status }
  //   );
  // }

  try {
    const user = (request as any).user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

    // Validate the input
    const body = await request.json();
    const { id } = checkinSchema.parse(body);

    // Perform the check-in
    const result = await performCheckin(id, userId);

    if (!result.success || !result.data) {
      console.error("Check-in failed:", result.error || "No data returned");
      return NextResponse.json(
        {
          error: result.error || "Check-in failed",
          errorCode: result.errorCode,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      status: result.data.status,
      message: "Check-in successful",
      id: result.data.id,
      name: result.data.name,
      email: result.data.email,
      phone: `${result.data.phone_country_code}${result.data.phone_number}`,
    });
  } catch (error) {
    console.error("Unexpected error during check-in:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred during check-in",
        errorCode: "UNEXPECTED_ERROR",
      },
      { status: 500 },
    );
  }
};
