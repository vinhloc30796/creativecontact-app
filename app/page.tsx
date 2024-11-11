import { EventSlot } from '@/app/types/EventSlot'
import RegisterPage from './(public)/(event)/register/_sections/_register'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { eventSlots } from "@/drizzle/schema/event"
import InConstruct from '@/components/InConstruction'
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv'

// show the in-construction page
const inConstructPage = true

async function getEventSlots(event: string): Promise<EventSlot[]> {
	console.log('Pulling event slots for event', event)
	return (await db.select().from(eventSlots).where(eq(eventSlots.event, event))).map(slot => slot as EventSlot)
}

export default async function Page() {
	const eventId = '10177076-f591-49c8-a87d-042ba7aa6345'
	const eventSlots = await getEventSlots(eventId)
	console.log(`Got ${eventSlots.length} event slots`);
	if (inConstructPage) {
		return (
			<BackgroundDiv >
				<InConstruct />
			</BackgroundDiv>
		)
	}
	return <RegisterPage eventSlots={eventSlots} />
}
