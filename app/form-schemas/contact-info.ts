import { z } from "zod";

export const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  userName: z.string().optional(),
  displayName: z.string().optional(),
  phoneCountryCode: z.string().default("84"),
  phoneNumber: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: "Phone number must be 10 digits",
  }),
  phoneCountryAlpha3: z.string().default("VNM"),
  location: z.string().optional(),
  instagramHandle: z.string().optional(),
  facebookHandle: z.string().optional(),
});

export type ContactInfoData = z.infer<typeof contactInfoSchema>;
