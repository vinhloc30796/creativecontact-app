/**
 * API Route: Search Registration by ID
 * 
 * This route lets staff members look up event registrations using a UUID.
 * It's protected by Payload authentication - only staff members can access it.
 * 
 * Example usage with curl:
 * ```bash
 * # First get a token by logging into Payload admin
 * # Then use that token in the Authorization header
 * 
 * curl -X POST \
 *   http://localhost:3000/staff/api/search-id \
 *   -H 'Content-Type: application/json' \
 *   -H 'Authorization: Bearer YOUR_PAYLOAD_TOKEN' \
 *   -d '{"id": "123e4567-e89b-12d3-a456-426614174000"}'
 * ```
 * 
 * Responses:
 * - 200: Registration found (returns registration data)
 * - 400: Invalid UUID format
 * - 401: Not authenticated
 * - 404: Registration not found
 * - 500: Server error
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { eventRegistrations } from "@/drizzle/schema/event";
import { protectStaffAPI } from '@/utils/middleware/staff-access';
import { AuthenticatedRequest } from '@/utils/middleware/payload-auth';

// Force edge runtime
export const runtime = 'edge';

// We use zod to make sure we get a valid UUID
// This prevents SQL injection and invalid searches
const searchSchema = z.object({
  id: z.string().uuid({
    message: "Invalid registration ID format"
  }),
});

// This type helps TypeScript catch any mistakes when we're working with the response data
interface SearchResponse {
  id: string;
  created_at: Date;
  status: string;
  signature: string | null;
  slot: string;
  name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  phone_country_alpha3: string;
}

async function handler(req: AuthenticatedRequest) {
  console.log('[Search-ID handler] Starting request processing');
  try {
    // Make sure we only accept POST requests
    if (req.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Check if the input is valid before touching the database
    const body = await req.json();
    console.log('Search-ID handler: Received body:', body);

    const result = searchSchema.safeParse(body);

    if (!result.success) {
      console.log('Search-ID handler: Validation failed:', result.error);
      return NextResponse.json({
        error: 'Invalid input',
        details: result.error.errors
      }, { status: 400 });
    }

    const { id } = result.data;
    console.log('Search-ID handler: Searching for registration:', id);

    // Get just the fields we need from the database
    // This makes our queries faster and uses less memory
    const registrations = await db
      .select({
        id: eventRegistrations.id,
        created_at: eventRegistrations.created_at,
        status: eventRegistrations.status,
        signature: eventRegistrations.signature,
        slot: eventRegistrations.slot,
        name: eventRegistrations.name,
        email: eventRegistrations.email,
        phone_country_code: eventRegistrations.phone_country_code,
        phone_number: eventRegistrations.phone_number,
        phone_country_alpha3: eventRegistrations.phone_country_alpha3,
      })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.id, id));

    // Give a clear error if we can't find the registration
    if (registrations.length === 0) {
      return NextResponse.json({
        error: `Registration not found`,
        details: { id }
      }, { status: 404 });
    }

    // This should never happen (UUID is unique)
    // But if it does, we need to know about it
    if (registrations.length > 1) {
      console.error(`Data integrity issue: Multiple registrations found for ID ${id}`);
      return NextResponse.json({
        error: 'Data integrity error',
        details: { message: 'Multiple registrations found' }
      }, { status: 500 });
    }

    // Send back the registration data
    // TypeScript makes sure we're sending the right data structure
    return NextResponse.json<SearchResponse>(registrations[0]);

  } catch (error) {
    // Log the error so we can debug issues in production
    // But don't send internal error details to the client
    console.error('Error during registration search:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

// Wrap our handler with protection - only staff members can use this API
export const POST = protectStaffAPI(handler);