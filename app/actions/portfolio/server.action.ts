/*
# delete portfolio command
## check auth
  * user_id vs owner of portfolio
## transaction delete portfolio
    - delete artwork_assets
    - delete artwork_credits
    - delete artworks
    - delete portfolio
    * return artwork_id
## delete storage
    - delete files in path artwork_assets/$artwork_id
*/
"use server";
import { artworkAssets, artworkCredits, artworks } from "@/drizzle/schema/artwork";
import { portfolioArtworks } from "@/drizzle/schema/portfolio";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { ConsoleLogWriter, eq } from "drizzle-orm";

export const getPortfolioById = async (id: string) => {
  const results = await db
    .select({
      id: portfolioArtworks.id,
      userId: portfolioArtworks.userId,
      artworkId: portfolioArtworks.artworkId,
    })
    .from(portfolioArtworks)
    .where(eq(portfolioArtworks.id, id));
  return results[0];
}
export const deletePortfolio = async (portfolioId: string, userId: string)
  : Promise<{ data: { success: boolean } | null, error: Error | null }> => {

  const portfolio = await getPortfolioById(portfolioId);
  if (!portfolio) {
    return { data: null, error: new Error("Portfolio not found") };
  }
  if (portfolio.userId !== userId) {
    return { data: null, error: new Error("Unauthorized") };
  }


  try {
    await db.transaction(async (tx) => {
      await tx.delete(portfolioArtworks).where(
        eq(portfolioArtworks.id, portfolioId)
      )
      await tx.delete(artworkAssets).where(
        eq(artworkAssets.artworkId, portfolio.artworkId)
      )
      await tx.delete(artworkCredits).where(
        eq(artworkCredits.artworkId, portfolio.artworkId)
      )
      await tx.delete(artworks).where(
        eq(artworks.id, portfolio.artworkId)
      )
    })
    await deleteAllfilesOfArtwork(portfolio.artworkId)
    return { data: { success: true }, error: null }
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return { data: null, error: new Error("Error deleting portfolio") };
  }

}

const deleteAllfilesOfArtwork = async (artworkId: string) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.storage
      .from('artwork_assets')
      .list(artworkId);
    if (error) {
      return error
    }
    const errors = []
    for (const file of data) {
      const { error: deleteError } = await supabase.storage
        .from('artwork_assets')
        .remove([`${artworkId}/${file.name}`]);
      if (deleteError) {
        errors.push(deleteError)
      }
    }
    if (errors.length > 0) {
      return errors
    }
    return null
  } catch (error) {
    return error
  }
}
