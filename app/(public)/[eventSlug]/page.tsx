// File: app/(public)/[eventSlug]/page.tsx
"use server";

// React and Next.js imports
import Link from 'next/link';
import { Suspense } from 'react';

// Database and ORM imports
import { db } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';
import { desc, eq } from 'drizzle-orm';

// Schema imports
import { artworkAssets, artworkCredits, artworkEvents, artworks } from '@/drizzle/schema/artwork';
import { events } from '@/drizzle/schema/event';
import { UserInfo, userInfos } from '@/drizzle/schema/user';

// Component imports
import { ArtworkCard, ArtworkWithAssetsThumbnailCredits } from '@/components/artwork/ArtworkCard';
import { Loading } from '@/components/Loading';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { EventHeader } from '@/components/wrappers/EventHeader';
import { EventFooter } from '@/components/wrappers/EventFooter';
import { EventNotFound } from './EventNotFound';
import { UploadStatistics } from './UploadStatistics';
// Utility imports
import { useTranslation } from '@/lib/i18n/init-server';
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
        acc[artwork.id].thumbnail = { filePath: assets.filePath, assetType: assets.assetType || "image" };
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
        phoneCountryCode: null,
        phoneNumber: null,
        phoneCountryAlpha3: null,
        location: null,
        occupation: null,
        about: null,
        industries: null,
        experience: 'Entry',
        profilePicture: null,
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
        <main className="flex-grow mt-10 lg:mt-20 relative z-20 justify-between w-full">
          <div className="w-full px-4 sm:px-8 md:px-16">
            {/* Render artwork cards */}
            {shuffledArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                  } mt-2 pb-[40vh] sm:pb-[25vh]`}
              >
                <ArtworkCard eventSlug={eventSlug} artwork={artwork} size={100} />
              </div>
            ))}
          </div>
        </main>

        {/* Footer section */}
        <EventFooter lang={lang}/>
      </div>
    </BackgroundDiv>
  );
}
