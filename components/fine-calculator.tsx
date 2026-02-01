"use client"

import { useState } from "react"
import { trackCalculatorUsed } from "@/lib/analytics"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calculator, AlertTriangle, DollarSign } from "lucide-react"

const violationTypes = [
  { value: "trash", label: "Trash/Debris Violation", baseFine: 250, dailyPenalty: 50 },
  { value: "permit", label: "Unpermitted Construction", baseFine: 500, dailyPenalty: 100 },
  { value: "noise", label: "Noise Ordinance", baseFine: 150, dailyPenalty: 25 },
  { value: "parking", label: "Parking Violation", baseFine: 100, dailyPenalty: 20 },
  { value: "vegetation", label: "Overgrown Vegetation", baseFine: 200, dailyPenalty: 40 },
  { value: "str", label: "Short-Term Rental", baseFine: 1000, dailyPenalty: 500 },
  { value: "occupancy", label: "Occupancy Violation", baseFine: 500, dailyPenalty: 100 },
]

export function FineCalculator() {
  const [violationType, setViolationType] = useState("")
  const [daysUnresolved, setDaysUnresolved] = useState([30])
  const [properties, setProperties] = useState([1])

  const selectedViolation = violationTypes.find((v) => v.value === violationType)
  
  const calculateFine = () => {
    if (!selectedViolation) return { base: 0, penalties: 0, total: 0 }
    const base = selectedViolation.baseFine * properties[0]
    const penalties = selectedViolation.dailyPenalty * daysUnresolved[0] * properties[0]
    return { 
      base, 
      penalties, 
      total: base + penalties 
    }
  }

  const fines = calculateFine()

  const handleViolationChange = (value: string) => {
    setViolationType(value)
    const v = violationTypes.find((t) => t.value === value)
    if (v) {
      const base = v.baseFine * properties[0]
      const penalties = v.dailyPenalty * daysUnresolved[0] * properties[0]
      trackCalculatorUsed({ violationType: value, estimatedTotal: base + penalties })
    }
  }

  return (
    <div className="liquid-glass-glow rounded-2xl p-4 sm:p-6 md:p-8">
      <div className="mb-4 sm:mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/20 text-primary glow-accent flex-shrink-0">
          <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">Fine Calculator</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Estimate potential violation costs</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Violation Type */}
        <div className="space-y-2">
          <Label className="text-sm sm:text-base text-foreground">Violation Type</Label>
          <Select value={violationType} onValueChange={handleViolationChange}>
            <SelectTrigger className="border-border bg-input text-foreground h-10 sm:h-11 text-sm sm:text-base">
              <SelectValue placeholder="Select violation type" />
            </SelectTrigger>
            <SelectContent className="border-border bg-card">
              {violationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-sm sm:text-base text-foreground hover:bg-secondary">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Days Unresolved */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-sm sm:text-base text-foreground">Days Unresolved</Label>
            <span className="text-xs sm:text-sm font-medium text-primary whitespace-nowrap">{daysUnresolved[0]} days</span>
          </div>
          <Slider
            value={daysUnresolved}
            onValueChange={setDaysUnresolved}
            max={365}
            min={1}
            step={1}
            className="touch-action-none"
          />
        </div>

        {/* Number of Properties */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-sm sm:text-base text-foreground">Number of Properties</Label>
            <span className="text-xs sm:text-sm font-medium text-primary whitespace-nowrap">{properties[0]} {properties[0] === 1 ? 'property' : 'properties'}</span>
          </div>
          <Slider
            value={properties}
            onValueChange={setProperties}
            max={50}
            min={1}
            step={1}
            className="touch-action-none"
          />
        </div>

        {/* Results */}
        {selectedViolation && (
          <div className="space-y-3 sm:space-y-4 rounded-xl border border-border bg-secondary/50 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Base Fine</span>
              <span className="font-medium text-sm sm:text-base text-foreground">${fines.base.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Accumulated Penalties</span>
              <span className="font-medium text-sm sm:text-base text-red-400">${fines.penalties.toLocaleString()}</span>
            </div>
            <div className="border-t border-border pt-3 sm:pt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-semibold text-sm sm:text-base text-foreground">
                  <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate">Estimated Total</span>
                </span>
                <span className="text-xl sm:text-2xl font-bold text-glow text-primary whitespace-nowrap">
                  ${fines.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-2 sm:gap-3 rounded-lg bg-destructive/10 p-3 sm:p-4">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-destructive mt-0.5" />
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            These are estimates only. Actual fines vary based on specific circumstances 
            and City Treasurer determinations.
          </p>
        </div>
      </div>
    </div>
  )
}
