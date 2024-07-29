// utils.ts
import { EventSlot, EventRegistration } from './types'

export function getAvailableCapacity(slot: EventSlot, registrations: EventRegistration[]): number {
	const registeredCount = registrations.filter((reg) => reg.slot === slot.id && (reg.status === 'confirmed' || reg.status === 'unconfirmed')).length
	return Math.max(0, slot.capacity - registeredCount)
}

// Keep the getSlotsForDate function as is
export function getSlotsForDate(slots: EventSlot[], date: string): EventSlot[] {
	return slots.filter((slot) => slot.time_start.split('T')[0] === date)
}
