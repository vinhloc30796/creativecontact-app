// File: app/types/EventRegistrationLogEntry.ts

import { UUID } from "crypto";
import { RegistrationStatus } from "@/app/types/RegistrationStatus";

// Define the EventRegistrationLogEntry interface
export interface EventRegistrationLogEntry {
  eventRegistrationId: UUID;
  staffId: UUID;
  statusBefore: RegistrationStatus;
  statusAfter: RegistrationStatus;
}