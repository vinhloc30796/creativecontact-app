// EmailExistedStep.tsx

import React from 'react'
import { Button } from '@/components/ui/button'
import { EventRegistrationWithSlot } from './types'

interface EmailExistedStepProps {
	existingRegistration: EventRegistrationWithSlot
	onConfirm: () => void
	onCancel: () => void
}

export function EmailExistedStep({ existingRegistration, onConfirm, onCancel }: EmailExistedStepProps) {
	const formatDateTime = (dateTimeString: string) => {
		const date = new Date(dateTimeString)
		return date.toLocaleString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		})
	}

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold">Existing Registration Found</h2>
			<p>You have already registered for another slot with this email address. If you proceed, your existing registration will be cancelled.</p>
			<p>
				Existing registration details:
				<br />
				Date and Time: {formatDateTime(existingRegistration.event_slot.time_start)}
				<br />
				End Time: {formatDateTime(existingRegistration.event_slot.time_end)}
			</p>
			<div className="flex space-x-4">
				<Button onClick={onConfirm}>Proceed and Cancel Existing Registration</Button>
				<Button variant="outline" onClick={onCancel}>
					Keep Existing Registration
				</Button>
			</div>
		</div>
	)
}
