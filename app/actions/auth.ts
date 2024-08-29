'use server'

import { authUsers } from "@/drizzle/schema/event"
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

	if (result.length === 0) {
		console.error('User not found')
		return null
	}

	const data = result[0]
	return data?.isAnonymous ?? null
}

export async function getUserId(email: string): Promise<string | null> {
	const result = await db
		.select()
		.from(authUsers)
		.where(eq(authUsers.email, email))
		.limit(1);

	return result[0]?.id ?? null
}
