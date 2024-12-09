// File: app/(public)/[eventSlug]/upload/page.tsx

"use server";

import { events } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import UploadPageClient from "./UploadPageClient";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import EventEnded from "../EventEnded";
import { headers } from "next/headers";

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
  const eventData = await db.query.events.findFirst({
    where: eq(events.slug, eventSlug),
    columns: { id: true, name: true, slug: true, time_end: true },
  });
  if (eventData?.time_end && new Date() > new Date(eventData.time_end)) {
    return (
      <BackgroundDiv>
        <EventEnded
          eventSlug={eventSlug}
          eventName={eventData.name}
          lang={lang}
        />
      </BackgroundDiv>
    );
  }
  const recentEvents = await db.query.events.findMany({
    orderBy: desc(events.created_at),
    limit: 5,
  });
  return (
    <UploadPageClient
      eventSlug={eventSlug}
      eventData={eventData}
      recentEvents={recentEvents}
      lang={lang}
    />
  );
}
