'use server'

import { authUsers } from '@/drizzle/schema'
import { db } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'
import { eq } from 'drizzle-orm'
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

export async function checkUserIsAnonymous(email: string): Promise<boolean | null> {
	const result = await db
		.select({ isAnonymous: authUsers.isAnonymous })
		.from(authUsers)
		.where(eq(authUsers.email, email))
		.limit(1)

	const data = result[0]
	const error = result.length === 0 ? new Error('User not found') : true

	if (error) {
		console.error('Error checking if user is anonymous:', error)
		return null
	}

	return data?.isAnonymous ?? null
}