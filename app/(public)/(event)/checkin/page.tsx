// File: app/(public)/(event)/checkin/page.tsx
"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CheckInContainer } from './_sections/CheckInContainer';
import { UserDetails } from './_sections/UserDetails';
import { MagicSignIn } from './_sections/MagicSignIn';

export default function CheckInPage() {
  const { user, isLoading, error, isAnonymous } = useAuth();

  return (
    <CheckInContainer>
      {isLoading ? (
        <p>Loading...</p>
      ) : (user && !isAnonymous) ? (
        <UserDetails user={user} />
      ) : (
        <MagicSignIn />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </CheckInContainer>
  );
}