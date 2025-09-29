import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { insertArtworkAssetsTransaction } from "@/app/(protected)/portfolio/new/transaction.actions";
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
      artworkId,
      assets,
    }: {
      artworkId: string;
      assets: ThumbnailSupabaseFile[];
    } = body;

    if (!artworkId || !Array.isArray(assets)) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const result = await insertArtworkAssetsTransaction(artworkId, assets);
    if (result.errors) {
      return NextResponse.json({ error: "asset_insert_failed", details: result.errors.map(e => String(e)) }, { status: 500 });
    }
    return NextResponse.json({ data: result.data });
  } catch (e) {
    console.error("[api/portfolio/assets] error", e);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}


