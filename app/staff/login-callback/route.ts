import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  // Initialize the Supabase client
  const supabase = await createClient()

  // Get the auth code from the URL
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Check if the exchange was successful by getting the session
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Successful login, redirect to the check-in page
      return NextResponse.redirect(new URL('/staff/checkin', request.url))
    }
  }

  // If there's no code or session, redirect to the login page
  return NextResponse.redirect(new URL('/staff/login', request.url))
}