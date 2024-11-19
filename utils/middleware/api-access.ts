import { NextRequest, NextResponse } from "next/server";

const API_ROUTES = [
  '/api/user',
  // Add more API routes as needed
];

export async function handleApiAccess(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the current route is an API route
  if (API_ROUTES.some(route => pathname.startsWith(route))) {
    const apiKey = req.headers.get('X-API-Key');

    if (apiKey !== process.env.DEV_API_KEY) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // If it's not an API route or the API key is valid, proceed with the request
  return NextResponse.next();
}