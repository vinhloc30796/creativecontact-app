// File: app/types/EventRegistration.ts

import { UUID } from "crypto";
import { RegistrationStatus } from "@/app/types/RegistrationStatus";
import { EventSlot } from "@/app/types/EventSlot";

// Define the base EventRegistration interface
export interface EventRegistration {
  id: UUID;
  created_at: Date;
  created_by: UUID;
  status: RegistrationStatus;
  signature: string | null;
  slot: UUID;
  name: string;
  email: string;
  phone_country_code: string;
  phone_number: string | null;
  phone_country_alpha3: string;
}

// Define the EventRegistrationWithSlot interface, which includes slot details
export interface EventRegistrationWithSlot extends EventRegistration {
  slot_details: EventSlot;
  slot_time_start: string;
  slot_time_end: string;
  event_slot: EventSlot;
}