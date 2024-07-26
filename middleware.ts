import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith("/api")) {
    const apiKey = request.headers.get("x-api-key");

    // If it's the test route, allow without API key
    if (request.nextUrl.pathname.startsWith("/api/test")) {
      return;
    }

    // For all other API routes, check the API key
    const devApiKey = process.env.DEV_API_KEY;
    if (apiKey !== devApiKey) {
      return NextResponse.json({ error: `Unauthorized because apiKey=${apiKey} != devApiKey` }, { status: 401 });
    }

    // If API key is valid, allow the request to proceed
    return;
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
