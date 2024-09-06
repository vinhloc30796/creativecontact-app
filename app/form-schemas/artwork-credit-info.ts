// File: app/form-schemas/artwork-credit-info.ts

import { z } from "zod";

export const artworkCreditSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  title: z.string().min(1, "Title is required"),
});

export type ArtworkCreditData = z.infer<typeof artworkCreditSchema>;

// Define the schema for ArtworkCreditInfoStep
export const artworkCreditInfoSchema = z.object({
  coartists: z.array(artworkCreditSchema).optional(),
});

export type ArtworkCreditInfoData = z.infer<typeof artworkCreditInfoSchema>;
