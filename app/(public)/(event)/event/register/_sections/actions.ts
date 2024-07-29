'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { EventRegistration, FormData, EventSlot } from './types'
import { Resend } from 'resend'
import crypto from 'crypto'
import { createEvent } from 'ics'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getRegistrationsForSlots(slotIds: string[]): Promise<EventRegistration[]> {
	const cookieStore = cookies()
	const supabase = createClient()

	console.log('Fetching registrations for slot IDs:', slotIds)

	const { data, error } = await supabase.from('event_registrations').select('*').in('slot', slotIds)

	if (error) {
		console.error('Error fetching registrations:', error)
		return []
	}

	console.log('Fetched registrations:', data)
	return data as EventRegistration[]
}

export async function createRegistration(
	formData: FormData & { created_by: string | null; is_anonymous: boolean }
): Promise<{ success: boolean; error?: string; status: 'confirmed' | 'unconfirmed' }> {
	const cookieStore = cookies()
	const supabase = createClient()

	// Check if the user is authenticated (not anonymous)
	const isAuthenticated = !formData.is_anonymous

	// Generate a signature for the registration
	const signature = crypto.randomBytes(16).toString('hex')

	const { data, error } = await supabase
		.from('event_registrations')
		.insert([
			{
				slot: formData.slot,
				created_by: formData.created_by,
				name: `${formData.lastName} ${formData.firstName}`,
				email: formData.email,
				phone: formData.phone,
				signature: signature,
				status: isAuthenticated ? 'confirmed' : 'unconfirmed',
			},
		])
		.select()

	if (error) {
		console.error('Error creating registration:', error)
		return { success: false, error: error.message, status: 'unconfirmed' }
	}

	// Fetch the slot details
	const { data: slotData, error: slotError } = await supabase.from('event_slots').select('*').eq('id', formData.slot).single()

	if (slotError) {
		console.error('Error fetching slot details:', slotError)
		return { success: false, error: slotError.message, status: 'unconfirmed' }
	}

	if (isAuthenticated) {
		// Send confirmation email with ICS file
		await sendConfirmationEmailWithICS(formData.email, data[0], slotData)
	} else {
		// Send confirmation request email
		await sendConfirmationRequestEmail(formData.email, signature)
	}

	return { success: true, status: isAuthenticated ? 'confirmed' : 'unconfirmed' }
}

async function sendConfirmationRequestEmail(email: string, signature: string) {
	try {
		const { data, error } = await resend.emails.send({
			from: 'Creative Contact <no-reply@bangoibanga.com>',
			to: email,
			subject: 'Confirm Your Event Registration',
			html: `
        <p>Please confirm your registration by clicking on this link:</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/confirm-registration?signature=${signature}">Confirm Registration</a></p>
      `,
		})

		if (error) {
			console.error('Error sending confirmation request email:', error)
		} else {
			console.log('Confirmation request email sent:', data)
		}
	} catch (error) {
		console.error('Unexpected error sending confirmation request email:', error)
	}
}

export async function sendConfirmationEmailWithICS(email: string, registrationData: EventRegistration, slotData: EventSlot) {
	try {
		const icsData = await generateICSFile(registrationData, slotData)

		const { data, error } = await resend.emails.send({
			from: 'Creative Contact <no-reply@bangoibanga.com>',
			to: email,
			subject: 'Your Event Registration is Confirmed',
			html: `
                <h1>Your registration is confirmed!</h1>
                <p>Thank you for registering for our event. We look forward to seeing you!</p>
                <p>Event details:</p>
                <ul>
                    <li>Date: ${new Date(slotData.time_start).toLocaleDateString()}</li>
                    <li>Time: ${new Date(slotData.time_start).toLocaleTimeString()} - ${new Date(slotData.time_end).toLocaleTimeString()}</li>
                </ul>
                <p>We've attached an ICS file to this email so you can add the event to your calendar.</p>
            `,
			attachments: [
				{
					filename: 'event.ics',
					content: icsData,
				},
			],
		})

		if (error) {
			console.error('Error sending confirmation email with ICS:', error)
		} else {
			console.log('Confirmation email with ICS sent:', data)
		}
	} catch (error) {
		console.error('Unexpected error sending confirmation email with ICS:', error)
	}
}

function generateICSFile(registrationData: EventRegistration, slotData: EventSlot): Promise<string> {
	return new Promise((resolve, reject) => {
		const startDate = new Date(slotData.time_start)
		const endDate = new Date(slotData.time_end)

		// Adjust for UTC+7
		const utcOffset = 7 * 60 // 7 hours in minutes
		startDate.setMinutes(startDate.getMinutes() + utcOffset)
		endDate.setMinutes(endDate.getMinutes() + utcOffset)

		const event = {
			start: [startDate.getUTCFullYear(), startDate.getUTCMonth() + 1, startDate.getUTCDate(), startDate.getUTCHours(), startDate.getUTCMinutes()],
			end: [endDate.getUTCFullYear(), endDate.getUTCMonth() + 1, endDate.getUTCDate(), endDate.getUTCHours(), endDate.getUTCMinutes()],
			title: 'Your Registered Event',
			description: 'Thank you for registering for our event!',
			location: 'Event Location',
			url: 'https://youreventwebsite.com',
			status: 'CONFIRMED' as const,
			busyStatus: 'BUSY' as const,
			// Explicitly set the timezone
			startInputType: 'utc',
			startOutputType: 'utc',
			endInputType: 'utc',
			endOutputType: 'utc',
		}

		createEvent(event as any, (error, value) => {
			if (error) {
				reject(error)
			} else {
				resolve(value)
			}
		})
	})
}

export async function signInAnonymously() {
	const cookieStore = cookies()
	const supabase = createClient()

	const { data, error } = await supabase.auth.signInAnonymously()

	if (error) {
		console.error('Error signing in anonymously:', error)
		return null
	}

	return data.user
}

export async function confirmRegistration(signature: string): Promise<{ success: boolean; error?: string }> {
	const cookieStore = cookies()
	const supabase = createClient()

	const { data, error } = await supabase.from('event_registrations').update({ status: 'confirmed' }).match({ signature: signature, status: 'unconfirmed' }).select()

	if (error) {
		console.error('Error confirming registration:', error)
		return { success: false, error: error.message }
	}

	if (data && data.length > 0) {
		// Fetch the slot details
		const { data: slotData, error: slotError } = await supabase.from('event_slots').select('*').eq('id', data[0].slot).single()

		if (slotError) {
			console.error('Error fetching slot details:', slotError)
			return { success: false, error: slotError.message }
		}

		// Send confirmation email with ICS file
		await sendConfirmationEmailWithICS(data[0].email, data[0], slotData)
		return { success: true }
	} else {
		return { success: false, error: 'Invalid or expired signature' }
	}
}
