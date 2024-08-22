// File: app/(public)/(event)/register/_sections/EmailExistedStep.tsx

import { Button } from '@/components/ui/button'
import { dateFormatter, timeslotFormatter } from '@/lib/timezones'
import { EventRegistrationWithSlot } from '@/app/types/EventRegistration'

interface EmailExistedStepProps {
	existingRegistration: EventRegistrationWithSlot
	onConfirm: () => void
	onCancel: () => void
}

export function EmailExistedStep({ existingRegistration, onConfirm, onCancel }: EmailExistedStepProps) {
	const dateStr = dateFormatter.format(new Date(existingRegistration.slot_time_start))
	const startTimeStr = timeslotFormatter.format(new Date(existingRegistration.slot_time_start))
	const endTimeStr = timeslotFormatter.format(new Date(existingRegistration.slot_time_end))
	return (
		// Prevent overflow-hidden from hiding the content
		<div className="space-y-4 overflow-visible">
			<h2 className="text-lg font-semibold text-primary">Existing Registration Found</h2>
			<p className="text-sm">
				You have already registered for another slot with this email address.
				You can either update your existing registration or keep it as is.
				The existing registration will be cancelled only after you have submitted the update.
			</p>
			<p className="text-sm">
				Existing registration details:
				<br />
				Date: {dateStr}
				<br />
				Time: {startTimeStr} - {endTimeStr}
			</p>
			{/* New line when overflow */}
			<div className="flex flex-col gap-2">
				<Button onClick={onConfirm} className="w-full">Update Existing Registration</Button>
				<Button variant="outline" onClick={onCancel} className="w-full">Keep Existing Registration</Button>
			</div>
		</div>
	)
}
