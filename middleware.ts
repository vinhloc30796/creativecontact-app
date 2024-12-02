// File: middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { handleStaffAccess } from '@/utils/middleware/staff-access';
import { handleLangPersist } from '@/utils/middleware/lang-persist';
import { handleI18n } from '@/utils/middleware/i18n-middleware';

export async function middleware(req: NextRequest) {
  // Skip middleware for auth-related routes and static files
  if (
    req.nextUrl.pathname.startsWith('/auth') ||
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  console.log("Middleware called for:", req.nextUrl.toString());

  try {
    // Handle staff access
    const staffResponse = await handleStaffAccess(req);
    if (staffResponse && staffResponse !== NextResponse.next() && 
        (staffResponse.headers.get("x-middleware-rewrite") || staffResponse.headers.get("Location"))) {
      return staffResponse;
    }
    
    // Handle i18n
    // const i18nResponse = await handleI18n(req);
    // if (i18nResponse !== NextResponse.next()) {
    //   return i18nResponse;
    // }
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.next();
  }
}

// Combine both matchers
export const config = {
  matcher: [
    '/staff/:path*',
    '/((?!api|static|.*\\..*|_next).*)'
  ],
};