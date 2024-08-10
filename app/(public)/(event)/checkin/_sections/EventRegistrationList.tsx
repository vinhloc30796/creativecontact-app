// File: app/(public)/(event)/checkin/_sections/EventRegistrationList.tsx
"use client";

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { EventRegistrationWithSlot } from '@/app/types/EventRegistration';
import { handleCheckin, CheckinStatus } from '../_utils/apiHelpers';

export interface EventRegistrationWithSlotListProps {
  eventRegistrations: EventRegistrationWithSlot[] | null;
  searchError: string;
}

export function EventRegistrationList({ eventRegistrations, searchError }: EventRegistrationWithSlotListProps) {
  const [checkinStatus, setCheckinStatus] = useState<CheckinStatus | null>(null);

  return (
    <>
      {eventRegistrations && eventRegistrations.length > 0 ? (
        eventRegistrations.map((registration) => (
          <React.Fragment key={registration.id}>
            <div className="border p-4 rounded-md">
              <h3 className="font-semibold">Registration</h3>
              <p><strong>Event:</strong> {registration.name}</p>
              <p><strong>Status:</strong> {registration.status}</p>
              <p><strong>Slot Time:</strong> {new Date(registration.slot_time_start).toLocaleString()} - {new Date(registration.slot_time_end).toLocaleString()}</p>
              {checkinStatus?.id === registration.id && (
                <p className={`mt-2 ${checkinStatus.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {checkinStatus.status === 'success' 
                    ? 'Check-in successful' 
                    : `Check-in failed: ${checkinStatus.errorMessage || 'An error occurred'}`}
                </p>
              )}
            </div>
            <Button
              className="mt-2 w-full"
              onClick={() => handleCheckin(registration.id, setCheckinStatus)}
              disabled={checkinStatus?.id === registration.id}
            >
              Check-in
            </Button>
          </React.Fragment>
        ))
      ) : (
        <p>No event registrations found.</p>
      )}
      {searchError && <p className="text-red-500">{searchError}</p>}
    </>
  );
}