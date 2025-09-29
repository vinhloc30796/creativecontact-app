// File: app/(public)/event/[eventSlug]/artwork/[artworkId]/page.tsx
// React and Next.js imports
import Image from "next/image";
import Link from "next/link";
import { Suspense, use } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import chevron icons

// Database ORM imports
import { and, asc, desc, eq, gt, lt, not } from "drizzle-orm";

// UI component imports
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { EventHeader } from "@/components/wrappers/EventHeader";
import { EventFooter } from "@/components/wrappers/EventFooter";
import { Button } from "@/components/ui/button"; // Import Button component

// Database schema imports
import {
  artworkAssets,
  artworkCredits,
  artworkEvents,
  artworks,
} from "@/drizzle/schema/artwork";
import { userInfos } from "@/drizzle/schema/user";

// Utility imports
import { db } from "@/lib/db";
import { getServerTranslation } from "@/lib/i18n/init-server";

interface ArtworkPageProps {
  params: Promise<{
    eventSlug: string;
    artworkId: string;
  }>;
  searchParams: Promise<{
    lang: string;
  }>;
}

async function getNextArtworks(currentArtwork: typeof artworks.$inferSelect) {
  const nextArtwork = await db
    .select({
      id: artworks.id,
    })
    .from(artworks)
    .where(
      and(
        gt(artworks.createdAt, currentArtwork.createdAt),
        not(eq(artworks.id, currentArtwork.id)),
      ),
    )
    .orderBy(asc(artworks.createdAt), asc(artworks.id))
    .limit(1);

  return nextArtwork;
}

async function getPrevArtworks(currentArtwork: typeof artworks.$inferSelect) {
  const prevArtwork = await db
    .select({
      id: artworks.id,
    })
    .from(artworks)
    .where(
      and(
        lt(artworks.createdAt, currentArtwork.createdAt),
        not(eq(artworks.id, currentArtwork.id)),
      ),
    )
    .orderBy(desc(artworks.createdAt), desc(artworks.id))
    .limit(1);

  return prevArtwork;
}

async function getArtworkCredits(artworkId: string) {
  const credits = await db
    .select({
      id: artworkCredits.id,
      userId: artworkCredits.userId,
      title: artworkCredits.title,
      name: userInfos.displayName,
    })
    .from(artworkCredits)
    .leftJoin(userInfos, eq(artworkCredits.userId, userInfos.id))
    .where(eq(artworkCredits.artworkId, artworkId));
  return credits;
}

