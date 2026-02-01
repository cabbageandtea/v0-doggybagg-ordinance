"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  getOnboardingStatus, 
  generateFirstHealthCheck,
  type OnboardingStatus,
  type ComplianceHealthCheck
} from "@/app/actions/agentic"
import { GhostCursor } from "./ghost-cursor"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Bot, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Shield,
  TrendingUp,
  AlertCircle,
  X
} from "lucide-react"

export function OnboardingAgent() {
  const [status, setStatus] = useState<OnboardingStatus['status'] | null>(null)
  const [healthCheck, setHealthCheck] = useState<ComplianceHealthCheck['report'] | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const [showHealthCheck, setShowHealthCheck] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void loadOnboardingStatus()
  }, [])

  async function loadOnboardingStatus() {
    setIsLoading(true)
    const result = await getOnboardingStatus()
    
    if (result.success && result.status) {
      setStatus(result.status)
      setCurrentStep(result.status.currentStep)
      
      // Show onboarding agent if not complete
      if (!result.status.isComplete) {
        setIsVisible(true)
      }
      
      // If just completed, generate health check
      if (result.status.completedSteps.length === 3 && !healthCheck) {
        await generateHealthCheckReport()
      }
    }
    setIsLoading(false)
  }


  async function generateHealthCheckReport() {
    const result = await generateFirstHealthCheck()
    if (result.success && result.report) {
      setHealthCheck(result.report)
      setShowHealthCheck(true)
    }
  }

  const steps = [
    {
      id: 1,
      key: 'add_property' as const,
      title: 'Add Your First Property',
      description: 'Start monitoring compliance for your property',
      targetElement: '[data-onboarding="add-property-btn"]',
      message: 'Click here to add your first property',
    },
    {
      id: 2,
      key: 'verify_phone' as const,
      title: 'Verify Phone Number',
      description: 'Get instant SMS alerts for violations',
      targetElement: '[data-onboarding="verify-phone-btn"]',
      message: 'Verify your phone for SMS alerts',
    },
    {
      id: 3,
      key: 'view_risk' as const,
      title: status?.userTier === 'free' ? 'View Neighborhood Watch' : 'View Risk Score',
      description: status?.userTier === 'free' 
        ? 'See enforcement heat maps for San Diego'
        : 'Check your property risk assessment',
      targetElement: status?.userTier === 'free'
        ? '[data-onboarding="neighborhood-watch"]'
        : '[data-onboarding="risk-score"]',
      message: status?.userTier === 'free'
        ? 'Explore neighborhood enforcement data'
        : 'View your risk prediction',
    },
  ]

  if (isLoading || !status) return null
  if (status.isComplete && !showHealthCheck) return null

  const progress = (status.completedSteps.length / status.totalSteps) * 100
  const activeStep = steps.find(s => s.id === currentStep)

  return (
    <>
      {/* Ghost Cursor Guide */}
      <GhostCursor
        targetElement={activeStep?.targetElement}
        message={activeStep?.message}
        isActive={isVisible && !status.isComplete}
      />

      {/* Onboarding Progress Card */}
      <AnimatePresence>
        {isVisible && !status.isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm"
          >
            <div className="liquid-glass-glow rounded-2xl p-6 shadow-2xl border border-primary/20">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                    <Bot className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">AI Onboarding Agent</h3>
                    <p className="text-xs text-muted-foreground">Let me guide you</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">
                    Step {currentStep} of {status.totalSteps}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Current Step */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {activeStep?.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {activeStep?.description}
                </p>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-2 mb-4">
                {steps.map((step) => {
                  const isCompleted = status.completedSteps.includes(step.key)
                  const isCurrent = step.id === currentStep
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2 text-xs ${
                        isCurrent ? 'text-primary font-medium' : 
                        isCompleted ? 'text-muted-foreground' : 
                        'text-muted-foreground/50'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : isCurrent ? (
                        <ArrowRight className="h-4 w-4 animate-pulse" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span>{step.title}</span>
                    </div>
                  )
                })}
              </div>

              {/* Next Action */}
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                <p className="text-xs font-medium text-primary flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  {status.nextAction}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Setup Complete - Health Check Report */}
        {showHealthCheck && healthCheck && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <div className="liquid-glass-glow rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-primary/20">
              {/* Celebration Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-4"
                >
                  <Shield className="h-8 w-8 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Setup Complete!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your first compliance health check is ready
                </p>
              </div>

              {/* Health Check Results */}
              <div className="space-y-6 mb-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center gap-3 mb-2">
                    <span className="text-5xl font-bold text-foreground">
                      {healthCheck.overallScore}
                    </span>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                      <p className={`text-lg font-semibold ${
                        healthCheck.portfolioHealth === 'Excellent' ? 'text-green-500' :
                        healthCheck.portfolioHealth === 'Good' ? 'text-blue-500' :
                        healthCheck.portfolioHealth === 'Fair' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {healthCheck.portfolioHealth}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <p className="text-2xl font-bold text-foreground">
                      {healthCheck.propertiesMonitored}
                    </p>
                    <p className="text-xs text-muted-foreground">Properties</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <p className="text-2xl font-bold text-foreground">
                      {healthCheck.activeViolations}
                    </p>
                    <p className="text-xs text-muted-foreground">Violations</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <p className={`text-2xl font-bold ${
                      healthCheck.neighborhoodRiskLevel === 'Low' ? 'text-green-500' :
                      healthCheck.neighborhoodRiskLevel === 'Medium' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {healthCheck.neighborhoodRiskLevel}
                    </p>
                    <p className="text-xs text-muted-foreground">Area Risk</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Next Steps
                  </h3>
                  <div className="space-y-2">
                    {healthCheck.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20"
                      >
                        <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          rec.priority === 'high' ? 'text-red-500' :
                          rec.priority === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
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
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowHealthCheck(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowHealthCheck(false)
                    setIsVisible(false)
                  }}
                  className="flex-1 glow-accent"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
