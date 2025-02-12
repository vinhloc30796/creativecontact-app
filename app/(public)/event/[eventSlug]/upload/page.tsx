// File: app/(public)/[eventSlug]/upload/page.tsx

"use server";

import { events } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import UploadPageClient from "./UploadPageClient";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import EventEnded from "../EventEnded";
import { headers } from "next/headers";
import { EventNotFound } from "../EventNotFound";

interface UploadPageProps {
  params: Promise<{
    eventSlug: string;
  }>;
}

export default async function UploadPage(props: UploadPageProps) {
  const params = await props.params;
  const { eventSlug } = params;
  const headersList = await headers();
  const lang =
    headersList.get("accept-language")?.split(",")[0].split("-")[0] || "en";
  const eventData = await db.select().from(events).where(eq(events.slug, eventSlug));
  const recentEvents = await db.select().from(events).orderBy(desc(events.created_at)).limit(5);

  if (!eventData || eventData.length === 0) {
    return (
      <BackgroundDiv>
        <EventNotFound eventSlug={eventSlug} recentEvents={recentEvents} />
      </BackgroundDiv>
    );
  }

  const firstEvent = eventData[0];
  if (firstEvent.time_end && new Date() > new Date(firstEvent.time_end)) {
    return (
      <BackgroundDiv>
        <EventEnded
          eventSlug={eventSlug}
          eventName={eventData[0].name}
          lang={lang}
        />
      </BackgroundDiv>
    );
  }

  return (
    <UploadPageClient
      eventSlug={eventSlug}
      eventData={eventData[0]}
      recentEvents={recentEvents}
      lang={lang}
    />
  );
}
