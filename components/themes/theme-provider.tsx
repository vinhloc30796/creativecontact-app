'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useParams } from 'next/navigation'
import { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const eventSlug = params.eventSlug as string

  // Define a mapping of event slugs to theme names
  const eventThemes: { [key: string]: string } = {
    'hoantat-2024': 'light',
    'trungthu-archive-2024': 'trungthu-archive-2024',
    'early-access-2024': 'early-access-2024',
    // Add more event slugs and their corresponding theme names here
  }

  const forcedTheme = eventSlug ? eventThemes[eventSlug] : undefined

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      forcedTheme={forcedTheme}
    >
      {children}
    </NextThemesProvider>
  )
}