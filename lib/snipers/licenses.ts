/**
 * License Registry Sniper
 * Fetches San Diego STRO license CSV, diffs vs previous snapshot,
 * identifies new Tier 3/4 licenses in target zips (92109 Pacific Beach, 92037 La Jolla).
 */

import { parse } from "csv-parse/sync"
import { createClient } from "@supabase/supabase-js"
import type { NewEntrant } from "./types"

const STRO_CSV = "https://seshat.datasd.org/stro_licenses/stro_licenses_datasd.csv"
const TARGET_ZIPS = ["92109", "92037"]
const TARGET_TIERS = ["Tier 3", "Tier 4"]

type StroRow = {
  license_id?: string
  address?: string
  zip?: string
  tier?: string
  local_contact_contact_name?: string
  local_contact_phone?: string
  host_contact_name?: string
}

export async function runLicenseSniper(): Promise<NewEntrant[]> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) {
    console.warn("[license-sniper] Supabase not configured")
    return []
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  const res = await fetch(STRO_CSV)
  if (!res.ok) {
    throw new Error(`STRO CSV fetch failed: ${res.status}`)
  }
  const csv = await res.text()
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true }) as StroRow[]

  const licenseIds = new Set<string>()

  for (const row of rows) {
    const tier = row.tier?.trim()
    const zip = row.zip?.trim()
    if (!TARGET_TIERS.includes(tier ?? "") || !TARGET_ZIPS.includes(zip ?? "")) continue
    const lid = row.license_id?.trim()
    if (!lid) continue
    licenseIds.add(lid)
  }

  // Known licenses: any we've seen in prior snapshots (avoid dup "new" on first run)
  const cutoff = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  const { data: prev } = await supabase
    .from("sniper_stro_snapshots")
    .select("license_id")
    .lt("ingested_at", cutoff)

  const prevSet = new Set((prev ?? []).map((r) => r.license_id))

  // First run: no prior snapshot → seed and return empty
  if ((prev ?? []).length === 0) {
    for (const row of rows) {
      const tier = row.tier?.trim()
      const zip = row.zip?.trim()
      if (!TARGET_TIERS.includes(tier ?? "") || !TARGET_ZIPS.includes(zip ?? "")) continue
      const lid = row.license_id?.trim()
      if (!lid) continue
      await supabase.from("sniper_stro_snapshots").insert({
        license_id: lid,
        address: row.address,
        zip: row.zip,
        tier: row.tier,
        local_contact_name: row.local_contact_contact_name,
        local_contact_phone: row.local_contact_phone,
        host_contact_name: row.host_contact_name,
      })
    }
    return []
  }

  const newEntrants: NewEntrant[] = []
  for (const row of rows) {
    const lid = row.license_id?.trim()
    if (!lid || !licenseIds.has(lid) || prevSet.has(lid)) continue
    const tier = row.tier?.trim()
    const zip = row.zip?.trim()
    if (!TARGET_TIERS.includes(tier ?? "") || !TARGET_ZIPS.includes(zip ?? "")) continue

    newEntrants.push({
      type: "stro_license",
      licenseId: lid,
      address: row.address ?? "",
      zip: zip ?? "",
      tier: tier ?? "",
      localContactName: row.local_contact_contact_name?.trim() || undefined,
      localContactPhone: row.local_contact_phone?.trim() || undefined,
      hostContactName: row.host_contact_name?.trim() || undefined,
    })
  }

  // Store snapshot for today (all target-zone Tier 3/4)
  for (const row of rows) {
    const tier = row.tier?.trim()
    const zip = row.zip?.trim()
    if (!TARGET_TIERS.includes(tier ?? "") || !TARGET_ZIPS.includes(zip ?? "")) continue
    const lid = row.license_id?.trim()
    if (!lid) continue

    await supabase.from("sniper_stro_snapshots").insert({
      license_id: lid,
      address: row.address,
      zip: row.zip,
      tier: row.tier,
      local_contact_name: row.local_contact_contact_name,
      local_contact_phone: row.local_contact_phone,
      host_contact_name: row.host_contact_name,
    })
  }

  return newEntrants
}
