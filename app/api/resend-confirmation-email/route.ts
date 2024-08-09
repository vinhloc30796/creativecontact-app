// File: app/api/resend-confirmation-email/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eventSlots, eventRegistrations } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import QRCode from 'qrcode';
import { sendConfirmationEmailWithICSAndQR } from '@/app/actions/email'; // Adjust the import path as necessary

export async function POST(request: Request) {
  const { registrationId } = await request.json();

  if (!registrationId) {
    return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
  }

  try {
    // Fetch registration details
    const registration = await db.select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.id, registrationId))
      .limit(1);

    if (!registration.length) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Fetch slot details
    const slot = await db.select()
      .from(eventSlots)
      .where(eq(eventSlots.id, registration[0].slot))
      .limit(1);

    if (!slot.length) {
      return NextResponse.json({ error: 'Event slot not found' }, { status: 404 });
    }

    // Generate QR code
    const qr = await QRCode.toDataURL(registrationId);

    // Send confirmation email
    await sendConfirmationEmailWithICSAndQR(
      registration[0].email,
      {
        id: registration[0].id,
        created_at: new Date(registration[0].createdAt).toISOString(),
        time_start: new Date(slot[0].timeStart).toISOString(),
        time_end: new Date(slot[0].timeEnd).toISOString(),
        capacity: slot[0].capacity,
      },
      qr
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resending confirmation email:', error);
    return NextResponse.json({ error: 'Failed to resend confirmation email' }, { status: 500 });
  }
}