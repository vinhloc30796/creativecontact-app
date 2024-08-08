// File: app/(public)/(event)/api/event-slots/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { eventSlots } from '@/drizzle/schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID (eventId) is required' }, { status: 400 });
  }

  try {
    const slots = await db.select().from(eventSlots).where(eq(eventSlots.event, eventId));
    return NextResponse.json(slots);
  } catch (err) {
    console.error('Error fetching event slots:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}