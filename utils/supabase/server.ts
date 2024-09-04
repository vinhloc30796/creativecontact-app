// File: utils/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function createClient() {
	const { cookies } = await import('next/headers') 
	const cookieStore = cookies()
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
	})
}
