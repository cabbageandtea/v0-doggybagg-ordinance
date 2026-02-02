/**
 * Integrity Gap Sniper
 * Identifies San Diego STR listings that display a permit not found in the STRO registry.
 * Target zips: 92109 (Pacific Beach), 92037 (La Jolla).
 *
 * Data source: Apify Airbnb Scraper (when APIFY_API_TOKEN set) or placeholder.
 * Cross-reference: sniper_stro_snapshots.license_id
 */

import { createClient } from "@supabase/supabase-js"
import type { IntegrityRisk } from "./types"

const TARGET_ZIPS = ["92109", "92037"]

/** Wire to Apify: apify.com/curious_coder/airbnb-scraper or tri_angle/airbnb-scraper */
type RawListing = {
  url?: string
  licenseNumber?: string
  registrationNumber?: string
  permitNumber?: string
  address?: string
  location?: { city?: string; zipCode?: string }
}

/** Normalize permit string for comparison */
function normalizePermit(s: string): string {
  return s
    .replace(/\s+/g, "")
    .replace(/[-–]/g, "")
    .toUpperCase()
    .trim()
}

/** Extract displayed permit from listing (various field names) */
function getDisplayedPermit(listing: RawListing): string | null {
  const val =
    listing.licenseNumber ?? listing.registrationNumber ?? listing.permitNumber
  if (typeof val === "string" && val.trim().length > 0) return val.trim()
  return null
}

/** Fetch known license_ids from STRO snapshots (last 30 days) */
async function getKnownLicenses(): Promise<Set<string>> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) return new Set()

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from("sniper_stro_snapshots")
    .select("license_id")
    .gte("ingested_at", cutoff)

  const set = new Set<string>()
  for (const row of data ?? []) {
    const id = row.license_id?.trim()
    if (id) set.add(normalizePermit(id))
  }
  return set
}

/** Fetch listings from Apify. Set APIFY_API_TOKEN + APIFY_AIRBNB_ACTOR_ID to enable. */
async function fetchListingsFromApify(): Promise<RawListing[]> {
  const token = process.env.APIFY_API_TOKEN
  const actorId = process.env.APIFY_AIRBNB_ACTOR_ID
  if (!token || !actorId) return []

  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startUrls: TARGET_ZIPS.map((z) => ({
            url: `https://www.airbnb.com/s/San-Diego--CA--United-States/homes?query=San%20Diego%20CA%20${z}`,
          })),
          maxListings: 20,
        }),
      }
    )
    if (!res.ok) return []
    const run = (await res.json()) as { data: { id: string } }
    const runId = run?.data?.id
    if (!runId) return []

    for (let i = 0; i < 6; i++) {
      await new Promise((r) => setTimeout(r, 5000))
      const datasetRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${token}`
      )
      if (datasetRes.ok) {
        const items = (await datasetRes.json()) as RawListing[]
        return Array.isArray(items) ? items : []
      }
    }
  } catch (err) {
    console.error("[integrity-sniper] Apify fetch:", err)
  }
  return []
}

export async function runIntegritySniper(): Promise<IntegrityRisk[]> {
  try {
    return await runIntegritySniperInner()
  } catch (err) {
    console.error("[integrity-sniper]", err)
    return []
  }
}

async function runIntegritySniperInner(): Promise<IntegrityRisk[]> {
  const knownLicenses = await getKnownLicenses()
  const listings = await fetchListingsFromApify()

  const risks: IntegrityRisk[] = []

  for (const listing of listings) {
    const permit = getDisplayedPermit(listing)
    if (!permit) continue

    const url = listing.url ?? ""
    if (!url) continue

    const normPermit = normalizePermit(permit)
    if (knownLicenses.has(normPermit)) continue

    const address =
      listing.address ??
      (listing.location
        ? [listing.location.city, listing.location.zipCode].filter(Boolean).join(", ")
        : undefined)

    risks.push({
      listingUrl: url,
      displayedPermit: permit,
      address,
      mismatch: `Listing shows #${permit}, but STRO Registry has no record`,
    })
  }

  return risks
}
