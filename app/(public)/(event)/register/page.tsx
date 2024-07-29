import { supabase } from '@/lib/supabase'
import RegisterPage from './_sections/_register'
import { EventSlot } from './_sections/types'

async function getEventSlots(event: string): Promise<EventSlot[]> {
	console.log('Fetching event slots...')

	let { data: event_slots, error } = await supabase.from('event_slots').select('*').eq('event', event)

	if (error) {
		console.error('Error fetching event slots:', error)
		return []
	}

	return event_slots as EventSlot[]
}

export default async function Page() {
	const eventId = '10177076-f591-49c8-a87d-042ba7aa6345'

	const eventSlots = await getEventSlots(eventId)

	return <RegisterPage eventSlots={eventSlots} />
}
