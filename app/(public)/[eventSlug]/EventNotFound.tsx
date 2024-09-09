"use client";

import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Link from 'next/link';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const EventNotFound = ({ recentEvents, eventSlug }: { recentEvents: { id: string; name: string; slug: string }[], eventSlug: string }) => {
  const { t } = useTranslation(['eventSlug']);

  return (
    <BackgroundDiv eventSlug={eventSlug}>
      <Card className="w-[400px] mx-auto mt-10">
        <CardHeader
          className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: `url(/${eventSlug}-background.png), url(/banner.jpg)`,
            backgroundSize: "cover",
          }}
        >
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-2">
          <CardTitle>
            {t("EventNotFound.text")}
          </CardTitle>
          <p className="mb-4">
            <Trans
              i18nKey="eventSlug:UploadPageClient.EventNotFound.description"
              values={{ eventSlug }}
            >
              The event <strong>{eventSlug}</strong> does not exist. Perhaps you meant one of the following events?
            </Trans>
          </p>
          <div className="space-y-2">
            {recentEvents.map((recentEvent) => (
              <Button key={recentEvent.id} asChild variant="outline" className="w-full">
                <Link href={`/${recentEvent.slug}/upload`}>
                  {recentEvent.name}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </BackgroundDiv>
  )
}