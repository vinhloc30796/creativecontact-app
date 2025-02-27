/**
 * This file adapts the auto-generated Payload types for use in our application
 * It provides type mappings and utility types for working with Payload CMS data
 */

// Import from the project root where the types file is generated
import type {
  Media as PayloadMedia,
  Event as PayloadEvent,
} from "@/payload-types";

// Re-export the types we need from the auto-generated types
export type { Event } from "@/payload-types";

// Helper function to get URL from Media object
export function getMediaUrl(
  media: PayloadMedia | number | null | undefined,
): string {
  if (!media) return "";
  if (typeof media === "number") return ""; // Media ID only, no URL available
  return media.url || "";
}

// Helper function to get alt text from Media object
export function getMediaAlt(
  media: PayloadMedia | number | null | undefined,
): string {
  if (!media) return "";
  if (typeof media === "number") return ""; // Media ID only, no alt available
  return media.alt || "";
}

// Enhanced Media type with guaranteed URL
export interface Media extends Omit<PayloadMedia, "url"> {
  url: string;
}

// Type guard to check if a block is of a specific type
export function isBlockType<T extends { blockType: string }>(
  block: any,
  type: string,
): block is T {
  return block?.blockType === type;
}

// Helper type to extract specific block types from the content array
export type EventBlock<T extends string> = Extract<
  PayloadEvent["content"][number],
  { blockType: T }
>;

// Safely get a value with a fallback
export function getOrDefault<T>(
  value: T | null | undefined,
  defaultValue: T,
): T {
  return value !== null && value !== undefined ? value : defaultValue;
}

// Specific block type exports for use in components
export type EventDetailsBlock = EventBlock<"EventDetails">;
export type EventSpeakerBlock = EventBlock<"EventSpeaker">;
export type EventSpeakersBlock = EventBlock<"EventSpeakers">;
export type EventGalleryBlock = EventBlock<"EventGallery">;
export type EventCreditsBlock = EventBlock<"EventCredits">;

// Union type of all possible blocks - mirrors the content array type
export type BlockTypes = PayloadEvent["content"][number];
