'use server'

import { getUserId } from "@/app/actions/user/auth"
import { signUpUser } from "@/app/actions/user/signUp"
import { artworkAssets, artworkCredits, artworks } from "@/drizzle/schema/artwork"
import { portfolioArtworks } from "@/drizzle/schema/portfolio"
import { UploadedMediaFileType } from "@/lib/uploadMediaFile"
import { db } from "@/lib/db"
import getServerSideUser from "@/lib/getServerSideUser"
import { createClient } from "@/utils/supabase/server"
import { getAdminSupabaseClient } from "@/utils/supabase/server-admin"
import { eq, max } from "drizzle-orm"
import { User } from "lucide-react"


async function createPortfolio(
  createPortfolioData: {
    id: string,
    title: string,
    description: string,
    displayOrder?: number,
    isHightlighted?: boolean
  },
  artworkAssetsData: UploadedMediaFileType[],
  coownersData: {
    email: string,
    title: string,
  }[]
): Promise<{ result: boolean, error: Error | null }> {
  try {
    const user = await getServerSideUser()
    if (!user) {
      return { result: false, error: new Error("User not logged in") }
    }

    // transaction
    await db.transaction(async (tx) => {
      // insert artwork
      await tx.insert(artworks).values({
        id: createPortfolioData.id,
        title: createPortfolioData.title,
        description: createPortfolioData.description,
      })

      // insert uploader credit
      await tx.insert(artworkCredits).values({
        artworkId: createPortfolioData.id,
        userId: user.id,
        title: "Uploader"
      })

      //insert co-owner credits
      const coownerValuesPromise = coownersData.map(async (coowner) => {
        const coownerInfo = await getCoOwnersInfo(coowner.email, coowner.title)
        if (coownerInfo.error) {
          throw coownerInfo.error
        }
        return coownerInfo.result!
      })
      const coownerValues = await Promise.all(coownerValuesPromise)
      coownersData.length > 0 && await tx.insert(artworkCredits).values(coownerValues.map(
        (coowner) => ({
          artworkId: createPortfolioData.id,
          userId: coowner.userId,
          title: coowner.title,
        })
      ))

      // insert assets
      await tx.insert(artworkAssets).values(
        artworkAssetsData.map((asset) => ({
          artworkId: createPortfolioData.id,
          filePath: asset.path,
          assetType: asset.type,
          description: asset.description || null,
          isThumbnail: asset.isThumbnail,
        })),
      )

      // insert portfolio
      const { result: maxDisplayOrder, error } = await getMaxDisplayOrderPortfolio()
      if (error) {
        return { result: false, error: error }
      }
      await tx.insert(portfolioArtworks).values({
        userId: user.id,
        artworkId: createPortfolioData.id,
        displayOrder: maxDisplayOrder + 1,
      })
    })
    return { result: true, error: null }
  } catch (err) {
    return { result: false, error: err as Error }
  }
}

async function getPortfolioById(id: string) {
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
async function deletePortfolio(portfolioId: string)
  : Promise<{ data: { success: boolean } | null, error: Error | null }> {
  const user = await getServerSideUser()
  if (!user) {
    return { data: null, error: new Error("User not logged in") }
  }
  const userId = user.id
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

// utils
async function deleteAllfilesOfArtwork(artworkId: string) {
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

async function getMaxDisplayOrderPortfolio(): Promise<{ result: number, error: Error | null }> {
  try {
    const user = await getServerSideUser()
    if (!user) {
      return { result: 0, error: new Error("User not logged in") }
    }
    const rs = await db
      .select({ result: max(portfolioArtworks.displayOrder) })
      .from(portfolioArtworks)
      .where(eq(portfolioArtworks.userId, user.id))
    if (!rs[0].result) {
      return { result: 0, error: null }
    }
    return { result: rs[0].result, error: null }
  } catch (err) {
    return { result: 0, error: err as Error }
  }
}

async function getCoOwnersInfo(email: string, title: string)
  : Promise<{ result: { userId: string, title: string } | null, error: Error | null }> {
  try {

    const userId = await getUserId(email)
    if (!userId) {
      const userid = await getAnonymousUserId(email)
      if (userid.result) {
        // TODO: send email invite to user
        console.log("### Send email invite to co-owner: ", email)
        return { result: { userId: userid.result, title: title }, error: null }
      }
      return { result: null, error: new Error("error creating user") }
    }
    return { result: { userId: userId!, title: title }, error: null }
  } catch (err) {
    return { result: null, error: err as Error }
  }
}

async function getAnonymousUserId(email: string) {
  const adminClient = await getAdminSupabaseClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email: email,
    password: Math.random().toString(36).slice(2, 10),
  })
  return { result: data?.user?.id, error }
}

export {
  getMaxDisplayOrderPortfolio,
  createPortfolio,
  deletePortfolio,
  getPortfolioById,
}