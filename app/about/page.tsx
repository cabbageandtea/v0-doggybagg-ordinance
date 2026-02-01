import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"

export const metadata = {
  title: "About",
  description: "About DoggyBagg — the compliance shield for San Diego investors.",
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-foreground">About DoggyBagg</h1>
            <p className="mb-6 text-muted-foreground">
              DoggyBagg is the compliance shield for San Diego property investors. We&apos;re built by
              investors who got burned by municipal violations—and built it right.
            </p>
            <p className="mb-6 text-muted-foreground">
              We monitor San Diego County municipal records 24/7. Real-time alerts, AI risk scoring,
              appeal support. So you stay ahead, not behind.
            </p>
            <Link
              href="/#features"
              className="inline-flex items-center text-primary hover:underline"
            >
              See how it works →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
