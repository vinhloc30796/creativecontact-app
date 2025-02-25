import { randomUUID } from "crypto";
import { events } from "@/drizzle/schema/event";
import { Event } from "@/payload-types";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getMediaUrl } from "./payloadTypeAdapter";

// Type of the Drizzle client inferred from the db export
type DrizzleDB = typeof db;

/**
 * Converts a Payload CMS event to the Drizzle schema format
 */
export function payloadToDrizzleEvent(payloadEvent: Event) {
  return {
    id: typeof payloadEvent.id === "string" ? payloadEvent.id : randomUUID(),
    created_at: new Date(),
    name: payloadEvent.title,
    slug: payloadEvent.slug || "",
    created_by: "00000000-0000-0000-0000-000000000000", // Default admin user ID - replace with actual logic
    time_end: payloadEvent.endDate ? new Date(payloadEvent.endDate) : null,
  };
}

/**
 * Retrieves a Drizzle event by slug, creating it if it doesn't exist
 */
export async function getOrCreateDrizzleEvent(
  db: DrizzleDB,
  payloadEvent: Event,
) {
  // First, try to find the event in Drizzle by slug
  const existingEvent = await db.query.events.findFirst({
    where: eq(events.slug, payloadEvent.slug || ""),
  });

  if (existingEvent) {
    return existingEvent;
  }

  // If not found, create a new event in Drizzle
  const newEvent = payloadToDrizzleEvent(payloadEvent);
  const result = await db.insert(events).values(newEvent).returning();
  return result[0];
}

/**
 * Utility function to integrate a Payload CMS event with Drizzle event/slots
 * Call this when creating or updating event information
 */
export async function integrateEvent(db: DrizzleDB, payloadEvent: Event) {
  // Get or create the main event record
  const drizzleEvent = await getOrCreateDrizzleEvent(db, payloadEvent);

  // Return both formats for convenience
  return {
    drizzleEvent,
    payloadEvent,
  };
}
