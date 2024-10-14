// File: app/providers.tsx
"use client";

import { ThemeProvider } from "@/components/themes/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { I18nProvider } from "@/lib/i18n/i18nProvider";
import { languages } from "@/lib/i18n/settings";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";

export async function generateStaticParams() {
  return languages.map((lang: string) => ({ lang }))
}

export async function SearchParamsProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState(searchParams.get('lang') || 'en')

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

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loading />}>
          <SearchParamsProvider>
            {children}
            <Toaster visibleToasts={9} closeButton={true} />
          </SearchParamsProvider>
        </Suspense>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
