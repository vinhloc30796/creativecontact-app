// File: app/(public)/(event)/checkin/_sections/EventRegistrationList.tsx
"use client";

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { EventRegistration } from '../_types/EventRegistration';
import { handleCheckin } from '../_utils/apiHelpers';

interface EventRegistrationListProps {
  eventRegistrations: EventRegistration[] | null;
  searchError: string;
}

interface CheckinStatus {
  id: string;
  status: 'success' | 'failure';
}

export function EventRegistrationList({ eventRegistrations, searchError }: EventRegistrationListProps) {
  const [checkinStatus, setCheckinStatus] = useState<CheckinStatus | null>(null);

  return (
    <>
      {eventRegistrations && eventRegistrations.length > 0 ? (
        eventRegistrations.map((registration) => (
          <React.Fragment key={registration.id}>
            <div className="border p-4 rounded-md">
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