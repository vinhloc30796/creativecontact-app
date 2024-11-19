// File: app/api/user/[id]/portfolio-artworks/helper.ts

import { artworkCredits, artworks } from "@/drizzle/schema/artwork";
import {
  PortfolioArtwork,
  PortfolioArtworkWithDetails,
  portfolioArtworks,
} from "@/drizzle/schema/portfolio";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";

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
  artworkId?: string,
): Promise<PortfolioArtworkWithDetails[]> {
  const query = db
    .select({
      portfolioArtworks: portfolioArtworks,
      artworks: artworks,
    })
    .from(portfolioArtworks)
    .where(
      artworkId
        ? and(
            eq(portfolioArtworks.userId, userId),
            eq(portfolioArtworks.id, artworkId),
          )
        : eq(portfolioArtworks.userId, userId),
    )
    .innerJoin(artworks, eq(portfolioArtworks.artworkId, artworks.id));

  const results = await query;
  console.debug("fetchUserPortfolioArtworksWithDetails: ", results);
  return results as PortfolioArtworkWithDetails[];
}
