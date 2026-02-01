"use client"

import { useRef, memo } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
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
import { BentoTiltCard } from "@/components/bento-tilt-card"
import { TactileButton } from "@/components/tactile-button"

const features = [
  {
    title: "Real-Time Violation Alerts",
    description: "Get instant notifications when a code violation is filed against any property in your portfolio.",
    icon: Bell,
    gridClass: "md:col-span-2 md:row-span-1",
    highlight: true,
  },
  {
    title: "Historical Data Analysis",
    description: "Full violation history. Spot patterns before they become problems.",
    icon: FileSearch,
    gridClass: "md:col-span-1 md:row-span-1",
    highlight: false,
  },
  {
    title: "Portfolio Analytics",
    description: "One-screen view of risk scores and compliance status across every property.",
    icon: BarChart3,
    gridClass: "md:col-span-1 md:row-span-2",
    highlight: false,
  },
  {
    title: "Early Detection",
    description: "Catch violations within 24 hours of filing—before penalties escalate.",
    icon: Clock,
    gridClass: "md:col-span-1 md:row-span-1",
    highlight: false,
  },
  {
    title: "San Diego Coverage",
    description: "Every zone. Every district. Full county coverage.",
    icon: MapPin,
    gridClass: "md:col-span-1 md:row-span-1",
    highlight: false,
  },
  {
    title: "Trend Forecasting",
    description: "Predict enforcement by neighborhood. See risk before it lands.",
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
            <div className="flex items-center gap-1 text-red-400">
              <AlertTriangle className="h-3 w-3" />
              <span>12 Active Alerts</span>
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

/** Parallax stats: each stat moves at a slightly different scroll rate */
function ParallaxStats() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y1 = useTransform(scrollYProgress, [0, 0.3], [0, 8])
  const y2 = useTransform(scrollYProgress, [0, 0.35], [0, -4])
  const y3 = useTransform(scrollYProgress, [0, 0.4], [0, 6])

  return (
    <div ref={ref} className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      <motion.div style={{ y: y1 }} className="group flex flex-col items-center justify-center rounded-xl border border-border/50 bg-background/30 p-4">
        <div className="mb-1 flex items-center gap-2 text-primary">
          <Shield className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-2xl font-bold text-foreground">$2.4M+</span>
        </div>
        <p className="text-xs text-muted-foreground">Fines Detected</p>
      </motion.div>
      <motion.div style={{ y: y2 }} className="group flex flex-col items-center justify-center rounded-xl border border-border/50 bg-background/30 p-4">
        <div className="mb-1 flex items-center gap-2 text-primary">
          <Eye className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-2xl font-bold text-foreground">12,000+</span>
        </div>
        <p className="text-xs text-muted-foreground">Properties Monitored</p>
      </motion.div>
      <motion.div style={{ y: y3 }} className="group flex flex-col items-center justify-center rounded-xl border border-border/50 bg-background/30 p-4">
        <div className="mb-1 flex items-center gap-2 text-primary">
          <Zap className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-2xl font-bold text-foreground">24/7</span>
        </div>
        <p className="text-xs text-muted-foreground">Real-time Alerts</p>
      </motion.div>
    </div>
  )
}

/** Kinetic headline: subtle scroll reaction, slower and gentler */
function KineticHeadline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.008])
  const y = useTransform(scrollYProgress, [0, 0.4], [0, -0.5])

  return (
    <motion.div ref={ref} style={{ scale, y }} className="mb-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
        San Diego&apos;s
        <br />
        <span className="text-glow text-primary">Compliance</span> Command Center
      </h1>
    </motion.div>
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
          >
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <Image
                src="/images/og-image.png"
                alt="DoggyBagg"
                width={180}
                height={90}
                className="h-20 w-auto object-contain md:h-24"
              />
            </motion.div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-sm font-medium text-primary">Stop fines before they stop you</span>
            </div>
            <KineticHeadline />
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl text-pretty">
              Real-time alerts. AI risk scores. Appeal support. The compliance shield for San Diego investors—so you stay ahead.
            </p>
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={
                  process.env.NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK ||
                  "mailto:support@doggybagg.cc?subject=Portfolio%20Audit%20Inquiry"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <TactileButton
                  size="lg"
                  className="group glow-accent-intense bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Get My $499 Portfolio Audit
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </TactileButton>
              </Link>
              <Link href="mailto:support@doggybagg.cc">
                <TactileButton
                  variant="outline"
                  size="lg"
                  className="border-border px-8 py-6 text-lg text-foreground hover:bg-secondary bg-transparent"
                >
                  Book a Portfolio Strategy Call
                </TactileButton>
              </Link>
            </div>
            {/* Stats - subtle parallax (each moves at different rate) */}
            <ParallaxStats />
          </BentoTiltCard>
        </div>

        {/* Section label */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Enterprise-Grade <span className="text-glow text-primary">Monitoring</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            AI-powered detection and portfolio tools. Stay ahead of the city.
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
