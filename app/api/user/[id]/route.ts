// app/api/user/[id]/route.ts
import { NextResponse } from 'next/server';
import { fetchUserData } from './helper';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id;

  try {
    const userData = await fetchUserData(userId);

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}