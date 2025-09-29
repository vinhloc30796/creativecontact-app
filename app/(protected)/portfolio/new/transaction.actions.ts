"use server"

import { ThumbnailSupabaseFile } from "@/app/types/SupabaseFile"
import { artworkAssets, artworkCredits, artworks, artworkEvents } from "@/drizzle/schema/artwork"
import { events } from "@/drizzle/schema/event"
import { portfolioArtworks } from "@/drizzle/schema/portfolio"
import { db } from "@/lib/db"
import { eq, max } from "drizzle-orm"


// todo: add co-owner
export async function createPortfolioTransaction(
  userData: {
    id: string,
  },
  artworkData: {
    id: string,
    title: string,
    description: string
  },
  portfolioData: {
    id?: string,
    displayOrder?: number
    isHightlighted?: boolean
  }
) {
  const result = await db.transaction(async (tx) => {
    const [artwork] = await tx.insert(artworks).values({
      id: artworkData.id,
      title: artworkData.title,
      description: artworkData.description,
    }).returning();
    await tx.insert(artworkCredits).values({
      artworkId: artworkData.id,
      userId: userData.id,
      title: "Artist",
    })
    const maxDisplayOrder = await getMaxDisplayOrder(userData.id)
    const displayOrder = maxDisplayOrder.maxDisplayOrder ? maxDisplayOrder.maxDisplayOrder + 1 : 1;
    const [portfolioArtwork] = await tx.insert(portfolioArtworks).values({
      userId: userData.id,
      artworkId: artwork.id,
      displayOrder: displayOrder,
      ...portfolioData
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
  console.debug("[insertArtworkAssetsTransaction] inserting assets for artworkId:", artworkId);
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
    console.log("[insertArtworkAssetsTransaction] inserted assets:", assets);
    return assets
  });
  console.error("[insertArtworkAssetsTransaction] results:", result);
  return { data: result, errors: null }
}


export async function linkArtworkToEventBySlug(
  artworkId: string,
  eventSlug: string,
) {
  const result = await db.transaction(async (tx) => {
    const foundEvent = await tx.select().from(events).where(eq(events.slug, eventSlug));
    if (!foundEvent || foundEvent.length === 0) {
      return { linked: false, reason: "event_not_found" as const };
    }
    const eventId = foundEvent[0].id;
    try {
      await tx.insert(artworkEvents).values({ artworkId, eventId });
      return { linked: true as const };
    } catch (e) {
      // Likely unique violation if already linked; treat as linked
      return { linked: true as const };
    }
  });
  return result;
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
