"use server";

import { getUserInfo } from '@/app/actions/user/getUserInfo';
import { Loading } from '@/components/Loading';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { artworkAssets, artworkCredits, artworkEvents, artworks } from '@/drizzle/schema/artwork';
import { db } from '@/lib/db';
import { asc, desc, eq, gte, lte } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { useTranslation } from '@/lib/i18n/init-server';
import { events } from '@/drizzle/schema/event';
import EventHeader from '@/components/wrappers/EventHeader';
import { userInfos } from '@/drizzle/schema/user';

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
    .where(eq(artworks.id, artworkId));

  // Fetch next and previous artwork by createdAt
  const nextArtwork = await db
    .select({
      id: artworks.id,
    })
    .from(artworks)
    .where(gte(artworks.createdAt, artworkData[0].artwork.createdAt))
    .orderBy(asc(artworks.createdAt))
    .limit(1);

  const prevArtwork = await db
    .select({
      id: artworks.id,
    })
    .from(artworks)
    .where(lte(artworks.createdAt, artworkData[0].artwork.createdAt))
    .orderBy(desc(artworks.createdAt))
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

  if (!artworkData || artworkData.length === 0) {
    return <div>Artwork not found</div>;
  }

  const artwork = artworkData[0].artwork;
  const assets = artworkData.map(item => item.assets).filter(asset => asset !== null);
  const nextArtworkId = nextArtwork[0]?.id || null;
  const prevArtworkId = prevArtwork[0]?.id || null;
  console.log(`Rendering ArtworkPage for ${artwork.title} with eventSlug: ${eventSlug}`);

  return (
    <BackgroundDiv eventSlug={eventSlug || undefined} shouldCenter={false}>
      <div className="h-screen mx-auto flex flex-col">
        {/* Header section */}
        <EventHeader eventSlug={eventSlug || ""} lang={lang} stickyOverlay={false} className="px-0" />
        {/* Artwork details */}
        <div className="mx-4 mb-10 grid grid-cols-12 gap-4 text-primary-foreground h-[20vh]">
          <div className="col-span-3">
            <h1 className="text-7xl font-bold mb-4">{artwork.title}</h1>
          </div>
          <div className="col-span-6">
            <div className="mb-4">
              <h2 className="text-4xl font-semibold mb-4">{t("description")}</h2>
              <p>{artwork.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              {assets.map((asset, index) => (
                <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                  {asset.assetType}
                </Badge>
              ))}
            </div>
          </div>
          <div className="col-span-3">
            <div className="mb-4">
              <h2 className="text-4xl font-semibold mb-4">{t("artist")}</h2>
              <p>{credits.map(credit => `${credit.name || "Anonymous"} [${credit.title}]`).join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-grow overflow-x-auto">
          <Suspense fallback={<Loading />}>
            <div className="flex h-full items-center gap-4 px-4">
              {assets.map((asset, index) => (
                <div
                  key={asset.id}
                  className="h-full items-center justify-center bg-red-500"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${asset.filePath}`}
                    alt={`${artwork.title} - Asset ${index + 1}`}
                    className="h-full w-auto"
                  />
                </div>
              ))}
            </div>
          </Suspense>
        </main>

        <div className="my-8 mx-4 flex justify-between items-center">
          <Button variant="outline" disabled={!prevArtworkId} asChild>
            <Link href={`/artwork/${prevArtworkId}`}>
              {t("previousArtwork")}
            </Link>
          </Button>
          <Button variant="outline" disabled={!nextArtworkId} asChild>
            <Link href={`/artwork/${nextArtworkId}`}>
              {t("nextArtwork")}
            </Link>
          </Button>
        </div>

        {/* Footer section */}
        <footer className="bg-primary-200/10 z-30 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center text-muted-foreground">
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
