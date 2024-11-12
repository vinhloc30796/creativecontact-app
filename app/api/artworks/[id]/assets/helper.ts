import {
  artworkEvents,
  artworkAssets,
  artworks as artworksTable,
  Artwork,
  ArtworkAsset,
  ArtworkEvent,
} from "@/drizzle/schema/artwork";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

export type ArtworkWithAssets = {
  assets: ArtworkAsset | null;
  event: ArtworkEvent | null;
};

export async function fetchArtworkWithAssets(id: string) {
  const artworkData: ArtworkWithAssets[] = await db
    .select({
      assets: artworkAssets,
      event: artworkEvents,
    })
    .from(artworkAssets)
    .innerJoin(artworksTable, eq(artworkAssets.artworkId, artworksTable.id))
    .leftJoin(artworkEvents, eq(artworkAssets.artworkId, artworkEvents.artworkId))
    .where(eq(artworksTable.id, id))
    .orderBy(desc(artworkAssets.isThumbnail)); // Sort thumbnail to the top

  return artworkData;
}
