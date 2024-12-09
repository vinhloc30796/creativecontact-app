import { NextRequest, NextResponse } from "next/server";
import { fetchArtwork } from "./helper";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    const artwork = await fetchArtwork(id);

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json(artwork);
  } catch (error) {
    console.error("Error fetching artwork:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork" },
      { status: 500 },
    );
  }
}
