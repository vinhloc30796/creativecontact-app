import { NextResponse } from "next/server";
import { fetchEventArtworks } from "./helper";

export async function GET(
  request: Request,
  { params }: { params: { eventSlug: string } }
) {
  try {
    // Extract eventSlug from URL
    const url = new URL(request.url);
    const eventSlug = url.searchParams.get("eventSlug");

    if (!eventSlug) {
      return NextResponse.json(
        { error: "Event slug is required" },
        { status: 400 }
      );
    }

    // Fetch event artworks using helper function
    const eventArtworks = await fetchEventArtworks(eventSlug);

    if (!eventArtworks) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Return successful response with event artworks data
    return NextResponse.json(eventArtworks);

  } catch (error) {
    console.error("Error fetching event artworks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
