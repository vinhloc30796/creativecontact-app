import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/custom-middleware'
import { STAFF_PASSWORD, PASSWORD_COOKIE_NAME } from '@/app/staff-access/const'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createClient(req)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isStaffRoute = req.nextUrl.pathname.startsWith('/staff/')
  const isLoginPage = req.nextUrl.pathname === '/staff/login'
  const isSignOutPage = req.nextUrl.pathname === '/staff/signout'
  const isSignUpPage = req.nextUrl.pathname === '/staff/signup'
  const isLoginCallback = req.nextUrl.pathname === '/staff/login-callback'
  const isPasswordPage = req.nextUrl.pathname === '/staff-access/password'

  // Check for password cookie
  const passwordCookie = req.cookies.get(PASSWORD_COOKIE_NAME)
  const hasValidPasswordCookie = passwordCookie?.value === STAFF_PASSWORD

  console.log(`Password cookie (querying ${PASSWORD_COOKIE_NAME}): ${passwordCookie?.value}`)
  console.log('Expected STAFF_PASSWORD:', STAFF_PASSWORD)
  console.log('Session:', session)
  console.log('Request URL:', req.nextUrl.pathname)

  if (isStaffRoute && !isPasswordPage) {
    // Handle password check
    if (!hasValidPasswordCookie && !isPasswordPage) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/staff-access/password'
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Handle authentication after password check
    if (hasValidPasswordCookie || isPasswordPage) {
      if (!session && !isLoginPage && !isSignUpPage && !isSignOutPage && !isLoginCallback) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/staff/login'
        redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
      
      if (session && (isLoginPage || isSignUpPage)) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/staff/checkin'
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/staff/:path*'],
}