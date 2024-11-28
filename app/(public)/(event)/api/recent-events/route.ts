import { NextResponse } from "next/server";
import { fetchRecentEvents } from "./helper";

// Set a default limit of 5 events
const DEFAULT_LIMIT = 5;

export async function GET() {
  try {
    // Fetch recent events using helper function with default limit
    const recentEvents = await fetchRecentEvents(DEFAULT_LIMIT);

    // Return successful response with recent events data
    return NextResponse.json(recentEvents);

  } catch (error) {
    console.error("Error in recent events route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
