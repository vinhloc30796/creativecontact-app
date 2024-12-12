import { NextResponse } from "next/server";
import { fetchEvent } from "./helper";

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const { slug } = params;

    // Fetch event data using helper function
    const eventData = await fetchEvent(slug);

    if (!eventData) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json(eventData);

  } catch (error) {
    console.error("Error in event route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
