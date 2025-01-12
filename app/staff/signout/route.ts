import { logoutStaff } from "@/app/actions/auth/staff";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST() {
  const result = await logoutStaff();

  if (result.error) {
    console.error('/staff/signout: error', result.error)
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Handle successful logout
  console.debug('/staff/signout: redirecting to /staff/login')
  redirect('/staff/login');
}
