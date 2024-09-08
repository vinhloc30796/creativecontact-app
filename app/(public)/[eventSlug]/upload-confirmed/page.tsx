"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { useQuery } from '@tanstack/react-query';
import { useTranslation, Trans } from 'react-i18next';

interface UploadConfirmedContentProps {
  params: {
    eventSlug: string;
  };
}

function UploadConfirmedContent({ params }: UploadConfirmedContentProps) {
  const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  // Params
  const { eventSlug } = params;
  const searchParams = useSearchParams();
  // Auth
  const { user, isLoading } = useAuth();
  // State
  const [uploadInfo, setUploadInfo] = useState({
    email: '',
    userId: '',
    artworkId: ''
  });
  const [emailStatus, setEmailStatus] = useState<'sent' | 'error'>('sent');
  // I18n
  const { t } = useTranslation(["upload-confirmed"], { keyPrefix: "UploadConfirmed" });

  useEffect(() => {
    const info = {
      email: searchParams.get('email') || '',
      userId: searchParams.get('userId') || '',
      artworkId: searchParams.get('artworkId') || ''
    };
    setUploadInfo(info);

    const emailSent = searchParams.get('emailSent') === 'true';
    setEmailStatus(emailSent ? 'sent' : 'error');
  }, [searchParams]);

  const { data: artwork, isLoading: isArtworkLoading, error: artworkError } = useQuery({
    queryKey: ['artwork', uploadInfo.artworkId],
    queryFn: async () => {
      if (!uploadInfo.artworkId) return null;
      const response = await fetch(`/api/artworks/${uploadInfo.artworkId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artwork');
      }
      return response.json();
    },
    enabled: !!uploadInfo.artworkId,
  });

  return (
    <BackgroundDiv eventSlug={eventSlug}>
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: `url(/${eventSlug}-background.png)`,
            backgroundSize: 'cover',
          }}
        />
        <CardContent className='p-6 flex flex-col gap-4'>
          <div
            className='flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20'
            style={{ backgroundColor: '#F6EBE4' }}
          >
            <h2 className="text-2xl font-semibold text-primary">{t("title")}</h2>
            <p>{t("description")}</p>
            {emailStatus === 'sent' && <p>{t("email.sent")}</p>}
            {emailStatus === 'error' && <p>
              <Trans
                i18nKey="email.error"
                values={{ email: "creative.contact.vn@gmail.com" }}
                components={{ a: <a href="mailto:creative.contact.vn@gmail.com" className='underline' /> }}
              />
            </p>}
            <div>
              <p className="text-muted-foreground text-sm">
                {isLoading ? t("user.loading") : (user?.email ? t("user.loggedIn", { email: user.email }) : t("user.guest"))}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p>{t("details.title")}</p>
            <ul className="list-disc list-inside">
              <li>{t("details.points.submission")}</li>
              <li>{t("details.points.artwork")}</li>
              <li>{t("details.points.review")}</li>
              <li>{t("details.points.contact")}</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-md space-y-4">
            {isArtworkLoading ? (
              <p>{t("artwork.loading")}</p>
            ) : artworkError ? (
              <p>{t("artwork.error")}</p>
            ) : artwork ? (
              <>
                <p><strong>{t("artwork.id")}:</strong> {artwork.id}</p>
                <ul className='list-disc list-inside'>
                  <li><strong>{t("artwork.title")}:</strong> {artwork.title}</li>
                  <li><strong>{t("artwork.description")}:</strong> {artwork.description}</li>
                </ul>
                {/* Add more artwork details as needed */}
              </>
            ) : (
              <p>{t("artwork.notFound")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </BackgroundDiv >
  )
}

export default UploadConfirmedContent;
