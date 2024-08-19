// File: app/(public)/(event)/checkin/_sections/MagicSignIn.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import styles from './_checkin.module.scss';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleMagicLinkRequest } from '../_utils/apiHelpers';

export function MagicSignIn() {
  const [email, setEmail] = useState<string>('');
  const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

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
    await handleMagicLinkRequest(e, email, setMagicLinkSent);
    setCountdown(60);
    localStorage.setItem('magicLinkCountdown', '60');
    localStorage.setItem('magicLinkTimestamp', Date.now().toString());
  };

  return (
    <>
      <div
        className={cn('flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20', styles.step)}
        style={{ backgroundColor: '#F6EBE4' }}
      >
        <h2 className="text-2xl font-semibold text-primary">Magic Sign-In</h2>
        <p>Please enter your email for magic sign-in before check-in</p>
      </div>
      {magicLinkSent ? (
        <div>
          <p>Magic link sent! Please check your email to continue.</p>
          <p>You can request a new link in {countdown} seconds.</p>
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
          <Button type="submit">
            Send Magic Link
          </Button>
        </form>
      )}
    </>
  );
}