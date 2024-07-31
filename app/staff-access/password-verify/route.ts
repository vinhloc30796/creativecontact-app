// app/staff-access/password-verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { STAFF_PASSWORD, PASSWORD_COOKIE_NAME } from '@/app/staff-access/const'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password === STAFF_PASSWORD) {
    const response = NextResponse.json({ message: 'Password correct' }, { status: 200 })
    response.cookies.set(PASSWORD_COOKIE_NAME, password, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    return response
  } else {
    return NextResponse.json({ message: 'Incorrect password' }, { status: 401 })
  }
}
