// File: middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/custom-middleware";
import { PASSWORD_COOKIE_NAME, STAFF_PASSWORD } from "@/app/staff-access/const";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createClient(req);

  const {data: { user }} = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  // Staff password
  const isPasswordPage = pathname === "/staff-access/password";
  // Staff pages
  const isStaffRoute = pathname.startsWith("/staff/");
  const isLoginPage = pathname === "/staff/login";
  const isSignOutPage = pathname === "/staff/signout";
  const isSignUpPage = pathname === "/staff/signup";
  const isLoginCallback = pathname === "/staff/login-callback";

  // Check for password cookie
  const passwordCookie = req.cookies.get(PASSWORD_COOKIE_NAME);
  const hasValidPasswordCookie = passwordCookie?.value === STAFF_PASSWORD;

  console.debug(
    `Password cookie (querying ${PASSWORD_COOKIE_NAME}): ${passwordCookie?.value};`,
    `Expected STAFF_PASSWORD: ${STAFF_PASSWORD};`,
    "User:", user,
    "with Request URL:", pathname,
  );

  // 1. Block access to /staff/* routes if no valid password cookie
  if (isStaffRoute && !hasValidPasswordCookie) {
    console.log(`Invalid cookie: Redirecting from ${pathname} to /staff-access/password`)
    return NextResponse.redirect(new URL("/staff-access/password", req.url));
  }

  // 2. Allow access to /staff/* routes if valid password cookie
  if (isStaffRoute && hasValidPasswordCookie) {
    return res;
  }

  // 3. Redirect /staff-access/password to /staff/login if valid cookie
  if (isPasswordPage && hasValidPasswordCookie) {
    console.log(
      "Valid cookie: Redirecting from /staff-access/password to /staff/login",
    );
    return NextResponse.redirect(new URL("/staff/login", req.url));
  }

  // For all other cases, proceed with the request
  return res;
}

export const config = {
  matcher: ["/staff/:path*"],
};
