import React from 'react';
import CreativeContactLogo, { LogoVariant } from '@/components/branding/CreativeContactLogo';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        <CreativeContactLogo
          variant={LogoVariant.SHORT}
          width={120}
          className="opacity-75"
        />
      </div>
    </div>
  );
};
