// File: app/staff/api/manual-search/route.ts

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { searchTerm } = await request.json()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('event_registrations')
    .select('id, name, email, phone, status, slot')
    .textSearch('search_column', searchTerm)
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ results: data })
}