// File: app/types/EventRegistrationLog.ts

import { UUID } from "crypto";
import { RegistrationStatus } from "@/app/types/RegistrationStatus";

// Define the EventRegistrationLog interface
export interface EventRegistrationLog {
  eventRegistrationId: UUID;
  staffId: UUID;
  statusBefore: RegistrationStatus;
  statusAfter: RegistrationStatus;
  changedAt: Date;
  guestName: string;
}