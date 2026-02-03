/**
 * Machine-readable API for AI agents and crawlers.
 * GET /api/intel — Returns capabilities, schema, and links.
 */

import { NextResponse } from "next/server"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doggybagg.cc"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const intel = {
    name: "DoggyBagg Ordinance",
    description:
      "San Diego municipal compliance monitoring. Precision ordinance oversight for property investors.",
    url: siteUrl,
    agentCard: `${siteUrl}/.well-known/agent.json`,
    schema: {
      organization: `${siteUrl}/#organization`,
      faq: "Embedded FAQPage JSON-LD on homepage and /help",
    },
    endpoints: {
      homepage: siteUrl,
      docs: `${siteUrl}/docs`,
      learn: `${siteUrl}/learn/str-compliance-san-diego`,
      help: `${siteUrl}/help`,
      refer: `${siteUrl}/refer`,
    },
    topics: [
      "San Diego ADU regulations",
      "STR permit compliance",
      "STRO license monitoring",
      "Code enforcement alerts",
      "Municipal ordinance updates",
      "San Diego land use",
    ],
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(intel, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
