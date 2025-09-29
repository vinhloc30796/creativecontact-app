import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { events } from "@/drizzle/schema/event";

export async function fetchRecentEvents(limit: number = 5) {
  try {
    // Fetch recent events ordered by creation date
    const recentEvents = await db.query.events.findMany({
      orderBy: desc(events.created_at),
      limit: limit,
      columns: {
        id: true,
        name: true,
        slug: true,
        time_end: true,
        created_at: true,
        summary_i18n: true
      }
    });

    return recentEvents;
  } catch (error) {
    console.error("Error fetching recent events:", error);
    return [];
  }
}
