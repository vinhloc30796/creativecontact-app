"use server";

import { Loading } from '@/components/Loading';
import { Badge } from "@/components/ui/badge";
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { EventHeader } from '@/components/wrappers/EventHeader';
import { artworkAssets, artworkCredits, artworkEvents, artworks } from '@/drizzle/schema/artwork';
import { userInfos } from '@/drizzle/schema/user';
import { db } from '@/lib/db';
import { useTranslation } from '@/lib/i18n/init-server';
import { and, asc, desc, eq, gt, lt, not } from 'drizzle-orm';
import Link from 'next/link';
import { Suspense } from 'react';

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


  const assets = artworkData.map(item => item.assets).filter(asset => asset !== null);
  const nextArtworkId = nextArtwork[0]?.id || null;
  const prevArtworkId = prevArtwork[0]?.id || null;
  console.log(`Rendering ArtworkPage for ${currentArtwork.title} with eventSlug: ${eventSlug}`);

  return (
    <BackgroundDiv eventSlug={eventSlug || undefined} shouldCenter={false}>
      <div className="h-screen mx-auto flex flex-col">
        {/* Header section */}
        <EventHeader eventSlug={eventSlug || ""} lang={lang} stickyOverlay={false} className="mb-8" />
        {/* Artwork details */}
        <div className="mx-16 mb-10 grid grid-cols-12 gap-4 text-primary-foreground h-[20vh]">
          <div className="col-span-4">
            <h1 className="text-5xl font-bold mb-4">{currentArtwork.title}</h1>
          </div>
          <div className="col-span-4">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-4">{t("description")}</h2>
              <p>{currentArtwork.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              <Badge className="text-xs text-primary-foreground">
                Assets: {assets.length}
              </Badge>
            </div>
          </div>
          <div className="col-span-4">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-4">{t("artist")}</h2>
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
        </div>

        {/* Main content */}
        <main className="flex-grow overflow-x-auto h-full">
          <Suspense fallback={<Loading />}>
            <div className="flex h-full items-center gap-4 px-16">
              {assets.map((asset, index) => asset && (
                <div
                  key={asset.id}
                  className="flex-none items-center justify-center h-full"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${asset.filePath}`}
                    alt={`${currentArtwork.title} - Asset ${index + 1}`}
                    className="h-full w-auto"
                  />
                </div>
              ))}
            </div>
          </Suspense>
        </main>

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

        {/* Footer section */}
        <footer className="bg-primary-200/10 z-30 shadow-md">
          <div className="container mx-auto px-16 py-4 flex justify-between items-center text-muted-foreground">
            <div className="text-left">
              {/* Left section content */}
            </div>
            <div className="text-center">
              © 2024 Creative Contact
            </div>
            <div className="text-right">
              <Link href="https://www.facebook.com/creativecontact.vn" className="mr-4 hover:text-primary-foreground transition-colors duration-300">FB</Link>
              <Link href="https://instagram.com/creativecontact_vn" className="hover:text-primary-foreground transition-colors duration-300">IG</Link>
            </div>
          </div>
        </footer>
      </div>
    </BackgroundDiv >
  );
}
