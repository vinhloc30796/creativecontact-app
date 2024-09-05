// File: app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/themes/theme-provider'
import React from 'react'
import { Toaster } from "@/components/ui/sonner"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster visibleToasts={9} closeButton={true}/>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
