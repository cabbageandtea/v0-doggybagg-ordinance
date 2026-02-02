/**
 * Renewal Sentinel
 * Identifies STRO licenses expiring in the next 10–45 days.
 * Highest-conversion leads for $499 Portfolio Audit (preventative outreach).
 */

import { createClient } from "@supabase/supabase-js"
import type { ExpiringLicense } from "./types"

const DAYS_MIN = 10
const DAYS_MAX = 45

export async function runRenewalSniper(): Promise<ExpiringLicense[]> {
  try {
    return await runRenewalSniperInner()
  } catch (err) {
    console.error("[renewal-sniper]", err)
    return []
  }
}

async function runRenewalSniperInner(): Promise<ExpiringLicense[]> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) return []

  const now = new Date()
  const minDate = new Date(now)
  minDate.setDate(minDate.getDate() + DAYS_MIN)
  const maxDate = new Date(now)
  maxDate.setDate(maxDate.getDate() + DAYS_MAX)
  const minStr = minDate.toISOString().slice(0, 10)
  const maxStr = maxDate.toISOString().slice(0, 10)

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  const { data } = await supabase
    .from("sniper_stro_snapshots")
    .select("license_id, expiration_date, address, zip, local_contact_name, local_contact_phone, host_contact_name")
    .not("expiration_date", "is", null)
    .gte("expiration_date", minStr)
    .lte("expiration_date", maxStr)
    .order("expiration_date", { ascending: true })

  const seen = new Set<string>()
  const expiring: ExpiringLicense[] = []

  for (const row of data ?? []) {
    const lid = row.license_id?.trim()
    if (!lid || seen.has(lid)) continue
    seen.add(lid)
    expiring.push({
      licenseId: lid,
      expirationDate: row.expiration_date ?? "",
      address: row.address ?? undefined,
      zip: row.zip ?? undefined,
      localContactName: row.local_contact_name ?? undefined,
      localContactPhone: row.local_contact_phone ?? undefined,
      hostContactName: row.host_contact_name ?? undefined,
    })
  }

  return expiring
}