export default async function ArtworkPage(props: ArtworkPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { eventSlug, artworkId } = params;
  const lang = searchParams.lang || "en";
  const { t } = await getServerTranslation(lang, ["ArtworkPage", "common"]);

  // Fetch artwork data
  const artworkData = await db
    .select({
      artwork: artworks,
      assets: artworkAssets,
      event: artworkEvents,
    })
    .from(artworks)
    .leftJoin(artworkAssets, eq(artworks.id, artworkAssets.artworkId))
    .leftJoin(artworkEvents, eq(artworks.id, artworkEvents.artworkId))
    .where(eq(artworks.id, artworkId))
    .orderBy(desc(artworkAssets.isThumbnail)); // Sort thumbnail to the top

  if (!artworkData || artworkData.length === 0) {
    return <div>Artwork not found</div>;
  }
  const currentArtwork = artworkData[0].artwork;

  // Fetch next and previous artwork by createdAt
  const nextArtwork = await getNextArtworks(currentArtwork);

  const prevArtwork = await getPrevArtworks(currentArtwork);

  // Fetch artwork credits
  const credits = await getArtworkCredits(artworkId);

  // Process and sort assets
  const assets = artworkData
    .map((item) => item.assets)
    .filter((asset): asset is NonNullable<typeof asset> => asset !== null)
    .sort((a, b) => {
      if (a.isThumbnail && !b.isThumbnail) return -1;
      if (!a.isThumbnail && b.isThumbnail) return 1;
      return 0;
    });
  const nextArtworkId = nextArtwork[0]?.id || null;
  const prevArtworkId = prevArtwork[0]?.id || null;
  console.log(
    `Rendering ArtworkPage for ${currentArtwork.title} (description: ${currentArtwork.description}) with eventSlug: ${eventSlug}`,
  );

  return (
    <BackgroundDiv eventSlug={eventSlug || undefined} shouldCenter={false} shouldImage={true}>
      <div className="mx-auto flex h-screen flex-col">
        {/* Header section */}
        <EventHeader
          eventSlug={eventSlug || ""}
          lang={lang}
          stickyOverlay={false}
          className="mb-8"
        />
        <div className="flex flex-col">
          <div className="mx-16 my-8 flex items-center justify-between">
            <div className="flex justify-center gap-4">
              <Link
                href={`/event/${eventSlug}`}
                className="flex items-center text-muted hover:underline"
              >
                {t("backToEvent")}
              </Link>
            </div>
            {/* Don't show nav buttons on desktop (because it's on the mobile footer) */}
            <div className="flex justify-end gap-4 lg:hidden">
              <Button
                asChild
                variant="outline"
                size="icon"
                className={`h-10 w-10 rounded-none border border-primary bg-transparent transition-shadow hover:bg-primary/10 hover:shadow-md ${!prevArtworkId ? "pointer-events-none opacity-50" : ""}`}
              >
                <Link
                  href={
                    prevArtworkId
                      ? `/event/${eventSlug}/artwork/${prevArtworkId}`
                      : "#"
                  }
                >
                  <ChevronLeft className="h-4 w-4 text-primary" />
                  <span className="sr-only">{t("previousArtwork")}</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="icon"
                className={`h-10 w-10 rounded-none border border-primary bg-transparent transition-shadow hover:bg-primary/10 hover:shadow-md ${!nextArtworkId ? "pointer-events-none opacity-50" : ""}`}
              >
                <Link
                  href={
                    nextArtworkId
                      ? `/event/${eventSlug}/artwork/${nextArtworkId}`
                      : "#"
                  }
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span className="sr-only">{t("nextArtwork")}</span>
                </Link>
              </Button>
            </div>
          </div>
          {/* Don't show artwork header on desktop (because it's on the content section) */}
          <div className="sticky top-0 z-10 mx-4 pb-4 lg:hidden">
            <h2 className="text-md text-transform: mb-2 font-semibold uppercase text-accent md:text-lg">
              {t("artwork")}
            </h2>
            <h1 className="mb-4 text-4xl font-bold text-primary md:text-5xl">
              {currentArtwork.title}
            </h1>
            <time
              className="mb-2 text-sm text-muted-foreground"
              dateTime={currentArtwork.createdAt.toISOString()}
            >
              {new Date(currentArtwork.createdAt).toLocaleDateString(lang, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>

        {/* Artwork details and Main content */}
        <div className="mx-4 mb-14 flex h-[calc(100vh-16rem)] flex-col gap-8 overflow-y-auto md:mx-8 lg:mx-16 lg:flex-row">
          {/* Artwork details */}
          <div className="relative flex flex-col gap-4 text-primary-foreground lg:h-full lg:w-1/3">
            <div className="pb-16">
              {/* Artwork header: frozen on desktop, hidden on mobile */}
              <div className="sticky top-0 z-10 hidden pb-4 lg:block">
                <h2 className="text-md text-transform: mb-2 font-semibold uppercase text-accent md:text-lg">
                  {t("artwork")}
                </h2>
                <h1 className="mb-4 text-4xl font-bold text-primary md:text-5xl">
                  {currentArtwork.title}
                </h1>
                <time
                  className="mb-2 text-sm text-muted-foreground"
                  dateTime={currentArtwork.createdAt.toISOString()}
                >
                  {new Date(currentArtwork.createdAt).toLocaleDateString(lang, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              {/* Artwork description: scrollable separately on its own on desktop */}
              <div className="block lg:h-[calc(100vh-32rem)] lg:overflow-y-auto">
                <div className="mb-4 mt-12">
                  <h2 className="text-md text-transform: mb-2 font-semibold uppercase text-accent md:text-lg">
                    {t("description")}
                  </h2>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {currentArtwork.description}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge className="rounded-[8px] bg-primary-1000/80 text-xs text-primary-foreground">
                    Assets: {assets.length}
                  </Badge>
                </div>
                <div className="mb-4 mt-12">
                  <h2 className="text-md text-transform: mb-2 font-semibold uppercase text-accent md:text-lg">
                    {t("artist")}
                  </h2>
                  <ul>
                    {credits.map((credit) => (
                      <li key={credit.id}>
                        {credit.name || "Anonymous"}
                        &nbsp;
                        <span className="text-xs italic text-primary-foreground">
                          ({credit.title})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* Nav buttons: only show in footer on desktop (otherwise in the header already) */}
            <div className="absolute bottom-0 left-0 right-0 hidden py-4 lg:block">
              <div className="flex items-center justify-start gap-4">
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className={`h-10 w-10 rounded-none border border-primary bg-transparent transition-shadow hover:bg-primary/10 hover:shadow-md ${!prevArtworkId ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Link
                    href={
                      prevArtworkId
                        ? `/event/${eventSlug}/artwork/${prevArtworkId}`
                        : "#"
                    }
                  >
                    <ChevronLeft className="h-4 w-4 text-primary" />
                    <span className="sr-only">{t("previousArtwork")}</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className={`h-10 w-10 rounded-none border border-primary bg-transparent transition-shadow hover:bg-primary/10 hover:shadow-md ${!nextArtworkId ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Link
                    href={
                      nextArtworkId
                        ? `/event/${eventSlug}/artwork/${nextArtworkId}`
                        : "#"
                    }
                  >
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="sr-only">{t("nextArtwork")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main content: scrollable always, but separate or together with artwork details depending on screen size */}
          <main className="grow lg:w-2/3 lg:overflow-y-auto">
            <Suspense fallback={<Loading />}>
              <div className="flex flex-col items-center gap-8 pb-8">
                {assets.map(
                  (asset, index) =>
                    asset && (
                      <div
                        key={asset.id}
                        className="relative flex w-full items-center justify-center"
                      >
                        {asset.assetType === "video" ? (
                          <video
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${asset.filePath}#t=0.05`}
                            controls
                            className="h-auto max-w-full"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${asset.filePath}`}
                            alt={`${currentArtwork.title} - Asset ${index + 1}`}
                            sizes="(min-width: 1024px) 66vw, 100vw"
                            width={1024}
                            height={1024}
                            style={{ objectFit: "contain" }}
                          />
                        )}
                      </div>
                    ),
                )}
              </div>
            </Suspense>
          </main>
        </div>

        {/* Footer section */}
        <EventFooter lang={lang} />
      </div>
    </BackgroundDiv>
  );
}
