import { z } from "zod";
import { industries, experienceLevels } from "@/drizzle/schema/user";

// Define the schema for professional info form
export const professionalInfoSchema = z.object({
  industryExperiences: z.array(z.object({
    industry: z.enum(industries),
    experienceLevel: z.enum(experienceLevels)
  })).min(1, { message: "Please add at least one industry experience" })
});

export type ProfessionalInfoData = z.infer<typeof professionalInfoSchema>;