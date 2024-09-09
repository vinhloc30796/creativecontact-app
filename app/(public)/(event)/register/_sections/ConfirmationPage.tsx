import { ContactInfoData } from "@/app/form-schemas/contact-info"
import { EventRegistrationData } from "@/app/form-schemas/event-registration"
import { ProfessionalInfoData } from "@/app/form-schemas/professional-info"
import { EventSlot } from '@/app/types/EventSlot'
import { TIMEZONE } from '@/lib/timezones'
import { formatInTimeZone } from 'date-fns-tz'

interface ConfirmationPageProps {
	contactInfoData: ContactInfoData
	eventRegistrationData: EventRegistrationData
	professionalInfoData: ProfessionalInfoData
	slots: EventSlot[]
	status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in'
}

export function ConfirmationPage({ contactInfoData, eventRegistrationData, professionalInfoData, slots, status }: ConfirmationPageProps) {

	const selectedSlot = slots.find((slot) => slot.id === eventRegistrationData.slot)

	const formatSlotTime = (slot: EventSlot | undefined) => {
		if (!slot) return 'No slot selected'

		const startTime = formatInTimeZone(new Date(slot.time_start), TIMEZONE, 'dd/MM/yyyy HH:mm')
		const endTime = formatInTimeZone(new Date(slot.time_end), TIMEZONE, 'HH:mm')

		return `${startTime} - ${endTime}`
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col space-y-2 p-4 bg-primary bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20">
				<h2 className="text-2xl font-semibold text-primary">Registration {status === 'confirmed' ? 'Confirmed' : 'Submitted'}</h2>
				{status === 'confirmed' ? (
					<p>Thank you for registering! Your registration is confirmed. We&apos;ve sent you an email with the event details and a calendar invite.</p>
				) : (
					<p>Thank you for registering! Please check your email and click the confirmation link to complete your registration.</p>
				)}
			</div>
			<p>
				<strong>Name:</strong> {contactInfoData.firstName} {contactInfoData.lastName}
			</p>
			<p>
				<strong>Email:</strong> {contactInfoData.email}
			</p>
			<p>
				<strong>Phone:</strong> {contactInfoData.phone}
			</p>
			<p>
				<strong>Selected Time Slot:</strong> {formatSlotTime(selectedSlot)}
			</p>
		</div>
	)
}
