// File: app/(public)/[eventSlug]/upload/actions.ts
"use server"

import { ArtworkCreditInfoData } from "@/app/form-schemas/artwork-credit-info";
import { artworkAssets as artworkAssetsTable, artworkCredits as artworkCreditsTable, artworks as artworksTable } from "@/drizzle/schema/artwork";
import { db } from "@/lib/db";

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

export async function createArtwork(
  uploaderId: string,
  artworkData: {
    uuid: string;
    title: string;
    description: string;
  }
) {
  const result = await db.transaction(async (tx) => {
    const [artwork] = await tx.insert(artworksTable).values({
      id: artworkData.uuid,
      title: artworkData.title,
      description: artworkData.description,
    }).returning();

    await tx.insert(artworkCreditsTable).values({
      artworkId: artwork.id,
      userId: uploaderId,
      title: "Uploader",
    });

    return { artwork };
  });

  return result;
}

export async function insertArtworkAssets(
  artworkId: string,
  artworkAssets: {
    id: string;
    path: string;
    fullPath: string;
  }[]
) {
  const result = await db.transaction(async (tx) => {
    const assets = await tx.insert(artworkAssetsTable).values(
      artworkAssets.map((asset: any) => ({
        artworkId: artworkId,
        filePath: asset.path,
        assetType: getAssetType(asset.path),
        description: asset.description || null,
      }))
    ).returning();
    return assets;
  });
  return result;
}

export async function insertArtworkCredit(
  artworkId: string,
  userId: string,
  title: string
) {
  const result = await db.transaction(async (tx) => {
    const credits = await tx.insert(artworkCreditsTable).values(
      {
        artworkId: artworkId,
        userId: userId,
        title: title,
      }
    ).returning();
    return credits;
  });
  return result;
}
