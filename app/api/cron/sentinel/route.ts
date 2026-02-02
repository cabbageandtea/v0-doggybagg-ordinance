/**
 * Cron endpoint for Municipal Sentinel.
 * GET/POST /api/cron/sentinel with Authorization: Bearer <CRON_SECRET>
 * Schedule: daily at midnight UTC via vercel.json
 *
 * Runs all snipers (docket, enforcement, license, integrity, renewal, TOT),
 * enriches contacts, sends admin email, and logs the run.
 */

import { NextRequest, NextResponse } from "next/server"
import { runEnforcementSniper } from "@/lib/snipers/enforcement"
import { runLicenseSniper } from "@/lib/snipers/licenses"
import { runDocketScraper } from "@/lib/snipers/dockets"
import { runIntegritySniper } from "@/lib/snipers/integrity"
import { runRenewalSniper } from "@/lib/snipers/renewal"
import { runTotSniper } from "@/lib/snipers/tot"
import { searchContactForLead } from "@/lib/snipers/contact-search"
import { sendSentinelTargetsEmail } from "@/lib/emails"
import { logSentinelRun } from "@/lib/snipers/log-run"
import type { DistressedLead, NewEntrant } from "@/lib/snipers/types"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: NextRequest) {
  return handleCron(request)
}

export async function POST(request: NextRequest) {
  return handleCron(request)
}

async function handleCron(request: NextRequest) {
  const auth = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const alerts = await runDocketScraper()
    const distressed = await runEnforcementSniper()
    const newEntrants = await runLicenseSniper()
    const integrityRisks = await runIntegritySniper()
    const expiring = await runRenewalSniper()
    const taxRisks = await runTotSniper()
    const totalTargets = distressed.length + newEntrants.length

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

    await logSentinelRun({
      alertsCount: alerts.length,
      integrityRisksCount: integrityRisks.length,
      expiringCount: expiring.length,
      taxRisksCount: taxRisks.length,
      distressedCount: distressed.length,
      newEntrantsCount: newEntrants.length,
      totalTargets,
      status: "completed",
    })

    return NextResponse.json({
      ok: true,
      status: "completed",
      alertsCount: alerts.length,
      integrityRisksCount: integrityRisks.length,
      expiringCount: expiring.length,
      taxRisksCount: taxRisks.length,
      distressedCount: distressed.length,
      newEntrantsCount: newEntrants.length,
      totalTargets,
      enrichedCount: enriched.length,
    })
  } catch (err) {
    console.error("[cron/sentinel]", err)
    const errMsg = err instanceof Error ? err.message : String(err)

    try {
      await logSentinelRun({
        alertsCount: 0,
        integrityRisksCount: 0,
        expiringCount: 0,
        taxRisksCount: 0,
        distressedCount: 0,
        newEntrantsCount: 0,
        totalTargets: 0,
        status: "failed",
        error: errMsg,
      })
    } catch {
      // Log failure is non-fatal
    }

    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    )
  }
}
