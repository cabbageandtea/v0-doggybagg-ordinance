import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"

export const metadata = {
  title: "Careers",
  description: "Join DoggyBagg — careers at the compliance shield for San Diego investors.",
}

export default function CareersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-foreground">Careers</h1>
            <p className="mb-6 text-muted-foreground">
              We&apos;re a small team building the compliance shield for San Diego. Interested in joining?
            </p>
            <a
              href="mailto:maliklomax@doggybagg.cc?subject=Career%20Inquiry"
              className="inline-flex items-center text-primary hover:underline"
            >
              Get in touch →
            </a>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
