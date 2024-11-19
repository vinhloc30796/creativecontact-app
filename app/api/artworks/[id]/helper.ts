import { artworks as artworksTable } from "@/drizzle/schema/artwork";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function fetchArtwork(id: string) {
  try {
    const [artwork] = await db
      .select()
      .from(artworksTable)
      .where(eq(artworksTable.id, id))
      .limit(1);

    if (!artwork) {
      throw new Error("Artwork not found");
    }

    return artwork;
  } catch (error) {
    console.error("Error fetching artwork:", error);
    throw new Error("Failed to fetch artwork");
  }
}
