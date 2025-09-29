// File: app/(public)/(event)/checkin/page.tsx
"use client";

import { MagicSignIn } from '@/components/auth/MagicSignIn';
import { useAuth } from '@/hooks/useAuth';
import { Suspense } from 'react';
import { CheckInContainer } from './_sections/CheckInContainer';
import { UserDetails } from './_sections/UserDetails';

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