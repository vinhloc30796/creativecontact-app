import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createPortfolioTransaction, setArtworkEventsTransaction } from "@/app/(protected)/portfolio/new/transaction.actions";
import { db } from "@/lib/db";
import { events } from "@/drizzle/schema/event";
import { eq } from "drizzle-orm";
import { ThumbnailSupabaseFile } from "@/app/types/SupabaseFile";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      artworkData,
      portfolioData,
      eventSlug,
    }: {
      artworkData: { id: string; title: string; description: string };
      portfolioData: { id?: string; displayOrder?: number; isHightlighted?: boolean };
      eventSlug?: string | null;
    } = body;

    if (!artworkData || !artworkData.id || !artworkData.title) {
      return NextResponse.json({ error: "invalid_artwork_data" }, { status: 400 });
    }

    const result = await createPortfolioTransaction(
      { id: user.id },
      artworkData,
      portfolioData ?? {},
    );

    if (eventSlug) {
      try {
        const found = await db.select().from(events).where(eq(events.slug, eventSlug));
        if (found && found.length > 0) {
          await setArtworkEventsTransaction(result.artwork.id, [found[0].id], { mode: "add" });
        }
      } catch (e) {
        // Non-fatal; proceed even if linking fails
        console.warn("[api/portfolio/create] link event failed", e);
      }
    }

    return NextResponse.json({ artwork: result.artwork, portfolioArtwork: result.portfolioArtwork });
  } catch (e) {
    console.error("[api/portfolio/create] error", e);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}


