import { NextRequest, NextResponse } from 'next/server';
import { LanguageDetector } from 'i18next-http-middleware';
import { languages, fallbackLng } from '@/lib/i18n/settings';

// Custom implementation of LanguageDetector for Next.js
class NextLanguageDetector extends LanguageDetector {
  constructor(services?: any, options?: any) {
    super(services, {
      order: ['path', 'cookie', 'header'],
      lookupCookie: 'i18next',
      lookupHeader: 'accept-language',
      caches: ['cookie'],
      ...options,
    });
  }

  detect(req: NextRequest): string | readonly string[] | undefined {
    let lng: string | undefined;

    // Check path first
    const pathLng = req.nextUrl.pathname.split('/')[1];
    if (languages.includes(pathLng)) {
      lng = pathLng;
    }

    // Check cookie
    if (!lng) {
      const cookie = req.cookies.get('i18next');
      if (cookie && languages.includes(cookie.value)) {
        lng = cookie.value;
      }
    }

    // Check accept-language header
    if (!lng) {
      const acceptLang = req.headers.get('accept-language');
      if (acceptLang) {
        const preferredLng = acceptLang
          .split(',')[0]
          .split('-')[0]
          .toLowerCase();
        if (languages.includes(preferredLng)) {
          lng = preferredLng;
        }
      }
    }

    return lng || fallbackLng;
  }

  cacheUserLanguage(req: NextRequest, res: NextResponse, lng: string): void {
    res.cookies.set('i18next', lng, {
      path: '/',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
  }
}

export async function handleI18n(req: NextRequest): Promise<NextResponse> {
  const detector = new NextLanguageDetector();
  const detectedLng = detector.detect(req);
  
  const response = NextResponse.next();
  
  if (typeof detectedLng === 'string') {
    detector.cacheUserLanguage(req, response, detectedLng);
  }

  return response;
} 