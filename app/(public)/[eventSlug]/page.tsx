// File: app/(public)/[eventSlug]/page.tsx
"use server";

import { Loading } from '@/components/Loading';
import { artworkEvents } from '@/drizzle/schema/artwork';
import { events } from '@/drizzle/schema/event';
import { db } from '@/lib/db';
import { count, desc, eq } from 'drizzle-orm';
import { Suspense } from 'react';
import { EventNotFound } from './EventNotFound';
import { UploadStatistics } from './UploadStatistics';

interface EventPageProps {
  params: {
    eventSlug: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventSlug } = params;
  // Check event
  const eventData = await db.query.events.findFirst({
    where: eq(events.slug, eventSlug),
    columns: { id: true, name: true, slug: true }
  });
  // Check recent events
  const recentEvents = await db.query.events.findMany({
    orderBy: desc(events.created_at),
    limit: 5
  });
  if (!eventData) {
    return <EventNotFound recentEvents={recentEvents} eventSlug={eventSlug} />;
  }

  // Count artworks for this event
  const [result] = await db
    .select({ count: count(artworkEvents.id) })
    .from(artworkEvents)
    .innerJoin(events, eq(events.id, artworkEvents.eventId))
    .where(eq(events.slug, eventSlug));
  const artworkCount = result?.count ?? 0;
  // Render
  return (
    <Suspense fallback={<Loading/>}>
      <UploadStatistics 
      eventSlug={eventSlug} 
      eventTitle={eventData.name} 
      artworkCount={artworkCount} 
      countdown={10}
      />
    </Suspense>
  );
}
