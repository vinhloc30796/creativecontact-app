// File: app/(public)/[eventSlug]/upload/actions.ts
"use server";

import { ArtworkCreditInfoData } from "@/app/form-schemas/artwork-credit-info";
import {
  artworkAssets as artworkAssetsTable,
  artworkCredits as artworkCreditsTable,
  artworkEvents,
  artworks as artworksTable,
} from "@/drizzle/schema/artwork";
import { events } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";

function getAssetType(
  path: string,
): "image" | "video" | "audio" | "font" | null {
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
    id: string;
    title: string;
    description: string;
  },
) {
  const result = await db.transaction(async (tx) => {
    const [artwork] = await tx
      .insert(artworksTable)
      .values({
        id: artworkData.id,
        title: artworkData.title,
        description: artworkData.description,
      })
      .returning();

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
    isThumbnail: boolean;
  }[],
) {
  if (artworkAssets.length === 0) {
    return [];
  }
  const result = await db.transaction(async (tx) => {
    const assets = await tx
      .insert(artworkAssetsTable)
      .values(
        artworkAssets.map((asset: any) => ({
          artworkId: artworkId,
          filePath: asset.path,
          assetType: getAssetType(asset.path),
          description: asset.description || null,
          isThumbnail: asset.isThumbnail,
        })),
      )
      .returning();
    return assets;
  });
  return result;
}

export async function insertArtworkCredit(
  artworkId: string,
  userId: string,
  title: string,
) {
  const result = await db.transaction(async (tx) => {
    const credits = await tx
      .insert(artworkCreditsTable)
      .values({
        artworkId: artworkId,
        userId: userId,
        title: title,
      })
      .onConflictDoUpdate({
        target: [artworkCreditsTable.artworkId, artworkCreditsTable.userId],
        set: { title: title },
      })
      .returning();
    return credits;
  });
  return result;
}

export async function insertArtworkEvents(
  artworkId: string,
  eventSlug: string,
) {
  const result = await db.transaction(async (tx) => {
    const event = await tx.query.events.findFirst({
      where: eq(events.slug, eventSlug),
      columns: { id: true, time_end: true },
    });

    if (!event) {
      throw new Error(`Event with slug ${eventSlug} not found`);
    }

    if (event.time_end && new Date() > new Date(event.time_end)) {
      throw new Error(`Event with slug ${eventSlug} has ended`);
    }

    const artworkEvent = await tx
      .insert(artworkEvents)
      .values({
        artworkId: artworkId,
        eventId: event.id,
      })
      .returning();
    return artworkEvent;
  });
  return result;
}
