// File: middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { handleStaffAccess } from '@/utils/middleware/staff-access';

export async function middleware(req: NextRequest) {
  return handleStaffAccess(req);
}

// Combine both matchers
export const config = {
  matcher: [
    '/staff/:path*',
    // '/((?!api|static|.*\\..*|_next).*)'
  ],
};