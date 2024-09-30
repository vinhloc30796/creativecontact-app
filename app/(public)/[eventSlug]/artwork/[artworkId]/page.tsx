"use server";

// React and Next.js imports
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// Database ORM imports
import { and, asc, desc, eq, gt, lt, not } from "drizzle-orm";

// UI component imports
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { EventHeader } from "@/components/wrappers/EventHeader";
import { EventFooter } from "@/components/wrappers/EventFooter";

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
import { useTranslation } from "@/lib/i18n/init-server";

interface ArtworkPageProps {
  params: {
    eventSlug: string;
    artworkId: string;
  };
  searchParams: {
    lang: string;
  };
}

export default async function ArtworkPage({
  params,
  searchParams,
}: ArtworkPageProps) {
  const { eventSlug, artworkId } = params;
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, ["ArtworkPage", "common"]);

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

  // Fetch artwork credits
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
    <BackgroundDiv eventSlug={eventSlug || undefined} shouldCenter={false}>
      <div className="mx-auto flex h-screen flex-col">
        {/* Header section */}
        <EventHeader
          eventSlug={eventSlug || ""}
          lang={lang}
          stickyOverlay={false}
          className="mb-8"
        />
        <div className="mx-16 my-8 flex items-center justify-between">
          <Link
            href={
              prevArtworkId ? `/${eventSlug}/artwork/${prevArtworkId}` : "#"
            }
            className={`text-sm font-medium text-primary-foreground transition-colors hover:underline focus-visible:underline focus-visible:outline-none ${!prevArtworkId ? "pointer-events-none opacity-50" : ""}`}
          >
            {t("previousArtwork")}
          </Link>
          <Link
            href={
              nextArtworkId ? `/${eventSlug}/artwork/${nextArtworkId}` : "#"
            }
            className={`text-sm font-medium text-primary-foreground transition-colors hover:underline focus-visible:underline focus-visible:outline-none ${!nextArtworkId ? "pointer-events-none opacity-50" : ""}`}
          >
            {t("nextArtwork")}
          </Link>
        </div>

        {/* Artwork details and Main content */}
        <div className="mx-4 mb-10 flex h-[calc(100vh-16rem)] flex-col gap-8 overflow-y-auto md:mx-8 lg:mx-16 lg:flex-row">
          {/* Artwork details */}
          <div className="flex flex-col gap-4 text-primary-foreground lg:h-full lg:w-1/3 lg:overflow-y-auto">
            <div>
              <div>
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

          {/* Main content */}
          <main className="flex-grow lg:w-2/3 lg:overflow-y-auto">
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
        <EventFooter />
      </div>
    </BackgroundDiv>
  );
}
