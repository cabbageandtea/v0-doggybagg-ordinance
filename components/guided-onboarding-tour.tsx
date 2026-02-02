"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/providers/onboarding-provider"
import { updateOnboardingMilestone } from "@/app/actions/onboarding"
import { generateFirstHealthCheck, type ComplianceHealthCheck } from "@/app/actions/agentic"
import { trackHealthCheckGenerated, trackOnboardingTourCompleted } from "@/lib/analytics"
import {
  MapPin,
  Smartphone,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react"

type GuidedTourProps = {
  onComplete?: () => void
}

const TOTAL_STEPS = 4

export function GuidedOnboardingTour({ onComplete }: GuidedTourProps) {
  const { progress, isLoading, refetch } = useOnboarding()
  const [showHealthCheck, setShowHealthCheck] = useState(false)
  const [healthCheck, setHealthCheck] = useState<ComplianceHealthCheck["report"] | null>(null)

  const currentStep = !progress
    ? 1
    : !progress.has_added_property
      ? 1
      : !progress.has_verified_phone
        ? 2
        : !progress.has_viewed_risk_score
          ? 3
          : 4

  const isComplete = progress
    ? progress.has_added_property &&
      progress.has_verified_phone &&
      progress.has_viewed_risk_score &&
      (progress.has_generated_health_check || !!healthCheck)
    : false

  useEffect(() => {
    if (isComplete && !healthCheck && progress?.has_viewed_risk_score) {
      void (async () => {
        const healthResult = await generateFirstHealthCheck()
        if (healthResult.success && healthResult.report) {
          setHealthCheck(healthResult.report)
          setShowHealthCheck(true)
          trackHealthCheckGenerated()
          await updateOnboardingMilestone("has_generated_health_check")
          await refetch()
        }
      })()
    }
  }, [isComplete, healthCheck, progress?.has_viewed_risk_score, refetch])

  async function handleStepComplete(
    step: "add_property" | "verify_phone" | "view_risk"
  ) {
    if (step === "verify_phone") await updateOnboardingMilestone("has_verified_phone")
    if (step === "view_risk") await updateOnboardingMilestone("has_viewed_risk_score")
    await refetch()
  }

  function getStepDetails(step: number) {
    const steps = [
      {
        title: "Add Your First Property",
        description: "Enter the address you want to monitor for compliance violations",
        icon: MapPin,
        action: "add_property" as const,
        targetId: "add-property-button",
        color: "text-blue-400",
      },
      {
        title: "Verify Your Phone Number",
        description: "Get instant SMS alerts when violations are detected",
        icon: Smartphone,
        action: "verify_phone" as const,
        targetId: "verify-phone-button",
        color: "text-green-400",
      },
      {
        title: "View Neighborhood Watch",
        description: "See real-time enforcement heat maps for San Diego neighborhoods",
        icon: TrendingUp,
        action: "view_risk" as const,
        targetId: "neighborhood-watch",
        color: "text-purple-400",
      },
    ]

    return steps[step - 1]
  }

  const stepInfo = getStepDetails(currentStep)
  const nextAction =
    currentStep === 1
      ? "Add your first property"
      : currentStep === 2
        ? "Verify your phone for SMS alerts"
        : currentStep === 3
          ? "View Neighborhood Watch heat map"
          : "Generate your health check"

  if (isLoading) return null
  if (isComplete && !showHealthCheck) return null

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
        >
          <div className="liquid-glass-glow rounded-2xl p-6 border-2 border-primary/30 shadow-2xl">
            {/* Ghost Cursor Animation */}
            <motion.div
              className="absolute -top-8 -right-8 pointer-events-none"
              animate={{
                x: [0, 10, 0],
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary drop-shadow-glow" />
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Setup Progress
                </span>
                <span className="text-xs font-bold text-primary">
                  {currentStep} of {TOTAL_STEPS}
                </span>
              </div>
              <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 flex-shrink-0 ${stepInfo?.color}`}>
                  {stepInfo && <stepInfo.icon className="h-6 w-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {stepInfo?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stepInfo?.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full gap-2 glow-accent group"
                onClick={() => {
                  if (stepInfo?.action) void handleStepComplete(stepInfo.action)
                  const target = document.getElementById(stepInfo?.targetId || "")
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    // Highlight target
                    target.classList.add('ring-4', 'ring-primary/50', 'ring-offset-2')
                    setTimeout(() => {
                      target.classList.remove('ring-4', 'ring-primary/50', 'ring-offset-2')
                    }, 2000)
                  }
                }}
              >
                <Zap className="h-4 w-4" />
                {nextAction}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Skip Option */}
              <button
                onClick={() => {
                  trackOnboardingTourCompleted()
                  if (onComplete) void onComplete()
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip guided tour
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* First Compliance Health Check Modal */}
      {showHealthCheck && healthCheck && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            trackOnboardingTourCompleted()
            setShowHealthCheck(false)
            if (onComplete) void onComplete()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="liquid-glass-glow rounded-2xl p-8 max-w-2xl w-full border-2 border-primary/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Celebration Animation */}
            <div className="text-center mb-6">
              <motion.div
                className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <CheckCircle className="h-12 w-12 text-green-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Setup Complete! 🎉
              </h2>
              <p className="text-muted-foreground">
                Your first Compliance Health Check is ready
              </p>
            </div>

            {/* Health Check Summary */}
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center p-6 rounded-xl bg-primary/10 border border-primary/20">
                <div className="text-6xl font-bold text-primary mb-2">
                  {healthCheck.overallScore}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {healthCheck.portfolioHealth}
                </div>
                <div className="text-sm text-muted-foreground">
                  Portfolio Health Score
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {healthCheck.propertiesMonitored}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Properties
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {healthCheck.activeViolations}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Violations
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {healthCheck.neighborhoodRiskLevel}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Area Risk
                  </div>
                </div>
              </div>

              {/* Top Recommendations */}
              {healthCheck.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Top Recommendations
                  </h3>
                  {healthCheck.recommendations.slice(0, 3).map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20"
                    >
                      <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                        rec.priority === 'high' ? 'bg-red-400' :
                        rec.priority === 'medium' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {rec.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {rec.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Button
                className="w-full gap-2 glow-accent"
                onClick={() => {
                  trackOnboardingTourCompleted()
                  setShowHealthCheck(false)
                  if (onComplete) onComplete()
                }}
              >
                Start Monitoring
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
