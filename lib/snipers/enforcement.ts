/**
 * Enforcement Arbitrage Sniper
 * Monitors San Diego code enforcement and parking data for "Distressed Leads":
 * - Unauthorized Short Term Rental, Noise Violations (code enforcement)
 * - Parking citations at residential addresses (possible STR activity)
 *
 * Data: seshat.datasd.org (code enforcement 2015–2018, parking 2024+)
 * Note: For live Accela CE cases, would need OpenDSD API integration.
 */

import { parse } from "csv-parse/sync"
import type { DistressedLead } from "./types"

const CODE_ENFORCEMENT_CSV =
  "https://seshat.datasd.org/code_enforcement_violations/code_enf_past_3_yr_datasd.csv"
const PARKING_CSV =
  "https://seshat.datasd.org/parking_citations/parking_citations_2024_part1_datasd.csv"

const DISTRESSED_KEYWORDS = [
  "unauthorized short term",
  "short term rental",
  "str",
  "noise",
  "noise violation",
  "nuisance",
  "illegal rental",
]

function matchesDistressed(desc: string): boolean {
  const lower = desc.toLowerCase()
  return DISTRESSED_KEYWORDS.some((kw) => lower.includes(kw))
}

type CodeEnforcementRow = {
  case_id?: string
  address_street?: string
  description?: string
  date_open?: string
}

type ParkingRow = {
  citation_id?: string
  location?: string
  date_issue?: string
  vio_desc?: string
}

export async function runEnforcementSniper(): Promise<DistressedLead[]> {
  const leads: DistressedLead[] = []
  const seen = new Set<string>()

  try {
    // 1. Code enforcement
    const ceRes = await fetch(CODE_ENFORCEMENT_CSV)
    if (ceRes.ok) {
      const ceCsv = await ceRes.text()
      const rows = parse(ceCsv, { columns: true, skip_empty_lines: true, trim: true }) as CodeEnforcementRow[]
      for (const row of rows) {
        const caseId = row.case_id?.trim()
        const addr = row.address_street?.trim()
        const desc = row.description ?? ""
        if (!caseId || !addr || !matchesDistressed(desc)) continue
        const key = `ce-${caseId}`
        if (seen.has(key)) continue
        seen.add(key)
        leads.push({
          type: "code_enforcement",
          address: addr,
          caseId,
          description: desc.slice(0, 200),
          dateOpened: row.date_open ?? undefined,
        })
      }
    }
  } catch (err) {
    console.error("[enforcement-sniper] code enforcement fetch:", err)
  }

  try {
    // 2. Parking citations (recent STR areas; limit for run time)
    const parkRes = await fetch(PARKING_CSV)
    if (parkRes.ok) {
      const parkCsv = await parkRes.text()
      const rows = parse(parkCsv, { columns: true, skip_empty_lines: true, trim: true }) as ParkingRow[]
      const limit = Math.min(2000, rows.length)
      for (let i = 0; i < limit; i++) {
        const row = rows[i]
        const cid = row.citation_id?.trim()
        const loc = row.location?.trim()
        if (!cid || !loc) continue
        const key = `park-${cid}`
        if (seen.has(key)) continue
        seen.add(key)
        leads.push({
          type: "parking",
          address: loc,
          caseId: cid,
          description: row.vio_desc?.slice(0, 100),
          dateOpened: row.date_issue ?? undefined,
        })
      }
    }
  } catch (err) {
    console.error("[enforcement-sniper] parking fetch:", err)
  }

  return leads
}
