"use client"

import { useRef, useCallback } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"

interface BentoTiltCardProps {
  children: React.ReactNode
  className?: string
  /** Tailwind col/row span for grid layout */
  gridClass?: string
  /** Max tilt in degrees (default 8). Set 0 or noTilt for static card. */
  maxTilt?: number
  /** Whether to show shine overlay */
  shine?: boolean
  /** Disable 3D tilt for calmer, more static feel */
  noTilt?: boolean
}

export function BentoTiltCard({
  children,
  className = "",
  gridClass = "",
  maxTilt = 8,
  shine = true,
  noTilt = false,
}: BentoTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useTransform(y, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(x, [0, 1], [-maxTilt, maxTilt])

  /** Transform-only shine position (avoids layout repaints) */
  const shineTransform = useTransform(
    [x, y],
    (v: number[]) =>
      `translate(calc(-50% + ${(v[0] - 0.5) * 100}%), calc(-50% + ${(v[1] - 0.5) * 100}%))`
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width
      const relY = (e.clientY - rect.top) / rect.height
      x.set(relX)
      y.set(relY)
    },
    [x, y]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0.5)
    y.set(0.5)
  }, [x, y])

  if (noTilt) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${gridClass} ${className}`}>
        <div className="liquid-glass h-full w-full p-6 backdrop-blur-xl">
          <div className="relative z-20">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      data-bento-tilt
      className={`relative overflow-hidden rounded-2xl ${gridClass} ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 120, damping: 28 }}
    >
      <div
        className="liquid-glass h-full w-full p-6 backdrop-blur-xl"
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        {shine && (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[400px] w-[400px]"
            style={{
              background:
                "radial-gradient(400px circle at center, oklch(0.72 0.15 55 / 0.12), transparent 70%)",
              transform: shineTransform,
            }}
            initial={false}
          />
        )}
        <div className="relative z-20">{children}</div>
      </div>
    </motion.div>
  )
}
