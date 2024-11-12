import { ContactInfoData } from "@/app/form-schemas/contact-info";
import { EventRegistrationData } from "@/app/form-schemas/event-registration";
import { ProfessionalInfoData } from "@/app/form-schemas/professional-info";
import { EventSlot } from '@/app/types/EventSlot';
import { formatInTimeZone } from 'date-fns-tz';
import { TIMEZONE } from '@/lib/timezones';

interface ConfirmationStepProps {
	contactInfoData: ContactInfoData
	eventRegistrationData: EventRegistrationData
	professionalInfoData: ProfessionalInfoData
	slots: EventSlot[]
}

export function ConfirmationStep({ contactInfoData, eventRegistrationData, professionalInfoData, slots }: ConfirmationStepProps) {
	const selectedSlot = slots.find((slot) => slot.id === eventRegistrationData.slot)

	const formatSlotTime = (slot: EventSlot | undefined) => {
		if (!slot) return 'No slot selected'

		const startTime = formatInTimeZone(new Date(slot.time_start), TIMEZONE, 'dd/MM/yyyy HH:mm')
		const endTime = formatInTimeZone(new Date(slot.time_end), TIMEZONE, 'HH:mm')

		return `${startTime} - ${endTime}`
	}

	return (
		<div className="space-y-4 mt-2">
			<p>
				<strong>Name:</strong> {contactInfoData.firstName} {contactInfoData.lastName}
			</p>
			<p>
				<strong>Email:</strong> {contactInfoData.email}
			</p>
			<p>
				<strong>Phone:</strong> {contactInfoData.phoneCountryCode} {contactInfoData.phoneNumber}
			</p>
			<p>
				<strong>Selected Time Slot:</strong> {formatSlotTime(selectedSlot)}
			</p>
		</div>
	)
}
