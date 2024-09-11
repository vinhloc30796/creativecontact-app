// File: utils/middleware/lang-persist.ts

import { NextRequest, NextResponse } from "next/server";

export async function handleLangPersist(req: NextRequest) {
  const { pathname, search, origin } = req.nextUrl;
  
  // Skip for static files and API routes
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  let lang = req.nextUrl.searchParams.get('lang');

  // If no lang in URL, check referer
  if (!lang) {
    const referer = req.headers.get('referer');
    if (referer) {
      const refererUrl = new URL(referer);
      lang = refererUrl.searchParams.get('lang');
    }
  }

  // If we have a lang, ensure it's in the URL
  if (lang) {
    const newUrl = new URL(pathname + search, origin);
    newUrl.searchParams.set('lang', lang);
    
    if (newUrl.toString() !== req.url) {
      return NextResponse.redirect(newUrl);
    }
  }

  return NextResponse.next();
}
