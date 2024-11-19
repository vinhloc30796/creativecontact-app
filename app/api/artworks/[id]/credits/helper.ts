import {
  artworkCredits,
  artworks as artworksTable,
  ArtworkCredit,
} from "@/drizzle/schema/artwork";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { authUsers, userInfos } from "@/drizzle/schema/user";

export type ArtworkWithCredits = {
  id: string;
  title: string | null;
  userId: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
};

export async function fetchArtworkCredits(id: string) {
  const credits = await db
    .select({
      id: artworkCredits.id,
      title: artworkCredits.title,
      userId: artworkCredits.userId,
      displayName: userInfos.displayName,
      firstName: userInfos.firstName,
      lastName: userInfos.lastName,
    })
    .from(artworkCredits)
    .innerJoin(artworksTable, eq(artworkCredits.artworkId, artworksTable.id))
    .leftJoin(userInfos, eq(artworkCredits.userId, userInfos.id))
    .where(eq(artworksTable.id, id));

  return credits;
}
