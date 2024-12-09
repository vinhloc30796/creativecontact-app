import { NextResponse } from "next/server";
import { fetchEventArtworks } from "./helper";

export async function GET(request: Request, props: { params: Promise<{ eventSlug: string }> }) {
  const params = await props.params;
  if (!params || !params.eventSlug) {
    return NextResponse.json(
      { error: "Event slug is required" },
      { status: 400 }
    );
  }
  try {
    // Get eventSlug from params instead of URL to avoid dynamic usage
    const eventSlug = params.eventSlug;

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
