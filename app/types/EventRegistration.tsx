// File: app/types/EventRegistration.ts

import { UUID } from "crypto";
import { RegistrationStatus } from "@/app/types/RegistrationStatus";
import { EventSlot } from "@/app/types/EventSlot";


// Define the base EventRegistration interface
export interface EventRegistration {
  id: UUID;
  eventName: string;
  createdAt: Date;
  createdBy: UUID;
  status: RegistrationStatus;
  signature: string | null;
  slot: UUID;
  name: string;
  email: string;
  phone: string;
}

// Define the EventRegistrationWithSlot interface, which includes slot details
export interface EventRegistrationWithSlot extends EventRegistration {
  slotDetails: EventSlot;
  slotTimeStart: string;
  slotTimeEnd: string;
}