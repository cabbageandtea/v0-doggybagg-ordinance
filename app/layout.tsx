import React from "react"
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Inter, Space_Grotesk, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/providers/query-provider'
import { PostHogProvider } from '@/providers/posthog-provider'
import { PostHogIdentifyBridge } from '@/components/posthog-identify-bridge'
import { Toaster } from 'sonner'
import { CookieConsent } from '@/components/cookie-consent'
import { StructuredData } from '@/components/structured-data'
import { FAQStructuredData } from '@/components/structured-data'
import { AdsScripts } from '@/components/ads-scripts'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "500", "600", "700"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doggybagg.cc'

/** 160-char high-converting summary for social and SEO */
const metaDescription =
  'Stop fines before they stop you. DoggyBagg monitors San Diego municipal code violations 24/7. Detect early, protect your portfolio, stay compliant. Start free.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DoggyBagg | AI-Powered Property Compliance',
    template: '%s | DoggyBagg',
  },
  description: metaDescription,
  generator: 'DoggyBagg',
  keywords: ['San Diego', 'property fines', 'municipal code', 'real estate', 'compliance', 'AI monitoring', 'STRO', 'short-term rental'],
  authors: [{ name: 'DoggyBagg LLC', url: siteUrl }],
  creator: 'DoggyBagg LLC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'DoggyBagg',
    title: 'DoggyBagg | AI-Powered Property Compliance',
    description: metaDescription,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DoggyBagg - Take it with you | San Diego Property Compliance',
      },
      {
        url: '/images/darkdoggylogo.jpg',
        width: 1200,
        height: 630,
        alt: 'DoggyBagg - San Diego Property Compliance Monitoring',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DoggyBagg | AI-Powered Property Compliance',
    description: metaDescription,
    images: ['/images/og-image.png'],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
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
      { url: '/images/og-image.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/og-image.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/images/og-image.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const nonce = headersList.get('x-nonce')
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${syne.variable} font-sans antialiased`}>
        <StructuredData />
        <FAQStructuredData />
        <AdsScripts nonce={nonce} />
        <PostHogProvider>
          <PostHogIdentifyBridge />
          <QueryProvider>{children}</QueryProvider>
          <Analytics />
          <Toaster position="bottom-center" richColors closeButton />
          <CookieConsent />
        </PostHogProvider>
      </body>
    </html>
  )
}
