// File: app/(auth)/login/page.tsx
"use client";

import { MagicSignIn } from '@/components/auth/MagicSignIn';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { Loading } from '@/components/Loading';

function LoginContent() {
  return (
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
  );
}

export default function LoginPage() {
  return (
    <BackgroundDiv>
      <Suspense fallback={<Loading />}>
        <LoginContent />
      </Suspense>
    </BackgroundDiv>
  );
}
