import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { artworks, artworkAssets, artworkCredits, artworkEvents } from "@/drizzle/schema/artwork";
import { events } from "@/drizzle/schema/event";
import { userInfos, UserInfo } from "@/drizzle/schema/user";
import { ArtworkWithAssetsThumbnailCredits } from "@/components/artwork/ArtworkCard";

export async function fetchEventArtworks(eventId: string): Promise<Record<string, ArtworkWithAssetsThumbnailCredits>> {
  // Fetch artworks and their assets for the event
  const eventArtworks = await db
    .select({
      artwork: artworks,
      assets: artworkAssets, 
      credits: artworkCredits,
      user: userInfos,
    })
    .from(artworkEvents)
    .innerJoin(artworks, eq(artworkEvents.artworkId, artworks.id))
    .leftJoin(artworkAssets, eq(artworks.id, artworkAssets.artworkId))
    .leftJoin(artworkCredits, eq(artworks.id, artworkCredits.artworkId))
    .leftJoin(userInfos, eq(artworkCredits.userId, userInfos.id))
    .where(eq(artworkEvents.eventId, eventId));

  // Process fetched artworks to group assets with their respective artworks
  const processedArtworks = eventArtworks.reduce(
    (acc, { artwork, assets, credits, user }) => {
      if (!acc[artwork.id]) {
        acc[artwork.id] = {
          ...artwork,
          assets: [],
          thumbnail: null,
          credits: [],
        };
      }

      if (assets && !acc[artwork.id].assets.some((a) => a.id === assets.id)) {
        acc[artwork.id].assets.push(assets);
        if (assets.isThumbnail) {
          acc[artwork.id].thumbnail = {
            filePath: assets.filePath,
            assetType: assets.assetType || "image",
          };
        }
      }

      if (credits && !acc[artwork.id].credits.some((c) => c.id === credits.id)) {
        const userInfo: UserInfo = user
          ? {
              ...user
            }
          : {
              id: credits.userId,
              firstName: null,
              lastName: null,
              userName: null, 
              displayName: "Anonymous",
              phoneCountryCode: null,
              phoneNumber: null,
              phoneCountryAlpha3: null,
              location: null,
              occupation: null,
              about: null,
              profilePicture: null,
              instagramHandle: null,
              facebookHandle: null,
            };
        acc[artwork.id].credits.push({ ...credits, user: userInfo });
      }
      return acc;
    },
    {} as Record<string, ArtworkWithAssetsThumbnailCredits>
  );

  return processedArtworks;
}
