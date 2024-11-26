// File: app/providers.tsx
"use client";

import { ThemeProvider } from "@/components/themes/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { IntlProvider } from "react-intl";
import { Loading } from "@/components/Loading";
import { I18nProvider } from "@/lib/i18n/i18nProvider";
import { languages } from "@/lib/i18n/settings";
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { Suspense } from "react";


export async function generateStaticParams() {
  return languages.map((lang: string) => ({ lang }))
}

export function SearchParamsProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState(() => {
    // First try URL param
    const urlLang = searchParams.get('lang');
    if (urlLang) return urlLang;
    
    // Then try cookie
    if (typeof document !== 'undefined') {
      const cookieLang = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      if (cookieLang) return cookieLang;
    }
    
    // Default to 'en'
    return 'en';
  });

  return (
    <I18nProvider lng={language} fallbackLng="en">
      {children}
    </I18nProvider>
  )
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

function PosthogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      person_profiles: 'identified_only',
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true, // Enable pageleave capture
    })
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SearchParamsProvider>
          <PosthogProvider>
            {children}
          </PosthogProvider>
          <Toaster visibleToasts={9} closeButton={true} />
        </SearchParamsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
