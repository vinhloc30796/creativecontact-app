// File: app/(public)/(event)/register/_sections/formSchema.ts

import { z } from "zod";

export const eventRegistrationSchema = z.object({
  // DateSelectionStep fields
  slot: z.string().min(1, "Please select a time slot"),
  existingRegistrationId: z.string().optional(),
});

export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>