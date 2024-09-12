// File: app/(public)/[eventSlug]/page.tsx
"use server";

// Import necessary components and utilities
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/Loading';
import { artworkEvents, artworks, artworkAssets } from '@/drizzle/schema/artwork';
import { events } from '@/drizzle/schema/event';
import { db } from '@/lib/db';
import { desc, eq, and } from 'drizzle-orm';
import { Suspense } from 'react';
import { EventNotFound } from './EventNotFound';
import { UploadStatistics } from './UploadStatistics';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { useTranslation } from '@/lib/i18n/init-server';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// Define the props interface for the EventPage component
interface EventPageProps {
  params: {
    eventSlug: string;
  };
  searchParams: {
    lang: string;
  };
}

// Helper function to generate random sizes for artwork cards
function getRandomSize() {
  return Math.floor(Math.random() * (33 - 25 + 1) + 25);
}

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Main EventPage component
export default async function EventPage({ params, searchParams }: EventPageProps) {
  // Initialize language and translation
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, "EventPage");

  // Extract event slug from params
  const { eventSlug } = params;

  // Fetch event data from the database
  const eventData = await db.query.events.findFirst({
    where: eq(events.slug, eventSlug),
    columns: { id: true, name: true, slug: true }
  });

  // Fetch recent events for the EventNotFound component
  const recentEvents = await db.query.events.findMany({
    orderBy: desc(events.created_at),
    limit: 5
  });

  // If event is not found, render the EventNotFound component
  if (!eventData) {
    return <EventNotFound recentEvents={recentEvents} eventSlug={eventSlug} />;
  }

  // Fetch artworks and their assets for the current event
  const eventArtworks = await db
    .select({
      artwork: artworks,
      assets: artworkAssets
    })
    .from(artworkEvents)
    .innerJoin(artworks, eq(artworkEvents.artworkId, artworks.id))
    .leftJoin(artworkAssets, eq(artworks.id, artworkAssets.artworkId))
    .where(eq(artworkEvents.eventId, eventData.id));

  // Process fetched artworks to group assets with their respective artworks
  const processedArtworks = eventArtworks.reduce((acc, { artwork, assets }) => {
    if (!acc[artwork.id]) {
      acc[artwork.id] = { ...artwork, assets: [], thumbnail: null };
    }
    if (assets) {
      acc[artwork.id].assets.push(assets);
      if (assets.isThumbnail) {
        acc[artwork.id].thumbnail = assets;
      }
    }
    return acc;
  }, {} as Record<string, typeof artworks.$inferSelect & { assets: typeof artworkAssets.$inferSelect[], thumbnail: typeof artworkAssets.$inferSelect | null }>);

  // Calculate the total number of artworks
  const artworkCount = Object.keys(processedArtworks).length;

  // Render the EventPage component
  return (
    <BackgroundDiv eventSlug={eventSlug} shouldCenter={false}>
      <div className="min-h-screen flex flex-col">
        {/* Header section */}
        <header className="fixed top-0 left-0 right-0 bg-primary-900/90 z-30 shadow-md">
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

        {/* Background text */}
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-10">
          <Suspense fallback={<Loading />}>
            <UploadStatistics
              eventSlug={eventSlug}
              eventTitle={eventData.name}
              artworkCount={artworkCount}
              countdown={undefined}
            />
          </Suspense>
        </div>

        {/* Main content area */}
        <main className="flex-grow mt-20 mb-16 relative z-20">
          <div className="container mx-auto px-4">
            {/* Render artwork cards */}
            {Object.values(processedArtworks).map((artwork, index) => {
              const size = getRandomSize();
              return (
                <div
                  key={artwork.id}
                  className={`flex ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  } my-16`}
                >
                  <Card 
                    className={`hover:shadow-lg transition-shadow duration-300 bg-primary`}
                    style={{ width: `${size}vw`, maxWidth: '600px' }}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl mb-2 break-words text-primary-foreground">{artwork.title}</CardTitle>
                      <CardDescription
                        className="text-primary-foreground"
                      >
                        <time dateTime={artwork.createdAt.toISOString()} className="text-sm text-primary-foreground">
                          {artwork.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-primary-foreground">
                      {artwork.thumbnail && (
                        <div className="mb-4">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${artwork.thumbnail.filePath}`}
                            alt={artwork.title}
                            width={300}
                            height={200}
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                      )}
                      <p className="mt-4 text-primary-foreground text-sm sm:text-base break-words">{artwork.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {artwork.assets.map((asset, assetIndex) => (
                          <Badge key={assetIndex} variant="secondary" className="text-xs sm:text-sm">
                            {asset.assetType}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </main>

        {/* Footer section */}
        <footer className="fixed bottom-0 left-0 right-0 bg-primary-200/10 z-30 shadow-md">
          <div className="container mx-auto px-4 py-4 text-center text-muted-foreground">
            © 2023 Creative Contact. All rights reserved.
          </div>
        </footer>
      </div>
    </BackgroundDiv>
  );
}
