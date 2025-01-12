'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginOperation } from 'payload'
import { usePayload } from '@/hooks/usePayload'
import { headers } from 'next/headers'

type LoginResult = Awaited<ReturnType<typeof loginOperation>>

export type StaffLoginResult = {
  success: boolean
  error?: string
  user?: LoginResult['user']
  redirect?: string
}

export type StaffLogoutResult = {
  success: boolean
  error?: string
}

export type StaffVerifyResult = {
  success: boolean
  error?: string
  user?: LoginResult['user']
  redirect?: string
}

export async function authenticateStaff(
  prevState: StaffLoginResult,
  formData: FormData
): Promise<StaffLoginResult> {
  try {
    // Extract credentials
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      }
    }

    const payload = await usePayload()

    // Authenticate with Payload
    const { user } = await payload.login({
      collection: 'staff',
      data: { email, password },
    })

    // Set additional staff access cookie
    const cookieStore = await cookies()
    cookieStore.set('payloadStaffAuth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return {
      success: true,
      user,
      redirect: '/staff/checkin'
    }

  } catch (error) {
    console.error('[authenticateStaff] error:', error)
    return {
      success: false,
      error: 'Invalid credentials'
    }
  }
}

export async function verifyStaffAuth(): Promise<StaffVerifyResult> {
  try {
    const payload = await usePayload()
    const cookieStore = await cookies()
    const authHeaders = new Headers({ cookie: cookieStore.toString() })

    console.debug('[verifyStaffAuth] attempting verification with headers', authHeaders)
    const { user } = await payload.auth({ headers: authHeaders })

    if (!user) {
      console.warn('[verifyStaffAuth] user not found')
      return {
        success: false,
        error: 'Authentication required',
        redirect: '/staff/login'
      }
    }

    if (!user.email) {
      console.warn('[verifyStaffAuth] user email missing')
      return {
        success: false,
        error: 'Staff email is required for check-in functionality',
        redirect: '/staff/login'
      }
    }

    console.info('[verifyStaffAuth] user verified:', user.email)
    return {
      success: true,
      user
    }

  } catch (error) {
    console.error('[verifyStaffAuth] error:', error)
    return {
      success: false,
      error: 'Authentication failed',
      redirect: '/staff/login'
    }
  }
}

export async function signOutStaff(): Promise<StaffLogoutResult> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const logoutURL = `${baseURL}/payload-cms/api/staff/logout`

    const requestHeaders = await headers()
    const res = await fetch(logoutURL, {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
        cookie: requestHeaders.get('cookie') || '',
      }),
    })

    if (!res.ok) {
      throw new Error('Logout request failed', { cause: res })
    }

    // Clear the payloadStaffAuth cookie
    console.debug('[signOutStaff] POST-ed successfully to Payload CMS /logout, next: clearing payloadStaffAuth and payload-token cookies')
    const cookieStore = await cookies()
    cookieStore.delete('payload-token') // remove the token cookie

    return { success: true }
  } catch (error) {
    console.error('Staff logout error:', error)
    return {
      success: false,
      error: 'Failed to sign out'
    }
  }
}