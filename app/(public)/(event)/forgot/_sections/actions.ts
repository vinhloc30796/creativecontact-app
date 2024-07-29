// app/forgot/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { sendEventDetailsEmail } from './email'

export async function sendForgotEmail(identifier: string) {
	const supabase = createClient()

	// Search for the registration
	const { data: registrations, error } = await supabase
		.from('event_registrations')
		.select('*')
		.or(`email.eq.${identifier},phone.eq.${identifier}`)
		.eq('status', 'confirmed')
		.order('created_at', { ascending: false })
		.limit(1)

	if (error) {
		console.error('Error fetching registration:', error)
		return { success: false, error: 'An error occurred while fetching the registration' }
	}

	if (registrations.length === 0) {
		// Don't reveal that no registration was found
		return { success: true }
	}

	const registration = registrations[0]

	// Fetch the associated event slot
	const { data: slot, error: slotError } = await supabase.from('event_slots').select('*').eq('id', registration.slot).single()

	if (slotError) {
		console.error('Error fetching event slot:', slotError)
		return { success: false, error: 'An error occurred while fetching the event details' }
	}

	// Send the email
	try {
		await sendEventDetailsEmail(registration.email, registration, slot)
		return { success: true }
	} catch (emailError) {
		console.error('Error sending email:', emailError)
		return { success: false, error: 'An error occurred while sending the email' }
	}
}
