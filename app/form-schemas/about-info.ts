import { z } from "zod";
import { professionalInfoSchema } from "@/app/form-schemas/professional-info";
import { contactInfoSchema } from "@/app/form-schemas/contact-info";

export { contactInfoSchema, professionalInfoSchema };

export const aboutSchema = z.object({
  about: z.string().optional(),
});

export type AboutInfoData = z.infer<typeof aboutSchema>;
