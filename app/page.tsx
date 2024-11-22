import { EventSlot } from '@/app/types/EventSlot'
import RegisterPage from './(public)/(event)/register/_sections/_register'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { eventSlots } from "@/drizzle/schema/event"
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv'
import InConstruct from '@/components/InConstruction'

// show the in-construction page
const inConstructPage = true

async function getEventSlots(event: string): Promise<EventSlot[]> {
	console.log('Pulling event slots for event', event)
	return (await db.select().from(eventSlots).where(eq(eventSlots.event, event))).map(slot => slot as EventSlot)
}
interface Props {
	searchParams: {
		lang?: string
	}
}
export default async function Page({ searchParams }: Props) {
	const lang = searchParams.lang || 'en'
	const eventId = '10177076-f591-49c8-a87d-042ba7aa6345'
	const eventSlots = await getEventSlots(eventId)
	console.log(`Got ${eventSlots.length} event slots`);
	if (inConstructPage) {
		return (
			<BackgroundDiv >
				<InConstruct lang={lang} />
			</BackgroundDiv>
		)
	}
	return <RegisterPage eventSlots={eventSlots} />
}
