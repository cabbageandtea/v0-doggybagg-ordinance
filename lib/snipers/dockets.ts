/**
 * Municipal Docket Scraper
 * Monitors San Diego City Council dockets for STRO/ordinance discussions.
 * Alerts 72 hours before meetings. Dedupes via sentinel_docket_history.
 *
 * Source: https://www.sandiego.gov/city-clerk/councilmeetingdocs
 */

import { createClient } from "@supabase/supabase-js"
import type { LegislativeAlert } from "./types"

const COUNCIL_DOCS_URL = "https://www.sandiego.gov/city-clerk/councilmeetingdocs"
const KEYWORDS = [
  "short term rental",
  "stro",
  "ordinance",
  "enforcement",
  "short-term rental",
  "str ",
]

const MS_7_DAYS = 7 * 24 * 60 * 60 * 1000 // Scan next 7 days (72h alert window)

function parseMeetingDate(s: string): Date | null {
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return null
  const month = parseInt(m[1], 10) - 1
  const day = parseInt(m[2], 10)
  const year = parseInt(m[3], 10)
  const d = new Date(year, month, day)
  return isNaN(d.getTime()) ? null : d
}

function isWithinWindow(d: Date, now: Date): boolean {
  const ms = d.getTime() - now.getTime()
  return ms >= 0 && ms <= MS_7_DAYS
}

function textContainsKeywords(text: string): boolean {
  const lower = text.toLowerCase()
  return KEYWORDS.some((kw) => lower.includes(kw))
}

export async function runDocketScraper(): Promise<LegislativeAlert[]> {
  try {
    return await runDocketScraperInner()
  } catch (err) {
    console.error("[docket-scraper]", err)
    return []
  }
}

async function runDocketScraperInner(): Promise<LegislativeAlert[]> {
  const alerts: LegislativeAlert[] = []
  const now = new Date()

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabase =
    serviceKey && supabaseUrl
      ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
      : null

  try {
    const res = await fetch(COUNCIL_DOCS_URL)
    if (!res.ok) return []
    const html = await res.text()

    // Extract: [Agenda](url) or [Summary](url) with ViewMeeting?id=...&doctype=1
    const linkRe = /\[(Agenda|Summary)\]\((https:\/\/[^)]*ViewMeeting\?id=(\d+)[^)]*doctype=1[^)]*)\)/gi
    const dateRe = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g

    const dates: string[] = []
    let match: RegExpExecArray | null
    while ((match = dateRe.exec(html)) !== null) {
      dates.push(match[1])
    }

    const links: { url: string; meetingId: string; type: string }[] = []
    linkRe.lastIndex = 0
    while ((match = linkRe.exec(html)) !== null) {
      const type = match[1]
      const url = match[2].replace(/&amp;/g, "&")
      const meetingId = match[3]
      if (!links.some((l) => l.meetingId === meetingId && l.type === "Agenda"))
        links.push({ url, meetingId, type })
    }

    // Match blocks: [Agenda](url) with id= meetingId, then date within ~500 chars
    const agendaRe =
      /\[Agenda\]\((https:\/\/[^)]*ViewMeeting\?id=(\d+)[^)]*)\)[\s\S]{0,500}?(\d{1,2}\/\d{1,2}\/\d{4})/gi
    const seen = new Set<string>()
    let m: RegExpExecArray | null
    while ((m = agendaRe.exec(html)) !== null) {
      const url = m[1].replace(/&amp;/g, "&")
      const meetingId = m[2]
      const dateStr = m[3]
      if (seen.has(meetingId)) continue
      seen.add(meetingId)

      const meetingDate = parseMeetingDate(dateStr)
      if (!meetingDate || !isWithinWindow(meetingDate, now)) continue

      if (supabase) {
        const { data: existing } = await supabase
          .from("sentinel_docket_history")
          .select("id")
          .eq("meeting_id", meetingId)
          .maybeSingle()
        if (existing) continue
      }

      if (alerts.length >= 5) break
      try {
        const agendaRes = await fetch(url)
        if (agendaRes.ok) {
          const agendaHtml = await agendaRes.text()
          if (textContainsKeywords(agendaHtml)) {
            alerts.push({
              meetingDate: dateStr,
              topicSummary: "STRO/Ordinance/Enforcement discussion",
              link: url,
              meetingId,
            })
            if (supabase) {
              await supabase.from("sentinel_docket_history").insert({
                meeting_id: meetingId,
                meeting_date: dateStr,
                link: url,
                alerted_at: new Date().toISOString(),
              })
            }
          }
        }
      } catch {
        alerts.push({
          meetingDate: dateStr,
          topicSummary: "City Council agenda — check for STRO items",
          link: url,
          meetingId,
        })
      }
    }
  } catch (err) {
    console.error("[docket-scraper] inner:", err)
  }

  return alerts
}
