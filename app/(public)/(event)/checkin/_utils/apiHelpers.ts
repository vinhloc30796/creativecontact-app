// File: app/(public)/(event)/checkin/_utils/apiHelpers.ts
"use client";

import { sendSignInWithOtp } from "@/app/actions/email/sendSignIn";
import { EventRegistrationWithSlot } from '@/app/types/EventRegistration';

type SetEventRegistrations = React.Dispatch<React.SetStateAction<EventRegistrationWithSlot[] | null>>;
type SetSearchError = React.Dispatch<React.SetStateAction<string>>;
type SetMagicLinkSent = React.Dispatch<React.SetStateAction<boolean>>;
export type CheckinStatus = {
  id: string;
  status: 'success' | 'failure';
  errorMessage?: string;
};
type SetCheckinStatus = (status: CheckinStatus) => void;


export async function searchEventRegistration(
  userEmail: string,
  setEventRegistrations: SetEventRegistrations,
  setSearchError: SetSearchError
): Promise<void> {
  try {
    const response = await fetch(`/api/search-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch event registration');
    }
    const data = await response.json();
    setEventRegistrations(data);
    setSearchError('');
  } catch (err) {
    console.error('Error searching event registration:', err);
    setEventRegistrations(null);
    setSearchError('Failed to find event registration. Please try again.');
  }
}

export async function handleCheckin(
  registrationId: string,
  setCheckinStatus: SetCheckinStatus
): Promise<void> {
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
      setCheckinStatus({ 
        id: registrationId, 
        status: 'failure', 
        errorMessage: data.error || 'Check-in failed'
      });
    }
  } catch (err) {
    console.error('Error during check-in:', err);
    setCheckinStatus({ 
      id: registrationId, 
      status: 'failure', 
      errorMessage: 'An unexpected error occurred'
    });
  }
}

export async function handleMagicLinkRequest(
  e: React.FormEvent<HTMLFormElement>,
  email: string,
  setMagicLinkSent: SetMagicLinkSent
): Promise<void> {
  e.preventDefault();
  try {
    const response = await fetch('/api/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send magic link');
    }

    setMagicLinkSent(true);
  } catch (err) {
    console.error('Error sending magic link:', err);
    // You might want to set an error state here and display it to the user
  }
}
