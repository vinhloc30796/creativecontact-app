// File: /home/vinhloc30796/work_creativecontact/creative-contact-prealpha/app/(public)/(event)/event/register/_sections/EventSlotsFetcher.tsx

import { db } from '@/lib/db';
import { eventSlots } from '@/db/schema';
import { eq } from 'drizzle-orm';
import RegistrationForm from './form';

// Define the type for the data returned from the database
interface DbEventSlot {
  id: string;
  createdAt: Date;
  event: string;
  timeStart: Date;
  timeEnd: Date;
  capacity: number;
}

// Define the EventSlot type expected by the RegistrationForm
interface EventSlot {
  id: string;
  timeStart: string;
  timeEnd: string;
  capacity: number;
}

async function getEventSlots(eventId: string): Promise<EventSlot[]> {
  try {
    const slots: DbEventSlot[] = await db.select().from(eventSlots).where(eq(eventSlots.event, eventId));
    
    // Transform the data to match the EventSlot interface
    return slots.map(slot => ({
      id: slot.id,
      timeStart: slot.timeStart.toISOString(),
      timeEnd: slot.timeEnd.toISOString(),
      capacity: slot.capacity
    }));
  } catch (error) {
    console.error('Failed to fetch event slots:', error);
    throw new Error('Failed to fetch event slots');
  }
}

export default async function EventSlotsFetcher({ eventId }: { eventId: string }) {
  const slots = await getEventSlots(eventId);
  
  return <RegistrationForm initialEventSlots={slots} />;
}