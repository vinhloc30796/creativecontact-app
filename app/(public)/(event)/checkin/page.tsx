// File: app/(public)/(event)/checkin/page.tsx
"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import styles from './_sections/_checkin.module.scss';
import { useAuth } from '@/hooks/useAuth';

export default function CheckInPage() {
  const supabase = createClient();
  const { user, isLoading, error, isAnonymous } = useAuth();

  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLinkRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/checkin`,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
    } catch (err) {
      console.error('Error sending magic link:', err);
    }
  };

  return (
    <div className={cn('min-h-screen flex items-center justify-center', styles.container)} style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover' }}>
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: 'url(/banner.jpg)',
            backgroundSize: 'cover',
          }}
        />
        <CardContent className='p-6 flex flex-col gap-2'>
          {isLoading ? (
            <p>Loading...</p>
          ) : (user && !isAnonymous) ? (
            <>
              <div
                className={cn('flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20', styles.step)}
                style={{ backgroundColor: '#F6EBE4' }}
              >
                <h2 className="text-2xl font-semibold">Check-in</h2>
                <p>Here are your User Details</p>
              </div>
              <div className="space-y-4">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
              <Button type="submit">
                Check In
              </Button>
            </>
          ) : (
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
                <form onSubmit={handleMagicLinkRequest} className="space-y-4">
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
          )}
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}