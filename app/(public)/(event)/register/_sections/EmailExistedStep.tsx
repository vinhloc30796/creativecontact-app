// File: app/(public)/(event)/register/_sections/EmailExistedStep.tsx

import { Button } from '@/components/ui/button'
import { dateFormatter, timeslotFormatter } from '@/lib/timezones'
import { EventRegistrationWithSlot } from './types'

interface EmailExistedStepProps {
	existingRegistration: EventRegistrationWithSlot
	onConfirm: () => void
	onCancel: () => void
}

export function EmailExistedStep({ existingRegistration, onConfirm, onCancel }: EmailExistedStepProps) {
	return (
		// Prevent overflow-hidden from hiding the content
		<div className="space-y-4 overflow-visible">
			<h2 className="text-lg font-semibold text-primary">Existing Registration Found</h2>
			<p className="text-sm">You have already registered for another slot with this email address. You can either update your existing registration or keep it as is.</p>
			<p className="text-sm">
				Existing registration details:
				<br />
				Date: {dateFormatter.format(new Date(existingRegistration.event_slot.time_start))}
				<br />
				Time: {timeslotFormatter.format(new Date(existingRegistration.event_slot.time_start))} - {timeslotFormatter.format(new Date(existingRegistration.event_slot.time_end))}
			</p>
			{/* New line when overflow */}
			<div className="flex flex-col gap-2">
				<Button onClick={onConfirm} className="w-full">Update Existing Registration</Button>
				<Button variant="outline" onClick={onCancel} className="w-full">Keep Existing Registration</Button>
			</div>
		</div>
	)
}
