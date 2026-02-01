import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import BuiltWithBadge from '../components/built-with-badge'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doggybagg.cc'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ordinance.ai | San Diego Property Fine Monitoring | DoggyBagg LLC',
  description: 'AI-powered municipal code violation monitoring for San Diego property investors. Detect fines early, protect your portfolio, and stay compliant with Ordinance.ai.',
  generator: 'v0.app',
  keywords: ['San Diego', 'property fines', 'municipal code', 'real estate', 'compliance', 'AI monitoring'],
  authors: [{ name: 'DoggyBagg LLC' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      {/* v0 – built-with badge (client-only) */}
      <BuiltWithBadge />
</body>
    </html>
  )
}
