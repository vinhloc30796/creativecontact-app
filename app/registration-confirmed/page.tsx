// File: app/registration-confirmed/page.tsx

"use client";

import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import styles from '../(public)/(event)/checkin/_sections/_checkin.module.scss';
import { useAuth } from '@/hooks/useAuth';

export default function RegistrationConfirmed() {
  const { user, isLoading } = useAuth();

  return (
    <div className={cn('min-h-screen flex items-center justify-center', styles.container)} style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover' }}>
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: 'url(/banner.jpg)',
            backgroundSize: 'cover',
          }}
        />
        <CardContent className='p-6 flex flex-col gap-4'>
          <div
            className={cn('flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20', styles.step)}
            style={{ backgroundColor: '#F6EBE4' }}
          >
            <h2 className="text-2xl font-semibold">Registration Confirmed</h2>
            <p>Your registration has been successfully confirmed. Thank you for registering!</p>
          </div>

          {isLoading ? (
            <p>Loading user information...</p>
          ) : user ? (
            <div className="space-y-2">
              <p><strong>Registered Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          ) : (
            <p>User information not available. Please ensure you&apos;re logged in.</p>
          )}

          <div className="space-y-2">
            <p>Please check your email for a confirmation message with the following details:</p>
            <ul className="list-disc list-inside">
              <li>Event schedule</li>
              <li>Venue information</li>
              <li>Any required materials or preparation</li>
              <li>Contact information for event organizers</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href={
                `https://creativecontact.vn/?utm_source=webapp&utm_medium=button&utm_campaign=registration-confirmed&utm_content=${user.id}`
              }>Go to Event Page</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}