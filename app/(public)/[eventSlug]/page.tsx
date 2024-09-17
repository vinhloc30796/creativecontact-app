// File: app/(public)/[eventSlug]/page.tsx
"use server";

// Import necessary components and utilities
import { ArtworkCard, ArtworkWithAssetsThumbnailCredits } from '@/components/artwork/ArtworkCard';
import { Loading } from '@/components/Loading';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { EventHeader } from '@/components/wrappers/EventHeader';
import { artworkAssets, artworkCredits, artworkEvents, artworks } from '@/drizzle/schema/artwork';
import { events } from '@/drizzle/schema/event';
import { UserInfo, userInfos } from '@/drizzle/schema/user';
import { db } from '@/lib/db';
import { useTranslation } from '@/lib/i18n/init-server';
import { createClient } from '@supabase/supabase-js';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Suspense } from 'react';
import { EventNotFound } from './EventNotFound';
import { UploadStatistics } from './UploadStatistics';
// Define the props interface for the EventPage component
interface EventPageProps {
  params: {
    eventSlug: string;
  };
  searchParams: {
    lang: string;
  };
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Helper function to generate random sizes for artwork cards
function getRandomSize() {
  return Math.floor(Math.random() * (33 - 25 + 1) + 25);
}

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
      assets: artworkAssets,
      credits: artworkCredits,
      user: userInfos
    })
    .from(artworkEvents)
    .innerJoin(artworks, eq(artworkEvents.artworkId, artworks.id))
    .leftJoin(artworkAssets, eq(artworks.id, artworkAssets.artworkId))
    .leftJoin(artworkCredits, eq(artworks.id, artworkCredits.artworkId))
    .leftJoin(userInfos, eq(artworkCredits.userId, userInfos.id))
    .where(eq(artworkEvents.eventId, eventData.id));

  // Process fetched artworks to group assets with their respective artworks
  const processedArtworks = eventArtworks.reduce((acc, { artwork, assets, credits, user }) => {
    if (!acc[artwork.id]) {
      acc[artwork.id] = { ...artwork, assets: [], thumbnail: null, credits: [] };
    }
    if (assets && !acc[artwork.id].assets.some(a => a.id === assets.id)) {
      acc[artwork.id].assets.push(assets);
      if (assets.isThumbnail) {
        acc[artwork.id].thumbnail = { filePath: assets.filePath };
      }
    }
    if (credits && !acc[artwork.id].credits.some(c => c.id === credits.id)) {
      const userInfo: UserInfo = user ? {
        ...user,
        experience: user.experience || 'Entry' // Provide a default value if null
      } : {
        id: credits.userId,
        firstName: null,
        lastName: null,
        displayName: 'Anonymous',
        phone: null,
        location: null,
        occupation: null,
        about: null,
        industries: null,
        experience: 'Entry',
        instagramHandle: null,
        facebookHandle: null
      };
      acc[artwork.id].credits.push({ ...credits, user: userInfo });
    }
    return acc;
  }, {} as Record<string, ArtworkWithAssetsThumbnailCredits>);

  // Calculate the total number of artworks
  const artworkCount = Object.keys(processedArtworks).length;

  // Shuffle the artworks
  const shuffledArtworks = shuffleArray(Object.values(processedArtworks));

  // Render the EventPage component
  return (
    <BackgroundDiv eventSlug={eventSlug} shouldCenter={false}>
      <div className="min-h-screen flex flex-col w-full">
        {/* Header section */}
        <EventHeader eventSlug={eventSlug} lang={lang} className="mb-0" />

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
        <main className="flex-grow my-20 relative z-20 justify-between w-full">
          <div className="w-full px-4 sm:px-8 md:px-16">
            {/* Render artwork cards */}
            {shuffledArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                  } my-16`}
              >
                <ArtworkCard eventSlug={eventSlug} artwork={artwork} size={100} />
              </div>
            ))}
          </div>
          {/* Add spacing */}
          <div className="h-20"></div>
        </main>

        {/* Footer section */}
        <footer className="fixed bottom-0 left-0 right-0 bg-primary-200/10 z-30 shadow-md w-full">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center text-muted-foreground w-full">
            <div className="text-left">
              {/* Left section content */}
            </div>
            <div className="text-center">
              © 2024 Creative Contact
            </div>
            <div className="text-right">
              {/* Right section content */}
              <Link href="https://www.facebook.com/creativecontact.vn" className="mr-4 hover:text-primary-foreground transition-colors duration-300">FB</Link>
              <Link href="https://instagram.com/creativecontact_vn" className="hover:text-primary-foreground transition-colors duration-300">IG</Link>
            </div>
          </div>
        </footer>
      </div>
    </BackgroundDiv>
  );
}
