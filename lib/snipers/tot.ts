/**
 * TOT Gap Sniper
 * Identifies STRO-licensed properties missing a TOT (Transient Occupancy Tax) certificate.
 * Cross-references sniper_stro_snapshots with San Diego TOT certificate registry.
 *
 * Source: data.sandiego.gov TOT Vacation Certificates / seshat.datasd.org
 * STR properties must have both STRO license and TOT certificate.
 */

import { parse } from "csv-parse/sync"
import { createClient } from "@supabase/supabase-js"
import type { TaxRisk } from "./types"

const TOT_CSV =
  "https://seshat.datasd.org/tot_establishments/tot_establishments_datasd.csv"
const TARGET_ZIPS = ["92109", "92037"]

type TotRow = {
  certificate_id?: string
  cert_id?: string
  license_id?: string
  stro_license?: string
  address?: string
  street_address?: string
  property_address?: string
  zip?: string
  zip_code?: string
}

function normalizeId(s: string): string {
  return s.replace(/\s+/g, "").replace(/[-–]/g, "").toUpperCase().trim()
}

function normalizeAddr(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/,/g, "")
    .trim()
}

export async function runTotSniper(): Promise<TaxRisk[]> {
  try {
    return await runTotSniperInner()
  } catch (err) {
    console.error("[tot-sniper]", err)
    return []
  }
}

async function runTotSniperInner(): Promise<TaxRisk[]> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) return []

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  // 1. Get STRO licenses in target zips (from recent snapshots)
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: stroRows } = await supabase
    .from("sniper_stro_snapshots")
    .select("license_id, address, zip")
    .in("zip", TARGET_ZIPS)
    .gte("ingested_at", cutoff)
    .order("ingested_at", { ascending: false })

  const stroByLicense = new Map<string, { address?: string; zip?: string }>()
  for (const row of stroRows ?? []) {
    const lid = row.license_id?.trim()
    if (lid && !stroByLicense.has(lid)) {
      stroByLicense.set(lid, { address: row.address ?? undefined, zip: row.zip ?? undefined })
    }
  }

  if (stroByLicense.size === 0) return []

  // 2. Fetch TOT certificates
  let totLicenseIds = new Set<string>()
  const totAddresses = new Set<string>()

  try {
    const res = await fetch(TOT_CSV)
    if (res.ok) {
      const csv = await res.text()
      const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true }) as TotRow[]

      for (const row of rows) {
        const lid =
          row.license_id?.trim() ??
          row.stro_license?.trim()
        if (lid) totLicenseIds.add(normalizeId(lid))

        const addr =
          row.address ?? row.street_address ?? row.property_address
        if (addr) totAddresses.add(normalizeAddr(addr))
      }
    }
  } catch (err) {
    console.error("[tot-sniper] TOT CSV fetch:", err)
    return []
  }

  // 3. STRO licenses with no matching TOT
  const risks: TaxRisk[] = []
  for (const [licenseId, meta] of stroByLicense) {
    const normLicense = normalizeId(licenseId)
    if (totLicenseIds.has(normLicense)) continue

    const addr = meta.address?.trim()
    if (addr && totAddresses.has(normalizeAddr(addr))) continue

    risks.push({
      licenseId,
      address: addr,
      status: "Missing TOT",
    })
  }

  return risks
}
