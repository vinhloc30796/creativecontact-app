// File: app/(public)/(event)/checkin/_sections/UserDetails.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { EventRegistrationList } from './EventRegistrationList';
import { searchEventRegistration } from '../_utils/apiHelpers';
import { User } from '@supabase/supabase-js';
import { EventRegistrationWithSlot } from '@/app/types/EventRegistration';

interface UserDetailsProps {
  user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistrationWithSlot[] | null>(null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (user.email) {
      searchEventRegistration(user.email, setEventRegistrations, setSearchError);
    }
  }, [user.email]);

  return (
    <>
      <div className="space-y-4">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <EventRegistrationList
          eventRegistrations={eventRegistrations}
          searchError={searchError}
        />
      </div>
    </>
  );
}