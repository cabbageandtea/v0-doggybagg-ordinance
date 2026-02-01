import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { Shield, AlertTriangle, FileCheck } from "lucide-react"

export const metadata = {
  title: "STR Compliance in San Diego: What Investors Need to Know",
  description:
    "Short-term rental compliance in San Diego: STRO registration, common violations, fines, and how to stay ahead. A guide for property owners and investors.",
  openGraph: {
    title: "STR Compliance in San Diego | DoggyBagg",
    description:
      "Short-term rental compliance in San Diego: STRO, violations, fines. A guide for property investors.",
  },
}

export default function STRCompliancePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <article className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              STR Compliance in San Diego: What Investors Need to Know
            </h1>
            <p className="mb-8 text-muted-foreground">
              San Diego&apos;s Short-Term Residential Occupancy (STRO) program is strict. Here&apos;s what you need to stay compliant.
            </p>

            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <FileCheck className="h-5 w-5 text-primary" />
                STRO Registration
              </h2>
              <p className="mb-4 text-muted-foreground">
                All short-term rentals in the City of San Diego must be registered under the STRO program. That means a valid license, correct tier assignment, and timely reporting.
              </p>
              <p className="text-muted-foreground">
                Fail to register or report correctly, and you face fines that escalate daily—often $500+ per day for STR violations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Common Violations
              </h2>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Operating without a valid STRO license</li>
                <li>Exceeding occupancy limits</li>
                <li>Missing or incorrect TOT (Transient Occupancy Tax) reporting</li>
                <li>Unpermitted ADUs or accessory structures</li>
                <li>Noise, trash, or parking violations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Shield className="h-5 w-5 text-primary" />
                Stay Ahead
              </h2>
              <p className="mb-6 text-muted-foreground">
                DoggyBagg monitors San Diego municipal records 24/7. Get alerts the moment a violation is filed—before penalties double.
              </p>
              <Link
                href="/#features"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
              >
                See how it works
                <span>→</span>
              </Link>
            </section>

            <Link href="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </article>
        </main>
        <Footer />
      </div>
    </div>
  )
}
