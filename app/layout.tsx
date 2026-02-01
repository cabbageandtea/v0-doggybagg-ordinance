import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/providers/query-provider'
import { PostHogProvider } from '@/providers/posthog-provider'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doggybagg.cc'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ordinance.ai | San Diego Property Fine Monitoring | DoggyBagg LLC',
    template: '%s | Ordinance.ai',
  },
  description: 'AI-powered municipal code violation monitoring for San Diego property investors. Detect fines early, protect your portfolio, and stay compliant with Ordinance.ai.',
  generator: 'Ordinance.ai',
  keywords: ['San Diego', 'property fines', 'municipal code', 'real estate', 'compliance', 'AI monitoring', 'STRO', 'short-term rental'],
  authors: [{ name: 'DoggyBagg LLC', url: siteUrl }],
  creator: 'DoggyBagg LLC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Ordinance.ai',
    title: 'Ordinance.ai | San Diego Property Fine Monitoring',
    description: 'AI-powered municipal code violation monitoring for San Diego property investors. Detect fines early, protect your portfolio.',
    images: [
      {
        url: '/images/darkdoggylogo.jpg',
        width: 1200,
        height: 630,
        alt: 'Ordinance.ai - Property Compliance Monitoring',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ordinance.ai | San Diego Property Fine Monitoring',
    description: 'AI-powered municipal code violation monitoring for San Diego property investors.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
        <PostHogProvider>
          <QueryProvider>{children}</QueryProvider>
          <Analytics />
        </PostHogProvider>
        <a
          href="https://v0.app"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-[1000] flex items-center gap-1.5 rounded-lg border border-white/12 bg-[#121212] px-3 py-2 text-sm text-white shadow-lg transition-opacity hover:opacity-90"
          aria-label="Built with v0"
        >
          Built with v0
        </a>
      </body>
    </html>
  )
}
