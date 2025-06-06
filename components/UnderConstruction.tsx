// Imports
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { getServerTranslation } from '@/lib/i18n/init-server';
import { use } from "react";

// Props
interface UnderConstructionProps {
  eventSlug?: string;
}

// Main UnderConstruction component
export default async function UnderConstruction({ eventSlug }: UnderConstructionProps) {
  const { t } = await getServerTranslation('en', 'UnderConstructionPage');

  return (
    // Render centered background with content
    <BackgroundDiv shouldCenter={true} eventSlug={eventSlug}>
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">{t('underConstruction')}</h1>
        <p className="text-xl">{t('developmentMessage')}</p>
      </div>
    </BackgroundDiv>
  );
}