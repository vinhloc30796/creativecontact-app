// File: middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { handleStaffAccess } from '@/utils/middleware/staff-access';
import { handleLangPersist } from '@/utils/middleware/lang-persist';

export async function middleware(req: NextRequest) {
  console.log("Middleware called for:", req.nextUrl.toString());

  // Skip middleware for signout routes
  if (req.nextUrl.pathname.includes('/signout')) {
    return NextResponse.next();
  }

  try {
    // First, attempt to handle staff access
    const staffResponse = await handleStaffAccess(req);
    
    // If staffResponse is not the default next response and it's a rewrite or redirect, return it
    if (staffResponse && staffResponse !== NextResponse.next() && 
        (staffResponse.headers.get("x-middleware-rewrite") || staffResponse.headers.get("Location"))) {
      console.log("Staff access handled, returning early");
      return staffResponse;
    }
    
    // In all other cases, including when handleStaffAccess returns NextResponse.next(),
    // we want to handle language persistence
    console.debug("Proceeding to lang persist");
    return handleLangPersist(req);
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