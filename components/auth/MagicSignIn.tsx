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
}

export function MagicSignIn({ purpose }: MagicSignInProps) {
  // State
  const [email, setEmail] = useState<string>('');
  const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // I18n
  const { t } = useTranslation('MagicSignIn');

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (magicLinkSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          const newCountdown = prevCountdown - 1;
          localStorage.setItem('magicLinkCountdown', newCountdown.toString());
          localStorage.setItem('magicLinkTimestamp', Date.now().toString());
          return newCountdown;
        });
      }, 1000);
    } else if (countdown === 0) {
      setMagicLinkSent(false);
      localStorage.removeItem('magicLinkCountdown');
      localStorage.removeItem('magicLinkTimestamp');
    }
    return () => clearInterval(timer);
  }, [magicLinkSent, countdown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleMagicLinkRequest(e, email, setMagicLinkSent);
      setCountdown(60);
      localStorage.setItem('magicLinkCountdown', '60');
      localStorage.setItem('magicLinkTimestamp', Date.now().toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2 bg-primary/10 p-4 mb-2'>
        <h1 className='text-2xl font-semibold text-primary'>{t(`title`)}</h1>
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
            />
          </div>
          <Button type="submit" disabled={isLoading} className='w-full'>
            {isLoading ? t(`sending`) : t(`send`)}
          </Button>
        </form>
      )}
    </>
  );
}