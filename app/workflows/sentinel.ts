/**
 * Municipal Sentinel Workflow
 * Daily durable workflow: run snipers, enrich contacts, email admin with high-priority targets.
 * Triggered by Vercel Cron: /api/cron/sentinel
 *
 * Architecture (Workflow DevKit 4.0.1-beta.30):
 * - No serve() pattern: this SDK uses withWorkflow() in next.config to auto-generate
 *   /.well-known/workflow/v1/flow, step, webhook route handlers at build time.
 * - No .input() or Zod schema: this workflow takes no arguments; no schema validation at discovery.
 * - Export is a pure async function; handlers are created by the framework, not this file.
 */

import { runEnforcementSniper } from "@/lib/snipers/enforcement"
import { runLicenseSniper } from "@/lib/snipers/licenses"
import { runDocketScraper } from "@/lib/snipers/dockets"
import { runIntegritySniper } from "@/lib/snipers/integrity"
import { runRenewalSniper } from "@/lib/snipers/renewal"
import { runTotSniper } from "@/lib/snipers/tot"
import { searchContactForLead } from "@/lib/snipers/contact-search"
import { sendSentinelTargetsEmail } from "@/lib/emails"
import type { DistressedLead, NewEntrant, LegislativeAlert, IntegrityRisk, ExpiringLicense, TaxRisk } from "@/lib/snipers/types"

async function stepDocketScraper() {
  "use step"
  return runDocketScraper()
}

async function stepEnforcementSniper() {
  "use step"
  return runEnforcementSniper()
}

async function stepLicenseSniper() {
  "use step"
  return runLicenseSniper()
}

async function stepIntegritySniper() {
  "use step"
  return runIntegritySniper()
}

async function stepRenewalSniper() {
  "use step"
  return runRenewalSniper()
}

async function stepTotSniper() {
  "use step"
  return runTotSniper()
}

async function stepEnrichAndEmail(
  alerts: LegislativeAlert[],
  integrityRisks: IntegrityRisk[],
  expiring: ExpiringLicense[],
  taxRisks: TaxRisk[],
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
  const result = await sendSentinelTargetsEmail(enriched, alerts, integrityRisks, expiring, taxRisks)
  if (!result.ok) throw new Error(result.error ?? "Failed to send sentinel email")
  return { sent: enriched.length }
}

async function stepLogRun(opts: {
  alertsCount: number
  integrityRisksCount: number
  expiringCount: number
  taxRisksCount: number
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

  const alerts = await stepDocketScraper()
  const distressed = await stepEnforcementSniper()
  const newEntrants = await stepLicenseSniper()
  const integrityRisks = await stepIntegritySniper()
  const expiring = await stepRenewalSniper()
  const taxRisks = await stepTotSniper()
  const totalTargets = distressed.length + newEntrants.length

  try {
    await stepEnrichAndEmail(alerts, integrityRisks, expiring, taxRisks, distressed, newEntrants)
    await stepLogRun({
      alertsCount: alerts.length,
      integrityRisksCount: integrityRisks.length,
      expiringCount: expiring.length,
      taxRisksCount: taxRisks.length,
      distressedCount: distressed.length,
      newEntrantsCount: newEntrants.length,
      totalTargets,
      status: "completed",
    })
    return {
      status: "completed" as const,
      alertsCount: alerts.length,
      integrityRisksCount: integrityRisks.length,
      expiringCount: expiring.length,
      taxRisksCount: taxRisks.length,
      distressedCount: distressed.length,
      newEntrantsCount: newEntrants.length,
      totalTargets,
    }
  } catch (err) {
    try {
      await stepLogRun({
        alertsCount: alerts.length,
        integrityRisksCount: integrityRisks.length,
        expiringCount: expiring.length,
        taxRisksCount: taxRisks.length,
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
