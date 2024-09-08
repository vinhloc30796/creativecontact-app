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

export async function generateStaticParams() {
  return languages.map((lang: string) => ({ lang }))
}

export default function Providers({ children, lang }: { children: React.ReactNode, lang: string }) {
  const [queryClient] = React.useState(() => new QueryClient())
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState(lang)

  return (
    <ThemeProvider>
      <I18nProvider lng={language} fallbackLng="en">
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster visibleToasts={9} closeButton={true} />
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
