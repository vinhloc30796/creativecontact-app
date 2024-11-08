// File: app/api/user/[id]/portfolio-artworks/helper.ts

import {
  PortfolioArtwork,
  portfolioArtworks,
} from "@/drizzle/schema/portfolio";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function fetchUserPortfolioArtworks(
  userId: string,
): Promise<PortfolioArtwork[]> {
  const artworks: PortfolioArtwork[] = await db
    .select()
    .from(portfolioArtworks)
    .where(eq(portfolioArtworks.userId, userId));
  return artworks;
}
