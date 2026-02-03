import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { PropertyExploreClient } from "./property-explore-client"
import { getLeadsByZone, slugify } from "@/lib/leads"

type ZoneEntry = [string, { count: number; sample: { Address: string }; slug: string }]

export const metadata = {
  title: "Property Intelligence Explorer",
  description: "Explore 2026 ordinance intelligence for San Diego properties. Transfer tax, ADU condo-sale eligibility, TPA density bonus.",
}

export default function PropertyExplorePage() {
  const zones = getLeadsByZone()
  const zoneEntries = Array.from(zones.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 12)
    .map(([zone, data]): ZoneEntry => [zone, { ...data, slug: slugify(data.sample.Address || "") }])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              San Diego Property Intelligence
            </h1>
            <p className="mt-4 text-muted-foreground">
              ʻ26 LDC updates, transfer tax impact, ADU condo-sale eligibility.
              Search by address or explore by neighborhood.
            </p>
          </div>

          <PropertyExploreClient zoneEntries={zoneEntries} />

          <div className="mt-16 text-center">
            <Link
              href="/#calculator"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Run a full compliance check →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
