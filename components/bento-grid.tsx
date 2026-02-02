"use client"

import { useRef, memo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Bell,
  FileSearch,
  BarChart3,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Shield,
  Eye,
  Zap,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { trackCtaClick } from "@/lib/analytics"
import { BentoTiltCard } from "@/components/bento-tilt-card"
import { TactileButton } from "@/components/tactile-button"

const features = [
  {
    title: "Precision Notifications",
    description: "Timely updates when municipal activity affects any property in your portfolio.",
    icon: Bell,
    gridClass: "md:col-span-2 md:row-span-1",
    highlight: true,
  },
  {
    title: "Historical Intelligence",
    description: "Complete audit trail. Identify trends for informed decisions.",
    icon: FileSearch,
    gridClass: "md:col-span-1 md:row-span-1",
    highlight: false,
  },
  {
    title: "Portfolio Analytics",
    description: "One-screen view of health scores and ordinance standing across every property.",
    icon: BarChart3,
    gridClass: "md:col-span-1 md:row-span-2",
    highlight: false,
  },
  {
    title: "Same-Day Intelligence",
    description: "Updates within 24 hours of municipal filing.",
    icon: Clock,
    gridClass: "md:col-span-1 md:row-span-1",
    highlight: false,
  },
  {
    title: "San Diego Coverage",
    description: "Every zone. Every district. Full county coverage. LA & Austin coming soon.",
    icon: MapPin,
    gridClass: "md:col-span-1 md:row-span-1",
    highlight: false,
  },
  {
    title: "Trend Forecasting",
    description: "Enrollment patterns by neighborhood. Data-driven foresight.",
    icon: TrendingUp,
    gridClass: "md:col-span-1 md:row-span-1",
    highlight: false,
  },
]

/** Memoized feature card to avoid re-renders when parent updates */
const FeatureCard = memo(function FeatureCard({
  feature,
}: {
  feature: (typeof features)[number]
}) {
  const Icon = feature.icon
  return (
    <BentoTiltCard
      gridClass={feature.gridClass}
      className={feature.highlight ? "liquid-glass-glow border-primary/30" : ""}
      noTilt
    >
      <div className="flex h-full flex-col">
        <div
          className={`group/icon mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
            feature.highlight
              ? "bg-primary/20 text-primary glow-accent"
              : "bg-secondary text-foreground"
          }`}
        >
          <Icon className="h-6 w-6 transition-transform duration-200 group-hover/icon:scale-110" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
        <p className="flex-grow text-sm text-muted-foreground">{feature.description}</p>
        {feature.highlight && (
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bell className="h-3 w-3" />
              <span>12 Updates Pending</span>
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="h-3 w-3" />
              <span>847 Resolved</span>
            </div>
          </div>
        )}
      </div>
    </BentoTiltCard>
  )
})

/** Static stats – no parallax; calmer, more trustworthy feel */
function StatsRow() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="group flex flex-col items-center justify-center rounded-xl border border-border/50 bg-background/30 p-4">
        <div className="mb-1 flex items-center gap-2 text-primary">
          <Shield className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-2xl font-bold text-foreground">$2.4M+</span>
        </div>
        <p className="text-xs text-muted-foreground">Portfolio Value Protected</p>
      </div>
      <div className="group flex flex-col items-center justify-center rounded-xl border border-border/50 bg-background/30 p-4">
        <div className="mb-1 flex items-center gap-2 text-primary">
          <Eye className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-2xl font-bold text-foreground">12,000+</span>
        </div>
        <p className="text-xs text-muted-foreground">Properties Monitored</p>
      </div>
      <div className="group flex flex-col items-center justify-center rounded-xl border border-border/50 bg-background/30 p-4">
        <div className="mb-1 flex items-center gap-2 text-primary">
          <Zap className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-2xl font-bold text-foreground">24/7</span>
        </div>
        <p className="text-xs text-muted-foreground">Continuous Monitoring</p>
      </div>
    </div>
  )
}

/** Static headline – no scroll motion for calmer feel */
function BentoHeadline() {
  return (
    <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
      San Diego&apos;s
      <br />
      <span className="text-glow text-primary">Portfolio</span> Intelligence Center
    </h1>
  )
}

export function BentoGrid() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Hero Row - Full width bento hero card */}
        <div className="mb-12 grid gap-4 md:grid-cols-4 md:auto-rows-[minmax(180px,auto)]">
          <BentoTiltCard
            gridClass="md:col-span-4 md:row-span-1"
            className="liquid-glass-glow min-h-[320px] flex flex-col justify-center items-center text-center py-16"
            noTilt
          >
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-background/30 ring-2 ring-primary/20 md:h-24 md:w-24">
                <Image
                  src="/images/og-image.png"
                  alt="DoggyBagg"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </motion.div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-sm font-medium text-primary">Precision oversight for San Diego portfolios</span>
            </div>
            <BentoHeadline />
            <p className="mx-auto mb-4 max-w-2xl text-lg text-muted-foreground md:text-xl text-pretty">
              Timely updates. Portfolio analytics. Resolution support. High-end oversight for San Diego investors.
            </p>
            <p className="mx-auto mb-8 text-sm text-muted-foreground/90">
              Professional oversight starts at $29/mo.
            </p>
            {/* Hero CTAs: See your risk + Portfolio Audit only. Book a Portfolio Strategy Call removed. */}
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#calculator" onClick={() => trackCtaClick({ cta: "see_your_risk", location: "hero" })}>
                <TactileButton
                  variant="outline"
                  size="lg"
                  className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6"
                >
                  Explore portfolio health
                  <ArrowRight className="ml-2 h-5 w-5" />
                </TactileButton>
              </a>
              <Link
                href={
                  process.env.NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK ||
                  "mailto:support@doggybagg.cc?subject=Portfolio%20Audit%20Inquiry"
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick({ cta: "portfolio_audit", location: "hero" })}
              >
                <TactileButton
                  size="lg"
                  className="group glow-accent-intense bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Request Portfolio Audit
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </TactileButton>
              </Link>
            </div>
            <StatsRow />
          </BentoTiltCard>
        </div>

        {/* Section label */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Enterprise-Grade <span className="text-glow text-primary">Monitoring</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Precision municipal intelligence and portfolio analytics.
          </p>
        </div>

        {/* Feature Bento Grid - 4 col desktop, 1 col mobile */}
        <div className="grid gap-4 md:grid-cols-4 md:auto-rows-[200px]">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
