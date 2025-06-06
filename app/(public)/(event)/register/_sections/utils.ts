import { EventRegistration } from "@/app/types/EventRegistration";
import { EventSlot } from "@/app/types/EventSlot";
import { TIMEZONE } from "@/lib/timezones";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function getAvailableCapacity(
  slot: EventSlot,
  registrations: EventRegistration[],
): number {
  const capacityStatus = ["confirmed", "pending", "checked-in"];
  const registeredCount =
    registrations.filter((reg) =>
      reg.slot === slot.id && capacityStatus.includes(reg.status)
    ).length;
  return Math.max(0, slot.capacity - registeredCount);
}

// Keep the getSlotsForDate function as is
export function getSlotsForDate(slots: EventSlot[], date: string): EventSlot[] {
  return slots.filter((slot) => format(slot.time_start, "yyyy-MM-dd") === date);
}

export function formatDateTime(
  dateString: string,
  formatStr: string = "PPP",
): string {
  const date = parseISO(dateString);
  const zonedDate = toZonedTime(date, TIMEZONE);
  return format(zonedDate, formatStr);
}
