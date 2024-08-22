// File: app/(public)/(event)/register/_sections/formSchema.ts

import { z } from "zod";
import { industries, experienceLevels } from "@/drizzle/schema";

export const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  phone: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: "Phone number must be 10 digits",
  }),
  // DateSelectionStep fields
  slot: z.string().min(1, "Please select a time slot"),
  existingRegistrationId: z.string().optional(),
});

// Define the schema for ProfessionalInfoStep
export const professionalInfoSchema = z.object({
  industries: z.array(z.enum(industries)).min(1, "Please select at least one industry"),
  experience: z.enum(experienceLevels),
})


export type FormData = z.infer<typeof formSchema>;
export type ProfessionalInfoData = z.infer<typeof professionalInfoSchema>
export type CombinedFormData = FormData & ProfessionalInfoData
