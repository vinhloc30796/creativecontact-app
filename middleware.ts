import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
	// Allow access to / and /event/register without authentication
	// if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/event/register') || request.nextUrl.pathname.startsWith('/api')) {
	return
	// }

	// For other routes, continue with session update
	// return await updateSession(request)
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
