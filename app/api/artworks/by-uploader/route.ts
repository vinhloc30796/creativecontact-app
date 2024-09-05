import { NextRequest, NextResponse } from 'next/server';

import { artworkCredits as artworkCreditsTable, artworks as artworksTable } from "@/drizzle/schema/artwork";
import { db } from "@/lib/db";
import { and, desc, eq } from "drizzle-orm";

export async function getArtworksByUploader(uploaderId: string) {
  try {
    const artworks = await db
      .select({
        id: artworksTable.id,
        title: artworksTable.title,
        description: artworksTable.description,
        createdAt: artworksTable.createdAt,
      })
      .from(artworksTable)
      .innerJoin(
        artworkCreditsTable,
        eq(artworksTable.id, artworkCreditsTable.artworkId)
      )
      .where(
        and(
          eq(artworkCreditsTable.userId, uploaderId),
          eq(artworkCreditsTable.role, "Uploader")
        )
      )
      .orderBy(desc(artworksTable.createdAt));

    return { success: true, artworks };
  } catch (error) {
    console.error("Error fetching artworks by uploader:", error);
    return { success: false, error: "Failed to fetch artworks" };
  }
}

export async function GET(request: NextRequest) {
  const uploaderId = request.nextUrl.searchParams.get('uploaderId');

  if (!uploaderId) {
    return NextResponse.json({ error: 'uploaderId is required' }, { status: 400 });
  }

  const result = await getArtworksByUploader(uploaderId);

  if (result.success) {
    return NextResponse.json(result.artworks);
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}