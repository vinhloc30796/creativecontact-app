// File: middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { handleStaffAccess } from '@/utils/middleware/staff-access';
import { handleLangPersist } from '@/utils/middleware/lang-persist';

// Circuit breaker state
let failureCount = 0;
const FAILURE_THRESHOLD = 5;
const RESET_TIMEOUT = 60000; // 1 minute
let circuitBreakerTripped = false;
let lastFailureTime = Date.now();

export async function middleware(req: NextRequest) {
  console.log("Middleware called for:", req.nextUrl.toString());

  // Check if circuit breaker is tripped
  if (circuitBreakerTripped) {
    if (Date.now() - lastFailureTime >= RESET_TIMEOUT) {
      // Reset circuit breaker after timeout
      circuitBreakerTripped = false;
      failureCount = 0;
    } else {
      console.log("Circuit breaker tripped, skipping middleware");
      return NextResponse.next();
    }
  }

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
      failureCount = 0; // Reset failure count on success
      return staffResponse;
    }
    
    // In all other cases, including when handleStaffAccess returns NextResponse.next(),
    // we want to handle language persistence
    console.debug("Proceeding to lang persist");
    const response = await handleLangPersist(req);
    failureCount = 0; // Reset failure count on success
    return response;

  } catch (error) {
    console.error("Error in middleware:", error);
    failureCount++;
    lastFailureTime = Date.now();
    
    if (failureCount >= FAILURE_THRESHOLD) {
      console.error("Circuit breaker tripped due to repeated failures");
      circuitBreakerTripped = true;
    }
    
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