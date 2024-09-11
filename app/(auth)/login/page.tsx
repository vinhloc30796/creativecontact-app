// File: app/(auth)/login/page.tsx
"use client";

import { MagicSignIn } from '@/components/auth/MagicSignIn';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  const { t } = useTranslation('auth');

  return (
    <BackgroundDiv eventSlug="early-access-2024">
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: 'url(/banner.jpg)',
            backgroundSize: 'cover',
          }}
        />
        <CardContent className='p-6 flex flex-col gap-2'>
          <MagicSignIn purpose="login" />
        </CardContent>
      </Card>
    </BackgroundDiv>
  );
}
