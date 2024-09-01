import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { plusJakartaSans } from './fonts'
import './globals.css'
import { ThemeProvider } from '@/components/themes/theme-provider'

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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
		</html>
	)
}