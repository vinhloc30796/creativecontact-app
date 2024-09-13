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

interface ArtworkPageProps {
  params: {
    artworkId: string;
  };
  searchParams: {
    lang: string;
  };
}

export default async function ArtworkPage({ params, searchParams }: ArtworkPageProps) {
  const { artworkId } = params;
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, ["ArtworkPage", "common"]);

  // Fetch artwork data
  const artworkData = await db
    .select({
      artwork: artworks,
      assets: artworkAssets,
      event: artworkEvents,
      eventSlug: events.slug
    })
    .from(artworks)
    .leftJoin(artworkAssets, eq(artworks.id, artworkAssets.artworkId))
    .leftJoin(artworkEvents, eq(artworks.id, artworkEvents.artworkId))
    .leftJoin(events, eq(artworkEvents.eventId, events.id))
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
    })
    .from(artworkCredits)
    .where(eq(artworkCredits.artworkId, artworkId));

  // Fetch user details for each credit
  const creditsWithUserDetails = await Promise.all(
    credits.map(async (credit) => {
      const userInfo = await getUserInfo(credit.userId);

      return {
        ...credit,
        user: userInfo ? {
          name: userInfo.displayName,
          email: userInfo.email,
        } : null,
      };
    })
  );

  if (!artworkData || artworkData.length === 0) {
    return <div>Artwork not found</div>;
  }

  const artwork = artworkData[0].artwork;
  const eventSlug = artworkData[0].eventSlug;
  const assets = artworkData.map(item => item.assets).filter(asset => asset !== null);
  const nextArtworkId = nextArtwork[0]?.id || null;
  const prevArtworkId = prevArtwork[0]?.id || null;

  return (
    <BackgroundDiv eventSlug={eventSlug || undefined} shouldCenter={false}>
      <div className="min-h-screen flex flex-col">
        {/* Header section */}
        <header className="sticky top-0 left-0 right-0 bg-primary-900/90 z-30 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary-foreground">Creative Contact</h1>
            </div>
            <div className="flex-1 text-center">
              <div className="space-x-4">
                <Button variant="secondary" disabled>
                  {t("common:about")}
                </Button>
                <Button variant="secondary" asChild>
                  <Link href={`/${eventSlug}`}>{t("common:gallery")}</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="space-x-4">
                <Button variant="ghost" className="text-accent" asChild>
                  <Link href="/upload">{t("common:upload")}</Link>
                </Button>
                <Button variant="ghost" className="text-accent" asChild>
                  <Link href="/signup">{t("common:signup")}</Link>
                </Button>
                <Button variant="ghost" className="text-accent" asChild>
                  <Link href="/login">{t("common:login")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8">
              {/* Artwork details */}
              <div className="grid grid-cols-12 gap-4 text-primary-foreground">
                <div className="col-span-3">
                  <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
                </div>
                <div className="col-span-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-2">{t("description")}</h2>
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
                    <h2 className="text-2xl font-semibold mb-2">{t("artist")}</h2>
                    <p>{creditsWithUserDetails.map(credit => `${credit.user?.name} ${credit.user?.email}`).join(', ')}</p>
                  </div>
                </div>
              </div>
              {/* Artwork assets */}
              <div className="flex-1">
                <Suspense fallback={<Loading />}>
                  <Carousel className="w-full max-w-4xl mx-auto">
                    <CarouselContent>
                      {assets.map((asset, index) => (
                        <CarouselItem key={asset.id}>
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${asset.filePath}`}
                                alt={`${artwork.title} - Asset ${index + 1}`}
                                width={800}
                                height={800}
                                objectFit="contain"
                              />
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </Suspense>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
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
          </div>
        </main>

        {/* Footer section */}
        <footer className="sticky bottom-0 left-0 right-0 bg-primary-200/10 z-30 shadow-md">
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
    </BackgroundDiv>
  );
}
