"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, Star, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { trackPortfolioAuditLead } from "@/lib/analytics"

const auditHref = process.env.NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK || "mailto:support@doggybagg.cc?subject=Portfolio%20Audit%20Inquiry"

function PortfolioAuditCTA() {
  const [propertyCount, setPropertyCount] = useState("")
  const [email, setEmail] = useState("")

  const handleAuditClick = () => {
    if (propertyCount || email) {
      trackPortfolioAuditLead({ propertyCount: propertyCount || undefined, email: email || undefined })
    }
  }

  return (
    <div className="mb-16 mx-auto max-w-3xl">
      <div className="liquid-glass-glow rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">One-Time Analysis</span>
            </span>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            Portfolio Audit
          </h3>
          <p className="mb-6 text-muted-foreground max-w-xl mx-auto">
            Comprehensive portfolio analysis. Ordinance standing, health scores, and clear next steps. One report, no surprises.
          </p>
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="text-5xl font-bold text-foreground">$499</span>
            <span className="text-muted-foreground">one-time</span>
          </div>
          <div className="mb-6 mx-auto flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
            <div className="flex-1 space-y-1.5 text-left sm:text-center">
              <Label htmlFor="audit-properties" className="text-xs text-muted-foreground">Properties (optional)</Label>
              <Select value={propertyCount} onValueChange={setPropertyCount}>
                <SelectTrigger id="audit-properties" className="h-10 border-border bg-secondary/30">
                  <SelectValue placeholder="How many?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1–5</SelectItem>
                  <SelectItem value="6-10">6–10</SelectItem>
                  <SelectItem value="11+">11+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1.5 text-left sm:text-center">
              <Label htmlFor="audit-email" className="text-xs text-muted-foreground">Email (optional)</Label>
              <Input
                id="audit-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-border bg-secondary/30"
              />
            </div>
          </div>
          <Link href={auditHref} target="_blank" rel="noopener noreferrer" onClick={handleAuditClick}>
            <Button
              size="lg"
              className="group glow-accent-intense bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Request Portfolio Audit
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const plans = [
  {
    name: "Community Alert",
    description: "Your home. Always free.",
    price: 0,
    period: "",
    features: [
      "1 property monitored",
      "Weekly ordinance checks",
      "SMS updates only",
      "Community support",
      "24-hour history",
    ],
    cta: "Begin Free",
    highlighted: false,
    isFree: true,
  },
  {
    name: "Starter",
    description: "Perfect for single property owners",
    price: 29,
    period: "/month",
    features: [
      "1 property monitored",
      "Daily ordinance checks",
      "Email updates",
      "Basic analytics",
      "7-day history",
    ],
    cta: "Begin Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For portfolio owners who mean business",
    price: 99,
    period: "/month",
    features: [
      "Up to 10 properties",
      "Real-time monitoring",
      "SMS + Email updates",
      "Advanced analytics",
      "90-day history",
      "Priority support",
      "API access",
    ],
    cta: "Begin",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "Custom for large portfolios",
    price: null,
    period: "",
    features: [
      "Unlimited properties",
      "24/7 monitoring",
      "Custom integrations",
      "Dedicated account manager",
      "Full history access",
      "Custom reporting",
      "White-label options",
    ],
    cta: "Request Consultation",
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Select Your <span className="text-glow text-primary">Plan</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty mb-2">
            Oversight for your San Diego portfolio. No lock-in. Cancel anytime.
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            Professional oversight starts at $29/mo.
          </p>
        </div>

        {/* Portfolio Audit CTA */}
        <PortfolioAuditCTA />

        {/* Community CTA Banner */}
        <div className="mb-12 mx-auto max-w-4xl">
          <div className="liquid-glass rounded-2xl p-6 text-center border-2 border-primary/30">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5">
              <span className="text-sm font-medium text-green-400">100% Free Forever</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">
              Your Home. Timely Municipal Updates—Free Forever.
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Single-property owners. Monitor your address and receive timely municipal updates—no credit card required.
            </p>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                plan.highlighted ? "liquid-glass-glow" : "liquid-glass"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground glow-accent">
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline">
                {plan.isFree ? (
                  <span className="text-4xl font-bold text-green-400">FREE</span>
                ) : plan.price !== null ? (
                  <>
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="ml-1 text-muted-foreground">{plan.period}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-foreground">Custom</span>
                )}
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className={`h-4 w-4 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.name === "Community Alert" ? (
                <Link href="/auth/sign-up?tier=community-free">
                  <Button
                    className="w-full bg-green-500 text-white hover:bg-green-600"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              ) : plan.name === "Starter" ? (
                <Link href="/checkout/starter-plan">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "glow-accent bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              ) : plan.name === "Professional" ? (
                <Link href="/checkout/professional-plan">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "glow-accent bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              ) : (
                <Link href="mailto:support@doggybagg.cc">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "glow-accent bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
