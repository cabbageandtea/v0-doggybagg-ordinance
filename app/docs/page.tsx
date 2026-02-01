import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"

export const metadata = {
  title: "API & Documentation",
  description: "DoggyBagg API and documentation.",
}

export default function DocsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-foreground">API & Documentation</h1>
            <p className="mb-6 text-muted-foreground">
              API access for programmatic portfolio monitoring. Integrate DoggyBagg into your workflow.
            </p>
            <a
              href="mailto:maliklomax@doggybagg.cc?subject=API%20Access%20Request"
              className="inline-flex items-center text-primary hover:underline"
            >
              Request API access →
            </a>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
