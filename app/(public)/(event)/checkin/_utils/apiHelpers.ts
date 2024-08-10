// File: app/(public)/(event)/checkin/_utils/apiHelpers.ts
"use client";

// File: app/(public)/(event)/checkin/_utils/apiHelpers.ts
import { sendSignInWithOtp } from '@/app/actions/email';
import { EventRegistration } from '../_types/EventRegistration';

type SetEventRegistrations = React.Dispatch<React.SetStateAction<EventRegistration[] | null>>;
type SetSearchError = React.Dispatch<React.SetStateAction<string>>;
type SetMagicLinkSent = React.Dispatch<React.SetStateAction<boolean>>;
type SetCheckinStatus = React.Dispatch<React.SetStateAction<{ id: string; status: 'success' | 'failure' } | null>>;

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
      setCheckinStatus({ id: registrationId, status: 'failure' });
    }
  } catch (err) {
    console.error('Error during check-in:', err);
    setCheckinStatus({ id: registrationId, status: 'failure' });
  }
}

export async function handleMagicLinkRequest(
  e: React.FormEvent<HTMLFormElement>,
  email: string,
  setMagicLinkSent: SetMagicLinkSent
): Promise<void> {

  e.preventDefault();
  try {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000";
    const result = await sendSignInWithOtp(email, {
      redirectTo: `${hostUrl}/checkin`,
      shouldCreateUser: false,
    });

    if (result.error) throw result.error;

    setMagicLinkSent(true);
  } catch (err) {
    console.error('Error sending magic link:', err);
  }
}