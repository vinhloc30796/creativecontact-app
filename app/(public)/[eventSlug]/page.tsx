// File: app/(public)/[eventSlug]/page.tsx
"use server";

import { Button } from '@/components/ui/button';
import { Loading } from '@/components/Loading';
import { artworkEvents } from '@/drizzle/schema/artwork';
import { events } from '@/drizzle/schema/event';
import { db } from '@/lib/db';
import { count, desc, eq } from 'drizzle-orm';
import { Suspense } from 'react';
import { EventNotFound } from './EventNotFound';
import { UploadStatistics } from './UploadStatistics';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { useTranslation } from '@/lib/i18n/init-server';

interface EventPageProps {
  params: {
    eventSlug: string;
  };
  searchParams: {
    lang: string;
  };
}

export default async function EventPage({ params, searchParams }: EventPageProps) {
  // Get lang from query string
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, "EventPage");

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
    .from(events)
    .innerJoin(artworkEvents, eq(events.id, artworkEvents.eventId))
    .where(eq(events.slug, eventSlug));
  const artworkCount = result?.count ?? 0;
  // Render
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-primary/25 z-30 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex-1">
            {/* Left section content */}
            <h1 className="text-3xl font-bold text-primary-foreground">Creative Contact</h1>
          </div>
          <div className="flex-1 text-center">
          <div className="space-x-4">
            <Button variant="secondary" disabled>
              {t("about", { ns: "EventPage" })}
            </Button>
            <Button variant="secondary" asChild>
              <a href={`/${eventSlug}`}>{t("gallery", { ns: "EventPage" })}</a>
            </Button>
          </div>
          </div>
          <div className="flex-1 text-right">
            <div className="space-x-4">
              <Button variant="ghost" className="text-accent" asChild>
                <a href={`/${eventSlug}/upload`}>{t("upload", { ns: "EventPage" })}</a>
              </Button>
              <Button variant="ghost" className="text-accent" asChild>
                <a href="/signup">{t("signup", { ns: "EventPage" })}</a>
              </Button>
              <Button variant="ghost" className="text-accent" asChild>
                <a href="/login">{t("login", { ns: "EventPage" })}</a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <BackgroundDiv eventSlug={eventSlug}>
        <Suspense fallback={<Loading />}>
          <div className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-10">
            <UploadStatistics
              eventSlug={eventSlug}
              eventTitle={eventData.name}
              artworkCount={artworkCount}
              countdown={10}
            />
          </div>
        </Suspense>
      </BackgroundDiv>
    </>
  );
}
