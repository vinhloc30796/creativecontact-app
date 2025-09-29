import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/drizzle/schema/event";
import { ilike, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const limitParam = searchParams.get("limit");
    const limit = Math.min(Math.max(Number(limitParam || 10), 1), 50);

    if (!q) {
      return NextResponse.json([], { status: 200 });
    }

    const rows = await db
      .select({ id: events.id, name: events.name, slug: events.slug })
      .from(events)
      .where(or(ilike(events.name, `%${q}%`), ilike(events.slug, `%${q}%`)))
      .limit(limit);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("[events/search] error:", error);
    return NextResponse.json(
      { error: "Failed to search events" },
      { status: 500 },
    );
  }
}


