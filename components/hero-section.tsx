"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Eye } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-sm text-primary">AI-Powered Fine Detection</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
            <span className="text-glow text-primary">Protect</span> Your San Diego
            <br />
            Property Portfolio
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl text-pretty">
            Real-time municipal code violation monitoring. Detect fines before they 
            escalate and stay compliant with San Diego City ordinances.
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="https://buy.stripe.com/test_28E6oAd3ka4ecIQbNX7Re00" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="group glow-accent-intense bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Get My $499 Portfolio Audit
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="mailto:maliklomax@doggybagg.cc?subject=Portfolio%20Strategy%20Call%20Request">
              <Button
                variant="outline"
                size="lg"
                className="border-border px-8 py-6 text-lg text-foreground hover:bg-secondary bg-transparent"
              >
                Book a Portfolio Strategy Call
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="liquid-glass rounded-2xl p-6">
              <div className="mb-2 flex items-center justify-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                <span className="text-3xl font-bold text-foreground">$2.4M+</span>
              </div>
              <p className="text-sm text-muted-foreground">Fines Detected</p>
            </div>
            <div className="liquid-glass rounded-2xl p-6">
              <div className="mb-2 flex items-center justify-center gap-2 text-primary">
                <Eye className="h-5 w-5" />
                <span className="text-3xl font-bold text-foreground">12,000+</span>
              </div>
              <p className="text-sm text-muted-foreground">Properties Monitored</p>
            </div>
            <div className="liquid-glass rounded-2xl p-6">
              <div className="mb-2 flex items-center justify-center gap-2 text-primary">
                <Zap className="h-5 w-5" />
                <span className="text-3xl font-bold text-foreground">24/7</span>
              </div>
              <p className="text-sm text-muted-foreground">Real-time Alerts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
