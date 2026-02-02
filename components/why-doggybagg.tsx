"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { MapPin, Clock, Brain, Shield } from "lucide-react"
import Link from "next/link"
import { TactileButton } from "@/components/tactile-button"

const differentiators = [
  {
    icon: MapPin,
    title: "Built for San Diego",
    description: "Every ordinance, every zone, every enforcement pattern. We know this city.",
    stat: "100%",
  },
  {
    icon: Clock,
    title: "Same-Day Intelligence",
    description: "Municipal filings reach our system within hours. Timely updates for informed decisions.",
    stat: "<24h",
  },
  {
    icon: Brain,
    title: "AI That Learns",
    description: "Models track enforcement trends by neighborhood. Data-driven foresight for your portfolio.",
    stat: "Predictive",
  },
  {
    icon: Shield,
    title: "Resolution Support",
    description: "Appeal templates, DIY guides, and expert support. Prepared when you need to respond.",
    stat: "Ready",
  },
]

export function WhyDoggyBagg() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Why <span className="text-glow text-primary">DoggyBagg</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Precision ordinance oversight built for San Diego investors.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                className="liquid-glass rounded-2xl border border-border/50 p-6"
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-primary">
                  {item.stat}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p className="mb-3 text-sm text-muted-foreground">No credit card required</p>
          <Link href="/auth/sign-up">
            <TactileButton
              size="lg"
              className="glow-accent bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Join San Diego investors
            </TactileButton>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
