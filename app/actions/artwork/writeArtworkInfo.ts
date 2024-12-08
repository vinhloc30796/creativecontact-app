"use server";

import { db } from "@/lib/db";

import { artworks } from "@/drizzle/schema/artwork";

export async function writeArtworkInfo(
  artworkId: string,
  title: string,
  description: string,
) {
  console.log("Received artwork data:", {
    artworkId,
    title,
    description,
  });

  try {
    const updateSet = {
      title: title,
      description: description,
    };

    console.log("Updating artwork:", { artworkId, updateSet });

    const result = await db
      .insert(artworks)
      .values({
        id: artworkId,
        ...updateSet,
      })
      .onConflictDoUpdate({
        target: artworks.id,
        set: updateSet,
      })
      .returning();

    console.log("Portfolio artwork updated:", result);

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error updating artwork:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
