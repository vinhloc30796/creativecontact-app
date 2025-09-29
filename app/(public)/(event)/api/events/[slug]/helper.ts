import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { events } from "@/drizzle/schema/event";

export async function fetchEvent(slug: string) {
  try {
    // Fetch event data from the database
    const eventData = await db.query.events.findFirst({
      where: eq(events.slug, slug),
      columns: {
        id: true,
        name: true,
        slug: true,
        time_end: true,
        summary_i18n: true,
      }
    });

    return eventData;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}
