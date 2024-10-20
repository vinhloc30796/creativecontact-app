// File: app/(public)/(event)/register/_sections/formSchema.ts

import { z } from "zod";
import { industries, experienceLevels } from "@/drizzle/schema/user";

// Define the schema for ProfessionalInfoStep
export const professionalInfoSchema = z.object({
  industries: z.array(z.enum(industries)).min(1, { message: "Please select at least one industry" }),
  experience: z.enum(experienceLevels),
})

export type ProfessionalInfoData = z.infer<typeof professionalInfoSchema>