import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { getLeadBySlug, isTpaLead, isAduLead } from "@/lib/leads"
import type { LeadRow } from "@/lib/leads"
import { PropertyIntelligence } from "./property-intelligence"
import { PropertyAieoScript } from "./property-aieo-script"

type Props = { params: Promise<{ address: string }> }

export async function generateMetadata({ params }: Props) {
  const { address: slug } = await params
  const lead = getLeadBySlug(slug)
  if (!lead) return { title: "Property Not Found" }
  const addr = lead.Address || "San Diego Property"
  return {
    title: `${addr} | 2026 Ordinance Intelligence | DoggyBagg`,
    description: `2026 LDC updates, transfer tax, and ADU condo-sale eligibility for ${addr}. San Diego ordinance intelligence from DoggyBagg.`,
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
          <PropertyContent lead={lead} />
        </main>
        <Footer />
      </div>
    </div>
  )
}

function PropertyContent({ lead }: { lead: LeadRow }) {
  const tpa = isTpaLead(lead)
  const adu = isAduLead(lead)
  const addr = lead.Address || "Unknown"

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to DoggyBagg
        </Link>
      </div>

      <div className="liquid-glass-glow rounded-2xl border border-primary/10 p-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
          {addr}
        </h1>
        <p className="text-muted-foreground">
          {lead.Name && lead.Name !== "Unknown" ? `${lead.Name} • ` : ""}
          {lead.Zone && `Zone: ${lead.Zone}`}
          {lead.Lead_Type && ` • ${lead.Lead_Type}`}
        </p>

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
