"use client"

import { Header } from "@/components/header"
import { TrustBar } from "@/components/trust-bar"
import { BentoGrid } from "@/components/bento-grid"
import { WhyDoggyBagg } from "@/components/why-doggybagg"
import { StickyCTA } from "@/components/sticky-cta"
import { FineCalculator } from "@/components/fine-calculator"
import { PropertySearch } from "@/components/property-search"
import { NeighborhoodWatchWidget } from "@/components/neighborhood-watch-widget"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { FeedbackTrigger } from "@/components/feedback-trigger"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <TrustBar />
        <main className="pt-1">
          <BentoGrid />
          <WhyDoggyBagg />
          <section id="calculator" className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid gap-8 lg:grid-cols-2">
                <FineCalculator />
                <PropertySearch />
              </div>
            </div>
          </section>
          <NeighborhoodWatchWidget />
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
        </main>
        <Footer />
        <StickyCTA />
        <FeedbackTrigger variant="floating" source="landing" />
      </div>
    </div>
  )
}
