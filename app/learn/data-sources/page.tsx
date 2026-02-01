import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { Database, RefreshCw, Shield, FileText } from "lucide-react"

export const metadata = {
  title: "How We Get Our Data",
  description:
    "DoggyBagg data sources, update frequency, and accuracy. Transparent information about San Diego municipal records and compliance monitoring.",
}

const sources = [
  {
    name: "San Diego City Treasurer",
    description: "Municipal code violation records, STRO registry, and fine assessments.",
    updateFrequency: "Daily",
    icon: FileText,
  },
  {
    name: "San Diego Development Services",
    description: "Permit status, inspection records, and code enforcement activity.",
    updateFrequency: "Daily",
    icon: Database,
  },
  {
    name: "Public Records",
    description: "Address verification, property identifiers, and historical violation data.",
    updateFrequency: "Weekly",
    icon: Shield,
  },
]

export default function DataSourcesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-4 text-3xl font-bold text-foreground">How We Get Our Data</h1>
            <p className="mb-10 text-muted-foreground">
              Transparency builds trust. Here&apos;s where our compliance and violation data comes from, how often it updates, and what that means for you.
            </p>

            <div className="mb-10 space-y-6">
              {sources.map((s) => {
                const Icon = s.icon
                return (
                  <section
                    key={s.name}
                    className="rounded-xl border border-border bg-secondary/20 p-6"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">{s.name}</h2>
                      <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                        <RefreshCw className="h-3 w-3" />
                        {s.updateFrequency}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </section>
                )
              })}
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">Accuracy & verification</h2>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                We match properties using address and STRO license IDs. Data is sourced from public municipal records. 
                We do not warrant 100% accuracy—always verify critical findings with the San Diego City Treasurer or your legal advisor.
              </p>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Questions? Visit the Help Center
              </Link>
            </div>

            <div className="mt-10">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
