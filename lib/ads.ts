/**
 * Ads conversion tracking – Google Ads (gtag) and Meta Pixel (fbq).
 * Call from analytics/events when key actions occur. Scripts load via AdsScripts.
 * Set NEXT_PUBLIC_GOOGLE_ADS_*_CONVERSION (e.g. AW-123456789/AbCdEf) in Vercel.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

const signUpConversion = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_CONVERSION
const purchaseConversion = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION
const leadConversion = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION

export function trackAdsSignUp() {
  if (typeof window === "undefined") return
  if (window.gtag && signUpConversion) {
    window.gtag("event", "conversion", { send_to: signUpConversion })
  }
  if (window.fbq) {
    window.fbq("track", "CompleteRegistration")
  }
}

export function trackAdsPurchase(value?: number, currency = "USD") {
  if (typeof window === "undefined") return
  if (window.gtag && purchaseConversion) {
    window.gtag("event", "conversion", {
      send_to: purchaseConversion,
      value,
      currency,
    })
  }
  if (window.fbq) {
    window.fbq("track", "Purchase", { value, currency })
  }
}

export function trackAdsLead() {
  if (typeof window === "undefined") return
  if (window.gtag && leadConversion) {
    window.gtag("event", "conversion", { send_to: leadConversion })
  }
  if (window.fbq) {
    window.fbq("track", "Lead")
  }
}
