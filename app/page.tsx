import { EventSlot } from '@/app/types/EventSlot'
import RegisterPage from './(public)/(event)/register/_sections/_register'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { eventSlots } from '@/drizzle/schema'

async function getEventSlots(event: string): Promise<EventSlot[]> {
	return (await db.select().from(eventSlots).where(eq(eventSlots.event, event))).map(slot => slot as EventSlot)
}

export default async function Page() {
	const eventId = '10177076-f591-49c8-a87d-042ba7aa6345'
	const eventSlots = await getEventSlots(eventId)
	return <RegisterPage eventSlots={eventSlots} />
}
