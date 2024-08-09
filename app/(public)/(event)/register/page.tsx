import { supabase } from '@/lib/supabase'
import RegisterPage from './_sections/_register'
import { EventSlot } from './_sections/types'

async function getEventSlots(event: string): Promise<EventSlot[]> {
	console.log(`Fetching event slots for event ${event}...`)

	let { data: event_slots, error } = await supabase.from('event_slots').select('*').eq('event', event)

	if (error) {
		console.error('Error fetching event slots:', error)
		return []
	} else {
		console.log("Finished fetching event slots")
	}

	return event_slots as EventSlot[]
}

export default async function Page() {
	const eventId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

	const eventSlots = await getEventSlots(eventId)

	return <RegisterPage eventSlots={eventSlots} />
}
