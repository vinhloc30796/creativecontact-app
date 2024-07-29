import { confirmRegistration } from '@/app/(public)/(event)/register/_sections/actions'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const signature = searchParams.get('signature')

	if (!signature) {
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
	}

	const result = await confirmRegistration(signature)

	if (result.success) {
		// Redirect to a confirmation success page
		return NextResponse.redirect(new URL('/registration-confirmed', request.url))
	} else {
		// Redirect to an error page with the error message
		const errorUrl = new URL('/registration-error', request.url)
		errorUrl.searchParams.set('error', result.error || 'Unknown error')
		return NextResponse.redirect(errorUrl)
	}
}
