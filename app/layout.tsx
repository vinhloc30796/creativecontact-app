import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { plusJakartaSans } from './fonts'
import './globals.css'

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
})

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
			<body className={cn('min-h-screen bg-background font-sans antialiased')}>{children}</body>
		</html>
	)
}