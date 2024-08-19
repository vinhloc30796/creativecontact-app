import React from 'react'
import { FormData } from './types'
import { EventSlot } from '@/app/types/EventSlot'
import { formatInTimeZone } from 'date-fns-tz'
import { TIMEZONE } from '@/lib/constants'

interface ConfirmationPageProps {
	formData: FormData
	slots: EventSlot[]
	status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in'
}

export function ConfirmationPage({ formData, slots, status }: ConfirmationPageProps) {

	const selectedSlot = slots.find((slot) => slot.id === formData.slot)

	const formatSlotTime = (slot: EventSlot | undefined) => {
		if (!slot) return 'No slot selected'

		const startTime = formatInTimeZone(new Date(slot.time_start), TIMEZONE, 'dd/MM/yyyy HH:mm')
		const endTime = formatInTimeZone(new Date(slot.time_end), TIMEZONE, 'HH:mm')

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
