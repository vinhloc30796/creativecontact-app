import { NextRequest, NextResponse } from "next/server";
import { fetchArtworkCredits } from "./helper";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const credits = await fetchArtworkCredits(id);

    if (!credits || credits.length === 0) {
      return NextResponse.json([], { status: 200 }); // Return empty array if no credits
    }

    return NextResponse.json(credits);
  } catch (error) {
    console.error("Error fetching artwork credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork credits" },
      { status: 500 }
    );
  }
} 