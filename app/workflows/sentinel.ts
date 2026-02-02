/**
 * Municipal Sentinel Workflow
 * Daily durable workflow: run snipers, enrich contacts, email admin with high-priority targets.
 * Triggered by Vercel Cron: /api/cron/sentinel
 */

import { runEnforcementSniper } from "@/lib/snipers/enforcement"
import { runLicenseSniper } from "@/lib/snipers/licenses"
import { searchContactForLead } from "@/lib/snipers/contact-search"
import { sendSentinelTargetsEmail } from "@/lib/emails"
import type { DistressedLead, NewEntrant } from "@/lib/snipers/types"

async function stepEnforcementSniper() {
  "use step"
  return runEnforcementSniper()
}

async function stepLicenseSniper() {
  "use step"
  return runLicenseSniper()
}

async function stepEnrichAndEmail(
  distressed: DistressedLead[],
  newEntrants: NewEntrant[]
) {
  "use step"
  // Prioritize new entrants (have contact info); dedupe by normalized address
  const normalizeAddr = (a: string) => a.toLowerCase().replace(/\s+/g, " ").trim()
  const seen = new Set<string>()
  const leads: (DistressedLead | NewEntrant)[] = []
  for (const l of newEntrants) {
    const key = normalizeAddr(l.address)
    if (!seen.has(key)) {
      seen.add(key)
      leads.push(l)
    }
  }
  for (const l of distressed) {
    const key = normalizeAddr(l.address)
    if (!seen.has(key)) {
      seen.add(key)
      leads.push(l)
    }
  }
  const enriched: Array<{
    type: string
    address: string
    caseId?: string
    licenseId?: string
    contact?: { name?: string; phone?: string }
  }> = []
  for (const lead of leads.slice(0, 50)) {
    const contact = await searchContactForLead(lead)
    enriched.push({
      type: lead.type,
      address: lead.address,
      caseId: lead.type !== "stro_license" ? lead.caseId : undefined,
      licenseId: lead.type === "stro_license" ? lead.licenseId : undefined,
      contact: { name: contact.name, phone: contact.phone },
    })
  }
  const result = await sendSentinelTargetsEmail(enriched)
  if (!result.ok) throw new Error(result.error ?? "Failed to send sentinel email")
  return { sent: enriched.length }
}

async function stepLogRun(opts: {
  distressedCount: number
  newEntrantsCount: number
  totalTargets: number
  status: "completed" | "failed"
  error?: string
}) {
  "use step"
  const { logSentinelRun: logRun } = await import("@/lib/snipers/log-run")
  await logRun(opts)
}

export async function municipalSentinelWorkflow() {
  "use workflow"

  const distressed = await stepEnforcementSniper()
  const newEntrants = await stepLicenseSniper()
  const totalTargets = distressed.length + newEntrants.length

  try {
    await stepEnrichAndEmail(distressed, newEntrants)
    await stepLogRun({
      distressedCount: distressed.length,
      newEntrantsCount: newEntrants.length,
      totalTargets,
      status: "completed",
    })
    return {
      status: "completed" as const,
      distressedCount: distressed.length,
      newEntrantsCount: newEntrants.length,
      totalTargets,
    }
  } catch (err) {
    try {
      await stepLogRun({
        distressedCount: distressed.length,
        newEntrantsCount: newEntrants.length,
        totalTargets,
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      })
    } catch {
      // Log failure is non-fatal
    }
    throw err
  }
}
