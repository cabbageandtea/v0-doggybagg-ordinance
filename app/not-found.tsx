"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Home, Search, AlertTriangle } from "lucide-react"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { TactileButton } from "@/components/tactile-button"

const spring = { type: "spring" as const, stiffness: 100, damping: 20 }

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <motion.div
          className="liquid-glass-glow mx-auto max-w-md rounded-2xl border-2 border-primary/20 p-8 text-center"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={spring}
        >
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Image
              src="/images/og-image.png"
              alt="DoggyBagg"
              width={120}
              height={60}
              className="h-12 w-auto object-contain opacity-90"
            />
          </motion.div>
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <div className="rounded-full bg-destructive/20 p-6">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </motion.div>

          <motion.h1
            className="mb-2 text-7xl font-bold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            404
          </motion.h1>
          <motion.h2
            className="mb-4 text-xl font-semibold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Page Not Found
          </motion.h2>

          <motion.p
            className="mx-auto mb-8 max-w-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The page you're looking for doesn't exist or has been moved. Let's get you back on
            track.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link href="/">
              <TactileButton
                size="lg"
                className="gap-2 glow-accent bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </TactileButton>
            </Link>
            <Link href="/dashboard">
              <TactileButton
                variant="outline"
                size="lg"
                className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent"
              >
                <Search className="h-4 w-4" />
                Go to Dashboard
              </TactileButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
