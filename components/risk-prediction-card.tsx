"use client"

import { useState, useEffect } from "react"
import { predictPropertyRisk, type RiskPrediction } from "@/app/actions/agentic"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  AlertTriangle, 
  MapPin,
  Brain,
  RefreshCw
} from "lucide-react"

type RiskPredictionCardProps = {
  propertyId: string
  zipCode: string
}

export function RiskPredictionCard({ propertyId, zipCode }: RiskPredictionCardProps) {
  const [prediction, setPrediction] = useState<RiskPrediction['prediction'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPrediction = async () => {
    setIsLoading(true)
    setError(null)
    
    const result = await predictPropertyRisk(propertyId, zipCode)
    
    if (result.success && result.prediction) {
      setPrediction(result.prediction)
    } else {
      setError(result.error || 'Failed to load prediction')
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    void loadPrediction()
  }, [propertyId, zipCode])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-secondary'
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 33) return 'text-green-400'
    if (score <= 66) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (isLoading) {
    return (
      <div className="liquid-glass-glow rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-sm text-muted-foreground">Analyzing risk factors...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !prediction) {
    return (
      <div className="liquid-glass-glow rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Risk Prediction</h3>
            <p className="text-sm text-muted-foreground">AI-powered analysis</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{error || 'No data available'}</p>
        <Button 
          onClick={loadPrediction} 
          variant="outline" 
          size="sm" 
          className="mt-4 bg-transparent"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="liquid-glass-glow rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Risk Prediction</h3>
            <p className="text-sm text-muted-foreground">Bayesian reasoning model</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={loadPrediction}
          className="h-8 w-8"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Risk Score Circle */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg className="h-32 w-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(prediction.score / 100) * 351.86} 351.86`}
              className={getScoreColor(prediction.score)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(prediction.score)}`}>
              {prediction.score}
            </span>
            <span className="text-xs text-muted-foreground">Risk Score</span>
          </div>
        </div>
      </div>

      {/* Risk Levels */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground mb-1">Property Risk</p>
          <Badge className={getRiskColor(prediction.level)}>
            {prediction.level}
          </Badge>
        </div>
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground mb-1">Neighborhood Score</p>
          <Badge className={getRiskColor(prediction.neighborhoodScore)}>
            {prediction.neighborhoodScore}
          </Badge>
        </div>
      </div>

      {/* Bayesian Reasoning - Why This Risk Level? */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Risk Factors</h4>
        </div>
        <ul className="space-y-2">
          {prediction.reasons.map((reason, idx) => (
            <li 
              key={idx} 
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Area Violations */}
      {prediction.areaViolations.count > 0 && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Neighborhood Analysis: {prediction.areaViolations.zipCode}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {prediction.areaViolations.count} recent violations detected in your area
              </p>
            </div>
          </div>
          {prediction.areaViolations.types.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {prediction.areaViolations.types.map((type, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className="text-xs border-primary/30"
                >
                  {type}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Model Info */}
      <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
        <Brain className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-foreground">Bayesian Reasoning Model</p>
          <p className="text-xs text-muted-foreground mt-1">
            Analyzes 90-day violation patterns, neighborhood enforcement trends, 
            and seasonal compliance factors to predict risk probability.
          </p>
        </div>
      </div>
    </div>
  )
}
