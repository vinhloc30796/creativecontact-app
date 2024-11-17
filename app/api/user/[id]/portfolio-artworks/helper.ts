// File: app/api/user/[id]/portfolio-artworks/helper.ts

import { artworkCredits, artworks } from "@/drizzle/schema/artwork";
import {
  PortfolioArtwork,
  PortfolioArtworkWithDetails,
  portfolioArtworks,
} from "@/drizzle/schema/portfolio";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function fetchUserPortfolioArtworks(
  userId: string,
): Promise<PortfolioArtwork[]> {
  const results: PortfolioArtwork[] = await db
    .select()
    .from(portfolioArtworks)
    .where(eq(portfolioArtworks.userId, userId));
  return results;
}

export async function fetchUserPortfolioArtworksWithDetails(
  userId: string,
): Promise<PortfolioArtworkWithDetails[]> {
  const results = await db
    .select({
      portfolioArtworks: portfolioArtworks,
      artworks: artworks,
    })
    .from(portfolioArtworks)
    .where(eq(portfolioArtworks.userId, userId))
    .innerJoin(artworks, eq(portfolioArtworks.artworkId, artworks.id));

  return results as PortfolioArtworkWithDetails[];
}
