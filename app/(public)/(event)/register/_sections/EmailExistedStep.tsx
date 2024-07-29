import React from 'react'
import { Button } from '@/components/ui/button'
import { EventRegistration } from './types'

interface EmailExistedStepProps {
	existingRegistration: EventRegistration
	onConfirm: () => void
	onCancel: () => void
}

export function EmailExistedStep({ existingRegistration, onConfirm, onCancel }: EmailExistedStepProps) {
	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold">Existing Registration Found</h2>
			<p>You have already registered for another slot with this email address. If you proceed, your existing registration will be cancelled.</p>
			<p>
				Existing registration details:
				<br />
				Date: {new Date(existingRegistration.slot).toLocaleDateString()}
				<br />
				Time: {new Date(existingRegistration.slot).toLocaleTimeString()}
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
