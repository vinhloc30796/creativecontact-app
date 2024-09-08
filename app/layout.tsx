// File: app/layout.tsx
import { languages } from "@/lib/i18n/settings"
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import React from 'react'
import { plusJakartaSans } from './fonts'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Creative Contact',
  description: 'Vietnamese Creative Network',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export async function generateStaticParams() {
  return languages.map((lang: string) => ({ lang }))
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={`${plusJakartaSans.variable} font-sans`} suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}