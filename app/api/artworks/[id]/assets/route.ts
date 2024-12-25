import { NextRequest, NextResponse } from "next/server";
import { fetchArtworkWithAssets } from "./helper";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    const artworkWithAssets = await fetchArtworkWithAssets(id);

    if (!artworkWithAssets || artworkWithAssets.length === 0) {
      return NextResponse.json(
        { error: "Artwork assets not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(artworkWithAssets);
  } catch (error) {
    console.error("Error fetching artwork assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork assets" },
      { status: 500 }
    );
  }
}
