// File: app/providers.tsx
"use client";

import { ThemeProvider } from "@/components/themes/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { IntlProvider } from "react-intl";
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

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

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
    </ThemeProvider >
  )
}
