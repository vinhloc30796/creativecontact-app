// File: app/(public)/(event)/register/_sections/formSchema.ts

import { z } from "zod";

// Define the schema for ArtworkInfoStep
export const artworkInfoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
});

export type ArtworkInfoData = z.infer<typeof artworkInfoSchema>
