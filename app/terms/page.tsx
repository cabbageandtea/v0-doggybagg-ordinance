import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"

export const metadata = {
  title: "Terms of Service",
  description: "DoggyBagg LLC terms of service.",
}

export default function TermsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-foreground">Terms of Service</h1>
            <p className="mb-6 text-muted-foreground">
              By using DoggyBagg, you agree to these terms. DoggyBagg LLC operates doggybagg.cc and
              provides property compliance monitoring services for San Diego County.
            </p>
            <p className="mb-6 text-muted-foreground">
              Our service is for informational purposes. Not legal or tax advice. Verify all findings
              with the San Diego City Treasurer.
            </p>
            <p className="mb-6 text-muted-foreground">
              For full terms, contact{" "}
              <a
                href="mailto:hello@doggybagg.cc?subject=Terms%20of%20Service"
                className="text-primary hover:underline"
              >
                hello@doggybagg.cc
              </a>
              .
            </p>
            <Link href="/privacy" className="inline-flex items-center text-primary hover:underline">
              Privacy Policy →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
