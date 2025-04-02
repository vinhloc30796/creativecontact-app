import RegisterPage from "./_sections/_register";
import { EventSlot } from "@/app/types/EventSlot";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { eventSlots } from "@/drizzle/schema/event";

async function getEventSlots(event: string): Promise<EventSlot[]> {
  console.log("Pulling event slots for event", event);
  return (
    await db.select().from(eventSlots).where(eq(eventSlots.event, event))
  ).map((slot) => slot as EventSlot);
}

interface PageProps {
  searchParams: Promise<{
    lang?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const eventId = "10177076-f591-49c8-a87d-042ba7aa6345";
  const eventSlots = await getEventSlots(eventId);
  const params = await searchParams;
  const lang = params.lang || "en";
  console.log(`Got ${eventSlots.length} event slots`);
  return <RegisterPage eventSlots={eventSlots} lang={lang} />;
}

export const dynamic = "force-dynamic";
