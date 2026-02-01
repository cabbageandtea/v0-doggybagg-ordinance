"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { TactileButton } from "@/components/tactile-button"
import { 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  ChevronRight 
} from "lucide-react"
import Link from "next/link"

interface NeighborhoodData {
  zipCode: string
  neighborhood: string
  violationCount: number
  riskLevel: 'low' | 'medium' | 'high'
  topViolationType: string
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

// Mock data - in production this would come from server action
const mockNeighborhoodData: NeighborhoodData[] = [
  {
    zipCode: '92109',
    neighborhood: 'Pacific Beach',
    violationCount: 127,
    riskLevel: 'high',
    topViolationType: 'STR Noise Complaints',
    trend: 'up',
    lastUpdated: '2 hours ago'
  },
  {
    zipCode: '92037',
    neighborhood: 'La Jolla',
    violationCount: 89,
    riskLevel: 'high',
    topViolationType: 'Parking Violations',
    trend: 'stable',
    lastUpdated: '4 hours ago'
  },
  {
    zipCode: '92101',
    neighborhood: 'Downtown',
    violationCount: 156,
    riskLevel: 'high',
    topViolationType: 'TOT Non-Compliance',
    trend: 'up',
    lastUpdated: '1 hour ago'
  },
  {
    zipCode: '92104',
    neighborhood: 'North Park',
    violationCount: 64,
    riskLevel: 'medium',
    topViolationType: 'Trash/Recycling',
    trend: 'down',
    lastUpdated: '3 hours ago'
  },
  {
    zipCode: '92118',
    neighborhood: 'Coronado',
    violationCount: 23,
    riskLevel: 'low',
    topViolationType: 'Property Maintenance',
    trend: 'stable',
    lastUpdated: '6 hours ago'
  },
  {
    zipCode: '92106',
    neighborhood: 'Ocean Beach',
    violationCount: 45,
    riskLevel: 'medium',
    topViolationType: 'STR Registration',
    trend: 'stable',
    lastUpdated: '5 hours ago'
  }
]

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 }

export function NeighborhoodWatchWidget() {
  const [data, setData] = useState<NeighborhoodData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  useEffect(() => {
    // Simulate loading from API
    setTimeout(() => {
      setData(mockNeighborhoodData)
      setIsLoading(false)
    }, 500)
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-secondary'
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-red-400" />
    if (trend === 'down') return <TrendingUp className="h-3 w-3 text-green-400 rotate-180" />
    return <span className="text-muted-foreground">→</span>
  }

  return (
    <section id="neighborhood-watch" ref={sectionRef} className="py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8 sm:mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={springTransition}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Live Enforcement Data</span>
          </div>
          <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-balance">
            Neighborhood <span className="text-glow text-primary">Watch</span> Dashboard
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground text-pretty">
            Real-time enforcement heat maps for San Diego neighborhoods. See where the city
            is actively monitoring before violations hit your property.
          </p>
        </motion.div>

        {/* Heat Map Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading enforcement data...</p>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ ...springTransition, delay: 0.1 }}
            >
              {data.map((neighborhood, idx) => (
                <motion.div
                  key={neighborhood.zipCode}
                  className="liquid-glass rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ ...springTransition, delay: 0.15 + idx * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                          {neighborhood.neighborhood}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {neighborhood.zipCode}
                        </p>
                      </div>
                    </div>
                    <Badge className={getRiskColor(neighborhood.riskLevel)}>
                      {neighborhood.riskLevel.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Violations</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-2xl font-bold text-foreground">
                          {neighborhood.violationCount}
                        </span>
                        {getTrendIcon(neighborhood.trend)}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">
                        Top Violation Type
                      </span>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-foreground font-medium truncate">
                          {neighborhood.topViolationType}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        Updated {neighborhood.lastUpdated}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className="liquid-glass-glow rounded-2xl p-6 sm:p-8 text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ ...springTransition, delay: 0.4 }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                Is Your Neighborhood at Risk?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get instant alerts when enforcement activity increases in your area. 
                Protect your property before violations escalate.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/sign-up?tier=community-free">
                  <TactileButton
                    size="lg"
                    className="w-full sm:w-auto glow-accent bg-green-500 text-white hover:bg-green-600"
                  >
                    Start Free Monitoring
                  </TactileButton>
                </Link>
                <Link href="#pricing">
                  <TactileButton
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto gap-2 bg-transparent"
                  >
                    View All Plans
                    <ChevronRight className="h-4 w-4" />
                  </TactileButton>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
