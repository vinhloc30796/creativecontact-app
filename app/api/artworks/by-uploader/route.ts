/**
 * TODO: This route doesn't yet work with /portfolio/new
 * Need to implement handling for new artwork creation flow
 */

import { NextRequest, NextResponse } from 'next/server';

import { artworkCredits as artworkCreditsTable, artworks as artworksTable } from "@/drizzle/schema/artwork";
import { db } from "@/lib/db";
import { and, desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const uploaderId = request.nextUrl.searchParams.get('uploaderId');

  if (!uploaderId) {
    return NextResponse.json({ success: false, error: 'uploaderId is required' }, { status: 400 });
  }

  try {
    const artworks = await db
      .select({
        uuid: artworksTable.id,
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
          eq(artworkCreditsTable.title, "Uploader")
        )
      )
      .orderBy(desc(artworksTable.createdAt));

    return NextResponse.json({artworks});
  } catch (error) {
    console.error("Error fetching artworks by uploader:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch artworks" }, { status: 500 });
  }
}