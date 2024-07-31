import { supabase } from '@/lib/supabase'
import { EventSlot } from './(public)/(event)/register/_sections/types'
import RegisterPage from './(public)/(event)/register/_sections/_register'

async function getEventSlots(event: string): Promise<EventSlot[]> {
	console.log('Fetching event slots...')

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
	const eventId = '10177076-f591-49c8-a87d-042ba7aa6345'

	const eventSlots = await getEventSlots(eventId)

	// console.log('eventSlots:', eventSlots)

	return <RegisterPage eventSlots={eventSlots} />
}
