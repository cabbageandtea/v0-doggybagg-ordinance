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
  const leads: (DistressedLead | NewEntrant)[] = [...distressed, ...newEntrants]
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

export async function municipalSentinelWorkflow() {
  "use workflow"

  const distressed = await stepEnforcementSniper()
  const newEntrants = await stepLicenseSniper()

  await stepEnrichAndEmail(distressed, newEntrants)

  return {
    status: "completed",
    distressedCount: distressed.length,
    newEntrantsCount: newEntrants.length,
    totalTargets: distressed.length + newEntrants.length,
  }
}
