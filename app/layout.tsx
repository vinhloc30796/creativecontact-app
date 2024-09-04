// File: app/layout.tsx
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import React from 'react'
import { plusJakartaSans } from './fonts'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Creative Contact',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} font-sans`} suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}