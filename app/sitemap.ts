import { MetadataRoute } from "next"
import { getAllLeadsForSitemap, slugify, isTpaLead, isAduLead } from "@/lib/leads"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doggybagg.cc"

/**
 * Tactile/landing pages + dynamic property pages from leads_crm.csv.
 * TPA and ADU leads get priority 0.8 for SEO.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ url: string; lastModified: Date; changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly"; priority: number }> = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/auth/sign-in`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/auth/sign-up`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/checkout/starter-plan`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/checkout/professional-plan`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/status`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${baseUrl}/learn/str-compliance-san-diego`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/learn/data-sources`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${baseUrl}/refer`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/property`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
  ]

  try {
    const leads = getAllLeadsForSitemap()
    for (const { address, lead } of leads) {
      const slug = slugify(address)
      if (!slug) continue
      const priority = isTpaLead(lead) || isAduLead(lead) ? 0.8 : 0.6
      routes.push({
        url: `${baseUrl}/property/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority,
      })
    }
  } catch {
    // leads_crm.csv may not exist (e.g. fresh deploy); skip property URLs
  }

  return routes.map(({ url, lastModified, changeFrequency, priority }) => ({
    url,
    lastModified,
    changeFrequency,
    priority,
  }))
}
