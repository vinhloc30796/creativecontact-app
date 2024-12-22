import getServerSideUser from "@/lib/getServerSideUser";
import { NextResponse } from "next/server";
import { getUserDataUsage } from "./helper";

export async function GET() {
  const user = await getServerSideUser()
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const rs = await getUserDataUsage(user.id)
  if (rs.error) {
    return NextResponse.json({ error: rs.error.message }, { status: 500 })
  }
  return NextResponse.json(rs)
}