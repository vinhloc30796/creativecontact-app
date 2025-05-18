import { format } from "date-fns";
import { TIMEZONE } from "./timezones";
import { toZonedTime } from "date-fns-tz";

/**
 * Formats a date string into a user-friendly format for event display
 * Example: "January 15, 2024"
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  const zonedDate = toZonedTime(date, TIMEZONE);
  return format(zonedDate, "MMMM d, yyyy");
}

/**
 * Formats a date string into a user-friendly format for event display with day of week
 * Example: "Monday, January 15, 2024"
 */
export function formatEventDateWithDay(dateString: string): string {
  const date = new Date(dateString);
  const zonedDate = toZonedTime(date, TIMEZONE);
  return format(zonedDate, "EEEE, MMMM d, yyyy");
}
