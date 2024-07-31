// utils.ts
import { EventRegistration, EventSlot } from "./types";

export function getAvailableCapacity(
	slot: EventSlot,
	registrations: EventRegistration[],
): number {
	const capacityStatus = ["confirmed", "pending", "checked-in"];
	const registeredCount =
		registrations.filter((reg) =>
			reg.slot === slot.id && (
				capacityStatus.includes(reg.status)
			)
		).length;
	return Math.max(0, slot.capacity - registeredCount);
}

// Keep the getSlotsForDate function as is
export function getSlotsForDate(slots: EventSlot[], date: string): EventSlot[] {
	return slots.filter((slot) => slot.time_start.split("T")[0] === date);
}
