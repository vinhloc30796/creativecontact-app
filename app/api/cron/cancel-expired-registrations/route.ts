import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
	// Verify the request is coming from the cron job
	const authHeader = req.headers.get('authorization')
	if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const supabase = createClient()

	try {
		await supabase.rpc('cancel_expired_registrations')
		return NextResponse.json({ message: 'Expired registrations cancelled successfully' })
	} catch (error) {
		console.error('Error cancelling expired registrations:', error)
		return NextResponse.json({ error: 'Failed to cancel expired registrations' }, { status: 500 })
	}
}
