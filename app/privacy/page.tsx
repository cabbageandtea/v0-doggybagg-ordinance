import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"

export const metadata = {
  title: "Privacy Policy",
  description:
    "DoggyBagg LLC privacy policy. How we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="mb-4 text-muted-foreground">
            DoggyBagg LLC (&quot;we&quot;) operates doggybagg.cc. This page
            explains how we collect, use, and protect your information.
          </p>
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">Cookies</h2>
              <p>
                We use cookies and similar technologies for analytics (e.g., PostHog), session
                management, and to improve your experience. By accepting our cookie banner, you
                consent to our use of analytics cookies.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">Data We Collect</h2>
              <p>
                We collect account information (email, name), property data you add, and usage
                analytics to improve our service.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">Contact</h2>
              <p>
                For privacy requests or questions, email{" "}
                <a
                  href="mailto:hello@doggybagg.cc?subject=Privacy%20Inquiry"
                  className="text-primary hover:underline"
                >
                  hello@doggybagg.cc
                </a>
                .
              </p>
            </section>
          </div>
            <Link
              href="/"
              className="mt-8 inline-block text-primary hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
