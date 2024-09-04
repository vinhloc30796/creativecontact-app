'use server'

import { authUsers } from "@/drizzle/schema/event"
import { db } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'
import { eq, isNotNull } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function signInAnonymously() {
	const cookieStore = cookies()
	const supabase = await createClient()

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
  const returning = data?.isAnonymous ?? null
  console.log('checkUserIsAnonymous result', result, 'returning isAnonymous:', returning)
  return returning
}

export async function checkUserEmailConfirmed(email: string): Promise<boolean | null> {
	const result = await db
		.select({ emailConfirmedAt: authUsers.emailConfirmedAt })
		.from(authUsers)
		.where(eq(authUsers.email, email))
		.limit(1)

  if (result.length === 0) {
    console.error('User not found')
    return null
  } else {
    const data = result[0]
    const returning = !(
      // email is not confirmed if emailConfirmedAt is null
      data?.emailConfirmedAt === null || 
      // email is not confirmed if emailConfirmedAt is undefined
      data?.emailConfirmedAt === undefined
    );
    console.log('checkUserEmailConfirmed result', result, 'returning emailConfirmed: ', returning)
    return returning
  }
}

export async function getUserId(email: string): Promise<string | null> {
	const result = await db
		.select()
		.from(authUsers)
		.where(eq(authUsers.email, email))
		.limit(1);

	return result[0]?.id ?? null
}
