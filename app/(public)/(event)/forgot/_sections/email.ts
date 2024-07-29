import { EventRegistration, EventSlot } from './types'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEventDetailsEmail(to: string, registration: EventRegistration, slot: EventSlot) {
	const emailContent = `
    <h1>Your Event Registration Details</h1>
    <p>Here are the details of your event registration:</p>
    <ul>
      <li>Name: ${registration.name}</li>
      <li>Email: ${registration.email}</li>
      <li>Phone: ${registration.phone}</li>
      <li>Event Date: ${new Date(slot.time_start).toLocaleDateString()}</li>
      <li>Event Time: ${new Date(slot.time_start).toLocaleTimeString()} - ${new Date(slot.time_end).toLocaleTimeString()}</li>
    </ul>
    <p>Your QR Code:</p>
    <img src="${registration.qr_code}" alt="Registration QR Code" />
  `

	try {
		const { data, error } = await resend.emails.send({
			from: 'Creative Contact <no-reply@bangoibanga.com>',
			to: [to],
			subject: 'Your Event Registration Details',
			html: emailContent,
		})

		if (error) {
			console.error('Error sending email:', error)
			throw new Error('Failed to send email')
		}

		return data
	} catch (error) {
		console.error('Error sending email:', error)
		throw error
	}
}
