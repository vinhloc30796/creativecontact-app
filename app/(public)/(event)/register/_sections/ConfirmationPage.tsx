import React from 'react'
import { FormData, EventSlot } from './types'
import { formatInTimeZone } from 'date-fns-tz'

interface ConfirmationPageProps {
	formData: FormData
	slots: EventSlot[]
	status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in'
}

export function ConfirmationPage({ formData, slots, status }: ConfirmationPageProps) {
	const timeZone = 'Asia/Bangkok' // UTC+7

	const selectedSlot = slots.find((slot) => slot.id === formData.slot)

	const formatSlotTime = (slot: EventSlot | undefined) => {
		if (!slot) return 'No slot selected'

		const startTime = formatInTimeZone(new Date(slot.time_start), timeZone, 'dd/MM/yyyy HH:mm')
		const endTime = formatInTimeZone(new Date(slot.time_end), timeZone, 'HH:mm')

		return `${startTime} - ${endTime}`
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold">Registration {status === 'confirmed' ? 'Confirmed' : 'Submitted'}</h2>
			{status === 'confirmed' ? (
				<p>Thank you for registering! Your registration is confirmed. We&apos;ve sent you an email with the event details and a calendar invite.</p>
			) : (
				<p>Thank you for registering! Please check your email and click the confirmation link to complete your registration.</p>
			)}
			<p>
				<strong>Name:</strong> {formData.firstName} {formData.lastName}
			</p>
			<p>
				<strong>Email:</strong> {formData.email}
			</p>
			<p>
				<strong>Phone:</strong> {formData.phone}
			</p>
			<p>
				<strong>Selected Time Slot:</strong> {formatSlotTime(selectedSlot)}
			</p>
		</div>
	)
}
