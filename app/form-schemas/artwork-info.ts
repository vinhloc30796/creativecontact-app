// File: app/(public)/(event)/register/_sections/formSchema.ts

import { z } from "zod";

// Define the schema for ArtworkInfoStep
export const artworkInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type ArtworkInfoData = z.infer<typeof artworkInfoSchema>
