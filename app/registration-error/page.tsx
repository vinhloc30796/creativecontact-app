// File: app/registration-error/page.tsx

"use client";

import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import styles from '../(public)/(event)/checkin/_sections/_checkin.module.scss';
import { AlertCircle } from 'lucide-react';
import { NextResponse } from 'next/server';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';

export default function RegistrationError() {
  const supabase = createClient();

  const handleRetry = async () => {
    // Redirect to registration page
    console.log('Redirecting to registration page');
    const redirectUrl = new URL('/', window.location.origin);
    window.location.href = redirectUrl.toString();
  };

  return (
    <BackgroundDiv>
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: 'url(/hoantat-2024-background.png)',
            backgroundSize: 'cover',
          }}
        />
        <CardContent className='p-6 flex flex-col gap-4'>
          <div
            className={cn('flex flex-col space-y-2 p-4 bg-red-100 rounded-md border border-red-300', styles.step)}
          >
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-red-700">
              <AlertCircle size={24} />
              Registration Error
            </h2>
            <p>We&apos;re sorry, but there was an error confirming your registration.</p>
          </div>

          <div className="space-y-2">
            <p>This might be due to one of the following reasons:</p>
            <ul className="list-disc list-inside">
              <li>The confirmation link has expired</li>
              <li>The confirmation link has already been used</li>
              <li>There was a technical issue with our system</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-semibold">What you can do:</p>
            <ol className="list-decimal list-inside">
              <li>Try to register again using the button below</li>
              <li>Check your email for a more recent confirmation link</li>
              <li>Contact our support team if the issue persists</li>
            </ol>
          </div>

          <div className="flex flex-col space-y-2">
            <Button onClick={handleRetry}>
              Retry Registration
            </Button>
            <Button variant="outline" asChild>
              <Link href="mailto:hello@creativecontact.vn">Contact Support: hello@creativecontact.vn</Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="/">Return to Home Page</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </BackgroundDiv>
  );
}