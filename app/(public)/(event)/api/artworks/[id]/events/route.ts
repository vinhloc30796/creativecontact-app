import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artworkEvents } from "@/drizzle/schema/artwork";
import { events } from "@/drizzle/schema/event";
import { eq, and } from "drizzle-orm";

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
    const body = await request.json();
    const eventIds: string[] = Array.isArray(body?.eventIds) ? body.eventIds : [];
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
        // drizzle-orm doesn't support composite where with in() in one call cleanly; do simple deletes
        for (const eid of toDelete) {
          await tx
            .delete(artworkEvents)
            .where(and(eq(artworkEvents.artworkId, id), eq(artworkEvents.eventId, eid)));
        }
      }
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[artworks/:id/events] POST error:", e);
    return NextResponse.json({ error: "Failed to set events" }, { status: 500 });
  }
}


