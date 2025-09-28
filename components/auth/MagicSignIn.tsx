// File: app/(public)/(event)/checkin/_sections/MagicSignIn.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleMagicLinkRequest } from '@/app/(public)/(event)/checkin/_utils/apiHelpers';

interface MagicSignInProps {
  purpose: 'login' | 'checkin';
  redirectTo?: string;
}

export function MagicSignIn({ purpose, redirectTo }: MagicSignInProps) {
  // State
  const [email, setEmail] = useState<string>('');
  const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // I18n
  const { t } = useTranslation('MagicSignIn');
  const fallbackRedirect = purpose === 'checkin' ? '/checkin' : '/';

  // Effects
  useEffect(() => {
    const storedCountdown = localStorage.getItem('magicLinkCountdown');
    const storedTimestamp = localStorage.getItem('magicLinkTimestamp');

    if (storedCountdown && storedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - parseInt(storedTimestamp)) / 1000);
      const remainingTime = Math.max(0, parseInt(storedCountdown) - elapsedTime);

      if (remainingTime > 0) {
        setMagicLinkSent(true);
        setCountdown(remainingTime);
      } else {
        localStorage.removeItem('magicLinkCountdown');
        localStorage.removeItem('magicLinkTimestamp');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleMagicLinkRequest(e, email, setMagicLinkSent, redirectTo ?? fallbackRedirect);
      setCountdown(60);
      localStorage.setItem('magicLinkCountdown', '60');
      localStorage.setItem('magicLinkTimestamp', Date.now().toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 bg-sunglow/10 p-4 mb-2 rounded-md border border-sunglow/40">
        <h1 className="text-2xl font-semibold">{t(`title`)}</h1>
        <p>{t(`${purpose}.description`)}</p>
      </div>
      {magicLinkSent ? (
        <div className="flex flex-col">
          <p>{t(`success`)}</p>
          <p>{t(`countdown`, { countdown })}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus-visible:ring-sunglow focus-visible:ring-offset-2"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sunglow text-black hover:bg-yellow-400 focus-visible:ring-yellow-500"
          >
            {isLoading ? t(`sending`) : t(`send`)}
          </Button>
        </form>
      )}
    </>
  );
}