// File: app/types/EventSlot.tsx

import { UUID } from "crypto";

// Define the EventSlot interface
export interface EventSlot {
  id: UUID;
  createdAt: Date;
  event: UUID;
  timeStart: Date;
  timeEnd: Date;
  capacity: number;
}
