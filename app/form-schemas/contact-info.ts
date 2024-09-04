import { z } from "zod";
import { experienceLevels } from "@/app/types/UserInfo";
import { industries } from "@/app/types/UserInfo";

export const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  phone: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: "Phone number must be 10 digits",
  }),
});

export type ContactInfoData = z.infer<typeof contactInfoSchema>