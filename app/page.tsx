"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BentoGrid } from "@/components/bento-grid"
import { FineCalculator } from "@/components/fine-calculator"
import { PropertySearch } from "@/components/property-search"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <BentoGrid />
          <section id="calculator" className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid gap-8 lg:grid-cols-2">
                <FineCalculator />
                <PropertySearch />
              </div>
            </div>
          </section>
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
