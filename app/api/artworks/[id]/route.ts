import { NextRequest, NextResponse } from 'next/server';
import { artworks as artworksTable } from "@/drizzle/schema/artwork";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const [artwork] = await db
      .select()
      .from(artworksTable)
      .where(eq(artworksTable.id, id))
      .limit(1);

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    return NextResponse.json(artwork);
  } catch (error) {
    console.error("Error fetching artwork:", error);
    return NextResponse.json({ error: 'Failed to fetch artwork' }, { status: 500 });
  }
}
