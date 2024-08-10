// File: app/(public)/(event)/checkin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { sendSignInWithOtp } from '@/app/actions/email';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import styles from './_sections/_checkin.module.scss';
import { eventRegistrations, eventSlots, events } from "@/drizzle/schema";

type EventRegistration = typeof eventRegistrations.$inferSelect & {
  slotId: typeof eventSlots.$inferSelect['id'];
  slotTimeStart: typeof eventSlots.$inferSelect['timeStart'];
  slotTimeEnd: typeof eventSlots.$inferSelect['timeEnd'];
  eventId: typeof events.$inferSelect['id'];
  eventName: typeof events.$inferSelect['name'];
};

export default function CheckInPage() {
  const supabase = createClient();
  const { user, isLoading, error, isAnonymous } = useAuth();

  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[] | null>(null);
  const [searchError, setSearchError] = useState('');
  const [checkinStatus, setCheckinStatus] = useState<{ id: string; status: string } | null>(null);
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000";

  const handleMagicLinkRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await sendSignInWithOtp(email, {
        redirectTo: `${hostUrl}/checkin`,
        shouldCreateUser: false,
      });

      if (result.error) throw result.error;

      setMagicLinkSent(true);
    } catch (err) {
      console.error('Error sending magic link:', err);
    }
  };

  const searchEventRegistration = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/search-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch event registration');
      }
      const data: EventRegistration[] = await response.json();
      setEventRegistrations(data);
      setSearchError('');
    } catch (err) {
      console.error('Error searching event registration:', err);
      setEventRegistrations(null);
      setSearchError('Failed to find event registration. Please try again.');
    }
  };

  const handleCheckin = async (registrationId: string) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: registrationId }),
      });
      const data = await response.json();
      if (response.ok) {
        setCheckinStatus({ id: registrationId, status: 'success' });
      } else {
        setCheckinStatus({ id: registrationId, status: 'failure' });
      }
    } catch (err) {
      console.error('Error during check-in:', err);
      setCheckinStatus({ id: registrationId, status: 'failure' });
    }
  };

  useEffect(() => {
    if (user && !isAnonymous && user.email) {
      searchEventRegistration(user.email);
    }
  }, [user, isAnonymous]);

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
                {eventRegistrations && eventRegistrations.length > 0 ? (
                  eventRegistrations.map((registration) => (
                    <>
                      <div key={registration.id} className="border p-4 rounded-md">
                        <h3 className="font-semibold">Registration</h3>
                        <p><strong>Event:</strong> {registration.eventName}</p>
                        <p><strong>Status:</strong> {registration.status}</p>
                        <p><strong>Slot Time:</strong> {new Date(registration.slotTimeStart).toLocaleString()} - {new Date(registration.slotTimeEnd).toLocaleString()}</p>
                        {checkinStatus?.id === registration.id && (
                          <p className={`mt-2 ${checkinStatus.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            Check-in {checkinStatus.status === 'success' ? 'successful' : 'failed'}
                          </p>
                        )}
                      </div>
                      <Button
                        className="mt-2 w-full"
                        onClick={() => handleCheckin(registration.id)}
                        disabled={checkinStatus?.id === registration.id}
                      >
                        Check-in
                      </Button>
                    </>
                  ))
                ) : (
                  <p>No event registrations found.</p>
                )}
                {searchError && <p className="text-red-500">{searchError}</p>}
              </div>
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