// File: app/(public)/[eventSlug]/upload/page.tsx

"use server";

import { events } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import UploadPageClient from './UploadPageClient';
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import EventEnded from "../EventEnded";

interface UploadPageProps {
  params: {
    eventSlug: string;
  };
}

export default async function UploadPage({ params }: UploadPageProps) {
  const { eventSlug } = params;
  const eventData = await db.query.events.findFirst({
    where: eq(events.slug, eventSlug),
    columns: { id: true, name: true, slug: true, time_end: true }
  });
  if (eventData?.time_end && new Date() > new Date(eventData.time_end)) {
    return <BackgroundDiv><EventEnded eventSlug={eventSlug} eventName={eventData.name} /></BackgroundDiv>
  }
  const recentEvents = await db.query.events.findMany({
    orderBy: desc(events.created_at),
    limit: 5
  });
  return (
    <UploadPageClient eventSlug={eventSlug} eventData={eventData} recentEvents={recentEvents} />
  );
}