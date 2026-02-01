"use client"

import { Shield } from "lucide-react"
import { copyToClipboardWithToast } from "@/lib/copy-toast"

interface ComplianceScoreBadgeProps {
  /** Risk score 0–100 (high = higher risk). Displayed as compliance = 100 - risk. */
  score: number
  address?: string
  showShareHint?: boolean
}

/** Compliance = 100 - risk (high compliance = good) */
function toCompliance(risk: number) {
  return Math.max(0, Math.min(100, Math.round(100 - risk)))
}

function getScoreColor(compliance: number) {
  if (compliance >= 75) return "text-green-400 border-green-500/40 bg-green-500/10"
  if (compliance >= 50) return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
  if (compliance >= 25) return "text-orange-400 border-orange-500/40 bg-orange-500/10"
  return "text-red-400 border-red-500/40 bg-red-500/10"
}

export function ComplianceScoreBadge({ score, address, showShareHint }: ComplianceScoreBadgeProps) {
  const compliance = toCompliance(score)
  const shareText = `My property compliance score: ${compliance}/100 — DoggyBagg | doggybagg.cc`

  const handleCopyShare = () => {
    void copyToClipboardWithToast(shareText, "Share text copied")
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCopyShare}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 transition-colors hover:opacity-90 ${getScoreColor(compliance)}`}
      >
        <Shield className="h-5 w-5" />
        <span className="font-bold text-lg">Compliance Score: {compliance}</span>
        <span className="text-xs opacity-80">/100</span>
      </button>
      {showShareHint && (
        <p className="text-xs text-muted-foreground">
          Tap to copy and share with lenders or listings.
        </p>
      )}
    </div>
  )
}
