import { db } from '@/lib/db';
import { artworks, artworkAssets, artworkCredits } from '@/drizzle/schema/artwork';
import { eq } from 'drizzle-orm';

export async function getArtwork(artworkId: string) {
  try {
    // Step 1: Query the artwork
    const artwork = await db.select().from(artworks).where(eq(artworks.id, artworkId)).limit(1);

    if (!artwork || artwork.length === 0) {
      console.error('Artwork not found');
      return null;
    }

    // Step 2: Query related artwork assets
    const assets = await db.select().from(artworkAssets).where(eq(artworkAssets.artworkId, artworkId));

    // Step 3: Query related artwork credits
    const credits = await db.select().from(artworkCredits).where(eq(artworkCredits.artworkId, artworkId));

    // Step 4: Combine and return the data
    return {
      ...artwork[0],
      artwork_assets: assets,
      artwork_credits: credits
    };
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return null;
  }
}


