import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { useTranslation } from '@/lib/i18n/init-server';

interface ArtworkPageProps {
  params: {
    eventSlug: string;
    artworkId: string;
  };
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { eventSlug } = params;
  const { t } = await useTranslation('en', 'ArtworkPage');

  return (
    <BackgroundDiv eventSlug={eventSlug} shouldCenter={true}>
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">{t('underConstruction')}</h1>
        <p className="text-xl">{t('developmentMessage')}</p>
      </div>
    </BackgroundDiv>
  );
}
