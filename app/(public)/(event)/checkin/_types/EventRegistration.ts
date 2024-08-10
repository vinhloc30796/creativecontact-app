// File: app/(public)/(event)/checkin/_types/EventRegistration.ts

import { UUID } from "crypto";

// Define the possible registration statuses
export type RegistrationStatus = "pending" | "confirmed" | "checked-in" | "cancelled";

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

// Define the EventSlot interface
export interface EventSlot {
  id: UUID;
  createdAt: Date;
  event: UUID;
  timeStart: Date;
  timeEnd: Date;
  capacity: number;
}

// Define the EventRegistrationWithSlot interface, which includes slot details
export interface EventRegistrationWithSlot extends EventRegistration {
  slotDetails: EventSlot;
  slotTimeStart: string;
  slotTimeEnd: string;
}

// Define the CheckinResult interface
export interface CheckinResult {
  success: boolean;
  data?: {
    id: UUID;
    status: RegistrationStatus;
    name: string;
    email: string;
    phone: string;
  };
  error?: string;
}

// Define the EventRegistrationLogEntry interface
export interface EventRegistrationLogEntry {
  eventRegistrationId: UUID;
  staffId: UUID;
  statusBefore: RegistrationStatus;
  statusAfter: RegistrationStatus;
}

// Utility type for creating a new event registration
export type NewEventRegistration = Omit<EventRegistration, 'id' | 'createdAt' | 'status'> & {
  status?: RegistrationStatus;
};

// Utility type for updating an event registration
export type UpdateEventRegistration = Partial<Omit<EventRegistration, 'id' | 'createdAt' | 'createdBy'>>;
