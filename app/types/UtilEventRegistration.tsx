// File: app/types/UtilEventRegistration.tsx
import { RegistrationStatus } from "@/app/types/RegistrationStatus";
import { EventRegistration } from "@/app/types/EventRegistration";


// Utility type for creating a new event registration
export type NewEventRegistration = Omit<EventRegistration, 'id' | 'createdAt' | 'status'> & {
  status?: RegistrationStatus;
};

// Utility type for updating an event registration
export type UpdateEventRegistration = Partial<Omit<EventRegistration, 'id' | 'createdAt' | 'createdBy'>>;
