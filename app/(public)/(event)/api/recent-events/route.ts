import { NextResponse } from "next/server";
import { fetchRecentEvents } from "./helper";

export async function GET(request: Request) {
  try {
    // Extract limit from URL query params if provided
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");
    const limitNum = limit ? parseInt(limit) : 5;

    // Fetch recent events using helper function
    const recentEvents = await fetchRecentEvents(limitNum);

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
