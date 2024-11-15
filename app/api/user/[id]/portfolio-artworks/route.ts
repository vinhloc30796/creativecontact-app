// File: app/api/user/[id]/portfolio-artworks/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fetchUserPortfolioArtworks } from './helper';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  const portfolioArtworks = await fetchUserPortfolioArtworks(userId);
  return NextResponse.json(portfolioArtworks);
}