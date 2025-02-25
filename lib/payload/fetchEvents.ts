import type { Payload, Where } from "payload";
import { getCustomPayload } from "@/lib/payload/getCustomPayload";
import { Event } from "@/payload-types";

interface FetchEventsOptions {
  limit?: number;
  page?: number;
  sort?: string;
  where?: Where;
  depth?: number;
}

export async function fetchEvents(
  options: FetchEventsOptions = {},
): Promise<Event[]> {
  const {
    limit = 10,
    page = 1,
    sort = "-eventDate",
    where = {},
    depth = 1,
  } = options;

  try {
    const payload = await getCustomPayload();

    const eventsQuery = await payload.find({
      collection: "events",
      limit,
      page,
      sort,
      where,
      depth,
    });

    return eventsQuery.docs as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function fetchEventBySlug(slug: string): Promise<Event | null> {
  try {
    const payload = await getCustomPayload();

    const eventsQuery = await payload.find({
      collection: "events",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 2, // Increase depth to load related content
    });

    if (eventsQuery.docs.length === 0) {
      return null;
    }

    return eventsQuery.docs[0] as Event;
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    return null;
  }
}
