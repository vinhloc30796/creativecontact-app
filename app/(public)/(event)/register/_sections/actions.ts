'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { EventRegistration, FormData, EventSlot } from './types'
import { Resend } from 'resend'
import crypto from 'crypto'
import { createEvent } from 'ics'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getRegistrationsForSlots(slotIds: string[]): Promise<EventRegistration[]> {
	const supabase = createClient()

	const { data, error } = await supabase.from('event_registrations').select('*').in('slot', slotIds).in('status', ['confirmed', 'pending'])

	if (error) {
		console.error('Error fetching registrations:', error)
		return []
	}

	return data as EventRegistration[]
}

export async function oldcreateRegistration(
	formData: FormData & { created_by: string | null; is_anonymous: boolean }
): Promise<{ success: boolean; error?: string; status: 'confirmed' | 'pending' }> {
	const cookieStore = cookies()
	const supabase = createClient()

	// Check if the user is authenticated (not anonymous)
	const isAuthenticated = !formData.is_anonymous

	// Generate a signature for the registration
	const signature = crypto.randomBytes(16).toString('hex')

	const registrationId = uuidv4()
	const qrCodeDataURL = await QRCode.toDataURL(registrationId)

	const { data, error } = await supabase
		.from('event_registrations')
		.insert([
			{
				id: registrationId,
				slot: formData.slot,
				created_by: formData.created_by,
				name: `${formData.lastName} ${formData.firstName}`,
				email: formData.email,
				phone: formData.phone,
				status: isAuthenticated ? 'confirmed' : 'pending',
				qr_code: qrCodeDataURL,
			},
		])
		.select()

	if (error) {
		console.error('Error creating registration:', error)
		return { success: false, error: error.message, status: 'pending' }
	}

	// Fetch the slot details
	const { data: slotData, error: slotError } = await supabase.from('event_slots').select('*').eq('id', formData.slot).single()

	if (slotError) {
		console.error('Error fetching slot details:', slotError)
		return { success: false, error: slotError.message, status: 'pending' }
	}

	if (isAuthenticated) {
		// Send confirmation email with ICS file and QR code
		await sendConfirmationEmailWithICSAndQR(formData.email, data[0], slotData, qrCodeDataURL)
	} else {
		// Send confirmation request email
		await sendConfirmationRequestEmail(formData.email, registrationId)
	}

	return { success: true, status: isAuthenticated ? 'confirmed' : 'pending' }
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

async function sendConfirmationEmailWithICSAndQR(email: string, registration: EventRegistration, slotData: EventSlot, qrCodeDataURL: string) {
	try {
		const icsData = await generateICSFile(registration, slotData)

		const { data, error } = await resend.emails.send({
			from: 'Creative Contact <no-reply@bangoibanga.com>',
			to: email,
			subject: 'Your Event Registration is Confirmed',
			html: `
                <h1>Your registration is confirmed!</h1>
                <p>Thank you for registering for our event. We look forward to seeing you!</p>
				<p>Please find your event details and QR code below:</p>
                <p>Event details:</p>
                <ul>
                    <li>Date: ${new Date(slotData.time_start).toLocaleDateString()}</li>
                    <li>Time: ${new Date(slotData.time_start).toLocaleTimeString()} - ${new Date(slotData.time_end).toLocaleTimeString()}</li>
                </ul>
				<img src="${qrCodeDataURL}" alt="Registration QR Code" />
        		<p>Please bring this QR code with you to the event for quick check-in.</p>
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

export async function confirmRegistration(signature: string) {
	const supabase = createClient()

	// Start a transaction
	const { data: registration, error: fetchError } = await supabase.from('event_registrations').select('*').eq('signature', signature).single()

	if (fetchError) {
		console.error('Failed to fetch registration:', fetchError)
		return { success: false, error: 'Failed to fetch registration' }
	}

	if (!registration) {
		return { success: false, error: 'Registration not found' }
	}

	if (registration.status === 'confirmed') {
		return { success: false, error: 'Registration already confirmed' }
	}

	// Update the registration status
	const { error: updateError } = await supabase.from('event_registrations').update({ status: 'confirmed' }).eq('signature', signature)

	if (updateError) {
		console.error('Failed to confirm registration:', updateError)
		return { success: false, error: 'Failed to confirm registration' }
	}

	// If the registration was created by a user, update their email
	if (registration.created_by) {
		const { data: userData, error: userError } = await supabase.auth.admin.getUserById(registration.created_by)

		if (userError) {
			console.error('Failed to fetch user:', userError)
			// We don't return here because the registration is confirmed, even if email update fails
		} else if (userData && userData.user) {
			// Check if the user is anonymous (you might need to adjust this condition based on how you identify anonymous users)
			if (userData.user.email === null || userData.user.email === '') {
				const { error: authUpdateError } = await supabase.auth.admin.updateUserById(registration.created_by, { email: registration.email })

				if (authUpdateError) {
					console.error('Failed to update user email:', authUpdateError)
					// We don't return here because the registration is confirmed, even if email update fails
				}
			}
		}
	}

	return { success: true }
}

export async function checkExistingRegistration(email: string): Promise<EventRegistration | null> {
	const supabase = createClient()

	const { data, error } = await supabase.from('event_registrations').select('*').eq('email', email).in('status', ['confirmed', 'pending']).order('created_at', { ascending: false }).limit(1)

	if (error) {
		console.error('Error checking existing registration:', error)
		return null
	}

	return data[0] || null
}

export async function createRegistration(
	formData: FormData & { created_by: string | null; is_anonymous: boolean; existingRegistrationId?: string }
): Promise<{ success: boolean; error?: string; status: 'confirmed' | 'pending' }> {
	const supabase = createClient()

	// Start a transaction
	const { data, error } = await supabase.rpc('submit_registration', {
		form_data: {
			slot: formData.slot,
			email: formData.email,
			name: `${formData.lastName} ${formData.firstName}`,
			phone: formData.phone,
			created_by: formData.created_by,
			is_anonymous: formData.is_anonymous,
		},
		existing_registration_id: formData.existingRegistrationId,
	})

	if (error) {
		console.error('Error creating registration:', error)
		return { success: false, error: error.message, status: 'pending' }
	}

	const isAuthenticated = !formData.is_anonymous

	return { success: true, status: isAuthenticated ? 'confirmed' : 'pending' }
}

export async function cancelExpiredRegistrations() {
	const supabase = createClient()

	try {
		await supabase.rpc('cancel_expired_registrations')
		return { success: true }
	} catch (error) {
		console.error('Error cancelling expired registrations:', error)
		return { success: false, error: 'Failed to cancel expired registrations' }
	}
}
