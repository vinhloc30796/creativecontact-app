// File: utils/middleware/lang-persist.ts

import { NextRequest, NextResponse } from "next/server";

export async function handleLangPersist(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip for static files and API routes
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next({ request: req });
  }

  let lang = req.nextUrl.searchParams.get('lang');
  const cookieLang = req.cookies.get('NEXT_LOCALE')?.value;

  // If no lang in URL and no cookie, set default lang without redirect
  if (!lang && !cookieLang) {
    const response = NextResponse.next({ request: req });
    response.cookies.set('NEXT_LOCALE', 'en', {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    return response;
  }

  // If no lang in URL but have cookie, use cookie value
  if (!lang && cookieLang) {
    return NextResponse.next({ request: req });
  }

  // If lang exists but doesn't match cookie, update cookie
  if (lang && lang !== cookieLang) {
    const response = NextResponse.next({ request: req });
    response.cookies.set('NEXT_LOCALE', lang, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    return response;
  }

  return NextResponse.next({ request: req });
}
