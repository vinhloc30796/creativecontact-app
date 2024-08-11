'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function signInAnonymously() {
	const cookieStore = cookies()
	const supabase = createClient()

	const { data, error } = await supabase.auth.signInAnonymously()

	if (error) {
		console.error('Error signing in anonymously:', error)
		return null
	}

	return data.user
}
