// File: app/staff/api/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { eventRegistrations } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';

// Define the schema for input validation
const searchSchema = z.object({
  slotId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate the input
    const { slotId } = searchSchema.parse(await request.json());

    // Search for the registration
    const registration = await db
      .select({
        id: eventRegistrations.id,
        createdAt: eventRegistrations.createdAt,
        status: eventRegistrations.status,
        signature: eventRegistrations.signature,
        slot: eventRegistrations.slot,
        name: eventRegistrations.name,
        email: eventRegistrations.email,
        phone: eventRegistrations.phone,
      })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.slot, slotId))
      .limit(1);

    if (registration.length === 0) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json(registration[0]);
  } catch (error) {
    console.error('Error during registration search:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'An error occurred during registration search',
    }, { status: 500 });
  }
}