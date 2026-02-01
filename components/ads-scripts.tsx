"use client"

/**
 * Google Ads (gtag) and Meta Pixel – CSP-compatible loading.
 * Uses nonce from middleware to satisfy strict Content-Security-Policy (no unsafe-inline).
 * Conversion events are fired from lib/ads.ts.
 */
import Script from "next/script"

const gadsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

interface AdsScriptsProps {
  /** Nonce from middleware (x-nonce header) for CSP-compatible inline scripts */
  nonce?: string | null
}

export function AdsScripts({ nonce }: AdsScriptsProps = {}) {
  const scriptProps = nonce ? { nonce } : {}
  return (
    <>
      {gadsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gadsId}`}
            strategy="afterInteractive"
            {...scriptProps}
          />
          <Script id="gtag-init" strategy="afterInteractive" {...scriptProps}>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gadsId}', { send_page_view: true });
            `}
          </Script>
        </>
      )}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive" {...scriptProps}>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}
