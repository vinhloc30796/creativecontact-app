"use server";

// React and Next.js imports
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

// Database ORM imports
import { and, asc, desc, eq, gt, lt, not } from 'drizzle-orm';

// UI component imports
import { Loading } from '@/components/Loading';
import { Badge } from "@/components/ui/badge";
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { EventHeader } from '@/components/wrappers/EventHeader';

// Database schema imports
import { artworkAssets, artworkCredits, artworkEvents, artworks } from '@/drizzle/schema/artwork';
import { userInfos } from '@/drizzle/schema/user';

// Utility imports
import { db } from '@/lib/db';
import { useTranslation } from '@/lib/i18n/init-server';

interface ArtworkPageProps {
  params: {
    eventSlug: string;
    artworkId: string;
  };
  searchParams: {
    lang: string;
  };
}

export default async function ArtworkPage({ params, searchParams }: ArtworkPageProps) {
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
    .orderBy(desc(artworkAssets.isThumbnail)) // Sort thumbnail to the top

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
        not(eq(artworks.id, currentArtwork.id))
      )
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
        not(eq(artworks.id, currentArtwork.id))
      )
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
    .map(item => item.assets)
    .filter((asset): asset is NonNullable<typeof asset> => asset !== null)
    .sort((a, b) => {
      if (a.isThumbnail && !b.isThumbnail) return -1;
      if (!a.isThumbnail && b.isThumbnail) return 1;
      return 0;
    });
  const nextArtworkId = nextArtwork[0]?.id || null;
  const prevArtworkId = prevArtwork[0]?.id || null;
  console.log(`Rendering ArtworkPage for ${currentArtwork.title} (description: ${currentArtwork.description}) with eventSlug: ${eventSlug}`);

  return (
    <BackgroundDiv eventSlug={eventSlug || undefined} shouldCenter={false}>
      <div className="h-screen mx-auto flex flex-col">
        {/* Header section */}
        <EventHeader eventSlug={eventSlug || ""} lang={lang} stickyOverlay={false} className="mb-8" />
        <div className="mx-16 my-8 flex justify-between items-center">
          <Link
            href={prevArtworkId ? `/${eventSlug}/artwork/${prevArtworkId}` : '#'}
            className={`text-sm font-medium text-primary-foreground transition-colors focus-visible:outline-none focus-visible:underline hover:underline ${!prevArtworkId ? 'pointer-events-none opacity-50' : ''}`}
          >
            {t("previousArtwork")}
          </Link>
          <Link
            href={nextArtworkId ? `/${eventSlug}/artwork/${nextArtworkId}` : '#'}
            className={`text-sm font-medium text-primary-foreground transition-colors focus-visible:outline-none focus-visible:underline hover:underline ${!nextArtworkId ? 'pointer-events-none opacity-50' : ''}`}
          >
            {t("nextArtwork")}
          </Link>
        </div>

        {/* Artwork details and Main content */}
        <div className="flex flex-col lg:flex-row mx-4 md:mx-8 lg:mx-16 mb-10 gap-8 overflow-y-auto h-[calc(100vh-16rem)]">
          {/* Artwork details */}
          <div className="lg:w-1/3 lg:h-full lg:overflow-y-auto flex flex-col gap-4 text-primary-foreground">
            <div>
              <div>
                <h2 className="text-xl md:text-2xl text-accent font-semibold mb-2">{t("artwork")}</h2>
                <h1 className="text-4xl md:text-5xl text-primary font-bold mb-4">{currentArtwork.title}</h1>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(currentArtwork.createdAt).toLocaleDateString(lang, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="mt-12 mb-4">
                <h2 className="text-xl md:text-2xl text-accent font-semibold mb-2">{t("description")}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{currentArtwork.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="text-xs text-primary-foreground">
                  Assets: {assets.length}
                </Badge>
              </div>
            </div>
            <div className="mt-12 mb-4">
              <h2 className="text-xl md:text-2xl text-accent font-semibold mb-2">{t("artist")}</h2>
              <ul>
                {credits.map(credit => (
                  <li key={credit.id}>
                    {credit.name || "Anonymous"}
                    &nbsp;
                    <span className="text-primary-foreground text-xs italic">
                      ({credit.title})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main content */}
          <main className="lg:w-2/3 flex-grow lg:overflow-y-auto">
            <Suspense fallback={<Loading />}>
              <div className="flex flex-col items-center gap-8 pb-8">
                {assets.map((asset, index) => asset && (
                  <div
                    key={asset.id}
                    className="flex w-full relative items-center justify-center"
                  >
                      {asset.isThumbnail && (
                        <Badge className="absolute top-2 right-2 z-10">
                          Thumbnail
                        </Badge>
                      )}
                      {asset.assetType === 'video' ? (
                        <video
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${asset.filePath}`}
                          controls
                          className="max-w-full h-auto"
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
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                  </div>
                ))}
              </div>
            </Suspense>
          </main>
        </div>


        {/* Footer section */}
        <footer className="fixed bottom-0 left-0 right-0 bg-primary-1000/80 z-30 shadow-md w-full">
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
    </BackgroundDiv >
  );
}
