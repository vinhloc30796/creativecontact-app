"use server"

import { ThumbnailSupabaseFile } from "@/app/types/SupabaseFile"
import { artworkAssets, artworkCredits, artworks } from "@/drizzle/schema/artwork"
import { portfolioArtworks } from "@/drizzle/schema/portfolio"
import { db } from "@/lib/db"
import { eq, max } from "drizzle-orm"


// todo: add co-owner
export async function createPortfolioTransaction(
  userData: {
    id: string,
  },
  artworkData: {
    title: string,
    description: string
  },
  portfolioData: {
    displayOrder?: number
    isHightlighted?: boolean
  }
) {
  const result = await db.transaction(async (tx) => {
    const [artwork] = await tx.insert(artworks).values({
      title: artworkData.title,
      description: artworkData.description,
    }).returning();
    await tx.insert(artworkCredits).values({
      artworkId: artwork.id,
      userId: userData.id,
      title: "Artist",
    })
    const maxDisplayOrder = await getMaxDisplayOrder(userData.id)
    const displayOrder = maxDisplayOrder.maxDisplayOrder ? maxDisplayOrder.maxDisplayOrder + 1 : 1;
    const [portfolioArtwork] = await tx.insert(portfolioArtworks).values({
      userId: userData.id,
      artworkId: artwork.id,
      displayOrder: displayOrder,
      // ...portfolioData
    }).returning()
    return { portfolioArtwork, artwork }
  })
  return result
}

const getMaxDisplayOrder = async (userId: string) => {
  const result = await db.select({
    maxDisplayOrder: max(portfolioArtworks.displayOrder)
  }).from(portfolioArtworks).where(eq(portfolioArtworks.userId, userId))
  return result[0]
}

export async function insertArtworkAssetsTransaction(
  artworkId: string,
  artworkAssetsData: ThumbnailSupabaseFile[]
) {
  if (artworkAssetsData.length === 0) {
    return { data: null, errors: [new Error("No files to upload")] };
  }
  const result = await db.transaction(async (tx) => {
    const assets = await tx.insert(artworkAssets).values(
      artworkAssetsData.map(asset => ({
        artworkId: artworkId,
        filePath: asset.path,
        assetType: getAssetType(asset.path),
        description: null,
        isThumbnail: asset.isThumbnail
      }))
    ).returning();
    return assets
  });
  return { data: result, errors: null }
}


function getAssetType(path: string): "image" | "video" | "audio" | "font" | null {
  // Return "image", "video", "audio", "font"
  const extension = path.split(".").pop() || "";
  if (extension.length === 0) {
    console.log("Unknown asset type for path: ", path);
    return null;
  }
  // Build extension list <-> assetType map
  const imageExtensions = ["png", "jpg", "jpeg", "gif", "svg", "ico"];
  const videoExtensions = ["mp4", "mov", "avi", "mkv"];
  const audioExtensions = ["mp3", "wav", "flac", "aac"];
  const fontExtensions = ["ttf", "otf", "woff", "woff2"];
  // Check if the extension is in the list
  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else if (audioExtensions.includes(extension)) {
    return "audio";
  } else if (fontExtensions.includes(extension)) {
    return "font";
  }
  console.log("Unknown asset type for path: ", path);
  return null;
}
