import React from 'react'
import { FormData } from './types'
import { EventSlot } from '@/app/types/EventSlot'
import { formatInTimeZone } from 'date-fns-tz'

interface ConfirmationStepProps {
	formData: FormData
	slots: EventSlot[]
}

export function ConfirmationStep({ formData, slots }: ConfirmationStepProps) {
	const timeZone = 'Asia/Bangkok' // UTC+7

	const selectedSlot = slots.find((slot) => slot.id === formData.slot)

	const formatSlotTime = (slot: EventSlot | undefined) => {
		if (!slot) return 'No slot selected'

		const startTime = formatInTimeZone(new Date(slot.time_start), timeZone, 'dd/MM/yyyy HH:mm')
		const endTime = formatInTimeZone(new Date(slot.time_end), timeZone, 'HH:mm')

		return `${startTime} - ${endTime}`
	}

	return (
		<div className="space-y-4 mt-2">
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
