// File: app/api/user/[id]/contacts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fetchUserContacts } from './helper';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const userId = params.id;
    const contactsInfo = await fetchUserContacts(userId);
    return NextResponse.json(contactsInfo);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


