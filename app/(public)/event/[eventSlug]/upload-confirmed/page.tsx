// File: app/(public)/[eventSlug]/upload-confirmed/page.tsx
// Actions
import { getArtwork } from '@/app/actions/artwork/getArtwork';
import { getUserInfo } from '@/app/actions/user/getUserInfo';
// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
// Hooks
import { getServerTranslation } from '@/lib/i18n/init-server';
import { use } from "react";
// Next
import Link from 'next/link';

interface UploadConfirmedContentProps {
  params: Promise<{
    eventSlug: string;
  }>;
  searchParams: Promise<{
    email?: string;
    userId?: string;
    artworkId?: string;
    emailSent?: string;
    lang?: string;
  }>;
}

async function UploadConfirmedContent(props: UploadConfirmedContentProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { eventSlug } = params;
  const { email, userId, artworkId, emailSent, lang } = searchParams;
  const artwork = artworkId ? await getArtwork(artworkId) : null;
  const user = userId ? await getUserInfo(userId) : null;
  const { t } = await getServerTranslation(lang || 'en', ['upload-confirmed', 'common']);

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
            className='flex flex-col space-y-2 p-4 bg-primary/10 rounded-md border border-primary-foreground border-opacity-20'
          >
            <h2 className="text-2xl font-semibold text-primary">{t('UploadConfirmed.title')}</h2>
            <p>{t('UploadConfirmed.description')}</p>
            {emailSent === 'true' ? (
              <p>{t('UploadConfirmed.email.sent')}</p>
            ) : (
              <p>{t('UploadConfirmed.email.error', { email })}</p>
            )}
            <p className="text-muted-foreground text-sm">
              {user ? t('UploadConfirmed.user.loggedIn', { email: user.email }) : t('UploadConfirmed.user.guest')}
            </p>
          </div>

          <div className="space-y-2">
            <p>{t('UploadConfirmed.details.title')}</p>
            <ul className="list-disc list-inside">
              {Object.values(t('UploadConfirmed.details.points', { returnObjects: true })).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          {artwork && (
            <div className="bg-gray-100 p-4 rounded-md space-y-2">
              <p><strong>{t('UploadConfirmed.artwork.title')}:</strong> {artwork.title}</p>
              <p><strong>{t('UploadConfirmed.artwork.description')}:</strong> {artwork.description}</p>
              <p className="text-muted-foreground text-sm"><strong>{t('UploadConfirmed.artwork.id')}:</strong> {artwork.id}</p>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href={`/event/${eventSlug}`}>{t('common:viewGallery')}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">{t('common:backToHome')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </BackgroundDiv>
  );
}

export default UploadConfirmedContent;
