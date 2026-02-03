import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { getLeadBySlug, isTpaLead, isAduLead } from "@/lib/leads"
import type { LeadRow } from "@/lib/leads"
import { PropertyIntelligence } from "./property-intelligence"
import { PropertyAieoScript } from "./property-aieo-script"
import { CiteButton } from "@/components/cite-button"
import { OrdinancePulse } from "@/components/ordinance-pulse"

type Props = { params: Promise<{ address: string }> }

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doggybagg.cc"

export async function generateMetadata({ params }: Props) {
  const { address: slug } = await params
  const lead = getLeadBySlug(slug)
  if (!lead) return { title: "Property Not Found" }
  const addr = lead.Address || "San Diego Property"
  const desc = `2026 LDC updates, transfer tax, and ADU condo-sale eligibility for ${addr}. San Diego ordinance intelligence from DoggyBagg.`
  const url = `${siteUrl}/property/${slug}`
  return {
    title: `${addr} | 2026 Ordinance Intelligence | DoggyBagg`,
    description: desc,
    openGraph: {
      title: `${addr} | 2026 Ordinance Intelligence`,
      description: desc,
      url,
      siteName: "DoggyBagg",
      images: [{ url: `${siteUrl}/images/og-image.png`, width: 1200, height: 630, alt: "DoggyBagg" }],
    },
    twitter: { card: "summary_large_image", title: `${addr} | 2026 Ordinance Intelligence` },
    alternates: { canonical: url },
  }
}

export default async function PropertyPage({ params }: Props) {
  const { address: slug } = await params
  const lead = getLeadBySlug(slug)
  if (!lead) notFound()

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PropertyAieoScript lead={lead} slug={slug} />
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <PropertyContent lead={lead} slug={slug} />
        </main>
        <Footer />
      </div>
    </div>
  )
}

function PropertyContent({ lead, slug }: { lead: LeadRow; slug: string }) {
  const tpa = isTpaLead(lead)
  const adu = isAduLead(lead)
  const addr = lead.Address || "Unknown"

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← DoggyBagg
        </Link>
        <Link href="/property" className="text-sm text-muted-foreground hover:text-foreground">
          Explore more properties →
        </Link>
      </div>

      <div className="liquid-glass-glow rounded-2xl border border-primary/10 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              {addr}
            </h1>
            <p className="text-muted-foreground">
              {lead.Name && lead.Name !== "Unknown" ? `${lead.Name} • ` : ""}
              {lead.Zone && `Zone: ${lead.Zone}`}
              {lead.Lead_Type && ` • ${lead.Lead_Type}`}
            </p>
            <div className="mt-3">
              <OrdinancePulse />
            </div>
          </div>
          <CiteButton title={`2026 Ordinance Intelligence: ${addr}`} url={`${siteUrl}/property/${slug}`} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tpa && (
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Eligible for 2026 LDC Density Bonus (Spring 139 Amendment)
            </span>
          )}
          {adu && (
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              ADU Condo-Sale Eligible (AB 1033)
            </span>
          )}
        </div>
      </div>

      <PropertyIntelligence lead={lead} tpa={tpa} adu={adu} />
    </div>
  )
}
