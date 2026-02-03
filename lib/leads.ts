/**
 * Lead/property data for Autonomous SEO Intelligence Layer.
 * Reads from leads_crm.csv (produced by lead_sniper.py).
 */

import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { parse } from "csv-parse/sync"

const CSV_PATH = join(process.cwd(), "leads_crm.csv")

export type LeadRow = {
  Name: string
  Address: string
  Zone: string
  Lead_Type: string
  Email: string
  Status: string
}

/** Create URL-safe slug from address */
export function slugify(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/** Parse slug back to searchable form (hyphens to spaces) */
export function slugToSearch(slug: string): string {
  return slug.replace(/-/g, " ").toLowerCase()
}

function loadLeads(): LeadRow[] {
  if (!existsSync(CSV_PATH)) return []
  const raw = readFileSync(CSV_PATH, "utf-8")
  const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true }) as LeadRow[]
  return rows
}

/** Find lead(s) by address slug. Returns first match; merges if multiple rows for same address. */
export function getLeadBySlug(slug: string): LeadRow | null {
  const rows = loadLeads()
  const search = slugToSearch(slug)
  const match = rows.find((r) => slugify(r.Address || "") === slug)
  if (match) return match
  const altMatch = rows.find((r) => slugify(r.Address || "").includes(search) || search.includes(slugify(r.Address || "")))
  return altMatch ?? null
}

/** Get all leads for sitemap. Dedupes by address. */
export function getAllLeadsForSitemap(): Array<{ address: string; lead: LeadRow }> {
  const rows = loadLeads()
  const seen = new Set<string>()
  const out: Array<{ address: string; lead: LeadRow }> = []
  for (const r of rows) {
    const addr = (r.Address || "").trim()
    if (!addr || seen.has(addr.toLowerCase())) continue
    seen.add(addr.toLowerCase())
    out.push({ address: addr, lead: r })
  }
  return out
}

export const TPA_ZIPS = new Set([
  "92101", "92103", "92104", "92105", "92110", "92113",
  "92114", "92115", "92116", "92117", "92111", "92126",
])

export function isTpaLead(lead: LeadRow): boolean {
  const zone = (lead.Zone || "").trim()
  if (zone.startsWith("TPA_")) return true
  const zipMatch = zone.match(/\d{5}/)
  return zipMatch ? TPA_ZIPS.has(zipMatch[0]) : false
}

export function isAduLead(lead: LeadRow): boolean {
  return (lead.Lead_Type || "").toLowerCase().includes("adu")
}

/** Group leads by zone for explore page */
export function getLeadsByZone(): Map<string, { count: number; sample: LeadRow }> {
  const rows = loadLeads()
  const byZone = new Map<string, { count: number; sample: LeadRow }>()
  const seen = new Set<string>()
  for (const r of rows) {
    const zone = (r.Zone || "Other").trim() || "Other"
    const addr = (r.Address || "").toLowerCase()
    if (!addr || seen.has(addr)) continue
    seen.add(addr)
    const prev = byZone.get(zone)
    if (prev) {
      prev.count += 1
    } else {
      byZone.set(zone, { count: 1, sample: r })
    }
  }
  return byZone
}

/** Search leads by address substring */
export function searchLeads(query: string, limit = 10): Array<{ lead: LeadRow; slug: string }> {
  const rows = loadLeads()
  const q = query.toLowerCase().trim()
  if (!q || q.length < 2) return []
  const results: Array<{ lead: LeadRow; slug: string }> = []
  const seen = new Set<string>()
  for (const r of rows) {
    const addr = (r.Address || "").toLowerCase()
    if (!addr || seen.has(addr) || !addr.includes(q)) continue
    seen.add(addr)
    results.push({ lead: r, slug: slugify(r.Address || "") })
    if (results.length >= limit) break
  }
  return results
}
