// File: app/(public)/[eventSlug]/page.tsx
"use server";

// React and Next.js imports
import { Suspense, use } from "react";

// Database and ORM imports
import { createClient } from "@supabase/supabase-js";

// Schema imports

// Component imports
import {
  ArtworkCard,
  ArtworkWithAssetsThumbnailCredits,
} from "@/components/artwork/ArtworkCard";
import { Loading } from "@/components/Loading";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { EventFooter } from "@/components/wrappers/EventFooter";
import { EventHeader } from "@/components/wrappers/EventHeader";
import { EventNotFound } from "./EventNotFound";
import { UploadStatistics } from "./UploadStatistics";
// Utility imports
import { getServerTranslation } from "@/lib/i18n/init-server";
import { fetchEvent } from "@/app/(public)/(event)/api/events/[slug]/helper";
import { fetchRecentEvents } from "@/app/(public)/(event)/api/recent-events/helper";
import { fetchEventArtworks } from "@/app/(public)/(event)/api/event-artworks/helper";

// Define the props interface for the EventPage component
interface EventPageProps {
  params: Promise<{
    eventSlug: string;
  }>;
  searchParams: Promise<{
    lang: string;
  }>;
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
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Helper function to generate random sizes for artwork cards
function getRandomSize() {
  return Math.floor(Math.random() * (33 - 25 + 1) + 25);
}

// Main EventPage component
export default async function EventPage(props: EventPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const lang = searchParams.lang || "en";
  const { t } = await getServerTranslation(lang, "EventPage");

  // Extract event slug from params
  const { eventSlug } = params;

  // Fetch event data from the database
  const eventData = await fetchEvent(eventSlug);

  // Fetch recent events for the EventNotFound component
  const recentEvents = await fetchRecentEvents(5);

  const eventEnded = (eventData?.time_end &&
    new Date() > new Date(eventData.time_end)) as boolean;

  // If event is not found, render the EventNotFound component
  if (!eventData) {
    return <EventNotFound recentEvents={recentEvents} eventSlug={eventSlug} />;
  }

  // Fetch artworks and their assets for the current event
  const eventArtworksData = await fetchEventArtworks(eventData.id);

  if (!eventArtworksData) {
    return <EventNotFound recentEvents={recentEvents} eventSlug={eventSlug} />;
  }

  // Calculate the total number of artworks
  const artworkCount = Object.keys(eventArtworksData).length;

  // Shuffle the artworks
  const shuffledArtworks = shuffleArray<ArtworkWithAssetsThumbnailCredits>(
    Object.values(eventArtworksData),
  );

  // Render the EventPage component
  return (
    <BackgroundDiv eventSlug={eventSlug} shouldCenter={false}>
      <div className="flex min-h-screen w-full flex-col">
        {/* Header section */}
        <EventHeader
          eventSlug={eventSlug}
          lang={lang}
          eventEnded={eventEnded}
          className="mb-0"
        />

        {/* Background text */}
        <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center overflow-hidden">
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
        <main className="relative z-20 mt-10 w-full flex-grow justify-between lg:mt-20">
          <div className="w-full px-4 sm:px-8 md:px-16">
            {/* Render artwork cards */}
            {shuffledArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className={`flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                } mt-2 pb-[40vh] sm:pb-[25vh]`}
              >
                <ArtworkCard
                  eventSlug={eventSlug}
                  artwork={artwork}
                  size={100}
                />
              </div>
            ))}
          </div>
        </main>

        {/* Footer section */}
        <EventFooter lang={lang} />
      </div>
    </BackgroundDiv>
  );
}
