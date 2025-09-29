import { artworkCredits, artworkEvents } from "@/drizzle/schema/artwork";
import { events } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { createClient as createSupabaseServerClient } from "@/utils/supabase/server";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  try {
    const rows = await db
      .select({ id: events.id, name: events.name, slug: events.slug })
      .from(artworkEvents)
      .innerJoin(events, eq(artworkEvents.eventId, events.id))
      .where(eq(artworkEvents.artworkId, id));
    return NextResponse.json(rows, { status: 200 });
  } catch (e) {
    console.error("[artworks/:id/events] GET error:", e);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  try {
    // Authentication: require a valid Supabase session
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Basic input validation
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const eventIds: string[] = Array.isArray((body as any)?.eventIds)
      ? (body as any).eventIds
      : [];

    // Authorization: require the user to be credited on the artwork (owner/creator/collaborator)
    // Adjust this rule as needed (e.g., restrict to specific credit titles or roles)
    const credit = await db
      .select({ id: artworkCredits.id })
      .from(artworkCredits)
      .where(and(eq(artworkCredits.artworkId, id), eq(artworkCredits.userId, user.id)))
      .limit(1);
    if (credit.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Reuse server action implementation through direct DB ops to avoid circular imports
    await db.transaction(async (tx) => {
      const current = await tx
        .select({ eventId: artworkEvents.eventId })
        .from(artworkEvents)
        .where(eq(artworkEvents.artworkId, id));
      const currentIds = new Set(current.map((r) => r.eventId));
      const desiredIds = new Set(eventIds);
      const toInsert = [...desiredIds].filter((eid) => !currentIds.has(eid));
      const toDelete = [...currentIds].filter((eid) => !desiredIds.has(eid));
      if (toInsert.length > 0) {
        await tx.insert(artworkEvents).values(toInsert.map((eid) => ({ artworkId: id, eventId: eid })));
      }
      if (toDelete.length > 0) {
        await tx
          .delete(artworkEvents)
          .where(
            and(
              eq(artworkEvents.artworkId, id),
              inArray(artworkEvents.eventId, toDelete),
            ),
          );
      }
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[artworks/:id/events] POST error:", e);
    return NextResponse.json({ error: "Failed to set events" }, { status: 500 });
  }
}


