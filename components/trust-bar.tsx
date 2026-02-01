"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Users } from "lucide-react"

const stats = [
  { icon: Shield, value: "$2.4M+", label: "Fines prevented" },
  { icon: Zap, value: "24/7", label: "AI monitoring" },
  { icon: Users, value: "12,000+", label: "Properties protected" },
]

export function TrustBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="border-b border-border/50 bg-background/30 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          {stats.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{item.value}</span>
                <span>{item.label}</span>
                {i < stats.length - 1 && (
                  <span className="hidden text-border sm:inline">|</span>
                )}
              </div>
            )
          })}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-border">|</span>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
              ✓ 47 joined this week
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
