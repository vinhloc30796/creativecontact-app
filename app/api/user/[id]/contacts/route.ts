// File: app/api/user/[id]/contacts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fetchUserContacts } from './helper';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const contactsInfo = await fetchUserContacts(userId);
    return NextResponse.json(contactsInfo);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
