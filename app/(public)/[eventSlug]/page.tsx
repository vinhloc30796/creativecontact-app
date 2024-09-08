// File: app/(public)/[eventSlug]/page.tsx

import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface EventPageProps {
  params: {
    eventSlug: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  // Get event slug from url
  redirect(`/${params.eventSlug}/upload`);
}
