// File: app/(public)/(event)/checkin/_sections/EventRegistrationList.tsx
"use client";

import { EventRegistrationWithSlot } from '@/app/types/EventRegistration';
import { Button } from '@/components/ui/button';
import { dateFormatter, timeslotFormatter } from '@/lib/timezones';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { CheckinStatus, handleCheckin } from '../_utils/apiHelpers';

export interface EventRegistrationWithSlotListProps {
  eventRegistrations: EventRegistrationWithSlot[] | null;
  searchError: string;
  userEmail: string | null;
}

export function EventRegistrationList({ eventRegistrations, searchError, userEmail }: EventRegistrationWithSlotListProps) {
  const [checkinStatus, setCheckinStatus] = useState<CheckinStatus | null>(null);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch('/signout', { method: 'POST' });
      if (response.ok) {
        router.push('/checkin');
      } else {
        console.error('Sign out failed');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <>
      {eventRegistrations && eventRegistrations.length > 0 ? (
        eventRegistrations.map((registration) => {
          const dateStr = dateFormatter.format(new Date(registration.slot_time_start));
          const timeStartStr = timeslotFormatter.format(new Date(registration.slot_time_start));
          const timeEndStr = timeslotFormatter.format(new Date(registration.slot_time_end));
          return ( 
            <React.Fragment key={registration.id}>
              <div className="border p-4 rounded-md">
                <h3 className="font-semibold">Registration</h3>
                <p><strong>Name:</strong> {registration.name}</p>
                <p><strong>Status:</strong> {registration.status}</p>
                <p><strong>Slot Date:</strong> {dateStr}</p>
                <p><strong>Slot Time:</strong> {timeStartStr} - {timeEndStr}</p>
                {checkinStatus?.id === registration.id && (
                  <p className={`mt-2 ${checkinStatus.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {checkinStatus.status === 'success'
                      ? 'Check-in successful! Welcome & enjoy the event!'
                      : `Check-in failed: ${checkinStatus.errorMessage || 'An error occurred'}`}
                  </p>
                )}
              </div>
              <div className="flex flex-row gap-4 mt-2">

                <Button type="submit" onClick={handleSignOut} variant="secondary" className="w-full">
                  {userEmail ? "Sign out" : "Retry"}
                </Button>
                <Button
                  className="w-full"
                  onClick={() => handleCheckin(registration.id, setCheckinStatus)}
                  disabled={checkinStatus?.id === registration.id}
                >
                  Check-in
                </Button>
              </div>
            </React.Fragment>
          )
        })
      ) : (
        <div className="flex flex-col gap-4">
          <p>No event registrations found. Please retry with a different email address.</p>
          <Button type="submit" onClick={handleSignOut} variant="secondary" className="w-full">
            {userEmail ? "Sign out" : "Retry"}
          </Button>
        </div>
      )}
      {searchError && <p className="text-red-500">{searchError}</p>}
    </>
  );
}