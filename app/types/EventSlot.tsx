// File: app/types/EventSlot.tsx

import { UUID } from "crypto";

// Define the EventSlot interface
export interface EventSlot {
  id: UUID;
  created_at: Date;
  event: UUID;
  time_start: Date;
  time_end: Date;
  capacity: number;
  // Optional: special_notes: string;
  special_notes?: string;
}
