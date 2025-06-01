// File: middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { handleLangPersist } from "@/utils/middleware/lang-persist";
import { handleI18n } from "@/utils/middleware/i18n-middleware";

export async function middleware(req: NextRequest) {
  // Skip middleware for auth-related routes and static files
  if (
    req.nextUrl.pathname.startsWith("/auth") ||
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  console.log("Middleware called for:", req.nextUrl.toString());
  return NextResponse.next();
}

// Combine both matchers
export const config = {
  matcher: ["/staff/:path*", "/((?!api|static|.*\\..*|_next).*)"],
};
