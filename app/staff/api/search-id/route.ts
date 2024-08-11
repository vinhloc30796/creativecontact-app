// File: app/staff/api/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { eventRegistrations } from '@/drizzle/schema';
import { createClient } from '@/utils/supabase/server';

// Define the schema for input validation
const searchSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get the current user's session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate the input
    const { id } = searchSchema.parse(await request.json());
    console.log('Searching for registration:', id);

    // Search for the registration
    const registrations = await db
      .select({
        id: eventRegistrations.id,
        created_at: eventRegistrations.created_at,
        status: eventRegistrations.status,
        signature: eventRegistrations.signature,
        slot: eventRegistrations.slot,
        name: eventRegistrations.name,
        email: eventRegistrations.email,
        phone: eventRegistrations.phone,
      })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.id, id));

    if (registrations.length === 0) {
      return NextResponse.json({ error: `Registration not found for id ${id}` }, { status: 404 });
    }
    else if (registrations.length > 1) {
      return NextResponse.json({ error: `Multiple registrations found for id ${id}` }, { status: 500 });
    }

    return NextResponse.json(registrations[0]);
  } catch (error) {
    console.error('Error during registration search:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'An error occurred during registration search',
    }, { status: 500 });
  }
}