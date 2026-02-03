"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { LeadRow } from "@/lib/leads"

type Props = { lead: LeadRow; tpa: boolean; adu: boolean }

/** Transfer tax: $0.55 to proposed $30.55 per $500 (Measure U increase) */
const RATE_CURRENT = 0.55 / 500
const RATE_PROPOSED = 30.55 / 500

function exitTaxIncrease(value: number): { current: number; proposed: number; diff: number } {
  const current = value * RATE_CURRENT
  const proposed = value * RATE_PROPOSED
  return { current, proposed, diff: proposed - current }
}

export function PropertyIntelligence({ lead, tpa, adu }: Props) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const estValue = 1_500_000
  const tax = exitTaxIncrease(estValue)
  const showExitRisk = tpa || adu || (lead.Lead_Type || "").toLowerCase().includes("stro")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/inbound-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), address: lead.Address || undefined }),
      })
      if (!res.ok) throw new Error("Failed")
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="space-y-8">
      {showExitRisk && (
        <div className="liquid-glass rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="mb-2 font-semibold text-foreground">Exit Risk (Transfer Tax)</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            If property value exceeds $1M, the proposed Jan 2026 rate increase affects your exit.
          </p>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Current rate:</strong> $0.55 per $500 → Est. tax on $1.5M: ${tax.current.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </p>
            <p>
              <strong>Proposed rate:</strong> $30.55 per $500 → Est. tax on $1.5M: ${tax.proposed.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </p>
            <p className="font-medium text-amber-600 dark:text-amber-500">
              Estimated Exit Tax Increase: ${tax.diff.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      )}

      {adu && (
        <div className="liquid-glass rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h2 className="mb-2 font-semibold text-foreground">Equity Unlock (AB 1033)</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Condo-ization Potential — sell your ADU as a separate condo under 2026 laws.
          </p>
          <div className="rounded-lg bg-background/50 p-4">
            <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
              Est. Separated Asset Value: $550k – $750k
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Based on San Diego ADU market; consult a professional for your property.
            </p>
          </div>
        </div>
      )}

      {tpa && (
        <div className="liquid-glass rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-2 font-semibold text-foreground">Transit Priority Area</h2>
          <p className="text-sm text-muted-foreground">
            This property is in a Transit Priority Area. The 2026 LDC density amendments (Spring 139) may unlock additional development potential. Consult the latest city guidance for specifics.
          </p>
        </div>
      )}

      <div className="liquid-glass rounded-2xl border border-primary/20 p-6">
        <h2 className="mb-2 font-semibold text-foreground">Full 2026 Compliance Audit</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Unlock the complete intelligence: transfer tax impact, ADU eligibility, TPA density bonus, and ordinance standing.
        </p>
        <div className="mb-4 rounded-lg bg-muted/50 p-4 blur-sm select-none">
          <p className="text-sm text-muted-foreground">
            [Portfolio health score • Ordinance standing • Renewal timeline • TOT status]
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm"
          />
          <Button type="submit" disabled={status === "loading"} className="glow-accent bg-primary">
            {status === "loading" ? "Saving…" : status === "success" ? "Saved" : "Unlock the Full 2026 Audit"}
          </Button>
        </form>
        {status === "success" && (
          <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">We&apos;ll be in touch shortly.</p>
        )}
        {status === "error" && (
          <p className="mt-2 text-sm text-destructive">Something went wrong. Try again or contact support@doggybagg.cc</p>
        )}
      </div>
    </div>
  )
}
