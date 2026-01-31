"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MousePointer2, Sparkles } from "lucide-react"

type GhostCursorProps = {
  targetElement?: string // CSS selector
  message?: string
  onComplete?: () => void
  isActive: boolean
}

export function GhostCursor({ targetElement, message, onComplete, isActive }: GhostCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showPulse, setShowPulse] = useState(true)

  useEffect(() => {
    if (!isActive || !targetElement) return

    const element = document.querySelector(targetElement)
    if (!element) return

    const rect = element.getBoundingClientRect()
    const targetX = rect.left + rect.width / 2
    const targetY = rect.top + rect.height / 2

    setPosition({ x: targetX, y: targetY })

    // Scroll element into view smoothly
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Add highlight class
    element.classList.add('onboarding-highlight')

    // Pulse animation
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev)
    }, 1000)

    return () => {
      clearInterval(pulseInterval)
      element.classList.remove('onboarding-highlight')
    }
  }, [targetElement, isActive])

  if (!isActive) return null

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Ghost Cursor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* Cursor Icon */}
              <MousePointer2 
                className="h-8 w-8 text-primary drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 0 8px rgba(var(--primary), 0.5))' }}
              />
              
              {/* Sparkle Effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>

              {/* Pulse Ring */}
              {showPulse && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 rounded-full border-2 border-primary"
                />
              )}
            </div>

            {/* Message Tooltip */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-10 top-0 liquid-glass rounded-lg px-4 py-2 shadow-lg border border-primary/30 whitespace-nowrap"
              >
                <p className="text-sm font-medium text-foreground">{message}</p>
                <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2">
                  <div className="h-0 w-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-primary/30" />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm pointer-events-none"
            style={{ zIndex: 9998 }}
          />
        </>
      )}
    </AnimatePresence>
  )
}

// Add global CSS for highlighting
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    .onboarding-highlight {
      position: relative;
      z-index: 9999 !important;
      animation: highlight-pulse 2s ease-in-out infinite;
      box-shadow: 0 0 0 4px rgba(var(--primary-rgb, 59, 130, 246), 0.5),
                  0 0 32px 8px rgba(var(--primary-rgb, 59, 130, 246), 0.3);
      border-radius: 8px;
    }
    
    @keyframes highlight-pulse {
      0%, 100% {
        box-shadow: 0 0 0 4px rgba(var(--primary-rgb, 59, 130, 246), 0.5),
                    0 0 32px 8px rgba(var(--primary-rgb, 59, 130, 246), 0.3);
      }
      50% {
        box-shadow: 0 0 0 6px rgba(var(--primary-rgb, 59, 130, 246), 0.7),
                    0 0 48px 12px rgba(var(--primary-rgb, 59, 130, 246), 0.5);
      }
    }
  `
  document.head.appendChild(style)
}
