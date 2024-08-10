// File: app/(public)/(event)/checkin/_sections/MagicSignIn.tsx
"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import styles from './_checkin.module.scss';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleMagicLinkRequest } from '../_utils/apiHelpers';

export function MagicSignIn() {
  const [email, setEmail] = useState<string>('');
  const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);

  return (
    <>
      <div
        className={cn('flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20', styles.step)}
        style={{ backgroundColor: '#F6EBE4' }}
      >
        <h2 className="text-2xl font-semibold">Magic Sign-In</h2>
        <p>Please enter your email for magic sign-in before check-in</p>
      </div>
      {magicLinkSent ? (
        <p>Magic link sent! Please check your email to continue.</p>
      ) : (
        <form onSubmit={(e) => handleMagicLinkRequest(e, email, setMagicLinkSent)} className="space-y-4">
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