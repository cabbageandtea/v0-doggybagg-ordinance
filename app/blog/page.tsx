import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"

export const metadata = {
  title: "Blog",
  description: "DoggyBagg blog — San Diego property compliance insights.",
}

export default function BlogPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-foreground">Blog</h1>
            <p className="mb-8 text-muted-foreground">
              Compliance insights and San Diego property updates.
            </p>
            <Link
              href="/learn/str-compliance-san-diego"
              className="block rounded-xl border border-border bg-secondary/30 p-6 text-left transition-colors hover:border-primary/30 hover:bg-secondary/50"
            >
              <span className="text-lg font-semibold text-foreground">STR Compliance in San Diego</span>
              <p className="mt-2 text-sm text-muted-foreground">
                What investors need to know about STRO, violations, and fines.
              </p>
              <span className="mt-2 inline-block text-sm text-primary">Read more →</span>
            </Link>
            <Link href="/" className="mt-8 inline-block text-primary hover:underline">
              ← Back to home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
