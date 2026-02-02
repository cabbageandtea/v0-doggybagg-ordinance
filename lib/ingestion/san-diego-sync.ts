/**
 * San Diego municipal data sync — code enforcement + parking citations
 *
 * Data sources:
 * - Code Enforcement 2015–2018: seshat.datasd.org
 * - Parking Citations 2024–2025: seshat.datasd.org (fresher data; location-based)
 *
 * Flow:
 * 1. Fetch CSV from San Diego Open Data
 * 2. Parse and normalize addresses
 * 3. Match to user properties (by normalized address)
 * 4. Insert new ordinances; update properties.reporting_status, risk_score
 * 5. Send compliance violation emails for new matches
 *
 * Run via: Vercel Cron (daily) or manual: GET/POST /api/cron/ingest with CRON_SECRET
 *
 * Prereq: Run scripts/013_ordinances_municipal_case_id.sql for idempotency.
 */

import { parse } from "csv-parse/sync"
import { createClient } from "@supabase/supabase-js"
import { sendComplianceViolationEmail } from "@/lib/emails"

const CODE_ENFORCEMENT_CSV =
  "https://seshat.datasd.org/code_enforcement_violations/code_enf_past_3_yr_datasd.csv"
const PARKING_CITATIONS_2024 =
  "https://seshat.datasd.org/parking_citations/parking_citations_2024_part1_datasd.csv"

export type SyncResult = {
  success: boolean
  processed: number
  inserted: number
  updated: number
  matched: number
  errors: string[]
}

type CodeEnforcementRow = {
  case_id: string
  apn?: string
  address_street?: string
  case_source?: string
  description?: string
  date_open?: string
  date_closed?: string
  close_reason?: string
}

type ParkingCitationRow = {
  citation_id: string
  date_issue?: string
  location?: string
  vio_code?: string
  vio_desc?: string
  vio_fine?: string
}

