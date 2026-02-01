"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { TactileButton } from "@/components/tactile-button"
import { trackConsentGiven } from "@/lib/analytics"

const STORAGE_KEY = "cookie-consent"

export function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) setVisible(true)
  }, [mounted])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted")
    trackConsentGiven()
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-6 md:right-auto md:max-w-md"
        role="dialog"
        aria-label="Cookie consent"
        aria-live="polite"
      >
        <div className="liquid-glass rounded-2xl border border-border/80 p-4 shadow-xl backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience and analytics. By continuing, you agree to our{" "}
            <Link
              href="/privacy"
              className="text-primary underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex items-center gap-3">
            <TactileButton size="sm" onClick={handleAccept}>
              Accept
            </TactileButton>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground"
            >
              Learn more
            </Link>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  )
}
