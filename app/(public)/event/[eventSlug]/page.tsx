// File: app/(public)/[eventSlug]/page.tsx
// React and Next.js imports
import { Suspense } from "react";

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
import { fetchEventArtworks } from "@/app/(public)/(event)/api/event-artworks/helper";
import { fetchEvent } from "@/app/(public)/(event)/api/events/[slug]/helper";
import { fetchRecentEvents } from "@/app/(public)/(event)/api/recent-events/helper";
import { getServerTranslation } from "@/lib/i18n/init-server";

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

// Helper function to generate random sizes for artwork cards
function getRandomSize() {
  return Math.floor(Math.random() * (33 - 25 + 1) + 25);
}

// Main EventPage component
export default async function EventPage(props: EventPageProps) {
  console.log("[EventPage] Starting component execution");

  try {
    console.log("[EventPage] About to await props.params and props.searchParams");
    const params = await props.params;
    const searchParams = await props.searchParams;
    console.log("[EventPage] Successfully resolved params:", params);
    console.log("[EventPage] Successfully resolved searchParams:", searchParams);

    const lang = searchParams.lang || "en";
    console.log("[EventPage] Language set to:", lang);

    const { t } = await getServerTranslation(lang, "EventPage");
    console.log("[EventPage] Translation loaded");

    const { eventSlug } = params;
    console.log("[EventPage] Event slug extracted:", eventSlug);

    console.log("[EventPage] About to fetch event data");
    const eventData = await fetchEvent(eventSlug);
    console.log("[EventPage] Event data fetched:", eventData);

    console.log("[EventPage] About to fetch recent events");
    const recentEvents = await fetchRecentEvents(5);
    console.log("[EventPage] Recent events fetched:", recentEvents);

    const eventEnded = (eventData?.time_end &&
      new Date() > new Date(eventData.time_end)) as boolean;
    console.log("[EventPage] Event ended status:", eventEnded);

    if (!eventData) {
      console.log("[EventPage] No event data found, rendering EventNotFound");
      return <EventNotFound recentEvents={recentEvents} eventSlug={eventSlug} />;
    }

    console.log("[EventPage] About to fetch event artworks");
    const eventArtworksData = await fetchEventArtworks(eventData.id);
    console.log("[EventPage] Event artworks fetched:", !!eventArtworksData);

    if (!eventArtworksData) {
      console.log("[EventPage] No artwork data found, rendering EventNotFound");
      return <EventNotFound recentEvents={recentEvents} eventSlug={eventSlug} />;
    }

    const artworkCount = Object.keys(eventArtworksData).length;
    console.log("[EventPage] Artwork count:", artworkCount);

    const shuffledArtworks = shuffleArray<ArtworkWithAssetsThumbnailCredits>(
      Object.values(eventArtworksData),
    );
    console.log("[EventPage] Artworks shuffled");

    console.log("[EventPage] About to render component");
    return (
      <BackgroundDiv eventSlug={eventSlug} shouldCenter={true} shouldImage={true}>
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
          <main className="relative z-20 mt-10 w-full grow justify-between lg:mt-20">
            {/* Spacer to push artworks below the fold */}
            <div className="h-screen" aria-hidden="true" />
            <div className="w-full px-4 sm:px-8 md:px-16">
              {/* Render artwork cards */}
              {shuffledArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"
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
  } catch (error) {
    console.error("[EventPage] Error in component:", error);
    throw error;
  }
}
