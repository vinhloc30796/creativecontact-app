// File: app/(public)/(event)/register/_sections/types.ts
import { InferSelectModel } from "drizzle-orm";
import { eventRegistrations, eventSlots } from "@/drizzle/schema/event";
import { IndustryType, ExperienceType } from "@/drizzle/schema/user";

// Use schema types directly
export type EventSlot = InferSelectModel<typeof eventSlots>;
export type EventRegistration = InferSelectModel<typeof eventRegistrations>;

export type FormData = {
  // Contact Info
  email: string;
  firstName: string;
  lastName: string;
  phoneCountryCode: string;
  phoneNumber?: string | null;
  phoneCountryAlpha3: string;

  // Professional Info
  industryExperiences: {
    industry: IndustryType;
    experienceLevel: ExperienceType;
  }[];

  // Event Registration
  slot: string;

  // Social Media
  instagramHandle?: string;
  facebookHandle?: string;
}

export interface EventRegistrationWithSlot extends EventRegistration {
  event_slot: EventSlot;
  slot_time_start: string;
  slot_time_end: string;
  slot_details: EventSlot;
}
