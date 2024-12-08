import getUserStorageUsage from "@/lib/server_action/get_user_storage_usage";
import { NextResponse } from "next/server";

export async function GET() {
  const rs = await getUserStorageUsage()
  if (rs.error) {
    return NextResponse.json({ error: rs.error.message }, { status: 500 })
  }
  return NextResponse.json(rs)
}