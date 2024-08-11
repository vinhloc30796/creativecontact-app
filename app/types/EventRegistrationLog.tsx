// File: app/types/EventRegistrationLog.ts

import { UUID } from "crypto";
import { RegistrationStatus } from "@/app/types/RegistrationStatus";

// Define the EventRegistrationLog interface
export interface EventRegistrationLog {
  event_registration_id: UUID;
  staff_id: UUID;
  status_before: RegistrationStatus;
  status_after: RegistrationStatus;
  changed_at: Date;
  guestName: string;
}