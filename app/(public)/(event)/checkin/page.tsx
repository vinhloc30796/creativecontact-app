// File: app/(public)/(event)/checkin/page.tsx
"use client";

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CheckInContainer } from './_sections/CheckInContainer';
import { UserDetails } from './_sections/UserDetails';
import { MagicSignIn } from '../../../../components/auth/MagicSignIn';

export default function CheckInPage() {
  const { user, isLoading, error, isAnonymous } = useAuth();

  return (
    <CheckInContainer>
      {isLoading ? (
        <p>Loading...</p>
      ) : (user && !isAnonymous) ? (
        <Suspense fallback={null}>
          <UserDetails user={user} />
        </Suspense>
      ) : (
        <MagicSignIn purpose="checkin" />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </CheckInContainer>
  );
}