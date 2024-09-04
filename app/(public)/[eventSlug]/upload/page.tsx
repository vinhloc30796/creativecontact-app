// File: app/(public)/[eventSlug]/upload/page.tsx

"use server";

import { events } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import UploadPageClient from './UploadPageClient';

interface UploadPageProps {
  params: {
    eventSlug: string;
  };
}

export default async function UploadPage({ params }: UploadPageProps) {
  const { eventSlug } = params;
  const eventData = await await db.query.events.findFirst({
    where: eq(events.slug, eventSlug),
    columns: { id: true, name: true, slug: true }
  });
  const recentEvents = await db.query.events.findMany({
    orderBy: desc(events.created_at),
    limit: 5
  });

  return (
    <UploadPageClient eventSlug={eventSlug} eventData={eventData} recentEvents={recentEvents} />
  );
}