import { EventSlot } from '@/app/types/EventSlot'
import RegisterPage from './(public)/(event)/register/_sections/_register'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { eventSlots } from '@/drizzle/schema'

async function getEventSlots(event: string): Promise<EventSlot[]> {
	return (await db.select().from(eventSlots).where(eq(eventSlots.event, event))).map(slot => slot as EventSlot)
}

export default async function Page() {
	const eventId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
	const eventSlots = await getEventSlots(eventId)
	return <RegisterPage eventSlots={eventSlots} />
}