/** Normalize address for matching: lowercase, collapse spaces, standardize abbrevs */
function normalizeAddress(addr: string): string {
  if (!addr || typeof addr !== "string") return ""
  let s = addr
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
  // Common abbrevs
  const abbrevs: [RegExp, string][] = [
    [/\bav\b/g, "ave"],
    [/\bavenue\b/g, "ave"],
    [/\bst\b/g, "st"],
    [/\bstreet\b/g, "st"],
    [/\bblvd\b/g, "blvd"],
    [/\bboulevard\b/g, "blvd"],
    [/\bdr\b/g, "dr"],
    [/\bdrive\b/g, "dr"],
    [/\bln\b/g, "ln"],
    [/\blane\b/g, "ln"],
    [/\bct\b/g, "ct"],
    [/\bcourt\b/g, "ct"],
    [/\brd\b/g, "rd"],
    [/\broad\b/g, "rd"],
    [/\bpl\b/g, "pl"],
    [/\bplace\b/g, "pl"],
    [/\bway\b/g, "way"],
    [/\bterrace\b/g, "ter"],
    [/\bter\b/g, "ter"],
  ]
  for (const [re, sub] of abbrevs) {
    s = s.replace(re, sub)
  }
  return s.replace(/[.,#]/g, "").trim()
}

/** Extract violation type from description (first 80 chars) */
function violationTypeFrom(desc: string | undefined): string {
  if (!desc) return "Code enforcement"
  const clean = desc.replace(/\s+/g, " ").trim().slice(0, 80)
  return clean || "Code enforcement"
}

/** Parse date string to YYYY-MM-DD or null */
function parseDate(s: string | undefined): string | null {
  if (!s) return null
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

export async function runSanDiegoSync(): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    processed: 0,
    inserted: 0,
    updated: 0,
    matched: 0,
    errors: [],
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) {
    result.errors.push("SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not set")
    return result
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  try {
    // 1. Fetch CSV
    const res = await fetch(CODE_ENFORCEMENT_CSV)
    if (!res.ok) {
      result.errors.push(`CSV fetch failed: ${res.status} ${res.statusText}`)
      return result
    }
    const csv = await res.text()

    // 2. Parse
    const allRows = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CodeEnforcementRow[]

    // Limit rows per run to avoid cron timeout (60s)
    const MAX_ROWS = 5000
    const rows = allRows.slice(0, MAX_ROWS)
    result.processed = rows.length

    if (rows.length === 0) {
      result.success = true
      return result
    }

    // 3. Load all user properties (we need user_id for notifications)
    const { data: properties, error: propErr } = await supabase
      .from("properties")
      .select("id, address, user_id, reporting_status")
      .not("user_id", "is", null)

    if (propErr) {
      result.errors.push(`Properties fetch failed: ${propErr.message}`)
      return result
    }
    if (!properties?.length) {
      result.success = true
      return result
    }

    // Build normalized address -> property lookup (one address can match multiple properties if same user has duplicates)
    const addrToProperties = new Map<string, typeof properties>()
    for (const p of properties) {
      const norm = normalizeAddress(p.address)
      if (!norm) continue
      const list = addrToProperties.get(norm) ?? []
      list.push(p)
      addrToProperties.set(norm, list)
    }

    // 4. Process each row
    const seenCaseIds = new Set<string>()
    for (const row of rows) {
      const caseId = row.case_id?.trim()
      if (!caseId || seenCaseIds.has(caseId)) continue
      seenCaseIds.add(caseId)

      const street = row.address_street?.trim()
      if (!street) continue

      const norm = normalizeAddress(street)
      const matches = addrToProperties.get(norm)
      if (!matches?.length) continue

      result.matched += matches.length

      const violationDate = parseDate(row.date_open || row.date_closed)
      const violationType = violationTypeFrom(row.description)
      const status = row.date_closed ? "resolved" : "active"
      const description = (row.description ?? "").slice(0, 500)

      for (const prop of matches) {
        // Check if we already have this case (idempotency)
        const { data: existing } = await supabase
          .from("ordinances")
          .select("id")
          .eq("municipal_case_id", caseId)
          .maybeSingle()

        if (existing) continue

        // Insert ordinance (municipal_case_id may need migration 013)
        const { error: insErr } = await supabase.from("ordinances").insert({
          property_id: prop.id,
          violation_type: violationType,
          violation_date: violationDate,
          description,
          status,
          municipal_case_id: caseId,
        })

        if (insErr) {
          // If municipal_case_id column doesn't exist, try without it
          if (insErr.message?.includes("municipal_case_id")) {
            const { error: insErr2 } = await supabase.from("ordinances").insert({
              property_id: prop.id,
              violation_type: violationType,
              violation_date: violationDate,
              description,
              status,
            })
            if (insErr2) result.errors.push(`Insert ${caseId}: ${insErr2.message}`)
            else result.inserted++
          } else {
            result.errors.push(`Insert ${caseId}: ${insErr.message}`)
          }
          continue
        }
        result.inserted++

        // Update property if not already violation
        if (prop.reporting_status !== "violation") {
          const { error: updErr } = await supabase
            .from("properties")
            .update({
              reporting_status: "violation",
              risk_score: Math.min(100, 50 + (prop.reporting_status === "pending" ? 20 : 0)),
              last_checked: new Date().toISOString(),
            })
            .eq("id", prop.id)

          if (!updErr) result.updated++

          // Send notification (respect email prefs)
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, email_notifications")
            .eq("id", prop.user_id)
            .single()

          if (profile?.email && profile.email_notifications !== false) {
            await sendComplianceViolationEmail(profile.email, {
              propertyAddress: prop.address,
              violationType,
            })
          }
        }
      }
    }

    // 5. Parking citations (2024+ data — fresher than code enforcement)
    try {
      const parkRes = await fetch(PARKING_CITATIONS_2024)
      if (parkRes.ok) {
        const parkCsv = await parkRes.text()
        const parkRows = parse(parkCsv, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        }) as ParkingCitationRow[]
        const parkLimit = Math.min(3000, parkRows.length)
        result.processed += parkLimit
        const seenPark = new Set<string>()
        for (let i = 0; i < parkLimit; i++) {
          const row = parkRows[i]
          const cid = row.citation_id?.trim()
          if (!cid || seenPark.has(cid)) continue
          seenPark.add(cid)
          const loc = row.location?.trim()
          if (!loc) continue
          const norm = normalizeAddress(loc)
          const matches = addrToProperties.get(norm)
          if (!matches?.length) continue
          result.matched += matches.length
          const violationDate = parseDate(row.date_issue)
          const violationType = (row.vio_desc ?? "Parking citation").slice(0, 80)
          const fine = row.vio_fine ? parseFloat(row.vio_fine) : null
          const muniId = `park-${cid}`
          for (const prop of matches) {
            const { data: existing } = await supabase
              .from("ordinances")
              .select("id")
              .eq("municipal_case_id", muniId)
              .maybeSingle()
            if (existing) continue
            const { error: insErr } = await supabase.from("ordinances").insert({
              property_id: prop.id,
              violation_type: violationType,
              violation_date: violationDate,
              description: row.vio_desc?.slice(0, 500) ?? "Parking citation",
              fine_amount: fine,
              status: "active",
              municipal_case_id: muniId,
            })
            if (!insErr) {
              result.inserted++
              if (prop.reporting_status !== "violation") {
                await supabase.from("properties").update({
                  reporting_status: "violation",
                  risk_score: Math.min(100, 50 + (prop.reporting_status === "pending" ? 20 : 0)),
                  last_checked: new Date().toISOString(),
                }).eq("id", prop.id)
                result.updated++
                const { data: profile } = await supabase.from("profiles").select("email, email_notifications").eq("id", prop.user_id).single()
                if (profile?.email && profile.email_notifications !== false) {
                  await sendComplianceViolationEmail(profile.email, { propertyAddress: prop.address, violationType })
                }
              }
            }
          }
        }
      }
    } catch (parkErr) {
      result.errors.push(`Parking sync: ${parkErr instanceof Error ? parkErr.message : "Unknown"}`)
    }

    result.success = true
    return result
  } catch (err) {
    result.errors.push(err instanceof Error ? err.message : "Unknown error")
    return result
  }
}
