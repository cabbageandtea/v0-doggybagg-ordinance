"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { TactileButton } from "@/components/tactile-button"

/** Sticky CTA bar for mobile — shows after scroll, hides when near footer or on desktop */
export function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const isMobile = window.innerWidth < 768
    if (!isMobile) return

    const onScroll = () => {
      const y = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setVisible(y > 400 && y < docHeight - 200)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          <div className="liquid-glass-glow mx-4 mb-4 rounded-2xl border border-primary/30 p-4 shadow-xl">
            <p className="mb-2 text-sm font-medium text-foreground">
              Ready to protect your portfolio?
            </p>
            <div className="flex gap-2">
              <Link href="/auth/sign-up" className="flex-1">
                <TactileButton
                  size="sm"
                  className="w-full glow-accent bg-primary text-primary-foreground"
                >
                  Get Started Free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </TactileButton>
              </Link>
              <Link href="#pricing" className="flex-shrink-0">
                <TactileButton variant="outline" size="sm">
                  View Plans
                </TactileButton>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
